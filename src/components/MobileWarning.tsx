import React from 'react';

export default function MobileWarning() {
  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Samo za Desktop
        </h1>
        <p className="text-gray-600">
          Ova aplikacija je optimizovana za veće ekrane. 
          Molimo otvorite je na računaru za najbolji doživljaj.
        </p>
      </div>
    </div>
  );
}
