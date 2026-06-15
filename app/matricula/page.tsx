import React from 'react';
import MatriculaForm from './MatriculaForm';

export const dynamic = 'force-dynamic';

export default function MatriculaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wind English</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha seus dados para iniciar sua matrícula</p>
        </div>
        <MatriculaForm />
      </div>
    </div>
  );
}
