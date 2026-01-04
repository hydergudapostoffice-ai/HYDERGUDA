import React, { useState, useMemo, useEffect } from 'react';
import { Lang } from '../../types';
import { PLI_TABLE } from '../../constants';

interface PliCalculatorProps {
  lang: Lang;
}

type Mode = 'monthly' | 'half' | 'yearly';

export default function PliCalculator({ lang }: PliCalculatorProps) {
  const [age, setAge] = useState<number>(25);
  const [sumAssured, setSumAssured] = useState<number>(1000000);
  const [matAge, setMatAge] = useState<number>(60);
  const [mode, setMode] = useState<Mode>('monthly');
  const [docsOpen, setDocsOpen] = useState(false);

  // Available Maturity Ages based on current Age
  const availableMatAges = useMemo(() => {
    const tableEntry = PLI_TABLE[age];
    if (!tableEntry) return [];
    return Object.keys(tableEntry).map(Number).sort((a, b) => a - b);
  }, [age]);

  // Ensure matAge is valid when age changes
  useEffect(() => {
    if (!availableMatAges.includes(matAge) && availableMatAges.length > 0) {
        // Pick the last available one (max age) usually preferred
        setMatAge(availableMatAges[availableMatAges.length - 1]);
    }
  }, [age, availableMatAges, matAge]);

  const validateSum = () => {
    let val = sumAssured;
    if (val < 20000) val = 20000;
    else if (val > 5000000) val = 5000000;
    else if (val % 10000 !== 0) val = Math.floor(val / 10000) * 10000;
    setSumAssured(val);
  };

  const calculatePremium = () => {
    const base = PLI_TABLE[age]?.[matAge];
    if (!base) return 0;

    const gross = (base / 1000000) * sumAssured;
    const rebate = Math.floor(sumAssured / 20000); // 1 Rupee rebate per 20k Sum Assured

    if (mode === 'monthly') return Math.round(gross - rebate);
    if (mode === 'half') return Math.round((gross * 6 * 0.985) - (rebate * 6));
    if (mode === 'yearly') return Math.round((gross * 12 * 0.97) - (rebate * 12));
    return 0;
  };

  const premium = calculatePremium();

  // Loss Calculation
  const calculateAnnualLoss = () => {
    const term = matAge - age;
    const base = PLI_TABLE[age]?.[matAge];
    if (!base) return 0;
    const gross = (base / 1000000) * sumAssured;
    const rebate = Math.floor(sumAssured / 20000);

    const yearlyPremiumCost = Math.round((gross * 12 * 0.97) - (rebate * 12));

    if (mode === 'yearly') {
        // Savings compared to monthly
        const monthlyAnnualCost = Math.round(gross - rebate) * 12;
        return monthlyAnnualCost - premium;
    } else {
        // Loss compared to yearly
        const currentAnnualCost = mode === 'monthly' ? premium * 12 : premium * 2;
        return currentAnnualCost - yearlyPremiumCost;
    }
  };

  const annualLoss = calculateAnnualLoss();

  // Bonus
  const totalBonus = (sumAssured / 1000) * 52 * (matAge - age);
  const maturity = sumAssured + totalBonus;
  const multiplier = mode === 'monthly' ? 12 : (mode === 'half' ? 2 : 1);
  const totalPaid = premium * multiplier * (matAge - age);
  const bonusPercent = (totalBonus / maturity) * 100;

  // Formatters
  const format = (v: number) => '₹' + Math.round(v).toLocaleString('en-IN');
  const formatCompact = (v: number) => {
    if (v >= 10000000) return (v / 10000000).toFixed(2) + 'Cr';
    if (v >= 100000) return (v / 100000).toFixed(2) + 'L';
    return (v / 1000).toFixed(1) + 'k';
  };

  const getWhatsappLink = () => {
    const text = `PLI Quote: Age ${age}, Sum ${sumAssured}, Mode ${mode}, Prem ${premium}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Dial Logic
  const dialRadius = 80;
  const dialCircumference = 2 * Math.PI * (dialRadius * 0.5); // Using roughly half circle for calc
  // SVG Path length is approx 251 for a 180 degree arc if calc properly?
  // Let's rely on the HTML provided SVG path logic:
  // d="M 20 100 A 80 80 0 0 1 180 100" -> This is a semi-circle.
  // Length is Pi * R = 3.14159 * 80 ~= 251.3
  const strokeDasharray = 251;
  const strokeDashoffset = 251 - (251 * ((age - 19) / (55 - 19)));

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-6 pb-2 border-b border-white/10 bg-slate-900/95 sticky top-0 z-40">
        <h2 className="text-yellow-500 font-bold text-lg uppercase tracking-widest">PLI Santosh</h2>
        <p className="text-[10px] text-slate-400">Govt. of India Guarantee</p>
      </div>

      <div className="p-5 space-y-6">
        {/* Age Dial */}
        <div className="text-center">
          <div className="relative w-[180px] h-[90px] mx-auto overflow-hidden">
            <svg className="w-full h-[180px] rotate-0" viewBox="0 0 200 200">
              <path fill="none" stroke="#334155" strokeWidth="20" strokeLinecap="round" d="M 20 100 A 80 80 0 0 1 180 100" />
              <path 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="20" 
                strokeLinecap="round" 
                d="M 20 100 A 80 80 0 0 1 180 100"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <div className="text-4xl font-black text-white">{age}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Years Old</div>
            </div>
          </div>
          <input 
            type="range" 
            min="19" 
            max="55" 
            value={age} 
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 mt-[-10px] relative z-10"
          />
        </div>

        {/* Inputs */}
        <div className="glass-card rounded-xl p-4 border-l-4 border-yellow-500">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Sum Assured (₹)</label>
          <input 
            type="number" 
            value={sumAssured} 
            onChange={(e) => setSumAssured(Number(e.target.value))}
            onBlur={validateSum}
            step="10000" 
            min="20000" 
            max="5000000" 
            className="bg-transparent text-2xl font-black text-white w-full focus:outline-none"
          />
          <div className="h-px bg-white/10 my-2"></div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">MATURITY AGE:</span>
            <select 
              value={matAge} 
              onChange={(e) => setMatAge(Number(e.target.value))}
              className="bg-slate-800 text-white rounded border border-white/20 px-1 py-0.5"
            >
              {availableMatAges.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
          {(['monthly', 'half', 'yearly'] as Mode[]).map(m => (
            <button 
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-[10px] font-bold rounded transition capitalize ${mode === m ? (m === 'yearly' ? 'bg-yellow-600 text-black' : 'bg-slate-600 text-white') : 'text-slate-400'}`}
            >
                {m === 'half' ? 'Half-Yearly' : m}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {mode === 'monthly' && (
            <div className="rounded-xl p-3 border border-red-500/30 bg-red-500/10 shake-alert flex gap-3 items-center">
                <i className="fa-solid fa-triangle-exclamation text-red-500 text-lg"></i>
                <div>
                    <p className="text-[10px] text-red-300 font-bold uppercase">Money Loss Alert</p>
                    <p className="text-xs text-white">Switch to Yearly to save <b className="text-red-400">{format(annualLoss)}</b> per year.</p>
                </div>
            </div>
        )}
        {mode === 'yearly' && (
            <div className="rounded-xl p-3 border border-yellow-500/30 bg-yellow-500/10 success-pulse flex gap-3 items-center">
                <i className="fa-solid fa-gift text-yellow-400 text-lg"></i>
                <div>
                    <p className="text-[10px] text-yellow-300 font-bold uppercase">Maximum Savings</p>
                    <p className="text-xs text-white">You save <b className="text-yellow-400">{format(annualLoss)}</b> every year!</p>
                </div>
            </div>
        )}

        {/* Charts and Stats */}
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-end h-[160px]">
                <div className="h-[160px] w-[50px] bg-slate-800 rounded-lg relative overflow-hidden flex flex-col-reverse shadow-2xl">
                    <div className="w-full bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ height: `${bonusPercent}%` }}></div>
                    <div className="w-full bg-slate-600 transition-all duration-1000" style={{ height: `${100 - bonusPercent}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 font-mono uppercase">Split</p>
            </div>
            <div className="flex flex-col justify-center gap-2 text-right">
                <div>
                    <p className="text-[9px] text-yellow-400 uppercase font-bold">Govt Bonus</p>
                    <p className="text-lg font-black text-white">{formatCompact(totalBonus)}</p>
                </div>
                <div className="opacity-60">
                    <p className="text-[9px] text-slate-300 uppercase font-bold">You Pay</p>
                    <p className="text-sm font-bold text-white">{formatCompact(totalPaid)}</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded border border-green-500/20 mt-2">
                    <p className="text-[9px] text-green-400 uppercase font-bold">Total Maturity</p>
                    <p className="text-lg font-black text-green-400">{formatCompact(maturity)}</p>
                </div>
            </div>
        </div>

        {/* Documents */}
        <div className="border-t border-white/10 pt-4">
            <button onClick={() => setDocsOpen(!docsOpen)} className="w-full flex justify-between text-xs font-bold text-slate-400 uppercase items-center">
                <span>Documents</span> 
                <i className={`fa-solid fa-chevron-down transition-transform ${docsOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${docsOpen ? 'max-h-[500px] pt-2' : 'max-h-0'}`}>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>{lang === 'en' ? '• Aadhaar & PAN' : '• ఆధార్ & పాన్'}</li>
                    <li>{lang === 'en' ? '• Degree/Diploma' : '• డిగ్రీ సర్టిఫికేట్'}</li>
                </ul>
            </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-white/10 flex justify-between items-center z-50 rounded-b-2xl">
        <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold capitalize">{mode} Premium</p>
            <div className="text-xl font-black text-white">{format(premium)}</div>
            {mode === 'monthly' && (
                <p className="text-[10px] text-yellow-500 font-bold mt-0.5">
                    <i className="fa-solid fa-mug-hot mr-1"></i>
                    <span>₹{Math.round(premium/30)}/day</span>
                </p>
            )}
        </div>
        <a 
            href={getWhatsappLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition"
        >
            <span>Proposal</span>
            <i className="fa-brands fa-whatsapp"></i>
        </a>
      </div>
    </div>
  );
}