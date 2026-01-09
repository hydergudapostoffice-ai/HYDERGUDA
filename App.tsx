import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModalWrapper from './components/modals/ModalWrapper';
import PliCalculator from './components/modals/PliCalculator';
import RpliCalculator from './components/modals/RpliCalculator';
import StandardCalculator from './components/modals/StandardCalculator';
import { SchemeId, Lang } from './types';

export default function App() {
  const [lang] = useState<Lang>('en');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSchemeId, setActiveSchemeId] = useState<SchemeId | null>(null);

  /* ================================
     OPEN MODAL + PUSH HISTORY STATE
     ================================ */
  const openModal = (id: SchemeId) => {
    setActiveSchemeId(id);
    setModalOpen(true);

    // Push history so mobile back button closes modal first
    window.history.pushState({ modal: true }, '');
  };

  /* ================================
     CLOSE MODAL SAFELY
     ================================ */
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveSchemeId(null), 300);

    // Pop only modal state (do NOT exit site)
    if (window.history.state?.modal) {
      window.history.back();
    }
  };

  /* ================================
     HANDLE MOBILE BACK BUTTON
     ================================ */
  useEffect(() => {
    const handlePopState = () => {
      if (modalOpen) {
        setModalOpen(false);
        setTimeout(() => setActiveSchemeId(null), 300);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [modalOpen]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-sans bg-black">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header />

        <main>
          {/* ================= HERO (MOBILE FIRST) ================= */}
          <section className="text-center flex flex-col justify-center items-center py-10 md:py-24 px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight">
              The Highest Bonus. The Lowest Premium.
              <span className="block">
                Guaranteed by the Government of India.
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto mb-6">
              Why pay more to private insurers? Secure your family’s future directly
              with India Post. No middlemen. No hidden charges. Just pure returns.
            </p>

            <div className="mt-2 text-slate-500">
              <i className="fa-solid fa-arrow-down text-lg animate-bounce"></i>
            </div>
          </section>

          {/* ================= SCHEME SELECTION ================= */}
          <section
            id="selection"
            className="px-4 pt-10 pb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-center text-3xl font-bold mb-8">
              Insurance Schemes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ================= PLI ================= */}
              <div
                onClick={() => openModal('pli')}
                className="glass-card p-7 rounded-2xl relative overflow-hidden cursor-pointer group border-amber-400/30 hover:border-amber-400/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-amber-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Best ROI
                </div>

                <div className="w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mb-4 border border-amber-400/20">
                  <i className="fa-solid fa-shield-halved text-2xl text-amber-400"></i>
                </div>

                <h3 className="font-bold text-xl text-amber-400 mb-2">
                  For Employees & Professionals
                </h3>

                <p className="text-sm text-slate-400 mb-5">
                  Exclusive to Govt, Semi-Govt employees and Degree Holders.
                  Government-backed life insurance with bonus advantage.
                </p>

                <span className="font-semibold text-sm text-white group-hover:text-amber-400 transition">
                  Check Eligibility →
                </span>
              </div>

              {/* ================= RPLI ================= */}
              <div
                onClick={() => openModal('rpli')}
                className="glass-card p-7 rounded-2xl relative overflow-hidden cursor-pointer group border-blue-400/30 hover:border-blue-400/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-blue-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Affordable
                </div>

                <div className="w-14 h-14 rounded-full bg-blue-400/10 flex items-center justify-center mb-4 border border-blue-400/20">
                  <i className="fa-solid fa-tractor text-2xl text-blue-400"></i>
                </div>

                <h3 className="font-bold text-xl text-blue-400 mb-2">
                  For Rural Residents
                </h3>

                <p className="text-sm text-slate-400 mb-5">
                  Low premium, strong maturity value and government-backed
                  protection for rural families.
                </p>

                <span className="font-semibold text-sm text-white group-hover:text-blue-400 transition">
                  Check Eligibility →
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="text-center py-5 text-slate-500 text-xs border-t border-white/10 bg-black/20 flex flex-col md:flex-row justify-between items-center px-6">
          <p>Managed by Hyderguda Sub-Office. PIN: 500048.</p>
          <p className="my-2 md:my-0 font-bold">
            IRDAI Exempt | Ministry of Communications
          </p>
          <p>Questions? Visit us at Hyderguda S.O.</p>
        </footer>
      </div>

      {/* ================= MODAL ================= */}
      <ModalWrapper isOpen={modalOpen && !!activeSchemeId} onClose={closeModal}>
        {activeSchemeId === 'pli' ? (
          <PliCalculator />
        ) : activeSchemeId === 'rpli' ? (
          <RpliCalculator />
        ) : activeSchemeId ? (
          <StandardCalculator schemeId={activeSchemeId} lang={lang} />
        ) : null}
      </ModalWrapper>
    </div>
  );
}
