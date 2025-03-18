"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  FaUsers, 
  FaUserPlus, 
  FaSearch, 
  FaFileInvoiceDollar,
  FaFileAlt,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";

export default function Clients() {
  // Données clients fictives pour la démo (statiques)
  const clientsData = [
    { 
      id: 1, 
      nom: "Dupont Immobilier", 
      contact: "Jean Dupont", 
      email: "contact@dupontimmo.fr", 
      telephone: "01 23 45 67 89", 
      adresse: "12 rue des Lilas, 75001 Paris",
      nbDevis: 5,
      nbFactures: 3,
      dateCreation: "15/01/2024"
    },
    { 
      id: 2, 
      nom: "Martin Résidences", 
      contact: "Sophie Martin", 
      email: "s.martin@residences.fr", 
      telephone: "06 12 34 56 78", 
      adresse: "8 avenue Victor Hugo, 69002 Lyon",
      nbDevis: 2,
      nbFactures: 2,
      dateCreation: "03/02/2024"
    },
    { 
      id: 3, 
      nom: "Dubois & Fils", 
      contact: "Pierre Dubois", 
      email: "p.dubois@duboisetfils.fr", 
      telephone: "04 56 78 90 12", 
      adresse: "45 rue du Commerce, 33000 Bordeaux",
      nbDevis: 3,
      nbFactures: 1,
      dateCreation: "22/02/2024"
    },
    { 
      id: 4, 
      nom: "Lepetit SCI", 
      contact: "Marie Lepetit", 
      email: "contact@lepetitsci.fr", 
      telephone: "07 89 01 23 45", 
      adresse: "5 place de la République, 31000 Toulouse",
      nbDevis: 1,
      nbFactures: 0,
      dateCreation: "10/03/2024"
    },
    { 
      id: 5, 
      nom: "Moreau Construction", 
      contact: "Philippe Moreau", 
      email: "p.moreau@construction.fr", 
      telephone: "09 87 65 43 21", 
      adresse: "24 boulevard Haussmann, 75009 Paris",
      nbDevis: 2,
      nbFactures: 2,
      dateCreation: "28/02/2024"
    }
  ];

  // États pour la recherche et le tri
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(clientsData);

  // Fonction de recherche
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === "") {
      setClients(clientsData);
    } else {
      const filteredClients = clientsData.filter(client => 
        client.nom.toLowerCase().includes(value) || 
        client.contact.toLowerCase().includes(value) || 
        client.email.toLowerCase().includes(value) ||
        client.adresse.toLowerCase().includes(value)
      );
      setClients(filteredClients);
    }
  };

  // Statut du client basé sur le nombre de factures et devis
  const getClientStatus = (client) => {
    if (client.nbFactures > 0) {
      return "text-green-600";
    } else if (client.nbDevis > 0) {
      return "text-amber-600";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Clients</h2>
          <p className="text-gray-500">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Link 
          href="/clients/nouveau/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center mt-4 sm:mt-0"
        >
          <FaUserPlus className="mr-2" />
          Nouveau client
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Statistiques des clients */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total clients</p>
              <p className="text-2xl font-bold text-gray-800">{clientsData.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Devis créés</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientsData.reduce((sum, client) => sum + client.nbDevis, 0)}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <FaFileAlt className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Factures émises</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientsData.reduce((sum, client) => sum + client.nbFactures, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaFileInvoiceDollar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des clients - Version mobile (cartes) */}
      <div className="sm:hidden space-y-4">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <Link href={`/clients/${client.id}`} className="block">
                  <h3 className={`font-medium text-lg ${getClientStatus(client)}`}>{client.nom}</h3>
                </Link>
              </div>
              
              <div className="mt-2">
                <p className="text-gray-700 font-medium">{client.contact}</p>
                <div className="mt-1 space-y-1 text-sm">
                  <div className="flex items-center text-gray-500">
                    <FaEnvelope className="mr-2 h-3 w-3" />
                    <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaPhone className="mr-2 h-3 w-3" />
                    <a href={`tel:${client.telephone}`}>{client.telephone}</a>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-2 h-3 w-3" />
                    <span>{client.adresse}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaCalendarAlt className="mr-2 h-3 w-3" />
                    <span>Créé le {client.dateCreation}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Link href={`/clients/${client.id}`} className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <FaEye title="Voir le détail" />
                  </Link>
                  <Link 
                    href={`/devis/nouveau?client=${client.id}`} 
                    className="bg-amber-100 text-amber-600 p-2 rounded-full"
                  >
                    <FaFileAlt title="Créer un devis" />
                  </Link>
                  <Link 
                    href={`/factures/nouveau?client=${client.id}`} 
                    className="bg-green-100 text-green-600 p-2 rounded-full"
                  >
                    <FaFileInvoiceDollar title="Créer une facture" />
                  </Link>
                  <button 
                    className="bg-red-100 text-red-600 p-2 rounded-full"
                    onClick={() => alert(`Supprimer le client ${client.nom}`)}
                  >
                    <FaTrashAlt title="Supprimer" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <FaUsers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium">Aucun client trouvé</p>
            <p className="mt-1">Ajoutez un nouveau client ou modifiez votre recherche.</p>
          </div>
        )}
      </div>

      {/* Liste des clients - Version desktop (table) */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Devis / Factures
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/clients/${client.id}`} className="block">
                      <div className="font-medium text-gray-900">{client.nom}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{client.contact}</div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <FaEnvelope className="mr-1 h-3 w-3" />
                      <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <FaPhone className="mr-1 h-3 w-3" />
                      <a href={`tel:${client.telephone}`}>{client.telephone}</a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {client.adresse}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="flex items-center text-amber-600">
                        <FaFileAlt className="mr-1" />
                        <span>{client.nbDevis} devis</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <FaFileInvoiceDollar className="mr-1" />
                        <span>{client.nbFactures} factures</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.dateCreation}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir le détail" />
                      </Link>
                      <Link href={`/devis/nouveau?client=${client.id}`} className="text-amber-600 hover:text-amber-900">
                        <FaFileAlt title="Créer un devis" />
                      </Link>
                      <Link href={`/factures/nouveau?client=${client.id}`} className="text-green-600 hover:text-green-900">
                        <FaFileInvoiceDollar title="Créer une facture" />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => alert(`Supprimer le client ${client.nom}`)}
                      >
                        <FaTrashAlt title="Supprimer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <FaUsers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium">Aucun client trouvé</p>
                  <p className="mt-1">Ajoutez un nouveau client ou modifiez votre recherche.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 