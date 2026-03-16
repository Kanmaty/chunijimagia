import React from 'react';
import type { CardData, BoardSummonState } from '../types/game';

interface CardProps {
    card: CardData | 'back'; // 'back'の場合は裏面を描画
    state?: BoardSummonState; // 盤面上のカード用状態 (予約 or 召喚)
    level?: number; // レベルアップサモン用
}

export const Card: React.FC<CardProps> = ({ card, state = 'summon', level }) => {
    if (card === 'back') {
        return (
            <div className="w-full h-full relative rounded-lg border-2 border-indigo-900 bg-indigo-950 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWExYTFhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDA4TDggOFoiIGZpbGw9IiMzMzMzMzMiPjwvcGF0aD4KPC9zdmc+')] opacity-30" />
                <div className="w-8 h-12 border border-indigo-500/50 rounded-sm rotate-45 flex items-center justify-center relative z-10 bg-indigo-900/40 backdrop-blur-sm">
                    <div className="w-4 h-8 border border-purple-400/50 rounded-sm absolute" />
                </div>
            </div>
        );
    }

    const isMonster = card.type === 'monster';

    // 「予約」状態の場合はコストだけ表示（あるいは伏せカードのように表示）
    if (state === 'reserve') {
        return (
            <div className={`w-full h-full relative rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-slate-900 shadow-md ${level && level > 1 ? 'border-yellow-500' : 'border-gray-600'}`}>
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center font-bold text-white text-[10px] shrink-0 z-10">
                    {card.cost}
                </div>
                {level && level > 1 ? (
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-yellow-400 font-bold text-[10px] drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">
                            Lv.{level}
                        </span>
                        <span className="text-white/50 font-bold text-[7px] tracking-wider">
                            LEVEL UP
                        </span>
                    </div>
                ) : (
                    <span className="text-white/40 font-bold text-[8px] rotate-[15deg] tracking-wider pointer-events-none">
                        RESERVE
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`w-full h-full relative rounded-lg border flex flex-col overflow-hidden bg-slate-800 select-none
      ${isMonster ? (card.isTaunt ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 'border-gray-500') : 'border-indigo-500'}
    `}>
            {/* 盤面用カードのヘッダー：マナコストと名前をコンパクトに */}
            <div className="bg-black/90 px-1 py-0.5 flex items-center gap-1 border-b border-gray-600">
                <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                    {card.cost}
                </div>
                <div className="text-[9px] font-bold text-white truncate flex-1 leading-tight">
                    {card.name}
                </div>
            </div>

            {/* イラスト枠 */}
            <div className={`flex-1 relative border-b border-gray-700/50 ${card.imageColor || 'bg-gray-700'} flex items-center justify-center overflow-hidden`}>
                {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white/20 font-bold text-[8px] rotate-[15deg] tracking-wider pointer-events-none">
                        {card.type.toUpperCase()}
                    </span>
                )}

                {/* 所属・ロールアイコン (左上に小さく表示) */}
                {isMonster && (
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

                {/* レベル表示 */}
                {level && level > 1 && (
                    <div className="absolute top-1 left-1 flex gap-0.5">
                        {Array.from({ length: level }).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600 shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
                        ))}
                    </div>
                )}

                {/* 挑発（Taunt）インジケーター */}
                {card.isTaunt && state === 'summon' && (
                    <div className="absolute bottom-1 right-1 bg-yellow-500/90 text-yellow-950 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.8)] backdrop-blur-sm pointer-events-none">
                        挑発
                    </div>
                )}

                {/* 攻撃エフェクトなどの重ね合わせ用プレースホルダ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* テキストボックスの代わりにステータスだけ配置 (盤面用は攻撃・体力を強調してテキストは不要) */}
            <div className="h-6 bg-black p-1 relative flex items-center">
                {/* モンスターのステータス (攻撃力 / 体力) */}
                {isMonster && (
                    <div className="absolute -bottom-1 -left-1 flex gap-0.5 pointer-events-none z-10 pl-1 pb-1">
                        <div className="w-6 h-6 rounded-full bg-red-600 border border-red-900 flex items-center justify-center font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.6)] text-[10px] pointer-events-auto">
                            {card.attack}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-600 border border-green-900 flex items-center justify-center font-bold text-white shadow-[0_0_8px_rgba(22,163,74,0.6)] text-[10px] pointer-events-auto">
                            {card.hp}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
