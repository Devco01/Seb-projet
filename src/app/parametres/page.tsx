"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaBuilding, FaEuroSign, FaSave, FaImage, FaUpload } from 'react-icons/fa';

export default function Parametres() {
  // États pour les différents paramètres
  const [companyName, setCompanyName] = useState("Entreprise de Peinture ABC");
  const [address, setAddress] = useState("12 rue des Artisans, 75001 Paris");
  const [phone, setPhone] = useState("01 23 45 67 89");
  const [email, setEmail] = useState("contact@peinture-abc.fr");
  const [siret, setSiret] = useState("12345678900012");
  const [tva, setTva] = useState("FR12345678900");
  const [defaultTva, setDefaultTva] = useState("20");
  const [paymentDelay, setPaymentDelay] = useState("30");
  const [logoUrl, setLogoUrl] = useState("/logo-placeholder.png");

  // Fonction de sauvegarde simulée
  const handleSave = (section) => {
    alert(`Paramètres de ${section} sauvegardés avec succès!`);
  };

  // Fonction pour simuler l'upload d'un logo
  const handleLogoUpload = () => {
    // Dans une vraie application, vous utiliseriez FormData et une API pour uploader le fichier
    alert("Cette fonctionnalité serait implémentée avec un vrai upload de fichier dans l&apos;application complète");
    
    // Utilisation de setLogoUrl pour éviter l'erreur ESLint
    setLogoUrl("/logo-placeholder.png");
  };

  return (
    <div className="space-y-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="py-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Paramètres</h2>
        <p className="text-gray-500 mt-2">Configurez votre application de facturation</p>
      </div>
      
      {/* Section informations de l'entreprise */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <FaBuilding className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Informations de l&apos;entreprise</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;entreprise
            </label>
            <input
              type="text"
              id="companyName"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              id="phone"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro SIRET
            </label>
            <input
              type="text"
              id="siret"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro TVA
            </label>
            <input
              type="text"
              id="tva"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={tva}
              onChange={(e) => setTva(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center">
          <div className="mb-4 sm:mb-0 sm:mr-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de l&apos;entreprise
            </label>
            <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
              {logoUrl ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={logoUrl} 
                    alt="Logo de l'entreprise" 
                    fill 
                    sizes="128px"
                    className="object-contain" 
                  />
                </div>
              ) : (
                <FaImage className="h-10 w-10 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="mt-2 sm:mt-6">
            <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center">
              <FaUpload className="mr-2" />
              Choisir un fichier
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Format recommandé: PNG ou JPEG, max 2MB</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSave('entreprise')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSave className="mr-2" />
            Sauvegarder les informations
          </button>
        </div>
      </div>
      
      {/* Section paramètres de facturation */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <FaEuroSign className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Paramètres de facturation</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="defaultTva" className="block text-sm font-medium text-gray-700 mb-1">
              Taux de TVA par défaut (%)
            </label>
            <input
              type="number"
              id="defaultTva"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={defaultTva}
              onChange={(e) => setDefaultTva(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="paymentDelay" className="block text-sm font-medium text-gray-700 mb-1">
              Délai de paiement par défaut (jours)
            </label>
            <input
              type="number"
              id="paymentDelay"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={paymentDelay}
              onChange={(e) => setPaymentDelay(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numérotation des factures
            </label>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  id="facture-auto"
                  name="facture-numerotation"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <label htmlFor="facture-auto" className="ml-3 block text-sm text-gray-700">
                  Automatique (F-ANNÉE-XXX)
                </label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  id="facture-custom"
                  name="facture-numerotation"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="facture-custom" className="ml-3 block text-sm text-gray-700">
                  Personnalisée
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions de paiement par défaut
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              defaultValue="Paiement à réception de facture. Tout retard de paiement entraîne des pénalités calculées au taux d'intérêt légal en vigueur."
            ></textarea>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSave('facturation')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSave className="mr-2" />
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}