'use client';

import { useState, useEffect } from 'react';
import { FaDownload, FaEnvelope, FaEdit, FaTrash, FaExchangeAlt, FaArrowLeft, FaPrint } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EnteteDocument from '@/app/components/EnteteDocument';

// Données fictives pour un devis
const devisData = {
  id: 1,
  numero: 'D-2023-056',
  client: {
    nom: 'Dupont SAS',
    adresse: '15 rue des Lilas',
    codePostal: '75001',
    ville: 'Paris',
    email: 'contact@dupont-sas.fr',
    telephone: '01 23 45 67 89'
  },
  date: '20/06/2023',
  validite: '20/07/2023',
  statut: 'En attente',
  statutColor: 'bg-yellow-100 text-yellow-800',
  lignes: [
    {
      description: 'Peinture murs intérieurs - Salon',
      quantite: 45,
      unite: 'm²',
      prixUnitaire: 25,
      total: 1125
    },
    {
      description: 'Peinture plafond - Salon',
      quantite: 20,
      unite: 'm²',
      prixUnitaire: 30,
      total: 600
    },
    {
      description: 'Préparation des surfaces',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: 350,
      total: 350
    }
  ],
  conditions: 'Paiement à 30 jours à compter de la date de facturation.',
  notes: 'Devis valable pour une durée de 30 jours. Les travaux pourront commencer 2 semaines après acceptation du devis.'
};

export default function DetailDevis({ params }: { params: { id: string } }) {
  const [devis, setDevis] = useState(devisData);
  const router = useRouter();

  useEffect(() => {
    const loadDevis = async () => {
      const id = parseInt(params.id);
      // Simulation d'un chargement de données
      if (id) {
        // Dans un cas réel, vous feriez un appel API ici
        setDevis({
          ...devisData,
          id: id,
          numero: `D-2023-${id.toString().padStart(3, '0')}`
        });
      }
    };

    loadDevis();
  }, [params.id]);

  // Calcul du total
  const total = devis.lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire);
  }, 0);

  // Fonction pour convertir le devis en facture
  const handleConvertToInvoice = () => {
    if (window.confirm('Êtes-vous sûr de vouloir convertir ce devis en facture ?')) {
      alert('Devis converti en facture avec succès !');
      router.push('/factures');
    }
  };

  // Fonction pour télécharger le devis
  const handleDownload = () => {
    alert('Téléchargement du devis en PDF...');
  };

  // Fonction pour envoyer le devis par email
  const handleSendEmail = () => {
    alert('Envoi du devis par email...');
  };

  // Fonction pour imprimer le devis
  const handlePrint = () => {
    window.print();
  };

  // Fonction pour supprimer le devis
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      alert('Devis supprimé avec succès !');
      router.push('/devis');
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/devis" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Retour aux devis
        </Link>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/devis" className="mr-4 text-blue-600 hover:text-blue-800">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Devis {devis.numero}</h1>
            <p className="text-gray-600">Créé le {devis.date} - Valide jusqu&apos;au {devis.validite}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" /> Imprimer
          </button>
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaDownload className="mr-2" /> PDF
          </button>
          <button 
            onClick={handleSendEmail}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEnvelope className="mr-2" /> Email
          </button>
          <Link 
            href={`/devis/${params.id}/modifier`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" /> Modifier
          </Link>
          {devis.statut === 'Accepté' && (
            <button 
              onClick={handleConvertToInvoice}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaExchangeAlt className="mr-2" /> Convertir
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaTrash className="mr-2" /> Supprimer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:hidden">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold mb-2">Client</h2>
            <p className="font-medium">{devis.client.nom}</p>
            <p>{devis.client.adresse}</p>
            <p>{devis.client.codePostal} {devis.client.ville}</p>
            <p>Email: {devis.client.email}</p>
            <p>Tél: {devis.client.telephone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold mb-2">Statut</h2>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${devis.statutColor}`}>
              {devis.statut}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Prestations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unité
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire (€)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (€)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devis.lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-normal">
                      {ligne.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ligne.quantite}
                    </td>
                    <td className="px-4 py-3">
                      {ligne.unite}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ligne.prixUnitaire.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {ligne.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">Total:</td>
                  <td className="px-4 py-3 text-right font-bold">{total.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Conditions de paiement</h2>
            <p className="text-gray-700">{devis.conditions}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Notes</h2>
            <p className="text-gray-700">{devis.notes}</p>
          </div>
        </div>
      </div>
      
      {/* Section visible uniquement à l'impression */}
      <div className="hidden print:block print:mb-8">
        <EnteteDocument title="Devis" subtitle={`Référence: ${devis.numero} - Créé le ${devis.date}`} />
        
        {/* Contenu d'impression du devis */}
        <div className="mt-8">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2">Client</h2>
              <p className="font-medium">{devis.client.nom}</p>
              <p>{devis.client.adresse}</p>
              <p>{devis.client.codePostal} {devis.client.ville}</p>
              <p>Email: {devis.client.email}</p>
              <p>Tél: {devis.client.telephone}</p>
            </div>
          </div>
          
          {/* Reste du contenu pour l'impression */}
        </div>
      </div>
    </>
  );
} 