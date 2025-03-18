"use client";

import React from 'react';
import MainLayout from '../components/MainLayout';

export default function Parametres() {
  return (
    <MainLayout>
      <div className="space-y-6 pb-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-800">Paramètres</h2>
          <p className="text-gray-500 mt-2">Configurez votre application</p>
        </div>
        
        {/* Contenu de la page paramètres */}
      </div>
    </MainLayout>
  );
}