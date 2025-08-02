import React from 'react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const Invoice: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateInvoice = () => {
    navigate('/invoice/new');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-xl">
        <div className="flex justify-center">
          <Button variant="gradient" size="sm" className="px-lg py-sm" onClick={handleCreateInvoice}>
            + New Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Invoice; 