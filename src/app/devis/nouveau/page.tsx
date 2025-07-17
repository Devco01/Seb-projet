'use client';

import { useState, useEffect, Suspense } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import EnteteDocument from '@/app/components/EnteteDocument';

interface LigneDevis {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

type Client = {
  id: number;
  nom: string;
  email?: string;
};

// Composant qui utilise useSearchParams
function DevisFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devisId = searchParams?.get('id');
  
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validite, setValidite] = useState('');
  const [lignes, setLignes] = useState<LigneDevis[]>([
    { description: '', quantite: 1, prixUnitaire: 0, total: 0 }
  ]);
  const [conditions, setConditions] = useState('Ce devis est valable 30 jours à compter de sa date d\'émission.');
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDevis, setIsLoadingDevis] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageTitle, setPageTitle] = useState('Nouveau devis');
  const [isModification, setIsModification] = useState(false);

  // Récupérer les clients depuis l'API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          console.error('Les données clients reçues ne sont pas un tableau:', data);
          setClients([]);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  // Calcul de la date de validité par défaut (30 jours après la date actuelle)
  useEffect(() => {
    if (!validite) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + 30);
      setValidite(dateObj.toISOString().split('T')[0]);
    }
  }, [validite]);

  // Charger les données du devis si un ID est fourni
  useEffect(() => {
    if (devisId) {
      setIsLoadingDevis(true);
      setIsModification(true);
      setPageTitle('Modifier devis');
      
      const fetchDevis = async () => {
        try {
          const response = await fetch(`/api/devis/${devisId}`);
          if (!response.ok) {
            throw new Error(`Erreur lors du chargement du devis: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Devis chargé:', data);
          
          // Formatage des dates
          const formatDateForInput = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          
          // Mise à jour des états avec les données du devis
          setClientId(data.clientId?.toString() || '');
          setDate(formatDateForInput(data.date));
          setValidite(formatDateForInput(data.validite));
          
          if (data.conditions) {
            setConditions(data.conditions);
          }
          
          if (data.notes) {
            setNotes(data.notes);
          }
          
          // Traitement des lignes
          let lignesData = [];
          if (data.lignes) {
            // Si les lignes sont stockées en format JSON string, les parser
            if (typeof data.lignes === 'string') {
              try {
                lignesData = JSON.parse(data.lignes);
              } catch (e) {
                console.error('Erreur lors du parsing des lignes du devis:', e);
                lignesData = [];
              }
            } else if (Array.isArray(data.lignes)) {
              lignesData = data.lignes;
            }
            
            if (lignesData.length > 0) {
              const formattedLignes = lignesData.map((ligne: {
                description?: string;
                quantite?: number;
                prixUnitaire?: number;
                unite?: string;
              }) => {
                const quantite = ligne.quantite || 0;
                const prixUnitaire = ligne.prixUnitaire || 0;
                
                return {
                  description: ligne.description || '',
                  quantite: quantite,
                  prixUnitaire: prixUnitaire,
                  total: Number((quantite * prixUnitaire).toFixed(2))
                };
              });
              
              setLignes(formattedLignes);
            }
          }
          
        } catch (err) {
          console.error('Erreur lors du chargement du devis:', err);
          setError(`Impossible de charger le devis: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        } finally {
          setIsLoadingDevis(false);
        }
      };
      
      fetchDevis();
    }
  }, [devisId]);

  // Fonction pour gérer les changements dans les lignes de devis
  const handleLigneChange = (index: number, field: keyof LigneDevis, value: string | number) => {
    const newLignes = [...lignes];
    
    if (field === 'quantite' || field === 'prixUnitaire') {
      // Convertir en nombre
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newLignes[index][field] = numValue;
      
      // Calculer le total
      newLignes[index].total = newLignes[index].quantite * newLignes[index].prixUnitaire;
    } else {
      // Pour les autres champs (comme description)
      newLignes[index][field] = value as never;
    }
    
    setLignes(newLignes);
  };

  // Fonction pour ajouter une ligne au devis
  const handleAjouterLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, total: 0 }]);
  };

  // Fonction pour supprimer une ligne du devis
  const handleSupprimerLigne = (index: number) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter((_, i) => i !== index));
    }
  };

  // Modifier la fonction handleSubmit pour gérer à la fois la création et la modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Vérification des données
    if (!clientId) {
      setError('Veuillez sélectionner un client');
      setIsLoading(false);
      return;
    }

    // Vérifier que les lignes ont des descriptions
    if (lignes.some(ligne => !ligne.description.trim())) {
      setError('Veuillez remplir la description de toutes les lignes');
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données du devis
      const devisData = {
        clientId: parseInt(clientId),
        date,
        validite,
        lignes: lignes,
        conditions,
        notes,
        statut: isModification ? undefined : 'En attente' // Ne pas changer le statut si c'est une modification
      };

      // URL et méthode selon si c'est une création ou une modification
      const url = isModification ? `/api/devis/${devisId}` : '/api/devis';
      const method = isModification ? 'PUT' : 'POST';

      // Envoyer les données au serveur
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur lors de ${isModification ? 'la modification' : 'la création'} du devis`);
      }

      const data = await response.json();
      setSuccessMessage(`Devis ${isModification ? 'modifié' : 'créé'} avec succès!`);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push(`/devis/${data.id || devisId}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un état de chargement
  if (isLoadingDevis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Chargement du devis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto min-h-screen overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-600">{isModification ? 'Modifiez les détails du devis' : 'Créez un nouveau devis pour un client'}</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link
            href="/devis"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div className="print:hidden">
        {/* Message d'aide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">💡 Comment créer votre devis</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sélectionnez votre client dans la liste déroulante</li>
            <li>• Ajoutez autant de lignes que nécessaire avec le bouton "Ajouter une ligne"</li>
            <li>• Chaque ligne peut contenir une description, quantité et prix unitaire</li>
            <li>• Le total se calcule automatiquement</li>
            <li>• Vous pouvez ajouter des conditions et des notes en bas du formulaire</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="client">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                id="client"
                name="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un client</option>
                {Array.isArray(clients) ? 
                  clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  )) : 
                  <option value="" disabled>Erreur lors du chargement des clients</option>
                }
              </select>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
                    Date du devis
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="validite">
                    Date de validité
                  </label>
                  <input
                    type="date"
                    id="validite"
                    name="validite"
                    value={validite}
                    onChange={(e) => setValidite(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 border-b pb-2">Lignes du devis</h2>
          
          {lignes.map((ligne, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-4 items-center">
              <div className="col-span-5">
                <label className={`block text-gray-700 text-sm mb-1 ${index === 0 ? 'font-medium' : 'sr-only'}`}>
                  Description
                </label>
                <input
                  type="text"
                  value={ligne.description}
                  onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description du service ou produit"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className={`block text-gray-700 text-sm mb-1 ${index === 0 ? 'font-medium' : 'sr-only'}`}>
                  Quantité
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={ligne.quantite}
                  onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className={`block text-gray-700 text-sm mb-1 ${index === 0 ? 'font-medium' : 'sr-only'}`}>
                  Prix unitaire (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ligne.prixUnitaire}
                  onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className={`block text-gray-700 text-sm mb-1 ${index === 0 ? 'font-medium' : 'sr-only'}`}>
                  Total (€)
                </label>
                <input
                  type="number"
                  value={ligne.total}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>
              <div className="col-span-1 flex items-center justify-center space-x-1">
                {index === 0 && (
                  <div className="w-full text-center mb-1">
                    <label className="block text-gray-700 text-sm font-medium">
                      Actions
                    </label>
                  </div>
                )}
                <div className={`flex space-x-1 ${index === 0 ? 'mt-1' : ''}`}>
                  <button
                    type="button"
                    onClick={handleAjouterLigne}
                    className="text-blue-500 p-2 rounded-full hover:bg-blue-100"
                    title="Ajouter une ligne après celle-ci"
                  >
                    <FaPlus />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSupprimerLigne(index)}
                    className={`text-red-500 p-2 rounded-full hover:bg-red-100 ${lignes.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={lignes.length === 1}
                    title={lignes.length === 1 ? 'Impossible de supprimer la dernière ligne' : 'Supprimer cette ligne'}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAjouterLigne}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center font-medium shadow-md transition-colors"
            >
              <FaPlus className="mr-2" /> Ajouter une ligne
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Vous pouvez ajouter autant de lignes que nécessaire pour votre devis
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between mb-6">
            <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="conditions">
                  Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 md:pl-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Récapitulatif</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Nombre de lignes:</span>
                    <span className="font-medium text-blue-600">{lignes.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total des quantités:</span>
                    <span>{lignes.reduce((sum, ligne) => sum + ligne.quantite, 0)}</span>
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">{lignes.reduce((sum, ligne) => sum + ligne.total, 0).toFixed(2)} €</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Cliquez sur "Ajouter une ligne" pour plus d'entrées
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
              Enregistrer le devis
            </button>
          </div>
        </form>
      </div>

      {/* Section d'aperçu pour l'impression */}
      <div className="hidden print:block mt-8">
        <EnteteDocument title="Devis" subtitle={`Devis créé le ${date}`} />
        
        {/* Contenu pour l'impression */}
        <div className="mt-6">
          {clientId && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Client</h2>
              <p>{clients.find(c => c.id.toString() === clientId)?.nom}</p>
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="font-bold mb-2">Détails du devis</h2>
            <p>Date: {date}</p>
            <p>Validité: {validite}</p>
          </div>
          
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Quantité</th>
                <th className="text-right pb-2">Prix unitaire</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{ligne.description}</td>
                  <td className="text-right py-2">{ligne.quantite}</td>
                  <td className="text-right py-2">{ligne.prixUnitaire.toFixed(2)} €</td>
                  <td className="text-right py-2">{ligne.total.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right pt-2 font-bold">Total:</td>
                <td className="text-right pt-2 font-bold">
                  {lignes.reduce((sum, ligne) => sum + ligne.total, 0).toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>
          
          {conditions && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Conditions</h2>
              <p>{conditions}</p>
            </div>
          )}
          
          {notes && (
            <div>
              <h2 className="font-bold mb-2">Notes</h2>
              <p>{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant de chargement pour le Suspense
function DevisLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-600">Chargement du formulaire de devis...</p>
    </div>
  );
}

// Composant principal enveloppé dans Suspense
export default function NouveauDevis() {
  return (
    <Suspense fallback={<DevisLoading />}>
      <DevisFormContent />
    </Suspense>
  );
} 