import { useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { CardData, BoardSlot, CardEffect } from '../types/game';
import { CharactersDb } from '../data/characters';
import { CardsDb } from '../data/cards';
import type { RoomData } from './useRoom';

export interface PlayerGameState {
    hp: number;
    cp: number;
    maxCp: number;
    deckOutCount: number;
    attackedThisTurn: number[];
    usedSkillsThisTurn: string[];
    slots: BoardSlot[];
    hand: CardData[];
    deck: CardData[];
    characterId: string;
    skills: string[]; // 選択したスキルのID配列（3個）
}

export interface MultiplayerGameState {
    currentTurn: 'player1' | 'player2';
    turnCount: number;
    gameResult: 'player1' | 'player2' | 'draw' | null;
    discardPhaseTarget: 'player1' | 'player2' | null;
    pendingEffect: { effect: CardEffect, player: 'player1' | 'player2' } | null;
    player1: PlayerGameState;
    player2: PlayerGameState;
}

export const useMultiplayerGame = (roomId: string | null, myUid: string, roomData: RoomData | null) => {
    const gameState = roomData && 'gameState' in roomData ? (roomData as any).gameState as MultiplayerGameState : null;
    const isPlayer1 = roomData?.player1?.uid === myUid;
    const myPlayerKey = isPlayer1 ? 'player1' : 'player2';
    const enemyPlayerKey = isPlayer1 ? 'player2' : 'player1';

    const myState = gameState ? gameState[myPlayerKey] : null;
    const enemyState = gameState ? gameState[enemyPlayerKey] : null;

    const myCharacter = myState ? CharactersDb[myState.characterId] : null;
    const enemyCharacter = enemyState ? CharactersDb[enemyState.characterId] : null;

    const isMyTurn = gameState?.currentTurn === myPlayerKey;
    const discardPhase = gameState?.discardPhaseTarget === myPlayerKey;

    // ヘルパー: DB更新関数
    const pushGameState = useCallback(async (newState: MultiplayerGameState) => {
        if (!roomId) return;
        await updateDoc(doc(db, 'rooms', roomId), { gameState: newState });
    }, [roomId]);

    // HP変更時の勝敗チェック（状態更新ごとに自動で呼ばれる想定）
    const checkWinCondition = (state: MultiplayerGameState) => {
        if (state.gameResult) return state; // 既に決着済み
        if (state.player1.hp <= 0 && state.player2.hp <= 0) {
            state.gameResult = 'draw';
        } else if (state.player1.hp <= 0) {
            state.gameResult = 'player2';
        } else if (state.player2.hp <= 0) {
            state.gameResult = 'player1';
        }
        return state;
    };

    // ダメージ処理に伴うCP回復処理（防御力適用）
    const applyDamage = (state: MultiplayerGameState, target: 'player1' | 'player2', amount: number) => {
        const targetState = state[target];
        const char = CharactersDb[targetState.characterId];
        const actualDamage = Math.max(0, amount - char.defense);

        const dmg = Math.min(targetState.hp, actualDamage);
        targetState.hp = Math.max(0, targetState.hp - dmg);
        // 減った分CP回復
        targetState.cp = Math.min(targetState.cp + dmg, targetState.maxCp);
    };

    // --- エフェクト解決エンジン ---
    const resolveEffects = useCallback((effects: CardEffect[], state: MultiplayerGameState, triggeringPlayer: 'player1' | 'player2') => {
        const enemyPlayer = triggeringPlayer === 'player1' ? 'player2' : 'player1';
        const triggeringState = state[triggeringPlayer];
        const enemySt = state[enemyPlayer];

        effects.forEach(effect => {
            switch (effect.type) {
                case 'DAMAGE_ALL_ENEMY':
                    enemySt.slots = enemySt.slots.map(slot => {
                        if (!slot || slot.state === 'reserve') return slot;
                        const newHp = (slot.card.hp || 0) - (effect.amount || 0);
                        return newHp <= 0 ? null : { ...slot, card: { ...slot.card, hp: newHp } };
                    });
                    break;
                case 'SUMMON_TARGET':
                    const targetIdx = triggeringState.slots.findIndex(s => s && s.state === 'reserve');
                    if (targetIdx !== -1) {
                        triggeringState.slots[targetIdx] = { ...triggeringState.slots[targetIdx]!, state: 'summon' };
                    }
                    break;
                case 'SPAWN_MONSTER':
                    let count = effect.amount || 1;
                    triggeringState.slots = triggeringState.slots.map(slot => {
                        if (slot === null && count > 0) {
                            count--;
                            return { card: { id: 'minion', name: '手下', type: 'monster', cost: 0, attack: 1, hp: 1, role: '無し', affiliation: '無し' }, state: 'reserve' };
                        }
                        return slot;
                    });
                    break;
                case 'DRAW_CARD_WITH_ROLE':
                    const deckIdxRole = triggeringState.deck.findIndex(c => c.role === effect.roleCondition);
                    if (deckIdxRole !== -1) {
                        const drawnCard = triggeringState.deck[deckIdxRole];
                        triggeringState.deck.splice(deckIdxRole, 1);
                        triggeringState.hand.push(drawnCard);
                    }
                    break;
                case 'DRAW_CARD_WITH_AFFILIATION':
                    const deckIdxAff = triggeringState.deck.findIndex(c => c.affiliation === effect.affiliationCondition);
                    if (deckIdxAff !== -1) {
                        const drawnCard = triggeringState.deck[deckIdxAff];
                        triggeringState.deck.splice(deckIdxAff, 1);
                        triggeringState.hand.push(drawnCard);
                    }
                    break;
                case 'BUFF_SELF_STATS':
                    // 複雑な自己バフはマルチプレイヤー版では省略または別途実装
                    break;
                case 'BUFF_ALL_ROLE':
                    triggeringState.slots = triggeringState.slots.map(slot => {
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
                    });
                    break;
                case 'BUFF_ALL_AFFILIATION':
                    triggeringState.slots = triggeringState.slots.map(slot => {
                        if (slot && slot.state === 'summon' && slot.card.affiliation === effect.affiliationCondition) {
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
                    });
                    break;
                case 'DAMAGE_TARGET':
                case 'FIXED_DAMAGE_TARGET':
                    state.pendingEffect = { effect, player: triggeringPlayer };
                    break;
                case 'LEVEL_UP_RANDOM_ALLY':
                    // 対象プレイヤー自身がトリガーさせた場合のみ処理
                    if (triggeringPlayer === myPlayerKey) {
                        const eligibleAllies = triggeringState.slots
                            .map((slot, index) => ({ slot, index }))
                            .filter(s => s.slot && s.slot.state === 'summon' && s.index !== effect.amount && (s.slot.level || 1) < 3);

                        if (eligibleAllies.length > 0) {
                            const target = eligibleAllies[Math.floor(Math.random() * eligibleAllies.length)];
                            const currentLevel = target.slot!.level || 1;
                            const targetLevel = currentLevel + 1;

                            triggeringState.slots[target.index] = {
                                ...target.slot!,
                                card: {
                                    ...target.slot!.card,
                                    attack: (target.slot!.card.attack || 0) + 1,
                                    hp: (target.slot!.card.hp || 0) + 2
                                },
                                level: targetLevel
                            };
                        }
                    }
                    break;
                case 'TRANSFORM_INTO':
                    if (triggeringPlayer === myPlayerKey && effect.targetId && effect.amount !== undefined) {
                        const targetIndex = effect.amount;
                        const slot = triggeringState.slots[targetIndex];
                        if (slot && slot.state === 'summon') {
                            const newCardData = CardsDb[effect.targetId];
                            if (newCardData) {
                                const oldLevel = slot.level || 1;
                                triggeringState.slots[targetIndex] = {
                                    ...slot,
                                    card: {
                                        ...newCardData,
                                        id: `${newCardData.id}_${Math.random().toString(36).slice(2, 6)}`,
                                        attack: (newCardData.attack || 0) + (oldLevel - 1),
                                        hp: (newCardData.hp || 0) + ((oldLevel - 1) * 2)
                                    }
                                };
                                if (newCardData.abilityEffects && newCardData.abilityEffects.length > 0) {
                                    const transformEffects = newCardData.abilityEffects.map((e: CardEffect) => ({ ...e, amount: targetIndex }));
                                    resolveEffects(transformEffects, state, triggeringPlayer);
                                }
                            }
                        }
                    }
                    break;
                case 'CONDITIONAL_BUFF_OTHER_ALLIES':
                    if (triggeringPlayer === myPlayerKey && effect.amount !== undefined) {
                        const sourceIndex = effect.amount;
                        let condCount = 0;
                        triggeringState.slots.forEach(s => {
                            if (s && s.state === 'summon' && s.card.affiliation === effect.affiliationCondition) {
                                condCount++;
                            }
                        });

                        if (condCount >= (effect.conditionCount || 0)) {
                            triggeringState.slots = triggeringState.slots.map((s, index) => {
                                if (s && s.state === 'summon' && index !== sourceIndex) {
                                    return {
                                        ...s,
                                        card: {
                                            ...s.card,
                                            attack: (s.card.attack || 0) + (effect.buffAttack || 0)
                                        }
                                    };
                                }
                                return s;
                            });
                        }
                    }
                    break;
                case 'BUFF_OTHER_ALLIES_STATS':
                    if (triggeringPlayer === myPlayerKey && effect.amount !== undefined) {
                        const sourceIndex = effect.amount;
                        triggeringState.slots = triggeringState.slots.map((s, index) => {
                            if (s && s.state === 'summon' && index !== sourceIndex) {
                                if (!effect.affiliationCondition || s.card.affiliation === effect.affiliationCondition) {
                                    return {
                                        ...s,
                                        card: {
                                            ...s.card,
                                            hp: (s.card.hp || 0) + (effect.buffHp || 0),
                                            attack: (s.card.attack || 0) + (effect.buffAttack || 0)
                                        }
                                    };
                                }
                            }
                            return s;
                        });
                    }
                    break;
                case 'DANKETSU_NUKO_BUFF':
                    if (triggeringPlayer === myPlayerKey) {
                        // 雲タイプのモンスターの数をカウント
                        let cloudCount = 0;
                        const cloudSlotIndices: number[] = [];
                        triggeringState.slots.forEach((s, idx) => {
                            if (s && s.state === 'summon' && s.card.affiliation === '雲') {
                                cloudCount++;
                                cloudSlotIndices.push(idx);
                            }
                        });

                        if (cloudCount >= 3) {
                            // 自分のモンスター全員の攻撃力を+2、体力を+1する
                            triggeringState.slots = triggeringState.slots.map(s => {
                                if (s && s.state === 'summon') {
                                    return {
                                        ...s,
                                        card: {
                                            ...s.card,
                                            attack: (s.card.attack || 0) + 2,
                                            hp: (s.card.hp || 0) + 1
                                        }
                                    };
                                }
                                return s;
                            });
                        } else if (cloudSlotIndices.length > 0) {
                            // 雲タイプを持つモンスターランダム1体の攻撃力と体力を+1する
                            const targetIdx = cloudSlotIndices[Math.floor(Math.random() * cloudSlotIndices.length)];
                            const targetSlot = triggeringState.slots[targetIdx];
                            if (targetSlot) {
                                triggeringState.slots[targetIdx] = {
                                    ...targetSlot,
                                    card: {
                                        ...targetSlot.card,
                                        attack: (targetSlot.card.attack || 0) + 1,
                                        hp: (targetSlot.card.hp || 0) + 1
                                    }
                                };
                            }
                        }
                    }
                    break;
            }
        });
        return checkWinCondition(state);
    }, [myPlayerKey]);

    // ターゲット指定エフェクトの解決
    const resolvePendingEffect = useCallback((targetSlotIndex: number | 'player') => {
        if (!gameState || !gameState.pendingEffect || gameState.pendingEffect.player !== myPlayerKey) return;

        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const effect = newState.pendingEffect!.effect;
        const enemySt = newState[enemyPlayerKey];
        const amount = effect.amount || 0;

        if (targetSlotIndex === 'player') {
            if (effect.type === 'FIXED_DAMAGE_TARGET') {
                enemySt.hp = Math.max(0, enemySt.hp - amount);
            } else {
                applyDamage(newState, enemyPlayerKey, amount);
            }
        } else {
            const target = enemySt.slots[targetSlotIndex as number];
            if (target && target.state === 'summon') {
                const newHp = (target.card.hp || 0) - amount;
                enemySt.slots[targetSlotIndex as number] = newHp <= 0 ? null : { ...target, card: { ...target.card, hp: newHp } };
            }
        }

        newState.pendingEffect = null;
        pushGameState(checkWinCondition(newState));
    }, [gameState, myPlayerKey, enemyPlayerKey, pushGameState]);

    const cancelPendingEffect = useCallback(() => {
        if (!gameState || !gameState.pendingEffect || gameState.pendingEffect.player !== myPlayerKey) return;
        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        newState.pendingEffect = null;
        pushGameState(newState);
    }, [gameState, myPlayerKey, pushGameState]);

    const drawCard = (state: MultiplayerGameState, player: 'player1' | 'player2') => {
        const pState = state[player];
        if (pState.deck.length === 0) {
            const damage = Math.pow(2, pState.deckOutCount);
            pState.deckOutCount++;
            pState.hp = Math.max(0, pState.hp - damage);
            return;
        }
        const drawnCard = pState.deck.shift()!;
        pState.hand.push(drawnCard);
    };

    const startTurn = (state: MultiplayerGameState, player: 'player1' | 'player2') => {
        const pState = state[player];
        const char = CharactersDb[pState.characterId];

        pState.cp = Math.min(pState.cp + char.mpRegen, pState.maxCp);
        pState.usedSkillsThisTurn = [];
        pState.attackedThisTurn = [];

        let triggeredEffects: CardEffect[] = [];
        pState.slots = pState.slots.map(slot => {
            if (slot && slot.state === 'reserve') {
                if (slot.card.abilityEffects) triggeredEffects.push(...slot.card.abilityEffects);
                return { ...slot, state: 'summon' };
            }
            return slot;
        });

        resolveEffects(triggeredEffects, state, player);
        drawCard(state, player);

        state.currentTurn = player;
        if (player === 'player1') state.turnCount++;
    };

    const endTurn = useCallback(() => {
        if (!gameState || !isMyTurn || gameState.gameResult || gameState.pendingEffect) return;
        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const mySt = newState[myPlayerKey];

        // 攻撃しなかったモンスターの数だけCP回復
        let idleMonsters = 0;
        mySt.slots.forEach((slot, index) => {
            if (slot && slot.state === 'summon' && !mySt.attackedThisTurn.includes(index)) {
                idleMonsters++;
            }
        });
        if (idleMonsters > 0) {
            mySt.cp = Math.min(mySt.cp + idleMonsters, mySt.maxCp);
        }

        // --- ターン終了時の特殊効果 ---
        const enemySt = newState[enemyPlayerKey];
        mySt.slots.forEach((slot, index) => {
            // しゃば犬：自分のターン終了時に正面の相手モンスター（予約中含む）の攻撃力を-1
            if (slot && slot.state === 'summon' && slot.card.name === 'しゃば犬') {
                const frontEnemySlot = enemySt.slots[index];
                if (frontEnemySlot) {
                    frontEnemySlot.card.attack = Math.max(0, (frontEnemySlot.card.attack || 0) - 1);
                }
            }
        });

        if (mySt.hand.length > 6) {
            newState.discardPhaseTarget = myPlayerKey;
            pushGameState(newState);
            return; // turn doesn't end yet
        }

        startTurn(newState, enemyPlayerKey);
        pushGameState(checkWinCondition(newState));
    }, [gameState, isMyTurn, myPlayerKey, enemyPlayerKey, pushGameState]);

    const discardCard = useCallback((cardId: string) => {
        if (!gameState || gameState.discardPhaseTarget !== myPlayerKey) return;
        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const mySt = newState[myPlayerKey];

        const cardIndex = mySt.hand.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
            mySt.hand.splice(cardIndex, 1);
        }

        if (mySt.hand.length <= 6) {
            newState.discardPhaseTarget = null;
            startTurn(newState, enemyPlayerKey);
        }
        pushGameState(checkWinCondition(newState));
    }, [gameState, myPlayerKey, enemyPlayerKey, pushGameState]);

    const playCardToBoard = useCallback((cardId: string, slotIndex: number) => {
        if (!gameState || !isMyTurn || gameState.gameResult || gameState.pendingEffect || gameState.discardPhaseTarget) return false;

        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const mySt = newState[myPlayerKey];

        const cardIndex = mySt.hand.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;
        const card = mySt.hand[cardIndex];

        let cost = card.cost;
        let isLevelUp = false;
        let targetLevel = 1;

        const existingSlot = mySt.slots[slotIndex];
        if (existingSlot) {
            if (existingSlot.state === 'summon' && (existingSlot.level || 1) < 3) {
                targetLevel = (existingSlot.level || 1) + 1;
                cost += (existingSlot.level || 1); // add current level as cost
                isLevelUp = true;
            } else {
                return false;
            }
        }

        if (mySt.cp < cost) return false;

        mySt.cp -= cost;
        mySt.hand.splice(cardIndex, 1);

        if (card.type === 'monster') {
            if (isLevelUp && existingSlot) {
                mySt.slots[slotIndex] = {
                    card: {
                        ...card,
                        attack: (card.attack || 0) + (targetLevel - 1),
                        hp: (card.hp || 0) + ((targetLevel - 1) * 2)
                    },
                    state: 'reserve',
                    level: targetLevel
                };
            } else {
                mySt.slots[slotIndex] = { card, state: 'reserve', level: 1 };
            }
        } else if (card.type === 'magic') {
            if (card.abilityEffects) {
                resolveEffects(card.abilityEffects, newState, myPlayerKey);
            }
        }

        pushGameState(checkWinCondition(newState));
        return true;
    }, [gameState, isMyTurn, myPlayerKey, resolveEffects, pushGameState]);

    const executeAttack = useCallback((attackerSlotIndex: number, targetSlotIndex: number | 'player') => {
        if (!gameState || !isMyTurn || gameState.gameResult || gameState.pendingEffect) return false;

        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const mySt = newState[myPlayerKey];
        const enemySt = newState[enemyPlayerKey];

        const attacker = mySt.slots[attackerSlotIndex];
        if (!attacker || attacker.state !== 'summon') return false;
        if (mySt.attackedThisTurn.includes(attackerSlotIndex)) return false;

        // Taunt check
        const hasTaunt = enemySt.slots.some(s => s && s.state === 'summon' && s.card.isTaunt);
        if (hasTaunt) {
            if (targetSlotIndex === 'player') return false;
            const target = enemySt.slots[targetSlotIndex as number];
            if (!target || !target.card.isTaunt) return false;
        }

        if (attacker.card.attackEffects && attacker.card.attackEffects.length > 0) {
            const mappedEffects = attacker.card.attackEffects.filter(effect => {
                // ダメージを能力者に与えた時発動する効果
                if (effect.type === 'LEVEL_UP_RANDOM_ALLY' || effect.type === 'TRANSFORM_INTO') {
                    return targetSlotIndex === 'player';
                }
                // それ以外の攻撃時効果・アタック開始時効果は対象問わず発動
                return true;
            }).map(effect => {
                return { ...effect, amount: attackerSlotIndex };
            });
            resolveEffects(mappedEffects, newState, myPlayerKey);
        }

        if (targetSlotIndex === 'player') {
            applyDamage(newState, enemyPlayerKey, attacker.card.attack || 0);
        } else {
            const target = enemySt.slots[targetSlotIndex as number];
            if (target && target.state === 'summon') {
                const newEnemyHp = (target.card.hp || 0) - (attacker.card.attack || 0);
                enemySt.slots[targetSlotIndex as number] = newEnemyHp <= 0 ? null : { ...target, card: { ...target.card, hp: newEnemyHp } };
            }
        }

        mySt.attackedThisTurn.push(attackerSlotIndex);
        pushGameState(checkWinCondition(newState));
        return true;
    }, [gameState, isMyTurn, myPlayerKey, enemyPlayerKey, resolveEffects, pushGameState]);

    const getPlayableSkills = () => {
        if (!isMyTurn || !myState || !myCharacter) return [];
        return myCharacter.equippedSkills.filter(skill => {
            if (myState.cp < skill.cost) return false;
            if (myState.usedSkillsThisTurn.includes(skill.id)) return false;

            const roleCounts: Record<string, number> = {};
            const affCounts: Record<string, number> = {};
            myState.slots.forEach(s => {
                if (s && s.state === 'summon') {
                    if (s.card.role) roleCounts[s.card.role] = (roleCounts[s.card.role] || 0) + 1;
                    if (s.card.affiliation) affCounts[s.card.affiliation] = (affCounts[s.card.affiliation] || 0) + 1;
                }
            });

            return skill.conditions.every(cond => {
                if (cond.type === 'role') return (roleCounts[cond.value] || 0) >= cond.count;
                if (cond.type === 'affiliation') return (affCounts[cond.value] || 0) >= cond.count;
                return false;
            });
        });
    };

    const activateSkill = useCallback((skillId: string) => {
        if (!gameState || !isMyTurn || gameState.gameResult || gameState.pendingEffect) return false;

        const playable = getPlayableSkills();
        if (!playable.some(s => s.id === skillId)) return false;

        const skill = myCharacter!.equippedSkills.find(s => s.id === skillId)!;

        const newState = JSON.parse(JSON.stringify(gameState)) as MultiplayerGameState;
        const mySt = newState[myPlayerKey];

        mySt.cp -= skill.cost;
        if (skill.effects) {
            resolveEffects(skill.effects, newState, myPlayerKey);
        }
        mySt.usedSkillsThisTurn.push(skillId);

        pushGameState(checkWinCondition(newState));
        return true;
    }, [gameState, isMyTurn, myPlayerKey, myCharacter, resolveEffects, pushGameState]);

    return {
        myHP: myState?.hp || 0,
        myCP: myState?.cp || 0,
        myMaxCP: myState?.maxCp || 15,
        mySlots: myState?.slots || [null, null, null],
        hand: myState?.hand || [],
        deck: myState?.deck || [],
        mySkills: myState?.skills || [],

        enemyHP: enemyState?.hp || 0,
        enemyCP: enemyState?.cp || 0,
        enemyMaxCP: enemyState?.maxCp || 15,
        enemySlots: enemyState?.slots || [null, null, null],
        enemyDeck: enemyState?.deck || [],
        enemyHandCount: enemyState?.hand.length || 0,
        enemySkills: enemyState?.skills || [],

        myCharacter,
        enemyCharacter,

        currentTurn: isMyTurn ? 'player' : 'enemy',
        turnCount: gameState?.turnCount || 1,

        playCardToBoard,
        executeAttack,
        activateSkill,
        playableSkills: getPlayableSkills(),
        usedSkillsThisTurn: myState?.usedSkillsThisTurn || [],

        pendingEffect: gameState?.pendingEffect?.player === myPlayerKey ? gameState.pendingEffect.effect : null,
        resolvePendingEffect,
        cancelPendingEffect,

        attackedThisTurn: new Set(myState?.attackedThisTurn || []),
        gameResult: gameState?.gameResult === myPlayerKey ? 'win' : (gameState?.gameResult === enemyPlayerKey ? 'lose' : (gameState?.gameResult === 'draw' ? 'draw' : null)),

        discardPhase,
        endTurn,
        discardCard
    };
};
