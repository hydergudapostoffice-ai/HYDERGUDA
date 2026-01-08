import React, { useState, useMemo, useEffect } from 'react';
import { Lang } from '../../types';
import { RPLI_MONTHLY_TABLE, RPLI_HALF_YEARLY_TABLE, RPLI_YEARLY_TABLE } from '../../constants';

interface RpliCalculatorProps {
  lang: Lang;
}

type Mode = 'monthly' | 'half' | 'yearly';

export default function RpliCalculator({ lang }: RpliCalculatorProps) {
  const [age, setAge] = useState<number>(25);
  const [sumAssured, setSumAssured] = useState<number>(500000);
  const [matAge, setMatAge] = useState<number>(60);
  const [mode, setMode] = useState<Mode>('monthly');
  const [docsOpen, setDocsOpen] = useState(false);

  const availableMatAges = useMemo(() => {
    const tableEntry = RPLI_MONTHLY_TABLE[age];
    if (!tableEntry) return [];
    return Object.keys(tableEntry).map(Number).sort((a, b) => a - b);
  }, [age]);

  useEffect(() => {
    if (!availableMatAges.includes(matAge) && availableMatAges.length > 0) {
        setMatAge(availableMatAges[availableMatAges.length - 1]);
    }
  }, [age, availableMatAges, matAge]);

  const validateSum = () => {
    let val = sumAssured;
    if (val < 10000) val = 10000;
    else if (val > 1000000) val = 1000000;
    else if (val % 5000 !== 0) val = Math.round(val / 5000) * 5000;
    setSumAssured(val);
  };
  
  const getPremiumDetails = (calcMode: Mode, currentAge: number) => {
    const table = calcMode === 'monthly' ? RPLI_MONTHLY_TABLE :
                  calcMode === 'half' ? RPLI_HALF_YEARLY_TABLE :
                  RPLI_YEARLY_TABLE;
    
    const baseGross = table[currentAge]?.[matAge];
    if (!baseGross) return { net: 0 };

    const gross = baseGross * (sumAssured / 1000000);
    
    let rebate = 0;
    if (calcMode === 'monthly') rebate = (sumAssured / 10000) * 0.5;
    else if (calcMode === 'half') rebate = (sumAssured / 10000) * 0.5 * 6;
    else if (calcMode === 'yearly') rebate = (sumAssured / 10000) * 0.5 * 12;

    return { net: Math.round(gross - rebate) };
  }

  const premium = getPremiumDetails(mode, age).net;

  const calculateCostOfDelay = () => {
    const nextAge = age + 1;
    if (!RPLI_YEARLY_TABLE[nextAge] || !RPLI_YEARLY_TABLE[nextAge][matAge]) return 0;
    
    const calculateTotalPaid = (currentAge: number) => {
        const yearlyPremium = getPremiumDetails('yearly', currentAge).net;
        return yearlyPremium * (matAge - currentAge);
    }
    const currentTotal = calculateTotalPaid(age);
    const nextYearTotal = calculateTotalPaid(nextAge);

    if (currentTotal <= 0 || nextYearTotal <= 0) return 0;
    
    return Math.round(nextYearTotal - currentTotal);
  };

  const costOfDelay = calculateCostOfDelay();
  
  const totalBonus = (sumAssured / 1000) * 48 * (matAge - age);
  const maturity = sumAssured + totalBonus;
  const multiplier = mode === 'monthly' ? 12 : (mode === 'half' ? 2 : 1);
  const totalPaid = premium * multiplier * (matAge - age);
  
  const format = (v: number) => '₹ ' + Math.round(v).toLocaleString('en-IN');

  const getWhatsappLink = () => {
    const message = `Hello, I'm interested in a Rural Postal Life Insurance (RPLI) policy. Here is my generated quote for discussion:\n\n- Scheme: RPLI Gram Santosh\n- Age: ${age}\n- Sum Assured: ${format(sumAssured)}\n- Maturity Age: ${matAge}\n- Payment Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n- Estimated Premium: ${format(premium)} / ${mode}\n- Maturity Value: ${format(maturity)}\n\nPlease provide me with further details on how to proceed.`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="pb-32">
      <div className="p-6 pb-4 border-b border-white/10 bg-slate-900/95 sticky top-0 z-40">
        <h2 className="text-blue-400 font-bold text-lg">RPLI Gram Santosh (Endowment Assurance)</h2>
        <p className="text-xs text-slate-400">Build a corpus. Get a lump sum cash payout at age {matAge}.</p>
      </div>

      <div className="p-5 space-y-6">
        <div className="text-center">
           <input 
            type="range" 
            min="19" 
            max="55" 
            value={age} 
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 relative z-10"
          />
           <p className="text-xs text-slate-400 mt-2">Your Age: <b className="text-white">{age}</b></p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-blue-500">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Sum Assured (₹)</label>
          <input 
            type="number" 
            value={sumAssured} 
            onChange={(e) => setSumAssured(Number(e.target.value))}
            onBlur={validateSum}
            step="5000" 
            min="10000" 
            max="1000000" 
            className="bg-transparent text-2xl font-black text-white w-full focus:outline-none"
          />
           <div className="h-px bg-white/10 my-3"></div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">MATURITY AGE:</span>
            <select 
              value={matAge} 
              onChange={(e) => setMatAge(Number(e.target.value))}
              className="bg-slate-800 text-white rounded border border-white/20 px-1 py-0.5"
            >
              {availableMatAges.map(a => (<option key={a} value={a}>{a}</option>))}
            </select>
          </div>
        </div>
        
        {costOfDelay > 0 && (
          <div className="rounded-xl p-3 border border-amber-500/30 bg-amber-500/10 flex gap-3 items-center">
              <div className="text-amber-400 text-xl">⚠️</div>
              <div>
                  <p className="text-[10px] text-amber-300 font-bold uppercase">Age Impact Alert</p>
                  <p className="text-xs text-white">Lock in this low rate before your next birthday, or pay <b className="text-amber-400">{format(costOfDelay)}</b> more over the policy term.</p>
              </div>
          </div>
        )}

        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
          {(['monthly', 'half', 'yearly'] as Mode[]).map(m => (
            <button 
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-[10px] font-bold rounded transition capitalize ${mode === m ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
            >{m === 'half' ? 'Half-Yearly' : m}</button>
          ))}
        </div>

        <div>
            <div className="space-y-3">
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Your Total Investment</p>
                    <p className="text-lg font-bold text-white">{format(totalPaid)}</p>
                </div>
                <div className="h-4 w-full bg-slate-700 rounded-full"></div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="text-right">
                    <p className="text-[10px] text-blue-400 uppercase font-bold">Your Maturity Value</p>
                    <p className="text-2xl font-black text-blue-400">{format(maturity)}</p>
                </div>
                <div className="relative h-6 w-full bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 h-full"></div>
                </div>
                <p className="text-xs text-center text-slate-300 pt-2">Includes <b className="text-blue-400">{format(totalBonus)}</b> in Government Bonuses.</p>
            </div>
        </div>
        
        <div className="border-t border-white/10 pt-4">
            <button onClick={() => setDocsOpen(!docsOpen)} className="w-full flex justify-between text-xs font-bold text-slate-400 uppercase items-center">
                <span>Documents</span> 
                <i className={`fa-solid fa-chevron-down transition-transform ${docsOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${docsOpen ? 'max-h-[500px] pt-2' : 'max-h-0'}`}>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>{lang === 'en' ? '• Aadhaar Card' : '• ఆధార్ కార్డు'}</li>
                    <li>{lang === 'en' ? '• Village Address Proof' : '• గ్రామ చిరునామా రుజువు'}</li>
                </ul>
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-white/10 flex flex-col items-center gap-3 z-50 rounded-b-2xl">
        <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold capitalize">{mode} Premium</p>
            <div className="text-2xl font-black text-white">{format(premium)}</div>
        </div>
        <a 
            href={getWhatsappLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition"
        >
            <span>Get This Plan on WhatsApp</span>
            <i className="fa-solid fa-arrow-right"></i>
        </a>
        <p className="text-[10px] text-slate-500">Direct service from Hyderguda S.O. (500048)</p>
      </div>
    </div>
  );
}