/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore, AppSettings } from '../store/useAppStore';
import { X, Volume2, VolumeX, Sliders, Type, Keyboard, Palette, Check } from 'lucide-react';
import { soundManager } from '../utils/soundEngine';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const store = useAppStore();
  const settings = store.settings;

  const handleSoundThemeChange = (theme: AppSettings['soundTheme']) => {
    store.updateSettings({ soundTheme: theme });
    if (theme !== 'off') {
      soundManager.playKeyClick();
    }
  };

  const handleVolumeChange = (vol: number) => {
    store.updateSettings({ soundVolume: vol });
    soundManager.playKeyClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Preferences & Customization</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          {/* Sound & Audio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" /> Audio Synthesizer
              </span>
              <span className="text-slate-400">{settings.soundTheme === 'off' ? 'Muted' : 'Active'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'mechanical', label: 'Mechanical' },
                { id: 'typewriter', label: 'Typewriter' },
                { id: 'soft', label: 'Membrane' },
                { id: 'cyber', label: 'Cyber Blip' },
                { id: 'off', label: 'Mute' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSoundThemeChange(s.id as AppSettings['soundTheme'])}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.soundTheme === s.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {settings.soundTheme !== 'off' && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-slate-400 text-[11px]">Volume</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
                <span className="text-slate-400 font-mono text-[11px] w-8">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-800" />

          {/* Typography & Font Sizing */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-400" /> Typography & Caret
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1.5">Typing Font</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mono', label: 'JetBrains Mono' },
                    { id: 'sans', label: 'Plus Jakarta' },
                    { id: 'dyslexic', label: 'OpenDyslexic' },
                    { id: 'serif', label: 'Serif Classic' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => store.updateSettings({ fontFamily: f.id as AppSettings['fontFamily'] })}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        settings.fontFamily === f.id
                          ? 'bg-slate-800 border-indigo-400 text-indigo-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5">Font Size</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'sm', label: 'S' },
                    { id: 'md', label: 'M' },
                    { id: 'lg', label: 'L' },
                    { id: 'xl', label: 'XL' },
                  ].map(sz => (
                    <button
                      key={sz.id}
                      onClick={() => store.updateSettings({ fontSize: sz.id as AppSettings['fontSize'] })}
                      className={`p-2 rounded-lg border text-center font-bold ${
                        settings.fontSize === sz.id
                          ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Typing Engine Rules */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-emerald-400" /> Engine Rules & Guides
            </span>

            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Stop on Error Mode</div>
                  <div className="text-[11px] text-slate-400">
                    Cannot advance until you backspace and fix the wrong keystroke.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.stopOnError}
                  onChange={e => store.updateSettings({ stopOnError: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Virtual Keyboard Display</div>
                  <div className="text-[11px] text-slate-400">
                    Show the on-screen keyboard with next key highlight.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showKeyboard}
                  onChange={e => store.updateSettings({ showKeyboard: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Finger Placement Visual Guide</div>
                  <div className="text-[11px] text-slate-400">
                    Show target finger & hand indicators below the text.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHands}
                  onChange={e => store.updateSettings({ showHands: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
