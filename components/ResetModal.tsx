
import React, { useState } from 'react';

interface ResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ADMIN_PIN = "2024";

const ResetModal: React.FC<ResetModalProps> = ({ onConfirm, onCancel }) => {
  const [pin, setPin] = useState('');
  
  const isPinComplete = pin.length === 4;
  const isPinCorrect = pin === ADMIN_PIN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Reset Tournament?</h2>
          <p className="text-slate-500 mb-6 text-sm">
            This will permanently erase <strong>all scores</strong> and return the app to its initial state.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center">
            Admin Authorization PIN
          </label>
          <input
            type="password"
            value={pin}
            maxLength={4}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className={`w-full text-center text-3xl tracking-[0.5em] font-bold p-3 bg-slate-50 border-2 rounded-xl focus:bg-white outline-none transition-all placeholder:tracking-normal ${
              isPinComplete && !isPinCorrect 
                ? 'border-red-500 animate-shake bg-red-50' 
                : 'border-slate-100 focus:border-indigo-500'
            }`}
            autoFocus
          />
          {isPinComplete && !isPinCorrect && (
            <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tight text-center">Incorrect PIN</p>
          )}
          {isPinCorrect && (
            <p className="text-green-600 text-[10px] font-bold mt-2 uppercase tracking-tight text-center">✓ PIN Verified</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={!isPinCorrect}
            className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg ${
              isPinCorrect 
                ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-red-200 cursor-pointer' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            Confirm Full Reset
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
