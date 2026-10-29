/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, Sparkles, X } from 'lucide-react';

export const BadgeUnlockedModal: React.FC = () => {
  const store = useAppStore();
  const badge = store.newlyUnlockedBadge;

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] text-center flex flex-col items-center gap-4 relative">
        <button
          onClick={() => store.dismissBadgeModal()}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/40 border-2 border-yellow-200 animate-bounce">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Achievement Unlocked
          </div>
          <h3 className="text-xl font-black text-white mt-1">{badge.name}</h3>
          <p className="text-xs text-slate-300 mt-1">{badge.description}</p>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
          +{badge.xp} XP Bounty Claimed
        </div>

        <button
          onClick={() => store.dismissBadgeModal()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-[1.02]"
        >
          Collect & Continue
        </button>
      </div>
    </div>
  );
};
