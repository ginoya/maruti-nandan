import React, { useEffect, useState } from 'react';
import { Button, Input } from './ui';

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rates: { geruRate: number; whiteRate: number; jaipuriRate: number; damarRate: number; goldRate: number }) => void;
  initialData?: { geruRate: number; whiteRate: number; jaipuriRate: number; damarRate: number; goldRate: number };
}

const RatesModal: React.FC<RatesModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [isClosing, setIsClosing] = useState(false);

  const [rates, setRates] = useState({
    geruRate: 0,
    whiteRate: 0,
    jaipuriRate: 0,
    damarRate: 0,
    goldRate: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setRates({
        geruRate: initialData?.geruRate ?? 0,
        whiteRate: initialData?.whiteRate ?? 0,
        jaipuriRate: initialData?.jaipuriRate ?? 0,
        damarRate: initialData?.damarRate ?? 0,
        goldRate: initialData?.goldRate ?? 0,
      });
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 0);
  };

  const handleChange = (key: keyof typeof rates, value: string) => {
    const num = value === '' || value === '.' ? 0 : parseFloat(value) || 0;
    setRates(prev => ({ ...prev, [key]: num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rates);
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg shadow-strong px-xl pt-xl py-lg pb-lg w-full transform transition-transform duration-500 ease-out animate-slide-up">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="text-xl font-bold text-secondary-900">Edit Rates</h2>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Geru Rate</label>
              <Input type="number" step="0.01" min="0" value={rates.geruRate} onChange={e => handleChange('geruRate', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">White Rate</label>
              <Input type="number" step="0.01" min="0" value={rates.whiteRate} onChange={e => handleChange('whiteRate', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Jaipuri Rate</label>
              <Input type="number" step="0.01" min="0" value={rates.jaipuriRate} onChange={e => handleChange('jaipuriRate', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Damar Rate</label>
              <Input type="number" step="0.01" min="0" value={rates.damarRate} onChange={e => handleChange('damarRate', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Gold Rate</label>
              <Input type="number" step="0.01" min="0" value={rates.goldRate} onChange={e => handleChange('goldRate', e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-between pt-md">
            <Button type="button" variant="outline" onClick={handleClose} size='sm'>Cancel</Button>
            <Button type="submit" variant="gradient" size='sm' className='px-xl'>Save Rates</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatesModal;