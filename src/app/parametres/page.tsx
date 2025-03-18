"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaBuilding, FaEnvelope, FaPhone, FaFileInvoiceDollar, FaSave, FaCreditCard, FaCheck } from 'react-icons/fa';

export default function Parametres() {
  const [successMessage, setSuccessMessage] = useState('');
  
  // Données par défaut pour les paramètres
  const defaultEntrepriseInfo = {
    nom: 'Martin Peinture',
    adresse: '15 rue des Lilas',
    codePostal: '75001',
    ville: 'Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@martin-peinture.fr',
    siret: '12345678901234',
    tva: 'FR12345678901',
  };

  const defaultFacturationInfo = {
    prefixeDevis: 'D-',
    prefixeFacture: 'F-',
    delaiPaiement: '30',
    conditionsPaiement: 'Paiement à réception de facture',
    mentionsTva: 'TVA non applicable, art. 293 B du CGI',
    piedPage: 'Merci pour votre confiance',
  };

  const defaultEmailInfo = {
    expediteur: 'contact@martin-peinture.fr',
    objetDevis: 'Votre devis {numero}',
    objetFacture: 'Votre facture {numero}',
    messageDevis: 'Bonjour,\n\nVeuillez trouver ci-joint votre devis {numero}.\n\nCordialement,\nMartin Peinture',
    messageFacture: 'Bonjour,\n\nVeuillez trouver ci-joint votre facture {numero}.\n\nCordialement,\nMartin Peinture',
  };

  const defaultPaiementInfo = {
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'ABCDEFGHIJK',
    banque: 'Banque Exemple',
    titulaire: 'Martin Jean',
  };

  // Initialiser les états avec les valeurs par défaut
  const [entrepriseInfo, setEntrepriseInfo] = useState(defaultEntrepriseInfo);
  const [facturationInfo, setFacturationInfo] = useState(defaultFacturationInfo);
  const [emailInfo, setEmailInfo] = useState(defaultEmailInfo);
  const [paiementInfo, setPaiementInfo] = useState(defaultPaiementInfo);

  // Charger les paramètres depuis le localStorage au chargement de la page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger les informations de l'entreprise
      const savedEntrepriseInfo = localStorage.getItem('entrepriseInfo');
      if (savedEntrepriseInfo) {
        try {
          setEntrepriseInfo(JSON.parse(savedEntrepriseInfo));
        } catch (err) {
          console.error("Erreur lors du chargement des informations de l'entreprise:", err);
        }
      }

      // Charger les informations de facturation
      const savedFacturationInfo = localStorage.getItem('facturationInfo');
      if (savedFacturationInfo) {
        try {
          setFacturationInfo(JSON.parse(savedFacturationInfo));
        } catch (err) {
          console.error("Erreur lors du chargement des informations de facturation:", err);
        }
      }

      // Charger les informations d'email
      const savedEmailInfo = localStorage.getItem('emailInfo');
      if (savedEmailInfo) {
        try {
          setEmailInfo(JSON.parse(savedEmailInfo));
        } catch (err) {
          console.error("Erreur lors du chargement des informations d'email:", err);
        }
      }

      // Charger les informations de paiement
      const savedPaiementInfo = localStorage.getItem('paiementInfo');
      if (savedPaiementInfo) {
        try {
          setPaiementInfo(JSON.parse(savedPaiementInfo));
        } catch (err) {
          console.error("Erreur lors du chargement des informations de paiement:", err);
        }
      }
    }
  }, []);

  // Fonction pour gérer les changements dans les formulaires
  const handleEntrepriseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntrepriseInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFacturationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFacturationInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaiementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaiementInfo(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sauvegarder les données dans le localStorage
    localStorage.setItem('entrepriseInfo', JSON.stringify(entrepriseInfo));
    localStorage.setItem('facturationInfo', JSON.stringify(facturationInfo));
    localStorage.setItem('emailInfo', JSON.stringify(emailInfo));
    localStorage.setItem('paiementInfo', JSON.stringify(paiementInfo));
    
    // Afficher un message de succès
    setSuccessMessage('Paramètres enregistrés avec succès !');
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600">Configurez les paramètres de votre entreprise</p>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <FaCheck className="mr-2" /> {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Informations de l'entreprise */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaBuilding className="text-blue-600 mr-2" />
              <h2 className="text-xl font-bold">Informations de l'entreprise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={entrepriseInfo.nom}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={entrepriseInfo.adresse}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  id="codePostal"
                  name="codePostal"
                  value={entrepriseInfo.codePostal}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={entrepriseInfo.ville}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={entrepriseInfo.telephone}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={entrepriseInfo.email}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  value={entrepriseInfo.siret}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro TVA (si applicable)
                </label>
                <input
                  type="text"
                  id="tva"
                  name="tva"
                  value={entrepriseInfo.tva}
                  onChange={handleEntrepriseChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Paramètres de facturation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaFileInvoiceDollar className="text-green-600 mr-2" />
              <h2 className="text-xl font-bold">Paramètres de facturation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prefixeDevis" className="block text-sm font-medium text-gray-700 mb-1">
                  Préfixe des devis
                </label>
                <input
                  type="text"
                  id="prefixeDevis"
                  name="prefixeDevis"
                  value={facturationInfo.prefixeDevis}
                  onChange={handleFacturationChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="prefixeFacture" className="block text-sm font-medium text-gray-700 mb-1">
                  Préfixe des factures
                </label>
                <input
                  type="text"
                  id="prefixeFacture"
                  name="prefixeFacture"
                  value={facturationInfo.prefixeFacture}
                  onChange={handleFacturationChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="delaiPaiement" className="block text-sm font-medium text-gray-700 mb-1">
                  Délai de paiement (jours)
                </label>
                <input
                  type="number"
                  id="delaiPaiement"
                  name="delaiPaiement"
                  value={facturationInfo.delaiPaiement}
                  onChange={handleFacturationChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="conditionsPaiement" className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions de paiement
                </label>
                <input
                  type="text"
                  id="conditionsPaiement"
                  name="conditionsPaiement"
                  value={facturationInfo.conditionsPaiement}
                  onChange={handleFacturationChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="mentionsTva" className="block text-sm font-medium text-gray-700 mb-1">
                  Mentions TVA
                </label>
                <input
                  type="text"
                  id="mentionsTva"
                  name="mentionsTva"
                  value={facturationInfo.mentionsTva}
                  onChange={handleFacturationChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="piedPage" className="block text-sm font-medium text-gray-700 mb-1">
                  Pied de page des documents
                </label>
                <textarea
                  id="piedPage"
                  name="piedPage"
                  value={facturationInfo.piedPage}
                  onChange={handleFacturationChange}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Paramètres d'email */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-purple-600 mr-2" />
              <h2 className="text-xl font-bold">Paramètres d'email</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expediteur" className="block text-sm font-medium text-gray-700 mb-1">
                  Email expéditeur
                </label>
                <input
                  type="email"
                  id="expediteur"
                  name="expediteur"
                  value={emailInfo.expediteur}
                  onChange={handleEmailChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="objetDevis" className="block text-sm font-medium text-gray-700 mb-1">
                  Objet des emails de devis
                </label>
                <input
                  type="text"
                  id="objetDevis"
                  name="objetDevis"
                  value={emailInfo.objetDevis}
                  onChange={handleEmailChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="objetFacture" className="block text-sm font-medium text-gray-700 mb-1">
                  Objet des emails de facture
                </label>
                <input
                  type="text"
                  id="objetFacture"
                  name="objetFacture"
                  value={emailInfo.objetFacture}
                  onChange={handleEmailChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="messageDevis" className="block text-sm font-medium text-gray-700 mb-1">
                  Message par défaut pour les devis
                </label>
                <textarea
                  id="messageDevis"
                  name="messageDevis"
                  value={emailInfo.messageDevis}
                  onChange={handleEmailChange}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="messageFacture" className="block text-sm font-medium text-gray-700 mb-1">
                  Message par défaut pour les factures
                </label>
                <textarea
                  id="messageFacture"
                  name="messageFacture"
                  value={emailInfo.messageFacture}
                  onChange={handleEmailChange}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Informations bancaires */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaPhone className="text-red-600 mr-2" />
              <h2 className="text-xl font-bold">Informations bancaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  value={paiementInfo.iban}
                  onChange={handlePaiementChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="bic" className="block text-sm font-medium text-gray-700 mb-1">
                  BIC
                </label>
                <input
                  type="text"
                  id="bic"
                  name="bic"
                  value={paiementInfo.bic}
                  onChange={handlePaiementChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="banque" className="block text-sm font-medium text-gray-700 mb-1">
                  Banque
                </label>
                <input
                  type="text"
                  id="banque"
                  name="banque"
                  value={paiementInfo.banque}
                  onChange={handlePaiementChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="titulaire" className="block text-sm font-medium text-gray-700 mb-1">
                  Titulaire du compte
                </label>
                <input
                  type="text"
                  id="titulaire"
                  name="titulaire"
                  value={paiementInfo.titulaire}
                  onChange={handlePaiementChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <FaSave className="mr-2" /> Enregistrer les paramètres
            </button>
          </div>
        </div>
      </form>
    </MainLayout>
  );
} 