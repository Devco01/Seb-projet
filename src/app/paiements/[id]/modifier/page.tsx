"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function ModifierPaiementPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du paiement...</p>
        </div>
      </div>
    }>
      <ModifierPaiementForm id={params.id} />
    </Suspense>
  );
}

interface Facture {
  id: number;
  numero: string;
  totalTTC: number;
  resteAPayer?: number;
  clientId: number;
}

interface Client {
  id: number;
  nom: string;
  email?: string;
}

function ModifierPaiementForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [factureId, setFactureId] = useState('');
  const [clientId, setClientId] = useState('');
  const [montant, setMontant] = useState('');
  const [datePaiement, setDatePaiement] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  
  const [factures, setFactures] = useState<Facture[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);

  // Chargement des données du paiement
  useEffect(() => {
    const fetchPaiement = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/paiements/${id}`);
        
        if (!response.ok) {
          throw new Error('Impossible de charger les données du paiement');
        }
        
        const data = await response.json();
        
        setFactureId(data.factureId.toString());
        setClientId(data.clientId.toString());
        setMontant(data.montant.toString());
        setDatePaiement(new Date(data.date).toISOString().split('T')[0]);
        setModePaiement(data.methode);
        setReference(data.reference || '');
        setNotes(data.notes || '');
      } catch (error) {
        console.error('Erreur lors du chargement du paiement:', error);
        toast.error('Erreur lors du chargement du paiement');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFactures = async () => {
      try {
        const response = await fetch('/api/factures');
        if (response.ok) {
          const data = await response.json();
          setFactures(data);
        } else {
          console.error('Erreur lors du chargement des factures');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error('Erreur lors du chargement des clients');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchPaiement();
    fetchFactures();
    fetchClients();
  }, [id]);

  // Mise à jour du client sélectionné lorsque la facture change
  useEffect(() => {
    if (factureId && factures.length > 0) {
      const facture = factures.find(f => f.id.toString() === factureId);
      setSelectedFacture(facture || null);
      
      if (facture) {
        setClientId(facture.clientId.toString());
      }
    }
  }, [factureId, factures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const paiement = {
        factureId: parseInt(factureId),
        clientId: parseInt(clientId),
        date: datePaiement,
        montant: parseFloat(montant),
        methode: modePaiement,
        reference,
        notes,
      };

      const response = await fetch(`/api/paiements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiement),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification du paiement');
      }

      toast.success('Paiement modifié avec succès !');
      router.push(`/paiements/${id}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Modifier le paiement</h1>
        <Link href={`/paiements/${id}`} className="text-blue-600 hover:text-blue-800">
          <FaTimes className="inline mr-1" />
          Annuler
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="factureId">
                Facture
              </label>
              <select
                id="factureId"
                name="factureId"
                value={factureId}
                onChange={(e) => setFactureId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une facture</option>
                {factures.map((facture) => (
                  <option key={facture.id} value={facture.id.toString()}>
                    {facture.numero} - {facture.totalTTC.toFixed(2)} €
                  </option>
                ))}
              </select>
              
              {selectedFacture && (
                <div className="mt-2 text-sm text-gray-600">
                  Reste à payer: {(selectedFacture.resteAPayer || selectedFacture.totalTTC).toFixed(2)} €
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="clientId">
                Client
              </label>
              <select
                id="clientId"
                name="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id.toString()}>
                    {client.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="montant">
                Montant (€)
              </label>
              <input
                type="number"
                id="montant"
                name="montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                step="0.01"
                min="0"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="datePaiement">
                Date de paiement
              </label>
              <input
                type="date"
                id="datePaiement"
                name="datePaiement"
                value={datePaiement}
                onChange={(e) => setDatePaiement(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="modePaiement">
                Mode de paiement
              </label>
              <select
                id="modePaiement"
                name="modePaiement"
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un mode de paiement</option>
                <option value="Virement">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte">Carte bancaire</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="reference">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 