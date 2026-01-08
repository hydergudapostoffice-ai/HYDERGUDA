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

  const availableMatAges = useMemo(() => {
    const tableEntry = PLI_TABLE[age];
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
    if (val < 20000) val = 20000;
    else if (val > 5000000) val = 5000000;
    else if (val % 10000 !== 0) val = Math.round(val / 10000) * 10000;
    setSumAssured(val);
  };

  const calculatePremium = () => {
    const base = PLI_TABLE[age]?.[matAge];
    if (!base) return 0;

    const gross = (base / 1000000) * sumAssured;
    const rebate = Math.floor(sumAssured / 20000);

    if (mode === 'monthly') return Math.round(gross - rebate);
    if (mode === 'half') return Math.round((gross * 6 * 0.985) - (rebate * 6));
    if (mode === 'yearly') return Math.round((gross * 12 * 0.97) - (rebate * 12));
    return 0;
  };

  const premium = calculatePremium();

  const calculateCostOfDelay = () => {
    const nextAge = age + 1;
    if (!PLI_TABLE[nextAge] || !PLI_TABLE[nextAge][matAge]) return 0;

    const calculateTotalPaid = (currentAge: number) => {
        const base = PLI_TABLE[currentAge]?.[matAge];
        if (!base) return 0;
        const gross = (base / 1000000) * sumAssured;
        const rebate = Math.floor(sumAssured / 20000);
        const yearlyPremium = Math.round((gross * 12 * 0.97) - (rebate * 12));
        return yearlyPremium * (matAge - currentAge);
    }
    const currentTotal = calculateTotalPaid(age);
    const nextYearTotal = calculateTotalPaid(nextAge);

    if(nextYearTotal === 0 || currentTotal === 0) return 0;
    
    return nextYearTotal - currentTotal;
  };
  
  const costOfDelay = calculateCostOfDelay();

  const totalBonus = (sumAssured / 1000) * 52 * (matAge - age);
  const maturity = sumAssured + totalBonus;
  const multiplier = mode === 'monthly' ? 12 : (mode === 'half' ? 2 : 1);
  const totalPaid = premium * multiplier * (matAge - age);

  const format = (v: number) => '₹ ' + Math.round(v).toLocaleString('en-IN');
  
  const getWhatsappLink = () => {
    const message = `Hello, I'm interested in a Postal Life Insurance (PLI) policy. Here is my generated quote for discussion:\n\n- Scheme: PLI Santosh\n- Age: ${age}\n- Sum Assured: ${format(sumAssured)}\n- Maturity Age: ${matAge}\n- Payment Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n- Estimated Premium: ${format(premium)} / ${mode}\n- Maturity Value: ${format(maturity)}\n\nPlease provide me with further details on how to proceed.`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const strokeDasharray = 251;
  const strokeDashoffset = 251 - (251 * ((age - 19) / (55 - 19)));

  return (
    <div className="pb-24">
      <div className="p-6 pb-4 border-b border-white/10 bg-slate-900/95 sticky top-0 z-40">
        <h2 className="text-yellow-400 font-bold text-lg">PLI Santosh (Endowment Assurance)</h2>
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
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 relative z-10"
          />
           <p className="text-xs text-slate-400 mt-2">Your Age: <b className="text-white">{age}</b></p>
        </div>

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
            <div className="mt-6 p-5 rounded-2xl border-2 border-yellow-500 bg-yellow-500/10 text-center">
  <p className="text-xs uppercase font-bold text-yellow-300 mb-1">
    You will receive at maturity
  </p>
  <p className="text-4xl md:text-5xl font-black text-yellow-400">
    {format(maturity)}
  </p>
  <p className="text-xs text-slate-300 mt-2">
    Includes <b className="text-yellow-400">{format(totalBonus)}</b> Government Bonus
  </p>
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
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition"
        >
            <span>Get This Plan on WhatsApp</span>
            <i className="fa-solid fa-arrow-right"></i>
        </a>
        <p className="text-[10px] text-slate-500">Direct service from Hyderguda S.O. (500048)</p>
      </div>
    </div>
  );
}
