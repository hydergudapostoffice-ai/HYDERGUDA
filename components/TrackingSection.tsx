import React, { useState } from 'react';

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTrack = () => {
    if (trackingNumber) {
      window.open('https://www.indiapost.gov.in/vas/Pages/trackconsignment.aspx', '_blank');
    }
  };

  const handleCopy = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 mb-8 max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-box absolute left-3 top-3.5 text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Consignment No." 
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
            {trackingNumber && (
              <button onClick={handleCopy} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <button
            onClick={handleTrack}
            className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-3 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2"
          >
            <span>Track</span> 
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}