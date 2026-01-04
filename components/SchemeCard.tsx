import React from 'react';
import { Scheme, Lang } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
  lang: Lang;
  onClick: () => void;
}

export default function SchemeCard({ scheme, lang, onClick }: SchemeCardProps) {
  return (
    <div 
      onClick={onClick} 
      className="glass-card p-6 rounded-xl hover:bg-white/5 transition cursor-pointer relative border-t border-white/10"
    >
      <div 
        className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${scheme.tagColor}`}
      >
        <span>{scheme.tag}</span>
      </div>
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <i className={`${scheme.icon} text-xl text-slate-200`}></i>
      </div>
      <h3 className="font-bold text-lg mb-1">
        {lang === 'en' ? scheme.name : scheme.nameTe}
      </h3>
      <p className="text-sm text-slate-400">
        {lang === 'en' ? scheme.desc : scheme.descTe}
      </p>
    </div>
  );
}