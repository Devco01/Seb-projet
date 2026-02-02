'use client';

import { useState, useEffect, use } from 'react';
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaFileContract, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Devis {
  id: number;
  numero: string;
  date: string;
  totalTTC: number;
  statut: string;
}

interface Facture {
  id: number;
  numero: string;
  date: string;
  totalTTC: number;
  statut: string;
}

interface ClientData {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string | null;
  notes: string | null;
  siret: string | null;
  tva: string | null;
  createdAt: string;
  updatedAt: string;
  devis?: Devis[];
  factures?: Facture[];
}

export default function ClientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Effet pour charger les données du client basé sur l'ID
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Client non trouvé");
          }
          throw new Error(`Erreur lors de la récupération du client: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Client récupéré:', data);
        console.log('Nombre de devis reçus:', data.devis?.length || 0);
        console.log('Nombre de factures reçues:', data.factures?.length || 0);
        console.log('Devis data:', data.devis);
        console.log('Factures data:', data.factures);
        
        // Adapter les données pour correspondre à notre interface
        const clientData: ClientData = {
          ...data,
          devis: data.devis || [],
          factures: data.factures || [],
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString()
        };
        
        setClient(clientData);
      } catch (err) {
        console.error("Erreur lors du chargement du client:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  // Fonction pour supprimer le client
  const handleDelete = async () => {
    if (!client) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${client.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression du client: ${response.status}`);
        }
        
        alert("Client supprimé avec succès");
        router.push("/clients");
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
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

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/clients" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Retour à la liste des clients
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error || !client) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/clients" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Retour à la liste des clients
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500">{error || "Client non trouvé"}</p>
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
            <span className="ml-4 text-gray-500">Client depuis le {new Date(client.createdAt).toLocaleDateString('fr-FR')}</span>
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
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Téléphone</p>
                <p className="font-medium">{client.telephone || 'N/A'}</p>
              </div>
              {client.siret && (
                <div>
                  <p className="text-gray-600">SIRET</p>
                  <p className="font-medium">{client.siret}</p>
                </div>
              )}
              {client.tva && (
                <div>
                  <p className="text-gray-600">TVA</p>
                  <p className="font-medium">{client.tva}</p>
                </div>
              )}
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
            <p>{client.notes || 'Aucune note'}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nombre de devis</p>
                <p className="font-medium">{client.devis?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Nombre de factures</p>
                <p className="font-medium">{client.factures?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {(client.devis && client.devis.length > 0) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Devis récents</h2>
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
                      <td className="py-2 px-4">{new Date(devis.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-4">{devis.totalTTC.toLocaleString('fr-FR')} €</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          devis.statut === 'Accepté' ? 'bg-green-100 text-green-800' :
                          devis.statut === 'Refusé' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {devis.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:underline">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(client.factures && client.factures.length > 0) && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Factures récentes</h2>
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
                      <td className="py-2 px-4">{new Date(facture.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-4">{facture.totalTTC.toLocaleString('fr-FR')} €</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          facture.statut === 'Payée' ? 'bg-green-100 text-green-800' :
                          facture.statut === 'Annulée' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {facture.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:underline">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 