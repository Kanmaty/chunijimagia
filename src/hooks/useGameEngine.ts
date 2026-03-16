import { useState, useCallback, useEffect, useRef } from 'react';
import type { CardData, BoardSlot, CardEffect } from '../types/game';
import { createCardInstance, CardsDb, buildDeck, TestDeckPlayer, TestDeckEnemy } from '../data/cards';
import { CharactersDb } from '../data/characters';

export const useGameEngine = (myCharacterId: string = 'delta', enemyCharacterId: string = 'alpha') => {
    const myCharacter = CharactersDb[myCharacterId];
    const enemyCharacter = CharactersDb[enemyCharacterId];

    // --- 初期デッキを1回だけ生成して手札とデッキで共有 ---
    const [initData] = useState(() => {
        const playerFullDeck = buildDeck(TestDeckPlayer);
        return {
            hand: playerFullDeck.slice(0, 4),
            deck: playerFullDeck.slice(4),
            enemyDeck: buildDeck(TestDeckEnemy)
        };
    });

    const [deck, setDeck] = useState<CardData[]>(() => initData.deck);
    const [hand, setHand] = useState<CardData[]>(() => initData.hand);
    const [enemyDeck] = useState<CardData[]>(() => initData.enemyDeck);

    // プレイヤー状態
    const [myHP, setMyHP] = useState(myCharacter.maxHp);
    const [myCP, setMyCP] = useState(myCharacter.initialMp);
    const myMaxCP = 15; // 絶対上限

    const [enemyHP, setEnemyHP] = useState(enemyCharacter.maxHp);
    const [enemyCP, setEnemyCP] = useState(enemyCharacter.initialMp);
    const enemyMaxCP = 15; // 絶対上限

    const [usedSkillsThisTurn, setUsedSkillsThisTurn] = useState<string[]>([]);

    // ターゲット選択待ちエフェクト（スキルや魔法カードの DAMAGE_TARGET / FIXED_DAMAGE_TARGET 用）
    const [pendingEffect, setPendingEffect] = useState<CardEffect | null>(null);

    // 盤面
    const [mySlots, setMySlots] = useState<BoardSlot[]>([null, null, null]);
    const [enemySlots, setEnemySlots] = useState<BoardSlot[]>([null, null, null]);

    // ターン管理
    const [turnCount, setTurnCount] = useState(1);
    const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');

    // --- 攻撃回数制限 ---
    const [attackedThisTurn, setAttackedThisTurn] = useState<Set<number>>(new Set());

    // --- デッキ切れダメージカウンター ---
    const [deckOutCount, setDeckOutCount] = useState(0);

    // --- 勝敗判定 ---
    const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

    // --- ターン終了時の手札破棄フェーズ ---
    const [discardPhase, setDiscardPhase] = useState(false);

    // （初期化は useState の lazy initializer で完了済み。useEffect は不要）

    // HP変更時の勝敗チェック
    useEffect(() => {
        if (gameResult) return; // 既に決着済み
        if (enemyHP <= 0) setGameResult('win');
        if (myHP <= 0) setGameResult('lose');
    }, [myHP, enemyHP, gameResult]);

    // --- エフェクト解決エンジン ---
    const resolveEffects = useCallback((effects: CardEffect[] | undefined, isEnemyTriggering: boolean) => {
        if (!effects || effects.length === 0) return;

        effects.forEach(effect => {
            switch (effect.type) {
                case 'DAMAGE_ALL_ENEMY':
                    // 敵(呼び出し元から見て相手)の全モンスターにダメージ
                    if (!isEnemyTriggering) {
                        setEnemySlots(prev => prev.map(slot => {
                            if (!slot || slot.state === 'reserve') return slot; // 予約状態はダメージを受けない
                            const newHp = (slot.card.hp || 0) - (effect.amount || 0);
                            return newHp <= 0 ? null : { ...slot, card: { ...slot.card, hp: newHp } };
                        }));
                    } else {
                        // 敵から味方への全体ダメージ
                        setMySlots(prev => prev.map(slot => {
                            if (!slot || slot.state === 'reserve') return slot;
                            const newHp = (slot.card.hp || 0) - (effect.amount || 0);
                            return newHp <= 0 ? null : { ...slot, card: { ...slot.card, hp: newHp } };
                        }));
                    }
                    break;

                case 'SUMMON_TARGET':
                    // 対象の予約状態カードを召喚する（最も左の予約を対象）
                    if (!isEnemyTriggering) {
                        setMySlots(prev => {
                            const newSlots = [...prev];
                            const targetIdx = newSlots.findIndex(s => s && s.state === 'reserve');
                            if (targetIdx !== -1) {
                                newSlots[targetIdx] = { ...newSlots[targetIdx]!, state: 'summon' };
                            }
                            return newSlots;
                        });
                    }
                    break;

                case 'SPAWN_MONSTER':
                    // 特定のモンスターを空きスロットに特殊召喚(reserve)する
                    if (!isEnemyTriggering && effect.targetId) {
                        setMySlots(prev => {
                            const newSlots = [...prev];
                            let spawned = 0;
                            const maxSpawn = effect.amount || 1;

                            for (let i = 0; i < newSlots.length; i++) {
                                if (newSlots[i] === null && spawned < maxSpawn) {
                                    const newCard = createCardInstance(effect.targetId as string, `spawn_${Date.now()}_${i}`);
                                    if (newCard) {
                                        newSlots[i] = { card: newCard, state: 'reserve', level: 1 };
                                        spawned++;
                                    }
                                }
                            }
                            return newSlots;
                        });
                    }
                    break;
                case 'DAMAGE_TARGET':
                case 'FIXED_DAMAGE_TARGET':
                    // ターゲット選択が必要なエフェクト → pendingEffect に保存してUI側で選択を待つ
                    if (!isEnemyTriggering) {
                        setPendingEffect(effect);
                    }
                    break;

                case 'BUFF_ALL_ROLE':
                    // 指定ロールの味方全体をバフする
                    if (!isEnemyTriggering && effect.roleCondition) {
                        setMySlots(prev => prev.map(slot => {
                            if (slot && slot.state === 'summon' && slot.card.role === effect.roleCondition) {
                                return {
                                    ...slot,
                                    card: {
                                        ...slot.card,
                                        attack: (slot.card.attack || 0) + (effect.buffAttack || 0),
                                        hp: (slot.card.hp || 0) + (effect.buffHp || 0)
                                    }
                                };
                            }
                            return slot;
                        }));
                    }
                    break;
            }
        });
    }, []);

    // --- ドロー処理 ---
    // デッキ切れ時は固定ダメージ（1→2→4→8…倍々）
    const drawCard = useCallback(() => {
        if (deck.length === 0) {
            // デッキ切れダメージ
            const damage = Math.pow(2, deckOutCount);
            setDeckOutCount(prev => prev + 1);
            setMyHP(prev => Math.max(0, prev - damage));
            return;
        }
        const drawnCard = deck[0];
        setDeck(prev => prev.slice(1));
        setHand(prev => [...prev, drawnCard]);
    }, [deck, deckOutCount]);

    // 自分のターン開始処理
    const startPlayerTurn = useCallback(() => {
        // CP回復
        setMyCP(prev => Math.min(prev + myCharacter.mpRegen, myMaxCP));

        // 使用済みスキルのリセット
        setUsedSkillsThisTurn([]);

        // 攻撃済みフラグのリセット
        setAttackedThisTurn(new Set());

        // 予約(reserve)状態のカードを召喚(summon)状態にする + 召喚時エフェクト発動
        let triggeredEffects: CardEffect[] = [];
        setMySlots(prev => prev.map(slot => {
            if (slot && slot.state === 'reserve') {
                if (slot.card.abilityEffects && slot.card.abilityEffects.length > 0) {
                    triggeredEffects.push(...slot.card.abilityEffects);
                }
                return { ...slot, state: 'summon' };
            }
            return slot;
        }));

        setTimeout(() => {
            resolveEffects(triggeredEffects, false);
        }, 100);

        // ドロー（1枚）
        drawCard();

        setTurnCount(prev => prev + 1);
        setCurrentTurn('player');
    }, [myMaxCP, resolveEffects, drawCard]);

    // 敵ターンの開始処理（簡易版）
    const startEnemyTurn = useCallback(() => {
        // CP回復
        setEnemyCP(prev => Math.min(prev + enemyCharacter.mpRegen, enemyMaxCP));

        // 予約(reserve)状態のカードを召喚(summon)状態にする
        let triggeredEffects: CardEffect[] = [];
        setEnemySlots(prev => prev.map(slot => {
            if (slot && slot.state === 'reserve') {
                if (slot.card.abilityEffects && slot.card.abilityEffects.length > 0) {
                    triggeredEffects.push(...slot.card.abilityEffects);
                }
                return { ...slot, state: 'summon' };
            }
            return slot;
        }));

        setTimeout(() => {
            resolveEffects(triggeredEffects, true);
        }, 100);

    }, [enemyMaxCP, resolveEffects]);

    // プレイヤーのターン終了操作
    const endTurn = useCallback(() => {
        if (currentTurn !== 'player') return;
        if (gameResult) return;
        if (discardPhase) return; // 破棄フェーズ中は終了不可

        // 手札が6枚を超えている場合、破棄フェーズに入る
        if (hand.length > 6) {
            setDiscardPhase(true);
            return;
        }

        // 攻撃しなかった召喚済みモンスターの数 × 1CP を獲得
        const idleMonsters = mySlots.filter((slot, i) =>
            slot && slot.state === 'summon' && !attackedThisTurn.has(i)
        ).length;
        if (idleMonsters > 0) {
            setMyCP(prev => Math.min(prev + idleMonsters, myMaxCP));
        }

        setCurrentTurn('enemy');
    }, [currentTurn, gameResult, discardPhase, hand.length, mySlots, attackedThisTurn, myMaxCP]);

    // 破棄フェーズ中に手札が6枚以下になったら自動的にターン終了を実行
    const endTurnRef = useRef(endTurn);
    endTurnRef.current = endTurn;

    useEffect(() => {
        if (discardPhase && hand.length <= 6) {
            setDiscardPhase(false);
            // 破棄完了 → ターン終了処理を実行
            // endTurn を直接呼ぶと discardPhase がまだ true なので、直接ターン終了処理を行う
            const idleMonsters = mySlots.filter((slot, i) =>
                slot && slot.state === 'summon' && !attackedThisTurn.has(i)
            ).length;
            if (idleMonsters > 0) {
                setMyCP(prev => Math.min(prev + idleMonsters, myMaxCP));
            }
            setCurrentTurn('enemy');
        }
    }, [discardPhase, hand.length, mySlots, attackedThisTurn, myMaxCP]);

    // startPlayerTurn を ref 経由で呼ぶことで useEffect の依存配列を安定させる
    const startPlayerTurnRef = useRef(startPlayerTurn);
    startPlayerTurnRef.current = startPlayerTurn;

    // 敵ターンとプレイヤーターンの自動進行ループ（相手AIは未実装のため即時スキップ）
    useEffect(() => {
        if (gameResult) return;
        if (currentTurn === 'enemy') {
            startEnemyTurn();

            const timer = setTimeout(() => {
                startPlayerTurnRef.current();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentTurn, startEnemyTurn, gameResult]);

    const playCardToBoard = useCallback((cardId: string, slotIndex: number) => {
        if (gameResult) return false;
        const cardIndex = hand.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;

        const card = hand[cardIndex];

        // CPチェック等
        let cost = card.cost;
        let isLevelUp = false;
        let targetLevel = 1;

        const existingSlot = mySlots[slotIndex];
        if (existingSlot) {
            // レベルアップサモンのチェック
            if (existingSlot.state === 'summon' && (existingSlot.level || 1) < 3) {
                targetLevel = (existingSlot.level || 1) + 1;
                // 追加コスト = 土台の現在レベル（Lv1→+1, Lv2→+2）
                const extraCost = existingSlot.level || 1;
                cost += extraCost;
                isLevelUp = true;
            } else {
                return false; // 上書き不可
            }
        }

        if (myCP < cost) return false; // CP不足

        // CP消費
        setMyCP(prev => prev - cost);

        // 魔法カードの即時発動
        if (card.type === 'magic') {
            resolveEffects(card.abilityEffects, false);
            // 盤面には置かずに墓地へ
        } else {
            // モンスターの場合：盤面更新
            setMySlots(prev => {
                const newSlots = [...prev];
                if (isLevelUp) {
                    // レベルアップ時は予約状態にする（次ターンに召喚される）
                    newSlots[slotIndex] = {
                        ...existingSlot!,
                        card: {
                            ...card,
                            attack: (card.attack || 0) + (targetLevel === 2 ? 1 : 2),
                            hp: (card.hp || 0) + (targetLevel === 2 ? 2 : 4)
                        },
                        state: 'reserve',
                        level: targetLevel
                    };
                } else {
                    // 通常プレイは「予約」
                    newSlots[slotIndex] = {
                        card,
                        state: 'reserve',
                        level: 1
                    };
                    // 予約したので次ターンに召喚される → 召喚酔いフラグは次ターンの startPlayerTurn でリセットされるが、
                    // 召喚された瞬間(ターン開始時)に setSummonedThisTurn にセットする必要がある
                    // → startPlayerTurn 側で処理する
                }
                return newSlots;
            });
        }

        // 手札から削除
        setHand(prev => {
            const newHand = [...prev];
            newHand.splice(cardIndex, 1);
            return newHand;
        });

        return true;
    }, [hand, myCP, mySlots, gameResult]);

    // ダメージ処理に伴うCP回復処理（防御力適用）
    const damagePlayer = useCallback((isEnemy: boolean, amount: number) => {
        if (isEnemy) {
            const actualDamage = Math.max(0, amount - enemyCharacter.defense);
            setEnemyHP(prev => {
                const dmg = Math.min(prev, actualDamage);
                setEnemyCP(cp => Math.min(cp + dmg, enemyMaxCP)); // 減った分CP回復
                return Math.max(0, prev - dmg);
            });
        } else {
            const actualDamage = Math.max(0, amount - myCharacter.defense);
            setMyHP(prev => {
                const dmg = Math.min(prev, actualDamage);
                setMyCP(cp => Math.min(cp + dmg, myMaxCP)); // 減った分CP回復
                return Math.max(0, prev - dmg);
            });
        }
    }, [enemyCharacter.defense, myCharacter.defense]);

    // 攻撃の実行 (味方から敵、または直接)
    const executeAttack = useCallback((attackerSlotIndex: number, targetSlotIndex: number | 'player') => {
        if (gameResult) return false;
        const attacker = mySlots[attackerSlotIndex];
        if (!attacker || attacker.state !== 'summon') return false;

        // 攻撃回数制限チェック
        if (attackedThisTurn.has(attackerSlotIndex)) {
            console.log('Attack Blocked: Already attacked this turn');
            return false;
        }


        // 挑発(Taunt)処理
        const hasTauntOnEnemyBoard = enemySlots.some(slot => slot && slot.state === 'summon' && slot.card.isTaunt);
        if (hasTauntOnEnemyBoard) {
            if (targetSlotIndex === 'player') return false;
            const target = enemySlots[targetSlotIndex as number];
            if (!target || !target.card.isTaunt) return false;
        }

        const attackValue = attacker.card.attack || 0;
        let isDirectAttack = targetSlotIndex === 'player';
        let isTargetDestroyed = false;

        if (isDirectAttack) {
            damagePlayer(true, attackValue);
        } else {
            const target = enemySlots[targetSlotIndex as number];
            if (!target) return false;

            const newTargetHp = (target.card.hp || 0) - attackValue;
            if (newTargetHp <= 0) {
                isTargetDestroyed = true;
            }

            // 敵モンスターにダメージ
            setEnemySlots(prev => {
                const newSlots = [...prev];
                const currentTarget = newSlots[targetSlotIndex as number];
                if (currentTarget) {
                    const hp = (currentTarget.card.hp || 0) - attackValue;
                    if (hp <= 0) {
                        newSlots[targetSlotIndex as number] = null; // 破壊
                    } else {
                        newSlots[targetSlotIndex as number] = {
                            ...currentTarget,
                            card: { ...currentTarget.card, hp }
                        };
                    }
                }
                return newSlots;
            });

        }

        // 攻撃済みフラグを立てる
        setAttackedThisTurn(prev => new Set(prev).add(attackerSlotIndex));

        // 攻撃時エフェクトの解決
        if (attacker.card.attackEffects && attacker.card.attackEffects.length > 0) {
            attacker.card.attackEffects.forEach(effect => {
                if (effect.type === 'DRAW_CARD_WITH_ROLE') {
                    // ダイレクトアタック成功時のみ発動
                    if (isDirectAttack && effect.roleCondition) {
                        const matchedBaseId = Object.keys(CardsDb).find(key => CardsDb[key].role === effect.roleCondition);
                        if (matchedBaseId) {
                            const newCard = createCardInstance(matchedBaseId, `draw_${Date.now()}`);
                            if (newCard) {
                                setHand(prev => [...prev, newCard]);
                            }
                        }
                    }
                } else if (effect.type === 'BUFF_SELF_STATS') {
                    // 相手モンスターを倒した時のみ発動
                    if (!isDirectAttack && isTargetDestroyed) {
                        setMySlots(prev => {
                            const newSlots = [...prev];
                            const currentAttacker = newSlots[attackerSlotIndex];
                            if (currentAttacker) {
                                newSlots[attackerSlotIndex] = {
                                    ...currentAttacker,
                                    card: {
                                        ...currentAttacker.card,
                                        attack: (currentAttacker.card.attack || 0) + (effect.buffAttack || 0),
                                        hp: (currentAttacker.card.hp || 0) + (effect.buffHp || 0)
                                    }
                                };
                            }
                            return newSlots;
                        });
                    }
                } else {
                    resolveEffects([effect], false);
                }
            });
        }

        return true;
    }, [mySlots, enemySlots, damagePlayer, resolveEffects, attackedThisTurn, gameResult]);

    // 手札からカードを捨てる
    const discardCard = useCallback((cardId: string) => {
        setHand(prev => prev.filter(c => c.id !== cardId));
    }, []);

    // -----------------------------------
    // チュニジアンスキル（マギアスキル）ロジック
    // -----------------------------------

    // 現在の盤面から利用可能なスキルを計算
    const getPlayableSkills = () => {
        if (currentTurn !== 'player') return [];

        return myCharacter.equippedSkills.filter(skill => {
            if (myCP < skill.cost) return false;
            if (usedSkillsThisTurn.includes(skill.id)) return false;

            const roleCounts: Record<string, number> = {};
            const affiliationCounts: Record<string, number> = {};

            mySlots.forEach(slot => {
                if (slot && slot.state === 'summon') {
                    const r = slot.card.role;
                    const a = slot.card.affiliation;
                    if (r) roleCounts[r] = (roleCounts[r] || 0) + 1;
                    if (a) affiliationCounts[a] = (affiliationCounts[a] || 0) + 1;
                }
            });

            const requiredRoles: Record<string, number> = {};
            const requiredAffiliations: Record<string, number> = {};

            skill.conditions.forEach(cond => {
                if (cond.type === 'role') {
                    requiredRoles[cond.value as string] = (requiredRoles[cond.value as string] || 0) + cond.count;
                } else if (cond.type === 'affiliation') {
                    requiredAffiliations[cond.value as string] = (requiredAffiliations[cond.value as string] || 0) + cond.count;
                }
            });

            const hasRoles = Object.entries(requiredRoles).every(([r, count]) => (roleCounts[r] || 0) >= count);
            const hasAffiliations = Object.entries(requiredAffiliations).every(([a, count]) => (affiliationCounts[a] || 0) >= count);

            return hasRoles && hasAffiliations;
        });
    };

    const playableSkills = getPlayableSkills();

    // スキルの発動
    const activateSkill = useCallback((skillId: string) => {
        if (currentTurn !== 'player' || gameResult) return false;

        const skill = myCharacter.equippedSkills.find(s => s.id === skillId);
        if (!skill) return false;

        const isPlayable = getPlayableSkills().some(s => s.id === skillId);
        if (!isPlayable) return false;

        // 挑発チェック（マギアスキルも挑発の影響を受ける）
        const hasTauntOnEnemyBoard = enemySlots.some(slot => slot && slot.state === 'summon' && slot.card.isTaunt);
        const hasTargetedDamage = skill.effects?.some(e => e.type === 'DAMAGE_TARGET' || e.type === 'FIXED_DAMAGE_TARGET');
        if (hasTauntOnEnemyBoard && hasTargetedDamage) {
            // 挑発がいる場合、ターゲット指定系スキルは挑発モンスターのみを対象にできる
            // → pendingEffect でUI側が制御するので、ここではブロックしない
        }

        // CP消費
        setMyCP(prev => prev - skill.cost);

        // エフェクト解決
        if (skill.effects && skill.effects.length > 0) {
            resolveEffects(skill.effects, false);
        }

        // 1ターンに1回の利用制限
        setUsedSkillsThisTurn(prev => [...prev, skillId]);

        return true;
    }, [currentTurn, myCharacter.equippedSkills, mySlots, myCP, usedSkillsThisTurn, resolveEffects, gameResult]);

    // ターゲット選択待ちエフェクトの解決
    const resolvePendingEffect = useCallback((targetSlotIndex: number | 'player') => {
        if (!pendingEffect) return;
        const amount = pendingEffect.amount || 0;
        const isFixed = pendingEffect.type === 'FIXED_DAMAGE_TARGET';

        if (targetSlotIndex === 'player') {
            // 敵能力者へのダメージ
            if (isFixed) {
                setEnemyHP(prev => Math.max(0, prev - amount));
            } else {
                damagePlayer(true, amount);
            }
        } else {
            // 敵モンスターへのダメージ
            setEnemySlots(prev => {
                const newSlots = [...prev];
                const target = newSlots[targetSlotIndex];
                if (target && target.state === 'summon') {
                    const newHp = (target.card.hp || 0) - amount;
                    newSlots[targetSlotIndex] = newHp <= 0 ? null : { ...target, card: { ...target.card, hp: newHp } };
                }
                return newSlots;
            });
        }
        setPendingEffect(null);
    }, [pendingEffect, damagePlayer]);

    // ターゲット選択のキャンセル
    const cancelPendingEffect = useCallback(() => {
        setPendingEffect(null);
    }, []);

    return {
        myHP, myCP, myMaxCP,
        enemyHP, enemyCP, enemyMaxCP,
        hand, mySlots, enemySlots,
        deck, enemyDeck,
        turnCount, currentTurn,
        myCharacter, enemyCharacter,
        playableSkills,
        usedSkillsThisTurn,
        pendingEffect,
        attackedThisTurn,
        gameResult,
        discardPhase,
        endTurn,
        playCardToBoard,
        executeAttack,
        damagePlayer,
        discardCard,
        activateSkill,
        resolvePendingEffect,
        cancelPendingEffect
    };
};
