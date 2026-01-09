import React, { useState, useMemo, useEffect } from 'react';
import { PLI_TABLE } from '../../constants';

type Mode = 'monthly' | 'half' | 'yearly';

export default function PliCalculator() {
  const [age, setAge] = useState<number>(25);
  const [sumAssured, setSumAssured] = useState<number>(1000000);
  const [matAge, setMatAge] = useState<number>(60);
  const [mode, setMode] = useState<Mode>('monthly');

  /* ============================
     MATURITY AGE OPTIONS
     ============================ */
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

  /* ============================
     VALIDATE SUM ASSURED
     ============================ */
  const validateSum = () => {
    let val = sumAssured;
    if (val < 20000) val = 20000;
    else if (val > 5000000) val = 5000000;
    else if (val % 10000 !== 0) val = Math.round(val / 10000) * 10000;
    setSumAssured(val);
  };

  /* ============================
     PREMIUM CALCULATION
     ============================ */
  const calculatePremium = () => {
    const base = PLI_TABLE[age]?.[matAge];
    if (!base) return 0;

    const gross = (base / 1000000) * sumAssured;
    const rebate = Math.floor(sumAssured / 20000);

    if (mode === 'monthly') return Math.round(gross - rebate);
    if (mode === 'half')
      return Math.round((gross * 6 * 0.985) - rebate * 6);
    if (mode === 'yearly')
      return Math.round((gross * 12 * 0.97) - rebate * 12);

    return 0;
  };

  const premium = calculatePremium();

  /* ============================
     MATURITY & TOTAL PAID
     ============================ */
  const totalBonus = (sumAssured / 1000) * 52 * (matAge - age);
  const maturity = sumAssured + totalBonus;
  const multiplier = mode === 'monthly' ? 12 : mode === 'half' ? 2 : 1;
  const totalPaid = premium * multiplier * (matAge - age);

  const format = (v: number) =>
    '₹ ' + Math.round(v).toLocaleString('en-IN');

  /* ============================
     WHATSAPP LINK (FIXED NUMBER)
     ============================ */
  const getWhatsappLink = () => {
    const message = `Hello, I'm interested in a Postal Life Insurance (PLI) policy.

Scheme: PLI Santosh
Age: ${age}
Sum Assured: ${format(sumAssured)}
Maturity Age: ${matAge}
Payment Mode: ${mode}
Premium: ${format(premium)}
Maturity Value: ${format(maturity)}

Please guide me further.`;

    const WHATSAPP_NUMBER = '919347133286';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="p-6 pb-4 border-b border-white/10 bg-slate-900/95 sticky top-0 z-40">
        <h2 className="text-yellow-400 font-bold text-lg">
          PLI Santosh (Endowment Assurance)
        </h2>
        <p className="text-xs text-slate-400">
          Build a corpus. Get a lump sum cash payout at age {matAge}.
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* AGE */}
        <div className="text-center">
          <input
            type="range"
            min="19"
            max="55"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg accent-yellow-500"
          />
          <p className="text-xs text-slate-400 mt-2">
            Your Age: <b className="text-white">{age}</b>
          </p>
        </div>

        {/* SUM ASSURED */}
        <div className="glass-card rounded-xl p-4 border-l-4 border-yellow-500">
          <label className="text-[10px] text-slate-400 font-bold uppercase">
            Sum Assured (₹)
          </label>
          <input
            type="number"
            value={sumAssured}
            onChange={(e) => setSumAssured(Number(e.target.value))}
            onBlur={validateSum}
            className="bg-transparent text-2xl font-black text-white w-full focus:outline-none"
          />

          <div className="flex justify-between items-center text-[10px] mt-3">
            <span className="text-slate-400">MATURITY AGE</span>
            <select
              value={matAge}
              onChange={(e) => setMatAge(Number(e.target.value))}
              className="bg-slate-800 text-white rounded px-2 py-1"
            >
              {availableMatAges.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MODE TOGGLE */}
        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
          {(['monthly', 'half', 'yearly'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mode === m
                  ? 'bg-yellow-500 text-black'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              {m === 'half' ? 'Half-Yearly' : m}
            </button>
          ))}
        </div>

        {/* TOTAL INVESTMENT */}
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold">
            Your Total Investment
          </p>
          <p className="text-lg font-bold text-white">
            {format(totalPaid)}
          </p>
        </div>

        {/* MATURITY */}
        <div className="p-6 rounded-2xl border-2 border-yellow-500 bg-yellow-500/10 text-center">
          <p className="text-xs uppercase font-bold text-yellow-300 mb-1">
            You will receive at maturity
          </p>
          <p className="text-4xl font-black text-yellow-400">
            {format(maturity)}
          </p>
          <p className="text-xs text-slate-300 mt-2">
            Includes{' '}
            <b className="text-yellow-400">
              {format(totalBonus)}
            </b>{' '}
            Government Bonus
          </p>
        </div>

        {/* WHATSAPP CTA */}
        <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl text-center space-y-3">
          <p className="text-[10px] text-slate-400 uppercase font-bold">
            {mode} Premium
          </p>
          <p className="text-2xl font-black text-white">
            {format(premium)}
          </p>

          <a
            href={getWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold"
          >
            Get This Plan on WhatsApp
          </a>

          <p className="text-[10px] text-slate-500">
            Direct service from Hyderguda S.O. (500048)
          </p>
        </div>
      </div>
    </div>
  );
}
