import React from 'react';
import type { CardData } from '../types/game';

interface CardDetailModalProps {
    card: CardData;
    onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm aspect-[3/4] rounded-2xl border-4 overflow-hidden shadow-2xl transition-transform animate-in zoom-in-95 duration-200"
                style={{
                    borderColor: card.type === 'monster' ? '#6b7280' : '#6366f1',
                    backgroundColor: '#1e293b'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* ヘッダーエリア */}
                <div className="bg-black/90 p-3 flex items-center gap-3 border-b-2 border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-300 flex items-center justify-center font-bold text-white text-xl shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.8)]">
                        {card.cost}
                    </div>
                    <div className="text-xl font-bold text-white flex-1 drop-shadow-md">
                        {card.name}
                    </div>
                </div>

                {/* 画像エリア */}
                <div className={`relative w-full h-1/2 flex items-center justify-center border-b-2 border-slate-700 ${card.imageColor || 'bg-slate-700'}`}>
                    {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white/30 font-bold text-2xl tracking-widest">{card.type.toUpperCase()}</span>
                    )}

                    {/* 所属・ロールアイコン (左側に縦並び) */}
                    {card.type === 'monster' && (
                        <div className="absolute top-2 left-2 flex flex-col gap-2 pointer-events-none">
                            {card.affiliation && card.affiliation !== '無し' && (
                                <div className="flex items-center gap-1.5 bg-black/80 border border-purple-500/50 rounded-full pr-3 pl-1 py-1 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-900/50 shrink-0 border border-purple-400/30">
                                        <img src={`/images/affiliations/${card.affiliation}.png`} alt={card.affiliation} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-purple-200 text-xs font-bold leading-none">{card.affiliation}</span>
                                </div>
                            )}
                            {card.role && card.role !== '無し' && (
                                <div className="flex items-center gap-1.5 bg-black/80 border border-cyan-500/50 rounded-full pr-3 pl-1 py-1 shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-cyan-900/50 shrink-0 border border-cyan-400/30">
                                        <img src={`/images/roles/${card.role}.png`} alt={card.role} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-cyan-200 text-xs font-bold leading-none">{card.role}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* テキストエリア */}
                <div className="p-4 bg-slate-900 h-full overflow-y-auto pb-20">
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {card.text}
                        {card.abilityText && card.abilityText !== '無し' && (
                            <span className="block mt-2">
                                <span className="font-bold text-yellow-500">【能力】</span> {card.abilityText}
                            </span>
                        )}
                        {card.attackText && card.attackText !== '無し' && (
                            <span className="block mt-2">
                                <span className="font-bold text-red-500">【攻撃時】</span> {card.attackText}
                            </span>
                        )}
                    </p>
                </div>

                {/* ステータス */}
                {card.type === 'monster' && (
                    <div className="absolute bottom-4 w-full flex justify-between px-6 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-red-600 border-2 border-red-900 flex items-center justify-center font-bold text-white text-2xl shadow-[0_0_15px_rgba(220,38,38,0.8)] pointer-events-auto">
                            {card.attack}
                        </div>
                        <div className="w-14 h-14 rounded-full bg-green-600 border-2 border-green-900 flex items-center justify-center font-bold text-white text-2xl shadow-[0_0_15px_rgba(22,163,74,0.8)] pointer-events-auto">
                            {card.hp}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
