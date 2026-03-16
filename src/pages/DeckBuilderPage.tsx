// デッキ作成ページ
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { CardsDb } from '../data/cards';
import { CharactersDb } from '../data/characters';
import { Card } from '../components/Card';

// デッキに入れることのできるカード一覧（masterカードデータ）
const allCards = Object.values(CardsDb).filter(c => c.id !== 'minion' && c.id !== 'chou_nuko'); // 手下やトークン等は除外

export const DeckBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roomIdParam = searchParams.get('roomId');
    const { roomData, myUid, saveDeck, setRoomId } = useRoom();

    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    // URLからroomIdをセット
    useEffect(() => {
        if (roomIdParam) {
            setRoomId(roomIdParam);
        }
    }, [roomIdParam, setRoomId]);

    // ルームがplaying状態になったら対戦ページへ遷移
    useEffect(() => {
        if (roomData?.status === 'playing' && roomIdParam) {
            navigate(`/battle/${roomIdParam}`);
        }
    }, [roomData?.status, roomIdParam, navigate]);

    // 自分がreadyかどうか
    const myPlayer = roomData?.player1?.uid === myUid ? roomData?.player1 : roomData?.player2;
    const isReady = myPlayer?.ready ?? false;
    const myCharacterParams = myPlayer ? CharactersDb[myPlayer.characterId] : null;

    // カードをデッキに追加
    const addCard = (cardId: string) => {
        if (selectedCards.length >= 20) return; // 20枚上限
        const count = selectedCards.filter(id => id === cardId).length;
        if (count >= 2) return; // 同名2枚上限
        setSelectedCards(prev => [...prev, cardId]);
    };

    // カードをデッキから1枚削除
    const removeCard = (index: number) => {
        setSelectedCards(prev => prev.filter((_, i) => i !== index));
    };

    // デッキ保存
    const handleSave = async () => {
        if (selectedCards.length !== 20 || selectedSkills.length !== 3) return;
        setSaving(true);
        await saveDeck(selectedCards, selectedSkills);
        setSaving(false);
    };

    // スキル選択トグル (ギア1, 2, 3から各1つ)
    const toggleSkill = (skillId: string) => {
        if (!myCharacterParams) return;
        const targetSkill = myCharacterParams.equippedSkills.find(s => s.id === skillId);
        if (!targetSkill) return;

        setSelectedSkills(prev => {
            const isCurrentlySelected = prev.includes(skillId);
            if (isCurrentlySelected) {
                return prev.filter(id => id !== skillId);
            }
            // 同じレベルのスキルが既に選択されていたら外して入れ替える
            const otherLevelSkills = prev.filter(id => {
                const s = myCharacterParams.equippedSkills.find(cs => cs.id === id);
                return s?.level !== targetSkill.level;
            });
            return [...otherLevelSkills, skillId];
        });
    };

    return (
        <div className="min-h-screen bg-stone-950 text-white flex flex-col font-sans">
            {/* ヘッダー */}
            <div className="bg-stone-900/80 border-b border-stone-700 px-4 py-3 flex items-center justify-between shrink-0">
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    デッキ作成
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold ${selectedCards.length === 20 ? 'text-green-400' : 'text-yellow-400'}`}>
                            カード: {selectedCards.length}/20
                        </span>
                        <span className={`text-[10px] font-bold ${selectedSkills.length === 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                            スキル: {selectedSkills.length}/3
                        </span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={selectedCards.length !== 20 || selectedSkills.length !== 3 || saving || isReady}
                        className="px-4 py-1.5 rounded-lg font-bold text-sm bg-gradient-to-r from-cyan-600 to-cyan-500 active:scale-95 transition-all border border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isReady ? '準備完了 ✓' : saving ? '保存中...' : '決定'}
                    </button>
                </div>
            </div>

            {isReady ? (
                // 準備完了 → 待機画面
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-4">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-green-600/30 border-2 border-green-500 flex items-center justify-center">
                            <span className="text-2xl">✓</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold">デッキ登録完了！</h2>
                    <p className="text-sm text-slate-400 text-center">
                        対戦相手のデッキ作成が終わるのを<br />待っています…
                    </p>
                </div>
            ) : (
                // デッキ作成UI
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* 選択済みデッキ（上部） */}
                    <div className="bg-stone-900/60 border-b border-stone-700 p-3 shrink-0">
                        <div className="text-xs text-slate-400 mb-2 font-bold">デッキ（タップで除外）</div>
                        {selectedCards.length === 0 ? (
                            <div className="h-16 flex items-center justify-center text-sm text-slate-500">
                                下のカード一覧からタップして追加
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {selectedCards.map((cardId, i) => {
                                    const card = CardsDb[cardId];
                                    return (
                                        <button
                                            key={`deck-${i}`}
                                            onClick={() => removeCard(i)}
                                            className="bg-stone-800 border border-stone-600 rounded-lg px-2 py-1 text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1"
                                        >
                                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center shrink-0">
                                                {card.cost}
                                            </span>
                                            <span className="truncate max-w-[60px]">{card.name}</span>
                                            <span className="text-red-400">×</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* スキル選択セクション */}
                    {myCharacterParams && (
                        <div className="bg-stone-900/60 border-b border-stone-700 p-3 shrink-0">
                            <div className="text-xs text-slate-400 mb-2 font-bold flex justify-between">
                                <span>能力者スキル（ギア1・2・3から各1つ選択）</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(level => (
                                    <div key={`gear-${level}`}>
                                        <div className="text-cyan-400 text-[10px] font-bold mb-1 border-b border-cyan-900 pb-0.5">ギア {level}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {myCharacterParams.equippedSkills.filter(s => s.level === level).map(skill => {
                                                const isSelected = selectedSkills.includes(skill.id);
                                                return (
                                                    <button
                                                        key={skill.id}
                                                        onClick={() => toggleSkill(skill.id)}
                                                        className={`p-2 rounded-lg border-2 text-left transition-all ${isSelected
                                                            ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                                            : 'border-stone-700 bg-stone-800 hover:border-stone-500 hover:bg-stone-700/50'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-5 h-5 rounded-full bg-red-900/80 border border-red-700 text-red-200 text-xs flex items-center justify-center font-bold shadow-inner">
                                                                    {skill.cost}
                                                                </span>
                                                                <span className="font-bold text-sm text-white drop-shadow">{skill.name}</span>
                                                            </div>
                                                            {isSelected && <span className="text-cyan-400 font-bold text-lg leading-none drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">✓</span>}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 line-clamp-2">{skill.description}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* カード一覧（下部スクロール） */}
                    <div className="flex-1 overflow-y-auto p-3 pb-20">
                        <div className="text-xs text-slate-400 mb-2 font-bold">カード一覧（タップで追加）</div>
                        <div className="grid grid-cols-3 gap-2">
                            {allCards.map((card) => {
                                const count = selectedCards.filter(id => id === card.id).length;
                                const isMax = count >= 2;
                                const isDeckFull = selectedCards.length >= 20;

                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => addCard(card.id)}
                                        disabled={isMax || isDeckFull}
                                        className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-all ${isMax || isDeckFull
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'active:scale-95 active:ring-2 active:ring-cyan-500'
                                            }`}
                                    >
                                        <Card card={card} />
                                        {/* 選択枚数バッジ */}
                                        {count > 0 && (
                                            <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg z-20">
                                                {count}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
