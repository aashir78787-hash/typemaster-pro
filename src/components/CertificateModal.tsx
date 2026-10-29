/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Award, Printer, X, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface CertificateModalProps {
  userName: string;
  wpm: number;
  accuracy: number;
  date: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  userName,
  wpm,
  accuracy,
  date,
  onClose,
}) => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getRank = (speed: number) => {
    if (speed >= 100) return 'Grandmaster Typist (Top 1%)';
    if (speed >= 80) return 'Elite Professional Typist';
    if (speed >= 60) return 'Advanced Touch Typist';
    if (speed >= 40) return 'Competent Touch Typist';
    return 'Certified Touch Typist';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
      <div
        className={`w-full max-w-2xl border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Modal Controls Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold">
            <Award className="w-5 h-5" />
            <span>TypeMaster Pro Verified Milestone Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          ref={printRef}
          className={`p-8 md:p-12 flex flex-col items-center justify-center relative border-8 border-double m-4 rounded-xl transition-colors ${
            isLight
              ? 'bg-[#fcfaf6] text-slate-900 border-amber-600/50 shadow-inner'
              : 'bg-slate-950 text-slate-100 border-amber-600/40'
          }`}
        >
          {/* Corner Flourishes */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

          {/* Organization Title */}
          <div className="text-xs uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400/80 mb-2 font-bold">
            Official Certification of Touch Typing Competence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-amber-800 dark:text-amber-300 text-center uppercase tracking-tight font-serif">
            Certificate of Typing Achievement
          </h1>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-4" />

          <p className={`text-xs md:text-sm text-center max-w-md ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            This certifies that the typist named below has demonstrated verified touch-typing velocity and accuracy on the TypeMaster Pro standardized platform:
          </p>

          {/* Recipient Name */}
          <div className="my-6 text-2xl md:text-4xl font-serif font-bold text-amber-950 dark:text-white tracking-wide border-b-2 border-amber-600/40 pb-2 px-8 text-center">
            {userName}
          </div>

          <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-6 uppercase tracking-wider">
            {getRank(wpm)}
          </div>

          {/* Metrics Plaque */}
          <div
            className={`grid grid-cols-2 gap-6 w-full max-w-sm mb-6 p-4 rounded-xl border text-center font-mono ${
              isLight
                ? 'bg-white border-amber-300 shadow-xs'
                : 'bg-slate-900/80 border-amber-500/30'
            }`}
          >
            <div>
              <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Typing Velocity
              </div>
              <div className="text-3xl font-black text-cyan-700 dark:text-cyan-400 mt-0.5">{wpm} WPM</div>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Net Words / Min</div>
            </div>
            <div>
              <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Accuracy Rating
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{accuracy}%</div>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Zero-error Precision</div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className={`flex items-center justify-between w-full max-w-md pt-4 border-t text-xs ${isLight ? 'border-amber-200' : 'border-slate-800'}`}>
            <div className="text-center">
              <div className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{date}</div>
              <div className={`text-[10px] uppercase mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Date Issued</div>
            </div>

            {/* Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-yellow-200">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono mt-1 font-bold">VERIFIED SEAL</span>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-amber-800 dark:text-amber-200 text-sm">TypeMaster Pro</div>
              <div className={`text-[10px] uppercase mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Board of Evaluation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
