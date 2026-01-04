import React from 'react';

export default function TrackingSection() {
  return (
    <div className="px-4 mb-8 max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-box absolute left-3 top-3.5 text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Consignment No." 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <a 
            href="https://www.indiapost.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-3 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2"
          >
            <span>Track</span> 
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  );
}