import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter, pointerWithin } from '@dnd-kit/core';
import type { CollisionDetection } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Card } from './Card';
import type { CardData, BoardSlot, TunisianSkill } from '../types/game';
import { Zap, CircleDot, Flame, Shield } from 'lucide-react';
import { useGameEngine } from '../hooks/useGameEngine';
import { CardDetailModal } from './CardDetailModal';
import { SkillDetailModal } from './SkillDetailModal';

// Draggableな手札用コンポーネント
const DraggableHandCard = ({ card, onClick }: { card: CardData, onClick: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `hand-${card.id}`,
        data: { dragType: 'hand', card }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0 : 1, // DragOverlayを使うため元の場所は透明に
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => {
                // ドラッグでなくタップなら詳細表示
                if (!isDragging) {
                    onClick();
                }
            }}
            className="w-[20vw] max-w-[90px] aspect-[3/4] transition-transform hover:-translate-y-4 cursor-pointer shrink-0 touch-none relative hover:z-50 focus-within:z-50"
        >
            <div className="w-full h-full transform origin-bottom border-2 border-indigo-400 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-lg overflow-hidden bg-slate-800 pointer-events-none flex flex-col">
                <div className="bg-black/90 px-1 py-0.5 flex items-center gap-1 border-b border-gray-600 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                        {card.cost}
                    </div>
                    <div className="text-[9px] font-bold text-white truncate flex-1 leading-tight">
                        {card.name}
                    </div>
                </div>

                {/* 手札のイラスト表示を復旧 */}
                <div className={`flex-1 relative border-b border-gray-700/50 flex items-center justify-center overflow-hidden ${card.imageColor || 'bg-gray-700'}`}>
                    {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white/20 font-bold text-[8px] rotate-[15deg] tracking-wider pointer-events-none">
                            {card.type.toUpperCase()}
                        </span>
                    )}

                    {/* 所属・ロールアイコン (左上に小さく表示) */}
                    {card.type === 'monster' && (
                        <div className="absolute top-1 left-1 flex flex-col gap-0.5 pointer-events-none max-w-[80%]">
                            {card.affiliation && card.affiliation !== '無し' && (
                                <div className="flex items-center gap-0.5 bg-black/80 border border-purple-500/50 rounded-full pr-1.5 pl-0.5 py-0.5 shadow-[0_0_8px_rgba(168,85,247,0.4)] backdrop-blur-md w-max">
                                    <div className="w-3 h-3 rounded-full overflow-hidden bg-purple-900/50 shrink-0 border border-purple-400/30">
                                        <img src={`/images/affiliations/${card.affiliation}.png`} alt={card.affiliation} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-purple-200 text-[6px] font-bold leading-none">{card.affiliation}</span>
                                </div>
                            )}
                            {card.role && card.role !== '無し' && (
                                <div className="flex items-center gap-0.5 bg-black/80 border border-cyan-500/50 rounded-full pr-1.5 pl-0.5 py-0.5 shadow-[0_0_8px_rgba(6,182,212,0.4)] backdrop-blur-md w-max">
                                    <div className="w-3 h-3 rounded-full overflow-hidden bg-cyan-900/50 shrink-0 border border-cyan-400/30">
                                        <img src={`/images/roles/${card.role}.png`} alt={card.role} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-cyan-200 text-[6px] font-bold leading-none">{card.role}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`h-6 text-[7px] p-1 leading-tight text-gray-300 bg-black shrink-0 relative flex items-center justify-start`}>
                    {/* ステータス */}
                    {card.type === 'monster' && (
                        <div className="absolute -bottom-1 -left-1 flex gap-0.5 pl-1 pb-1 pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-red-600 border border-red-900 flex items-center justify-center font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.6)] text-[10px]">
                                {card.attack}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-green-600 border border-green-900 flex items-center justify-center font-bold text-white shadow-[0_0_8px_rgba(22,163,74,0.6)] text-[10px]">
                                {card.hp}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 盤面に配置されるアタッカーカード（ドラッグ＆長押し攻撃対応）
const DraggableAttackerCard = ({ index, boardCard, onCardClick, onAttackTap }: { index: number, boardCard: BoardSlot, onCardClick: (c: CardData) => void, onAttackTap: (slotIndex: number) => void }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `attacker-${index}`,
        data: { dragType: 'attacker', slotIndex: index, boardCard },
    });

    const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const didLongPress = React.useRef(false);

    // ドラッグ開始時にタイマーをキャンセル
    useEffect(() => {
        if (isDragging && longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, [isDragging]);

    const handlePointerDown = () => {
        didLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            onAttackTap(index);
        }, 500); // 500ms 長押しで攻撃ターゲット選択
    };

    const handlePointerUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onPointerDown={(e) => {
                // dnd-kitのlistenersのonPointerDownも呼ぶ
                if (listeners?.onPointerDown) listeners.onPointerDown(e);
                handlePointerDown();
            }}
            onPointerUp={() => {
                handlePointerUp();
            }}
            onPointerCancel={handlePointerUp}
            onClick={(e) => {
                e.stopPropagation();
                // 長押しでもドラッグ中でもなければカード詳細表示
                if (!isDragging && !didLongPress.current && boardCard) {
                    onCardClick(boardCard.card);
                }
            }}
            className={`w-full h-full transform scale-[0.95] ${isDragging ? 'opacity-0' : ''} `}
        >
            <Card card={boardCard?.card!} state={boardCard?.state!} level={boardCard?.level} />
        </div>
    );
};

// DroppableかつDraggableになりうる盤面スロットコンポーネント
const BoardSlotComponent = ({ index, boardCard, isEnemy, onCardClick, onAttackTap }: { index: number, boardCard: BoardSlot, isEnemy: boolean, onCardClick: (c: CardData) => void, onAttackTap?: (slotIndex: number) => void }) => {

    // アタッカーとしてドラッグ可能か判定 (自分のスロットかつ召喚状態のみ)
    const canAttack = !isEnemy && boardCard && boardCard.state === 'summon';

    // スロット自体へのドロップ設定
    const { isOver, setNodeRef: setDroppableRef } = useDroppable({
        id: isEnemy ? `enemy-slot-${index}` : `slot-${index}`
    });

    return (
        <div
            ref={setDroppableRef}
            onClick={() => {
                if (boardCard && !canAttack) {
                    // 相手の予約カードは詳細を見せない
                    if (isEnemy && boardCard.state === 'reserve') return;
                    onCardClick(boardCard.card);
                }
            }}
            className={`relative w-[28vw] max-w-[100px] aspect-[3/4] rounded-lg border-2 flex items-center justify-center transition-all bg-black/40 touch-none
           ${isEnemy ? 'border-red-900/50 shadow-[inset_0_0_15px_rgba(220,38,38,0.1)]' : 'border-blue-900/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]'}
           ${isOver ? (isEnemy ? 'border-red-400 bg-red-900/50' : 'border-cyan-400 bg-cyan-900/50 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105') : ''}
           ${isEnemy ? 'transform rotate-x-6' : 'transform -rotate-x-6'}
`}>
            {boardCard ? (
                canAttack ? (
                    <DraggableAttackerCard index={index} boardCard={boardCard} onCardClick={onCardClick} onAttackTap={onAttackTap || (() => { })} />
                ) : (
                    <div className="w-full h-full transform scale-[0.95] pointer-events-none">
                        <Card card={boardCard.card} state={boardCard.state} level={boardCard.level} />
                    </div>
                )
            ) : (
                <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center pointer-events-none">
                    <CircleDot className={`w-4 h-4 ${isOver ? 'text-cyan-400' : 'text-white/20'} `} />
                </div>
            )}
        </div>
    )
};


export const BattleBoard: React.FC = () => {
    const {
        myHP, myCP, myMaxCP,
        enemyHP, enemyCP, enemyMaxCP,
        hand, mySlots, enemySlots,
        deck, enemyDeck,
        currentTurn,
        myCharacter, enemyCharacter,
        playableSkills,
        usedSkillsThisTurn,
        endTurn,
        playCardToBoard,
        executeAttack,
        discardCard,
        activateSkill,
        pendingEffect,
        resolvePendingEffect,
        cancelPendingEffect,
        attackedThisTurn,
        gameResult,
        discardPhase
    } = useGameEngine();

    const [activeDragData, setActiveDragData] = useState<any>(null);
    const [selectedCardDetail, setSelectedCardDetail] = useState<CardData | null>(null);
    const [selectedSkillDetail, setSelectedSkillDetail] = useState<{ skill: TunisianSkill, isEnemy: boolean } | null>(null);

    // モンスターのタップ攻撃用ステート（タップしたモンスターのスロットインデックスを保持）
    const [pendingAttacker, setPendingAttacker] = useState<number | null>(null);

    // ターン切り替え時のトランジション用ステート
    const [showTurnTransition, setShowTurnTransition] = useState(false);
    const [transitionText, setTransitionText] = useState('');

    useEffect(() => {
        setTransitionText(currentTurn === 'player' ? 'YOUR TURN' : 'ENEMY TURN');
        setShowTurnTransition(true);
        const timer = setTimeout(() => {
            setShowTurnTransition(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [currentTurn]);

    // クリックイベントがドラッグ判定に吸われないようにセンサーを設定
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px移動するまではタップアクションとして扱う
            },
        })
    );

    // カスタム衝突判定: enemy-player の上にポインタがあればそちらを優先、なければ closestCenter
    const customCollisionDetection: CollisionDetection = (args) => {
        // まず pointerWithin で enemy-player を検出
        const pointerCollisions = pointerWithin(args);
        const enemyPlayerHit = pointerCollisions.find(c => c.id === 'enemy-player');
        if (enemyPlayerHit) {
            return [enemyPlayerHit];
        }
        // それ以外は closestCenter でスロットを判定
        return closestCenter(args);
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (currentTurn !== 'player') return; // 自分のターン以外は操作不可
        const { active } = event;
        setActiveDragData(active.data.current);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragData(null);

        if (!over) return;

        const dragData = active.data.current as any;
        const overId = over.id.toString();

        // アクション 1: 手札から盤面に出す
        if (dragData?.dragType === 'hand') {
            if (overId.startsWith('slot-')) {
                const slotIndex = parseInt(overId.replace('slot-', ''), 10);
                playCardToBoard(dragData.card.id as string, slotIndex);
            }
        }

        // アクション 2: モンスターが攻撃する
        if (dragData?.dragType === 'attacker') {
            const attackerSlotIndex = dragData.slotIndex;
            console.log('Attacker Drop:', { overId, attackerSlotIndex });

            // Target is enemy player
            if (over.id === 'enemy-player') {
                const attackerIndex = parseInt(String(active.id).replace('attacker-', ''), 10);
                console.log('Execute attack on player from', attackerIndex);
                executeAttack(attackerIndex, 'player');
                return;
            }
            if (overId.startsWith('enemy-slot-')) {
                const targetSlotIndex = parseInt(overId.replace('enemy-slot-', ''), 10);
                // ターゲットにカードがあるか
                if (enemySlots[targetSlotIndex]) {
                    executeAttack(attackerSlotIndex, targetSlotIndex);
                }
            }
        }
    };

    const handleDragOver = () => {
        // ドラッグ中のホバーフィードバック用（現在は不要）
    };

    const handleDragMove = () => {
        // ドラッグ移動のログ用（不要）
    };

    // 敵能力者へのダイレクトアタック領域（ドロップ先）
    const { setNodeRef: setEnemyPlayerRef, isOver: isPlayerOver } = useDroppable({
        id: 'enemy-player'
    });

    return (
        <DndContext sensors={sensors} collisionDetection={customCollisionDetection} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-stone-950 text-white flex flex-col relative overflow-hidden font-sans select-none">
                {/* 背景など既存のままでOK */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWExYTFhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDA4TDggOFoiIGZpbGw9IiMzMzMzMzMiPjwvcGF0aD4KPC9zdmc+')] opacity-20 pointer-events-none mingle-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-stone-950 to-blue-950/30 pointer-events-none" />

                {/* ============== 敵プレイヤー情報 ============== */}
                <div
                    className="h-16 bg-gradient-to-b from-black/80 to-transparent flex justify-between w-full relative z-10 pointer-events-none"
                >
                    {/* 左側：敵のスキル情報 */}
                    <div className="flex-1 flex flex-col items-start justify-start px-2 pt-1 pointer-events-auto overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-1 items-start">
                            {enemyCharacter.equippedSkills.map((skill) => (
                                <button
                                    key={`enemy-${skill.id}`}
                                    onClick={() => setSelectedSkillDetail({ skill, isEnemy: true })}
                                    className="relative px-2 py-0.5 rounded text-[10px] font-bold transition-all bg-red-950/80 text-red-200 border border-red-900 hover:bg-red-900 hover:text-white cursor-pointer shadow-md"
                                    title={`コスト:${skill.cost} 効果:${skill.name}`}
                                >
                                    <div className="flex items-center gap-1 relative z-10 drop-shadow-md">
                                        <span className="font-mono px-1 rounded border bg-black/40 border-red-800 text-red-100">{skill.cost}</span>
                                        <span>{skill.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 中央：敵プレイヤー情報 ＆ ドロップ判定領域 */}
                    <div className="flex shrink-0 justify-center pt-2 pointer-events-auto">
                        <div
                            ref={setEnemyPlayerRef}
                            className={`flex items-center gap-2 z-10 touch-none p-1 rounded-xl transition-all cursor-crosshair
                            ${isPlayerOver ? 'bg-red-900/50 ring-4 ring-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] scale-105' : ''}
                            `}
                        >
                            <div className="relative pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-red-900/50 border-2 border-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] overflow-hidden">
                                    <img src={`/images/characters/${enemyCharacter.id}.png`} alt="Enemy" className="w-full h-full object-cover transform scale-125 object-top" />
                                </div>
                            </div>
                            <div className="pointer-events-none">
                                <div className="flex items-center gap-1">
                                    <div className="text-sm font-bold text-red-100">{enemyCharacter.name}</div>
                                    <span className="text-[10px] bg-slate-800/80 px-1 py-0.5 rounded border border-slate-600 flex items-center gap-0.5 shadow"><Shield className="w-3 h-3 text-slate-300" />{enemyCharacter.defense}</span>
                                </div>
                                <div className="w-24 h-3 bg-red-950 border border-red-800 rounded-full mt-1 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300" style={{ width: `${(enemyHP / enemyCharacter.maxHp) * 100}%` }} />
                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">{enemyHP} / {enemyCharacter.maxHp}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右側：CP情報 */}
                    <div className="flex-1 flex flex-col items-end px-2 pt-1 gap-1">
                        <div className="bg-slate-900/80 p-1.5 rounded-xl backdrop-blur border border-slate-700 shadow-xl pointer-events-none">
                            <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs font-bold text-cyan-100">CP</span>
                                <span className="text-base font-bold text-white">{enemyCP}<span className="text-[10px] text-cyan-400">/{enemyMaxCP}</span></span>
                            </div>
                        </div>
                        <div className="flex gap-1 pointer-events-none">
                            <div className="bg-black/60 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                                <span className="text-[9px] text-slate-400">DECK</span>
                                <span className="font-mono font-bold text-xs text-white">{enemyDeck.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============== メイン戦場エリア ============== */}
                <div className="flex-1 flex flex-col justify-center items-center relative z-0 py-1 mt-2">

                    {/* 敵側のスロット（視覚効果はコンポーネント内に移動） */}
                    <div className="flex gap-2 justify-center mb-4 w-full px-2 perspective-[800px]">
                        {enemySlots.map((boardCard, i) => (
                            <BoardSlotComponent key={`e-${i}`} index={i} boardCard={boardCard} isEnemy={true} onCardClick={setSelectedCardDetail} />
                        ))}
                    </div>

                    <div className="w-full flex items-center justify-center relative my-2 h-8 shrink-0">
                        <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-purple-900/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-10 animate-pulse pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-purple-500/40 blur-sm absolute" />
                            <Flame className="w-5 h-5 text-purple-400 relative z-10" />
                        </div>
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent absolute top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 味方側のスロット */}
                    <div className="flex gap-2 justify-center mt-4 w-full px-2 relative z-10 perspective-[800px]">
                        {mySlots.map((boardCard, i) => (
                            <BoardSlotComponent key={`m-${i}`} index={i} boardCard={boardCard} isEnemy={false} onCardClick={setSelectedCardDetail} onAttackTap={(slotIndex) => {
                                if (currentTurn === 'player' && !attackedThisTurn.has(slotIndex) && !gameResult) {
                                    setPendingAttacker(slotIndex);
                                }
                            }} />
                        ))}
                    </div>

                    {/* 攻撃済み/召喚酔いインジケーター */}
                    <div className="flex gap-2 justify-center w-full px-2 mt-0.5">
                        {mySlots.map((slot, i) => (
                            <div key={`status-${i}`} className="w-[28vw] max-w-[100px] text-center h-4">
                                {slot && slot.state === 'summon' && attackedThisTurn.has(i) && (
                                    <span className="text-[9px] text-gray-500 font-bold">攻撃済</span>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

                {/* ============== 味方プレイヤー情報 & 手札 ============== */}
                <div className="mt-auto shrink-0 relative z-20 flex flex-col">
                    {/* プレイヤー情報 */}
                    <div className="px-2 mb-1 flex justify-between items-end drop-shadow-lg">
                        <div className="flex items-center gap-3 bg-black/60 p-2 rounded-xl backdrop-blur border border-white/10 shadow-xl pointer-events-auto">
                            <div className="w-12 h-12 rounded-full bg-blue-900/50 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] overflow-hidden">
                                <img src={`/images/characters/${myCharacter.id}.png`} alt="Player" className="w-full h-full object-cover transform scale-125 object-top" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-bold text-blue-100">{myCharacter.name}</div>
                                    {myCharacter.defense > 0 && <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-600 flex items-center gap-1 shadow"><Shield className="w-3 h-3 text-slate-300" /> {myCharacter.defense}</span>}
                                </div>
                                <div className="w-24 h-3 bg-blue-950 border border-blue-800 rounded-full mt-1 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300" style={{ width: `${(myHP / myCharacter.maxHp) * 100}% ` }} />
                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">{myHP} / {myCharacter.maxHp}</span>
                                </div>
                                <div className="mt-2 flex gap-1">
                                    {myCharacter.equippedSkills.map((skill) => {
                                        const isUsed = usedSkillsThisTurn.includes(skill.id);
                                        const isPlayable = playableSkills.some(s => s.id === skill.id) && !isUsed;

                                        return (
                                            <button
                                                key={skill.id}
                                                onClick={() => setSelectedSkillDetail({ skill, isEnemy: false })}
                                                className={`relative px-2 py-0.5 rounded text-[10px] font-bold transition-all overflow-hidden group border
                                                   ${isPlayable
                                                        ? 'bg-gradient-to-b from-yellow-500 to-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] border-yellow-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(253,224,71,0.8)] z-10'
                                                        : isUsed
                                                            ? 'bg-stone-900/80 text-stone-600 border-stone-800 opacity-50 cursor-pointer'
                                                            : 'bg-stone-800 text-stone-500 border-stone-600 opacity-80 cursor-pointer'
                                                    }
`}
                                                title={`コスト:${skill.cost} 効果:${skill.name} `}
                                            >
                                                {/* Playable時のみキラッと光るエフェクト */}
                                                {isPlayable && (
                                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
                                                )}
                                                <div className="flex items-center gap-1 relative z-10 drop-shadow-md">
                                                    <span className={`font-mono px-1 rounded border ${isPlayable ? 'bg-black/40 text-yellow-100 border-yellow-500/50' : 'bg-black/20 border-stone-700'} `}>{skill.cost}</span>
                                                    <span>{isUsed ? '使用済' : skill.name}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end pointer-events-auto">
                            {/* ターン終了ボタン */}
                            <button
                                onClick={() => {
                                    if (currentTurn === 'player' && !gameResult) endTurn();
                                }}
                                disabled={currentTurn !== 'player' || !!gameResult}
                                className={`text-xs font-bold py-1 px-3 rounded shadow-[0_0_10px_rgba(79,70,229,0.5)] border transition-colors ${currentTurn === 'player' && !gameResult
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400'
                                    : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                ターン終了
                            </button>
                            <div className="bg-black/60 p-2 px-4 rounded-xl backdrop-blur border border-white/10 flex flex-col items-center">
                                <span className="text-cyan-400 text-xs font-bold mb-1">CP</span>
                                <div className="flex gap-1 items-baseline">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[inset_0_0_10px_rgba(6,182,212,0.5)]">
                                        <span className="font-mono font-bold text-xl text-white">{myCP}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">/{myMaxCP}</span>
                                </div>
                            </div>
                            {/* デッキ残数 */}
                            <div className="bg-black/60 px-3 py-1 rounded-lg backdrop-blur border border-white/10 flex items-center gap-1">
                                <span className="text-[10px] text-slate-400">DECK</span>
                                <span className="font-mono font-bold text-sm text-white">{deck.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* 手札エリア（枚数に応じてカードが重なる） */}
                    <div className="h-28 bg-stone-900 border-t-2 border-stone-700/80 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] flex justify-center items-end pb-1 px-2 z-30 touch-none">
                        <div className="flex justify-center items-end" style={{ marginLeft: hand.length > 4 ? `${Math.min((hand.length - 4) * 8, 30)}px` : '0' }}>
                            {hand.map((card, i) => {
                                // カード枚数に応じて重なり幅を動的に計算
                                const overlap = hand.length <= 4 ? 0 : Math.min((hand.length - 4) * 10, 45);
                                return (
                                    <div key={card.id} style={{ marginLeft: i === 0 ? 0 : `-${overlap}px`, zIndex: i }} className="transition-all duration-200">
                                        <DraggableHandCard card={card} onClick={() => setSelectedCardDetail(card)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ドラッグ中のオーバーレイ表示 */}
                <DragOverlay dropAnimation={null} className="z-50 pointer-events-none">
                    {activeDragData?.dragType === 'hand' && activeDragData.card ? (
                        <div className="w-[20vw] max-w-[90px] aspect-[3/4] opacity-80 rotate-3 scale-110 pointer-events-none">
                            <Card card={activeDragData.card} />
                        </div>
                    ) : null}
                    {activeDragData?.dragType === 'attacker' && activeDragData.boardCard ? (
                        <div className="w-[28vw] max-w-[100px] aspect-[3/4] opacity-80 scale-105 pointer-events-none">
                            <Card card={activeDragData.boardCard.card} state={activeDragData.boardCard.state} level={activeDragData.boardCard.level} />
                        </div>
                    ) : null}
                </DragOverlay>

                {/* カード詳細モーダル */}
                {selectedCardDetail && (
                    <CardDetailModal
                        card={selectedCardDetail}
                        onClose={() => setSelectedCardDetail(null)}
                    />
                )}

                {selectedSkillDetail && (
                    <SkillDetailModal
                        skill={selectedSkillDetail.skill}
                        isPlayable={!selectedSkillDetail.isEnemy && playableSkills.some(s => s.id === selectedSkillDetail.skill.id)}
                        isUsed={!selectedSkillDetail.isEnemy && usedSkillsThisTurn.includes(selectedSkillDetail.skill.id)}
                        onClose={() => setSelectedSkillDetail(null)}
                        onActivate={() => {
                            if (!selectedSkillDetail.isEnemy) {
                                activateSkill(selectedSkillDetail.skill.id);
                                setSelectedSkillDetail(null);
                            }
                        }}
                    />
                )}

                {/* ターゲット選択オーバーレイ（スキル・魔法・モンスター攻撃のターゲット選択用） */}
                {(pendingEffect || pendingAttacker !== null) && (
                    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-start bg-black/70 backdrop-blur-sm">
                        {/* ヘッダーメッセージ */}
                        <div className="mt-4 mb-6 text-center">
                            <div className="text-xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse">
                                ⚔️ ターゲットを選択してください
                            </div>
                            <div className="text-sm text-gray-300 mt-1">
                                {pendingEffect
                                    ? `${pendingEffect.type === 'FIXED_DAMAGE_TARGET' ? `固定${pendingEffect.amount}` : pendingEffect.amount}ダメージを与える対象を選んでください`
                                    : `モンスターの攻撃先を選んでください`
                                }
                            </div>
                        </div>

                        {/* 敵モンスタースロット */}
                        <div className="flex gap-3 justify-center mb-6">
                            {enemySlots.map((slot, i) => (
                                <button
                                    key={`target-enemy-${i}`}
                                    disabled={!slot || slot.state !== 'summon'}
                                    onClick={() => {
                                        if (pendingEffect) {
                                            resolvePendingEffect(i);
                                        } else if (pendingAttacker !== null) {
                                            executeAttack(pendingAttacker, i);
                                            setPendingAttacker(null);
                                        }
                                    }}
                                    className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                                        ${slot && slot.state === 'summon'
                                            ? 'border-red-500 bg-red-900/40 hover:bg-red-700/60 hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                                            : 'border-gray-700 bg-gray-900/40 opacity-30 cursor-not-allowed'
                                        }`}
                                >
                                    {slot && slot.state === 'summon' ? (
                                        <>
                                            <div className="text-white font-bold text-sm">{slot.card.name}</div>
                                            <div className="flex gap-2">
                                                <span className="text-red-400 font-mono text-xs">⚔ {slot.card.attack}</span>
                                                <span className="text-green-400 font-mono text-xs">♥ {slot.card.hp}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-gray-600 text-xs">空き</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* 敵能力者ボタン */}
                        <button
                            onClick={() => {
                                if (pendingEffect) {
                                    resolvePendingEffect('player');
                                } else if (pendingAttacker !== null) {
                                    executeAttack(pendingAttacker, 'player');
                                    setPendingAttacker(null);
                                }
                            }}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-orange-500 bg-orange-900/40 active:bg-orange-700/60 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all animate-pulse mb-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-900/50 border-2 border-red-500 flex items-center justify-center overflow-hidden">
                                <img src={`/images/characters/${enemyCharacter.id}.png`} alt="Enemy" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-orange-200 font-bold">{enemyCharacter.name} に攻撃</div>
                                <div className="text-orange-400 text-xs">HP: {enemyHP} / {enemyCharacter.maxHp}</div>
                            </div>
                        </button>

                        {/* キャンセルボタン */}
                        <button
                            onClick={() => {
                                if (pendingEffect) cancelPendingEffect();
                                setPendingAttacker(null);
                            }}
                            className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
                        >
                            キャンセル
                        </button>
                    </div>
                )}

                {/* 勝敗結果オーバーレイ */}
                {gameResult && (
                    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                        <div className={`text-4xl font-black italic tracking-widest mb-6 ${gameResult === 'win'
                            ? 'text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]'
                            : 'text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]'
                            }`}>
                            {gameResult === 'win' ? '🎉 YOU WIN!' : '💀 YOU LOSE...'}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 active:bg-indigo-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-400"
                        >
                            もう一度プレイ
                        </button>
                    </div>
                )}

                {/* ターントランジションアニメーション */}
                {showTurnTransition && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-pulse" />
                        <div className={`
                            relative text-3xl font-black italic tracking-widest uppercase
                           ${currentTurn === 'player' ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]'}
                            animate-[bounce-in_0.5s_ease-out_forwards]
    `}>
                            {transitionText}
                        </div>
                    </div>
                )}

                {/* 捨てるカード選択モーダル */}
                {discardPhase && hand.length > 6 && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">手札上限オーバー</h2>
                            <p className="text-white text-sm">手札を6枚にしてください。あと<span className="text-red-400 font-bold">{hand.length - 6}枚</span>捨ててください。</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 p-4 bg-red-950/30 rounded-2xl border border-red-500/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]">
                            {hand.map((card) => (
                                <div
                                    key={card.id}
                                    className="w-[22vw] max-w-[100px] aspect-[3/4] cursor-pointer hover:-translate-y-4 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 意図しないドラッグ等への干渉を防ぐ
                                        discardCard(card.id);
                                    }}
                                >
                                    <div className="w-full h-full pointer-events-none rounded-lg overflow-hidden border-2 border-transparent hover:border-red-500 transition-colors">
                                        <Card card={card} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DndContext >
    );
};
