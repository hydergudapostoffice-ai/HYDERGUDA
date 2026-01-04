import React, { useEffect, useState } from 'react';

const messages = [
  "Did you know? SSY is Tax Free.",
  "PLI Bonus is highest in India.",
  "Track Speed Post here instantly."
];

export default function Ticker() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % messages.length);
        setFade(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
        <i className="fa-solid fa-lightbulb text-yellow-400 text-xs animate-pulse"></i>
        <span 
          className={`text-xs font-medium text-slate-300 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
          {messages[index]}
        </span>
      </div>
    </div>
  );
}