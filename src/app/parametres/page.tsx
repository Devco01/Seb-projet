"use client";

import Layout from '../components/Layout';
import { useState } from 'react';
import { FaSave, FaCog, FaUser, FaFileInvoiceDollar, FaFileAlt, FaMoneyBillWave, FaEnvelope } from 'react-icons/fa';
import { ChangeEvent } from 'react';

export default function Parametres() {
  // État pour les informations de l'entreprise
  const [entreprise, setEntreprise] = useState({
    nom: 'Martin Peinture',
    adresse: '15 rue des Artisans',
    codePostal: '75001',
    ville: 'Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@martin-peinture.fr',
    siret: '12345678901234',
    tva: 'Non assujetti à la TVA',
  });

  // État pour les paramètres des devis et factures
  const [documents, setDocuments] = useState({
    prefixeDevis: 'D-',
    prefixeFacture: 'F-',
    delaiValiditeDevis: 30,
    delaiPaiementFacture: 30,
    mentionsLegalesDevis: 'Devis valable 30 jours à compter de sa date d\'émission.',
    mentionsLegalesFacture: 'TVA non applicable, art. 293 B du CGI\nPaiement à réception de facture\nPas d\'escompte pour paiement anticipé\nRetard de paiement : pénalités de 3 fois le taux d\'intérêt légal',
  });

  // État pour les paramètres de paiement
  const [paiement, setPaiement] = useState({
    rib: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'ABCDEFGHIJK',
    banque: 'Banque Exemple',
    moyensPaiement: ['Virement bancaire', 'Chèque'],
  });

  // Fonction pour gérer les changements dans le formulaire d'entreprise
  const handleEntrepriseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntreprise({
      ...entreprise,
      [name]: value,
    });
  };

  // Fonction pour gérer les changements dans le formulaire de documents
  const handleDocumentsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocuments({
      ...documents,
      [name]: value,
    });
  };

  // Fonction pour gérer les changements dans le formulaire de paiement
  const handlePaiementChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaiement({
      ...paiement,
      [name]: value,
    });
  };

  // Fonction pour gérer les moyens de paiement (checkbox)
  const handleMoyenPaiementChange = (moyen: string) => {
    if (paiement.moyensPaiement.includes(moyen)) {
      setPaiement({
        ...paiement,
        moyensPaiement: paiement.moyensPaiement.filter(m => m !== moyen),
      });
    } else {
      setPaiement({
        ...paiement,
        moyensPaiement: [...paiement.moyensPaiement, moyen],
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres et personnalisation</h1>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaSave className="mr-2" /> Enregistrer les modifications
          </button>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <a
              href="#entreprise"
              className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <FaUser className="inline-block mr-2" /> Entreprise
            </a>
            <a
              href="#documents"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <FaFileInvoiceDollar className="inline-block mr-2" /> Devis et Factures
            </a>
            <a
              href="#paiement"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <FaMoneyBillWave className="inline-block mr-2" /> Paiement
            </a>
            <a
              href="#notifications"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <FaEnvelope className="inline-block mr-2" /> Notifications
            </a>
          </nav>
        </div>

        {/* Section Entreprise */}
        <div id="entreprise" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaUser className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Informations de l'entreprise</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={entreprise.nom}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    value={entreprise.adresse}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="codePostal"
                    id="codePostal"
                    value={entreprise.codePostal}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="ville"
                    id="ville"
                    value={entreprise.ville}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="telephone"
                    id="telephone"
                    value={entreprise.telephone}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={entreprise.email}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                  Numéro SIRET
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="siret"
                    id="siret"
                    value={entreprise.siret}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="tva" className="block text-sm font-medium text-gray-700">
                  Statut TVA
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="tva"
                    id="tva"
                    value={entreprise.tva}
                    onChange={handleEntrepriseChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  En tant qu'auto-entrepreneur, vous n'êtes pas assujetti à la TVA (article 293 B du CGI).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Devis et Factures */}
        <div id="documents" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaFileInvoiceDollar className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Paramètres des devis et factures</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="prefixeDevis" className="block text-sm font-medium text-gray-700">
                  Préfixe des devis
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="prefixeDevis"
                    id="prefixeDevis"
                    value={documents.prefixeDevis}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="prefixeFacture" className="block text-sm font-medium text-gray-700">
                  Préfixe des factures
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="prefixeFacture"
                    id="prefixeFacture"
                    value={documents.prefixeFacture}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="delaiValiditeDevis" className="block text-sm font-medium text-gray-700">
                  Délai de validité des devis (jours)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="delaiValiditeDevis"
                    id="delaiValiditeDevis"
                    value={documents.delaiValiditeDevis}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="delaiPaiementFacture" className="block text-sm font-medium text-gray-700">
                  Délai de paiement des factures (jours)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="delaiPaiementFacture"
                    id="delaiPaiementFacture"
                    value={documents.delaiPaiementFacture}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="mentionsLegalesDevis" className="block text-sm font-medium text-gray-700">
                  Mentions légales des devis
                </label>
                <div className="mt-1">
                  <textarea
                    id="mentionsLegalesDevis"
                    name="mentionsLegalesDevis"
                    rows={3}
                    value={documents.mentionsLegalesDevis}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="mentionsLegalesFacture" className="block text-sm font-medium text-gray-700">
                  Mentions légales des factures
                </label>
                <div className="mt-1">
                  <textarea
                    id="mentionsLegalesFacture"
                    name="mentionsLegalesFacture"
                    rows={4}
                    value={documents.mentionsLegalesFacture}
                    onChange={handleDocumentsChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Paiement */}
        <div id="paiement" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaMoneyBillWave className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Paramètres de paiement</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="rib" className="block text-sm font-medium text-gray-700">
                  IBAN
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="rib"
                    id="rib"
                    value={paiement.rib}
                    onChange={handlePaiementChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bic" className="block text-sm font-medium text-gray-700">
                  BIC
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bic"
                    id="bic"
                    value={paiement.bic}
                    onChange={handlePaiementChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="banque" className="block text-sm font-medium text-gray-700">
                  Banque
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="banque"
                    id="banque"
                    value={paiement.banque}
                    onChange={handlePaiementChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700">Moyens de paiement acceptés</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="virement"
                        name="moyensPaiement"
                        type="checkbox"
                        checked={paiement.moyensPaiement.includes('Virement bancaire')}
                        onChange={() => handleMoyenPaiementChange('Virement bancaire')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="virement" className="ml-3 block text-sm font-medium text-gray-700">
                        Virement bancaire
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cheque"
                        name="moyensPaiement"
                        type="checkbox"
                        checked={paiement.moyensPaiement.includes('Chèque')}
                        onChange={() => handleMoyenPaiementChange('Chèque')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="cheque" className="ml-3 block text-sm font-medium text-gray-700">
                        Chèque
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="especes"
                        name="moyensPaiement"
                        type="checkbox"
                        checked={paiement.moyensPaiement.includes('Espèces')}
                        onChange={() => handleMoyenPaiementChange('Espèces')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="especes" className="ml-3 block text-sm font-medium text-gray-700">
                        Espèces
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="carte"
                        name="moyensPaiement"
                        type="checkbox"
                        checked={paiement.moyensPaiement.includes('Carte bancaire')}
                        onChange={() => handleMoyenPaiementChange('Carte bancaire')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="carte" className="ml-3 block text-sm font-medium text-gray-700">
                        Carte bancaire
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        {/* Section Notifications */}
        <div id="notifications" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Paramètres des notifications</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Rappels de paiement</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="rappel1"
                        name="rappel1"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rappel1" className="font-medium text-gray-700">Premier rappel</label>
                      <p className="text-gray-500">Envoyer un rappel 3 jours après la date d'échéance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="rappel2"
                        name="rappel2"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rappel2" className="font-medium text-gray-700">Deuxième rappel</label>
                      <p className="text-gray-500">Envoyer un rappel 10 jours après la date d'échéance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="rappel3"
                        name="rappel3"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rappel3" className="font-medium text-gray-700">Rappel final</label>
                      <p className="text-gray-500">Envoyer un rappel 30 jours après la date d'échéance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Notifications par email</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifDevis"
                        name="notifDevis"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifDevis" className="font-medium text-gray-700">Devis</label>
                      <p className="text-gray-500">Recevoir une notification lorsqu'un devis est accepté ou refusé</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifFacture"
                        name="notifFacture"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifFacture" className="font-medium text-gray-700">Factures</label>
                      <p className="text-gray-500">Recevoir une notification lorsqu'une facture est payée</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifRetard"
                        name="notifRetard"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifRetard" className="font-medium text-gray-700">Retards de paiement</label>
                      <p className="text-gray-500">Recevoir une notification lorsqu'une facture est en retard de paiement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 