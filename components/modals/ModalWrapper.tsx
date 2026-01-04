import React, { useEffect, useState } from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({ isOpen, onClose, children }: ModalWrapperProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation frame for fade in
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-slate-900 w-full md:max-w-md rounded-t-2xl md:rounded-2xl border border-white/20 shadow-2xl max-h-[95vh] overflow-y-auto relative flex flex-col"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center z-50 transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
}