'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaFileContract, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Devis {
  id: number;
  numero: string;
  date: string;
  montant: number;
  statut: string;
}

interface Facture {
  id: number;
  numero: string;
  date: string;
  montant: number;
  statut: string;
}

interface ClientData {
  id: number;
  nom: string;
  contact: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  dateCreation: string;
  notes: string;
  devis: Devis[];
  factures: Facture[];
}

// Données fictives pour un client
const clientData: ClientData = {
  id: 1,
  nom: "Entreprise ABC",
  contact: "Jean Dupont",
  email: "contact@entrepriseabc.fr",
  telephone: "01 23 45 67 89",
  adresse: "123 rue de la Paix",
  codePostal: "75000",
  ville: "Paris",
  pays: "France",
  dateCreation: "2023-01-15",
  notes: "Client fidèle depuis 2023. Préfère être contacté par email.",
  devis: [
    { id: 101, numero: "DEV-2023-0001", date: "2023-05-10", montant: 1200, statut: "Accepté" },
    { id: 102, numero: "DEV-2023-0008", date: "2023-07-22", montant: 850, statut: "En attente" },
    { id: 103, numero: "DEV-2023-0012", date: "2023-09-05", montant: 2300, statut: "Refusé" }
  ],
  factures: [
    { id: 201, numero: "FACT-2023-0001", date: "2023-05-15", montant: 1200, statut: "Payée" },
    { id: 202, numero: "FACT-2023-0010", date: "2023-08-01", montant: 1500, statut: "En attente" }
  ]
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<ClientData | null>(clientData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Effet pour charger les données du client basé sur l'ID
  useEffect(() => {
    // Cette fonction sera utilisée pour charger les vraies données depuis l'API
    // Pour l'instant, nous utilisons des données fictives
    console.log(`Chargement du client avec ID: ${params.id}`);
    
    const fetchClient = async () => {
      try {
        setLoading(true);
        // Simulation d'un appel API
        // Dans une vraie implémentation, nous ferions un fetch ici
        setTimeout(() => {
          // Nous réutilisons les données fictives mais avec l'ID du paramètre
          setClient({
            ...clientData,
            id: parseInt(params.id)
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erreur lors du chargement du client:", error);
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  // Fonction pour supprimer le client
  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      setLoading(true);
      // Simulation d'une suppression
      setTimeout(() => {
        setLoading(false);
        alert("Client supprimé avec succès");
        router.push("/clients");
      }, 1000);
    }
  };

  // Fonction pour créer un nouveau devis
  const handleCreateDevis = () => {
    router.push(`/devis/nouveau?clientId=${client?.id}`);
  };

  // Fonction pour créer une nouvelle facture
  const handleCreateFacture = () => {
    router.push(`/factures/nouveau?clientId=${client?.id}`);
  };

  if (!client) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/clients" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Retour à la liste des clients
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Client non trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/clients" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Retour à la liste des clients
        </Link>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/clients" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
              <FaArrowLeft className="mr-2" /> Retour à la liste
            </Link>
            <h1 className="text-2xl font-bold">{client.nom}</h1>
            <span className="ml-4 text-gray-500">Client depuis le {new Date(client.dateCreation).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateDevis}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
            >
              <FaFileContract className="mr-2" /> Nouveau devis
            </button>
            <button
              onClick={handleCreateFacture}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
            >
              <FaFileInvoiceDollar className="mr-2" /> Nouvelle facture
            </button>
            <Link
              href={`/clients/${client.id}/modifier`}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-yellow-700"
            >
              <FaEdit className="mr-2" /> Modifier
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 disabled:bg-red-400"
            >
              <FaTrash className="mr-2" /> Supprimer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Contact</p>
                <p className="font-medium">{client.contact}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Téléphone</p>
                <p className="font-medium">{client.telephone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            <p>{client.adresse}</p>
            <p>{client.codePostal} {client.ville}</p>
            <p>{client.pays}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p>{client.notes}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nombre de devis</p>
                <p className="font-medium">{client.devis.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Nombre de factures</p>
                <p className="font-medium">{client.factures.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Devis récents</h2>
          {client.devis.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Numéro</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Montant</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.devis.map((devis: Devis) => (
                    <tr key={devis.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{devis.numero}</td>
                      <td className="py-2 px-4">{new Date(devis.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{devis.montant.toLocaleString()} €</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          devis.statut === 'Accepté' ? 'bg-green-100 text-green-800' :
                          devis.statut === 'Refusé' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {devis.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-800">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucun devis pour ce client.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Factures récentes</h2>
          {client.factures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Numéro</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Montant</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.factures.map((facture: Facture) => (
                    <tr key={facture.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{facture.numero}</td>
                      <td className="py-2 px-4">{new Date(facture.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{facture.montant.toLocaleString()} €</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          facture.statut === 'Payée' ? 'bg-green-100 text-green-800' :
                          facture.statut === 'En retard' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {facture.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-800">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucune facture pour ce client.</p>
          )}
        </div>
      </div>
    </>
  );
} 