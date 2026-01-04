import React from 'react';
import { Lang } from '../types';

interface HeaderProps {
  lang: Lang;
  onToggleLang: () => void;
}

export default function Header({ lang, onToggleLang }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-4 md:px-8 border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-red-600 rounded-lg p-2 text-white shadow-lg shadow-red-900/50">
          <i className="fa-solid fa-building-columns text-xl"></i>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide uppercase">HYDERGUDA S.O.</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">India Post</p>
        </div>
      </div>
      <button 
        onClick={onToggleLang} 
        className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 flex items-center gap-2 hover:bg-white/20 transition"
      >
        <i className="fa-solid fa-language"></i> 
        <span>{lang === 'en' ? 'ENG' : 'తెలుగు'}</span>
      </button>
    </header>
  );
}