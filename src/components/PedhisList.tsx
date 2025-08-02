import React from 'react';
import { usePedhis } from '../hooks/usePedhis';

const PedhisList: React.FC = () => {
  const { pedhis, loading, error, isEmpty } = usePedhis();

  if (loading) {
    return (
      <div className="p-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-sm text-secondary-600">Loading pedhis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-md">
        <div className="bg-red-50 border border-red-200 rounded-md p-md">
          <p className="text-red-800">Error loading pedhis: {error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-md">
        <div className="text-center">
          <p className="text-secondary-600">No pedhis found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-md">
      <h3 className="text-lg font-semibold text-secondary-900 mb-md">Pedhis</h3>
      <div className="space-y-sm">
        {pedhis.map((pedhi: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
          <div
            key={pedhi.id}
            className="bg-white border border-gray-200 rounded-md p-sm hover:bg-gray-50"
          >
            <p className="font-medium text-secondary-900">{pedhi.name}</p>
            {/* Add more fields as needed based on your Firebase data structure */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedhisList; 