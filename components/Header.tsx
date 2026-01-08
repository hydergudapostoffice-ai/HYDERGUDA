import React from 'react';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 py-4 md:px-8 border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-white">
          <i className="fa-solid fa-building-columns text-xl text-red-500"></i>
        </div>
        <div>
          <h1 className="font-bold text-sm md:text-base text-white">Hyderguda S.O. | India Post</h1>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-amber-400">100% Sovereign Guarantee</p>
        <p className="text-[10px] text-slate-500">u/s 118 of Insurance Act</p>
      </div>
    </header>
  );
}