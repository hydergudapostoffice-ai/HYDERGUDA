import React, { useState } from 'react';
import Header from './components/Header';
import Ticker from './components/Ticker';
import TrackingSection from './components/TrackingSection';
import SchemeCard from './components/SchemeCard';
import ModalWrapper from './components/modals/ModalWrapper';
import PliCalculator from './components/modals/PliCalculator';
import StandardCalculator from './components/modals/StandardCalculator';
import { SCHEMES } from './constants';
import { SchemeId, Lang } from './types';

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSchemeId, setActiveSchemeId] = useState<SchemeId | null>(null);

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'te' : 'en'));

  const openModal = (id: SchemeId) => {
    setActiveSchemeId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // Slight delay to clear active scheme for animation if needed, but immediate is fine for now
    setTimeout(() => setActiveSchemeId(null), 300);
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto md:max-w-full">
        <Header lang={lang} onToggleLang={toggleLang} />

        <section className="text-center py-8 px-4">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Government Guaranteed</h1>
          <p className="text-slate-400 text-sm mb-6">100% Secure Wealth Creation.</p>
          <Ticker />
        </section>

        <TrackingSection />

        <section className="px-4 pb-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PLI Card (Featured) */}
            <div 
              onClick={() => openModal('pli')} 
              className="glass-card p-6 rounded-xl relative overflow-hidden cursor-pointer group border-yellow-500/50 hover:bg-yellow-500/5 transition transform hover:scale-[1.02] shadow-xl shadow-yellow-900/20"
            >
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Recommended
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 border border-yellow-500/30">
                <i className="fa-solid fa-shield-halved text-xl text-yellow-400"></i>
              </div>
              <h3 className="font-bold text-lg text-yellow-500 mb-1">Postal Life Insurance</h3>
              <p className="text-sm text-slate-400">Low Premium, High Bonus. Best for Professionals.</p>
            </div>

            {/* Other Schemes */}
            {SCHEMES.map(scheme => (
              <React.Fragment key={scheme.id}>
                <SchemeCard 
                  scheme={scheme} 
                  lang={lang} 
                  onClick={() => openModal(scheme.id)} 
                />
              </React.Fragment>
            ))}
          </div>
        </section>

        <footer className="text-center py-8 text-slate-600 text-[10px] uppercase tracking-widest border-t border-white/5 bg-black/20">
          <p>Developed by GN Prakash Reddy [Hyderguda S.O]</p>
        </footer>
      </div>

      {/* Modal */}
      {modalOpen && activeSchemeId && (
        <ModalWrapper 
          isOpen={modalOpen} 
          onClose={closeModal}
          children={
            activeSchemeId === 'pli' ? (
              <PliCalculator lang={lang} />
            ) : (
              <StandardCalculator schemeId={activeSchemeId} lang={lang} />
            )
          }
        />
      )}
    </div>
  );
}