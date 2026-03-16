import React from 'react';
import type { TunisianSkill } from '../types/game';

interface SkillDetailModalProps {
    skill: TunisianSkill;
    isPlayable: boolean;
    isUsed: boolean;
    onClose: () => void;
    onActivate: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, isPlayable, isUsed, onClose, onActivate }) => {
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm rounded-2xl border-4 overflow-hidden shadow-2xl transition-transform animate-in zoom-in-95 duration-200 border-yellow-500 bg-stone-900"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-black/90 p-4 flex items-center gap-3 border-b-2 border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-yellow-600 border-2 border-yellow-300 flex items-center justify-center font-bold text-white text-2xl shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.8)]">
                        {skill.cost}
                    </div>
                    <div className="text-2xl font-bold text-white flex-1 drop-shadow-md">
                        {skill.name}
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">
                    {/* Conditions */}
                    <div className="bg-black/40 rounded-lg p-3 border border-slate-700">
                        <div className="text-cyan-400 text-sm font-bold mb-2 flex items-center gap-2">
                            <span>◇ 発動条件 (タイプ・ロール)</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-white">
                            {skill.conditions.map((cond, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-slate-800 rounded-full py-1 pr-3 pl-1.5 border border-slate-600">
                                    {cond.type === 'affiliation' && (
                                        <div className="w-5 h-5 rounded-full overflow-hidden bg-purple-900/50 shrink-0 border border-purple-400/30">
                                            <img src={`/images/affiliations/${cond.value}.png`} alt={cond.value as string} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    {cond.type === 'role' && (
                                        <div className="w-5 h-5 rounded-full overflow-hidden bg-cyan-900/50 shrink-0 border border-cyan-400/30">
                                            <img src={`/images/roles/${cond.value}.png`} alt={cond.value as string} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold">{cond.value} × {cond.count}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-cyan-300 text-[10px] mt-2 opacity-80">
                            ※ 指定のタイプやロールを持つ味方モンスターを盤面に特殊召喚・召喚している必要があります
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-black/40 rounded-lg p-3 border border-slate-700">
                        <div className="text-yellow-400 text-sm font-bold mb-2 flex items-center gap-2">
                            <span>◇ スキル効果</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                            {skill.description}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-black/60 border-t-2 border-slate-800 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                    >
                        閉じる
                    </button>
                    <button
                        onClick={onActivate}
                        disabled={!isPlayable || isUsed}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${isPlayable && !isUsed
                                ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                    >
                        {isUsed ? '使用済み' : 'スキル発動'}
                    </button>
                </div>
            </div>
        </div>
    );
};
