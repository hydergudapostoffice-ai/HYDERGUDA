

import React, { useState } from 'react';
import Header from './components/Header';
import ModalWrapper from './components/modals/ModalWrapper';
import PliCalculator from './components/modals/PliCalculator';
import RpliCalculator from './components/modals/RpliCalculator';
import StandardCalculator from './components/modals/StandardCalculator';
import { SchemeId, Lang } from './types';
import Ticker from './components/Ticker';
import TrackingSection from './components/TrackingSection';
import SchemeCard from './components/SchemeCard';
import { SCHEMES } from './constants';

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSchemeId, setActiveSchemeId] = useState<SchemeId | null>(null);

  const openModal = (id: SchemeId) => {
    setActiveSchemeId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveSchemeId(null), 300);
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-sans bg-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="text-center min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight">
              The Highest Bonus. The Lowest Premium.
              <span className="block">Guaranteed by the Government of India.</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto mb-12">
              Why pay more to private insurers? Secure your family’s future directly with India Post. No middlemen. No hidden charges. Just pure returns.
            </p>
            <div className="arrow-bounce text-slate-500">
              <i className="fa-solid fa-arrow-down text-2xl"></i>
            </div>
          </section>

          <Ticker />
          <TrackingSection />

          {/* Selection Cards Section */}
          <section id="selection" className="px-4 pt-16 pb-24 max-w-4xl mx-auto">
             <h2 className="text-center text-3xl font-bold mb-10">Insurance Schemes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PLI Card */}
              <div 
                onClick={() => openModal('pli')} 
                className="glass-card p-8 rounded-2xl relative overflow-hidden cursor-pointer group border-amber-400/30 hover:border-amber-400/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-amber-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Best ROI
                </div>
                <div className="w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mb-5 border border-amber-400/20">
                  <i className="fa-solid fa-shield-halved text-2xl text-amber-400"></i>
                </div>
                <h3 className="font-bold text-xl text-amber-400 mb-2">For Employees & Professionals</h3>
                <p className="text-sm text-slate-400 mb-6">Exclusive to Govt, Semi-Govt employees, and Degree Holders. The gold standard of insurance with the highest bonus rates in the industry.</p>
                <span className="font-semibold text-sm text-white group-hover:text-amber-400 transition">Check Eligibility &gt;</span>
              </div>

              {/* RPLI Card */}
              <div 
                onClick={() => openModal('rpli')} 
                className="glass-card p-8 rounded-2xl relative overflow-hidden cursor-pointer group border-blue-400/30 hover:border-blue-400/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-blue-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Affordable
                </div>
                <div className="w-14 h-14 rounded-full bg-blue-400/10 flex items-center justify-center mb-5 border border-blue-400/20">
                  <i className="fa-solid fa-tractor text-2xl text-blue-400"></i>
                </div>
                <h3 className="font-bold text-xl text-blue-400 mb-2">For Rural Residents</h3>
                <p className="text-sm text-slate-400 mb-6">High-return protection designed for everyone living in rural areas. Small monthly savings, massive maturity value.</p>
                <span className="font-semibold text-sm text-white group-hover:text-blue-400 transition">Check Eligibility &gt;</span>
              </div>
            </div>
          </section>

          <section id="other-schemes" className="px-4 pb-24 max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-10">Other Savings Schemes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCHEMES.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} lang={lang} onClick={() => openModal(scheme.id)} />
              ))}
            </div>
          </section>
        </main>

        <footer className="text-center py-6 text-slate-500 text-xs border-t border-white/10 bg-black/20 flex flex-col md:flex-row justify-between items-center px-8">
          <p>Managed by Hyderguda Sub-Office. PIN: 500048.</p>
          <p className="my-2 md:my-0 font-bold">IRDAI Exempt | Ministry of Communications</p>
          <p>Questions? Visit us at Hyderguda S.O.</p>
        </footer>
      </div>

      {/* Modal */}
      <ModalWrapper 
        isOpen={modalOpen && !!activeSchemeId} 
        onClose={closeModal}
      >
        {activeSchemeId === 'pli' ? (
          <PliCalculator lang={lang} />
        ) : activeSchemeId === 'rpli' ? (
          <RpliCalculator lang={lang} />
        ) : activeSchemeId ? (
          <StandardCalculator schemeId={activeSchemeId} lang={lang} />
        // FIX: Replace null with an empty fragment to ensure a valid ReactNode is always returned, satisfying the 'children' prop requirement for ModalWrapper.
        ) : <></>}
      </ModalWrapper>
    </div>
  );
}