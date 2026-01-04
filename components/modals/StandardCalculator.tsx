import React, { useState, useEffect } from 'react';
import { Lang, SchemeId } from '../../types';
import { SCHEMES } from '../../constants';

interface StandardCalculatorProps {
  schemeId: SchemeId;
  lang: Lang;
}

export default function StandardCalculator({ schemeId, lang }: StandardCalculatorProps) {
  const scheme = SCHEMES.find(s => s.id === schemeId);
  const [inputAmount, setInputAmount] = useState<number>(5000);
  const [docsOpen, setDocsOpen] = useState(false);

  useEffect(() => {
    if (scheme) {
        setInputAmount(scheme.min);
        setDocsOpen(false);
    }
  }, [scheme]);

  if (!scheme) return null;

  const calculateResult = () => {
    const val = inputAmount;
    if (scheme.id === 'ssy') return val * 554.613; // Approx multiplier for 21 years logic from source
    if (scheme.id === 'ppf') return val * 315.572;
    if (scheme.id === 'rd') return val * 71.366;
    if (scheme.id === 'td') return val * 1.3857;
    if (scheme.id === 'mis') return val * 0.00617; // Monthly Income
    return val;
  };

  const result = calculateResult();

  const calculateInterestPercent = () => {
    let invested = scheme.inputType === 'monthly' ? inputAmount * 180 : inputAmount; // Default 15 years approx?
    // Specific logic override matching source:
    if (scheme.id === 'rd') invested = inputAmount * 60; // 5 years
    // Logic for lump sum schemes like TD/MIS, invested is just inputAmount, but for percent calc in chart:
    if (scheme.id === 'mis') return 25; // Fixed visual
    
    // For TD/PPF/SSY
    const profit = result - invested;

    // Prevent divide by zero or negative
    if (result <= 0) return 0;
    return Math.max(0, Math.min(100, (profit / result) * 100));
  };

  const interestPercent = calculateInterestPercent();

  // Formatters
  const format = (v: number) => '₹' + Math.round(v).toLocaleString('en-IN');
  const formatCompact = (v: number) => {
    if (v >= 10000000) return (v / 10000000).toFixed(2) + 'Cr';
    if (v >= 100000) return (v / 100000).toFixed(2) + 'L';
    return (v / 1000).toFixed(1) + 'k';
  };

  const getSummaryHtml = () => {
    const val = format(inputAmount);
    const res = format(result);
    if (scheme.id === 'mis') return `Deposit <b class="text-white">${val}</b> & get <b class="text-white">${res}/mo</b>.`;
    return `Invest <b class="text-white">${val}</b> & get <b class="text-white">${res}</b>.`;
  };

  const getWhatsappLink = () => {
    return `https://wa.me/?text=I%20want%20to%20open%20${scheme.name}%20for%20${inputAmount}`;
  };

  const docs = lang === 'en' ? scheme.docs : scheme.docsTe;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <i className={`${scheme.icon} text-white`}></i>
        </div>
        <div>
            <h2 className="font-bold text-lg">{lang === 'en' ? scheme.name : scheme.nameTe}</h2>
            <p className="text-xs text-green-400 font-bold">{scheme.rate}% Interest</p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <label className="text-[10px] text-slate-400 font-bold uppercase mb-2 block">
            {scheme.inputType === 'monthly' ? 'Monthly Deposit' : 'Investment Amount'}
        </label>
        <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-500">₹</span>
            <input 
                type="number" 
                value={inputAmount} 
                onChange={(e) => setInputAmount(Number(e.target.value))}
                className="bg-transparent text-2xl font-bold text-white w-full focus:outline-none"
            />
        </div>
        <input 
            type="range" 
            min={scheme.min} 
            max={scheme.max} 
            step={scheme.step} 
            value={inputAmount} 
            onChange={(e) => setInputAmount(Number(e.target.value))}
            className="w-full accent-green-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Visual Result */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-3">
            <div 
                className="w-full h-full shadow-lg rounded-full transition-all duration-500 ease-out"
                style={{
                    background: `conic-gradient(#4ade80 ${interestPercent}%, #374151 0)`
                }}
            ></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-400 uppercase">Maturity</span>
                <span className="text-sm font-bold text-white">{formatCompact(result)}</span>
            </div>
        </div>
        <p className="text-sm text-slate-300 px-4" dangerouslySetInnerHTML={{ __html: getSummaryHtml() }}></p>
      </div>

      {/* Documents */}
      <div>
        <button 
            onClick={() => setDocsOpen(!docsOpen)} 
            className="w-full flex justify-between bg-slate-800 p-3 rounded-lg text-xs font-bold uppercase text-slate-300 hover:bg-slate-700 transition"
        >
            <span>Documents</span> 
            <i className={`fa-solid fa-chevron-down transition-transform ${docsOpen ? 'rotate-180' : ''}`}></i>
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${docsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
            <ul className="p-3 space-y-2 text-xs text-slate-400">
                {docs.map((doc, idx) => (
                    <li key={idx} className="flex gap-2">
                        <i className="fa-solid fa-check text-green-500"></i> 
                        <span>{doc}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* CTA */}
      <a 
        href={getWhatsappLink()} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full bg-green-600 hover:bg-green-500 transition text-white font-bold py-3 rounded-xl text-center flex justify-center gap-2 shadow-lg"
      >
        <i className="fa-brands fa-whatsapp text-lg"></i> 
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
}