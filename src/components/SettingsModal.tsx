/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore, AppSettings } from '../store/useAppStore';
import { X, Volume2, Sliders, Type, Keyboard, Sun, Moon, Palette } from 'lucide-react';
import { soundManager } from '../utils/soundEngine';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const store = useAppStore();
  const settings = store.settings;
  const isLight = settings.theme === 'light';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`w-full max-w-xl border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/40 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-base">
            <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Preferences & Customization</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          {/* Theme Selection */}
          <div className="flex flex-col gap-3">
            <span
              className={`font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> App Theme
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => store.updateSettings({ theme: 'light' })}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  settings.theme === 'light'
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold ring-2 ring-cyan-200'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold">Light Theme (Active)</div>
                  <div className="text-[10px] opacity-80">Clean, friendly, bright workspace</div>
                </div>
              </button>

              <button
                onClick={() => store.updateSettings({ theme: 'dark' })}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  settings.theme === 'dark'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold ring-2 ring-cyan-500/30'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-bold">Dark Slate Theme</div>
                  <div className="text-[10px] opacity-80">Deep contrast night mode</div>
                </div>
              </button>
            </div>
          </div>

          <div className={`h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* Sound & Audio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className={`font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Audio Synthesizer
              </span>
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                {settings.soundTheme === 'off' ? 'Muted' : 'Active'}
              </span>
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
                      ? isLight
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold shadow-2xs'
                        : 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {settings.soundTheme !== 'off' && (
              <div className="flex items-center gap-3 pt-2">
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Volume</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-600 cursor-pointer"
                />
                <span className={`font-mono text-[11px] w-8 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          <div className={`h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* Typography & Font Sizing */}
          <div className="flex flex-col gap-3">
            <span
              className={`font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              <Type className="w-4 h-4 text-indigo-500" /> Typography & Font
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Typing Font Family
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sans', label: 'Lexend (Friendly)' },
                    { id: 'mono', label: 'JetBrains Mono' },
                    { id: 'serif', label: 'Serif Classic' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => store.updateSettings({ fontFamily: f.id as AppSettings['fontFamily'] })}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        settings.fontFamily === f.id
                          ? isLight
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                            : 'bg-slate-800 border-indigo-400 text-indigo-300 font-bold'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Text Font Size
                </label>
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
                          ? isLight
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                            : 'bg-slate-800 border-cyan-400 text-cyan-300'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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

          <div className={`h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* Typing Engine Rules */}
          <div className="flex flex-col gap-3">
            <span
              className={`font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              <Keyboard className="w-4 h-4 text-emerald-500" /> Guides & Assistance
            </span>

            <div className="flex flex-col gap-2.5">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Stop on Error Mode
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Requires correcting mistake before advancing.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.stopOnError}
                  onChange={e => store.updateSettings({ stopOnError: e.target.checked })}
                  className="w-4 h-4 accent-cyan-600 cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Virtual Keyboard Display
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Show the on-screen keyboard with next key highlight.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showKeyboard}
                  onChange={e => store.updateSettings({ showKeyboard: e.target.checked })}
                  className="w-4 h-4 accent-cyan-600 cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Finger Placement Visual Guide
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Show target finger & hand indicators below the text.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHands}
                  onChange={e => store.updateSettings({ showHands: e.target.checked })}
                  className="w-4 h-4 accent-cyan-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
