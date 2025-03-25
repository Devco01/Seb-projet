"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBuilding, FaEuroSign, FaSave, FaImage, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Parametres() {
  // États pour les différents paramètres
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");
  const [paymentDelay, setPaymentDelay] = useState("30");
  const [prefixeDevis, setPrefixeDevis] = useState("D-");
  const [prefixeFacture, setPrefixeFacture] = useState("F-");
  const [logoUrl, setLogoUrl] = useState("/img/logo-placeholder.png");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres au chargement de la page
  useEffect(() => {
    const fetchParametres = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Chargement des paramètres...');
        const response = await fetch('/api/parametres');
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Aucun paramètre trouvé, utilisation des valeurs par défaut');
            setIsLoading(false);
            return;
          }
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Paramètres chargés avec succès:', data);
        
        setCompanyName(data.companyName || "");
        setAddress(data.address || "");
        setZipCode(data.zipCode || "");
        setCity(data.city || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setSiret(data.siret || "");
        
        // Extraction du délai de paiement
        if (data.paymentDelay) {
          setPaymentDelay(String(data.paymentDelay));
        }
        
        // Préfixes
        setPrefixeDevis(data.prefixeDevis || "D-");
        setPrefixeFacture(data.prefixeFacture || "F-");
        
        // Mettre à jour le logo s'il existe
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        setError(errorMessage);
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParametres();
  }, []);

  // Fonction de sauvegarde des paramètres
  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Création du FormData pour envoyer les données et le logo
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("address", address);
      formData.append("zipCode", zipCode);
      formData.append("city", city);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("siret", siret);
      formData.append("paymentDelay", paymentDelay);
      formData.append("prefixeDevis", prefixeDevis);
      formData.append("prefixeFacture", prefixeFacture);
      formData.append("conditionsPaiement", `Paiement à ${paymentDelay} jours`);

      const response = await fetch('/api/parametres', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(`Paramètres de ${section} sauvegardés avec succès!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la sauvegarde des paramètres");
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour uploader un logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image");
      return;
    }

    setIsUploading(true);
    
    try {
      // Création du FormData pour envoyer le logo
      const formData = new FormData();
      formData.append("logo", file);
      
      // Ajouter les autres paramètres pour éviter de les perdre
      formData.append("companyName", companyName);
      formData.append("address", address);
      formData.append("zipCode", zipCode);
      formData.append("city", city);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("siret", siret);
      formData.append("paymentDelay", paymentDelay);
      formData.append("prefixeDevis", prefixeDevis);
      formData.append("prefixeFacture", prefixeFacture);
      formData.append("conditionsPaiement", `Paiement à ${paymentDelay} jours`);
      
      // Envoyer l'image au serveur
      const response = await fetch('/api/parametres', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl.startsWith('/uploads/') ? data.logoUrl : `/uploads/${data.logoUrl}`);
          toast.success("Logo mis à jour avec succès!");
        } else {
          toast.error("Erreur: le logo n'a pas été mis à jour");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la mise à jour du logo");
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de l'upload du logo");
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour supprimer le logo
  const handleDeleteLogo = async () => {
    try {
      const response = await fetch('/api/parametres/logo', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLogoUrl("/img/logo-placeholder.png");
        toast.success("Logo supprimé avec succès!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la suppression du logo");
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la suppression du logo");
    }
  };

  // Afficher un état de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si nécessaire
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur de chargement</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
              placeholder="Entrez le nom de votre entreprise"
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
              placeholder="Adresse complète"
            />
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Code postal
            </label>
            <input
              type="text"
              id="zipCode"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Code postal"
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              id="city"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville"
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
              placeholder="Numéro de téléphone"
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
              placeholder="Adresse email"
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
              placeholder="Numéro SIRET"
            />
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center">
          <div className="mb-4 sm:mb-0 sm:mr-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de l&apos;entreprise
            </label>
            <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
              {isUploading ? (
                <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
              ) : logoUrl ? (
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
            <div className="flex gap-2">
              <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center">
                <FaUpload className="mr-2" />
                Choisir un fichier
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </label>
              {logoUrl !== "/img/logo-placeholder.png" && (
                <button
                  onClick={handleDeleteLogo}
                  className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 inline-flex items-center"
                >
                  <FaImage className="mr-2" />
                  Supprimer le logo
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Format recommandé: PNG ou JPEG, max 2MB</p>
            <p className="text-xs text-gray-600 mt-2">
              Le logo apparaîtra sur vos devis et factures.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSave('entreprise')}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
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
            <label htmlFor="prefixeFacture" className="block text-sm font-medium text-gray-700 mb-1">
              Préfixe des factures
            </label>
            <input
              type="text"
              id="prefixeFacture"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={prefixeFacture}
              onChange={(e) => setPrefixeFacture(e.target.value)}
              placeholder="Préfixe des factures (ex: F-)"
            />
          </div>
          
          <div>
            <label htmlFor="prefixeDevis" className="block text-sm font-medium text-gray-700 mb-1">
              Préfixe des devis
            </label>
            <input
              type="text"
              id="prefixeDevis"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={prefixeDevis}
              onChange={(e) => setPrefixeDevis(e.target.value)}
              placeholder="Préfixe des devis (ex: D-)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions de paiement par défaut
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              defaultValue={`Paiement à ${paymentDelay} jours. Tout retard de paiement entraîne des pénalités calculées au taux d'intérêt légal en vigueur.`}
            ></textarea>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSave('facturation')}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}