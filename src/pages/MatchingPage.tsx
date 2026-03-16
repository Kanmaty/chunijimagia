// マッチングページ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { CharactersDb } from '../data/characters';

export const MatchingPage: React.FC = () => {
    const navigate = useNavigate();
    const { roomId, roomData, createRoom, joinRoom, error, loading } = useRoom();

    const [playerName, setPlayerName] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState('delta');
    const [mode, setMode] = useState<'menu' | 'waiting'>('menu');

    const characterList = Object.values(CharactersDb);

    // ルーム状態の変化を監視 → デッキ構築画面へ遷移
    useEffect(() => {
        if (roomData?.status === 'deckbuilding' || roomData?.status === 'playing') {
            navigate(`/deck?roomId=${roomId}`);
        }
    }, [roomData?.status, roomId, navigate]);

    const handleCreate = async () => {
        if (!playerName.trim() || !password.trim()) return;
        const id = await createRoom(password.trim(), playerName.trim(), selectedCharacter);
        if (id) {
            setMode('waiting');
        }
    };

    const handleJoin = async () => {
        if (!playerName.trim() || !password.trim()) return;
        await joinRoom(password.trim(), playerName.trim(), selectedCharacter);
    };

    return (
        <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-4 font-sans">
            {/* 背景パターン */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-stone-950 to-stone-950 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md space-y-6">
                {/* タイトル */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        チュニジマギア
                    </h1>
                    <p className="text-sm text-slate-400">友達と合言葉でマッチング対戦</p>
                </div>

                {mode === 'waiting' ? (
                    // 待機画面
                    <div className="bg-stone-900/80 backdrop-blur border border-stone-700 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                        <div className="animate-pulse">
                            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/30 border-2 border-indigo-500 flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-white">対戦相手を待っています…</h2>
                        <p className="text-sm text-slate-400">合言葉: <span className="text-cyan-400 font-mono font-bold">{password}</span></p>
                        <p className="text-xs text-slate-500">相手がこの合言葉で参加すると対戦が始まります</p>
                    </div>
                ) : (
                    // メニュー画面
                    <div className="space-y-4">
                        {/* プレイヤー名 */}
                        <div className="bg-stone-900/80 backdrop-blur border border-stone-700 rounded-2xl p-4 space-y-3 shadow-xl">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">プレイヤー名</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="名前を入力"
                                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                maxLength={20}
                            />
                        </div>

                        {/* キャラクター選択 */}
                        <div className="bg-stone-900/80 backdrop-blur border border-stone-700 rounded-2xl p-4 space-y-3 shadow-xl">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">能力者を選択</label>
                            <div className="grid grid-cols-2 gap-3">
                                {characterList.map((char) => (
                                    <button
                                        key={char.id}
                                        onClick={() => setSelectedCharacter(char.id)}
                                        className={`relative p-3 rounded-xl border-2 transition-all ${selectedCharacter === char.id
                                                ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                : 'border-stone-600 bg-stone-800 active:scale-95'
                                            }`}
                                    >
                                        <div className="w-12 h-12 mx-auto rounded-full bg-stone-700 border border-stone-500 overflow-hidden mb-2">
                                            <img src={`/images/characters/${char.id}.png`} alt={char.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-sm font-bold text-center">{char.name}</div>
                                        <div className="text-[10px] text-slate-400 text-center">
                                            HP:{char.maxHp} DEF:{char.defense} MP:{char.initialMp}+{char.mpRegen}/t
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 合言葉 */}
                        <div className="bg-stone-900/80 backdrop-blur border border-stone-700 rounded-2xl p-4 space-y-3 shadow-xl">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">合言葉</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="対戦相手と同じ合言葉を入力"
                                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                maxLength={30}
                            />
                        </div>

                        {/* エラー */}
                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-950/30 border border-red-800/50 rounded-lg p-2">
                                {error}
                            </div>
                        )}

                        {/* ボタン */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreate}
                                disabled={loading || !playerName.trim() || !password.trim()}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ルーム作成
                            </button>
                            <button
                                onClick={handleJoin}
                                disabled={loading || !playerName.trim() || !password.trim()}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-cyan-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                参加する
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
