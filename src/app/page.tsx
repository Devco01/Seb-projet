"use client";

import Link from 'next/link';
import { FaFileInvoiceDollar, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { MainLayout } from './components/Layout/MainLayout';
import { Button } from './components/ui/Button';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simplifiez votre facturation avec FacturePro
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Solution professionnelle de facturation et gestion pour auto-entrepreneurs, conforme aux normes françaises.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Accéder au tableau de bord
                </Button>
              </Link>
              <Link href="/factures/nouveau">
                <Button variant="outline" size="lg">
                  Créer une facture
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-blue-50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaFileInvoiceDollar className="text-blue-500 w-32 h-32 opacity-20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-6 w-64 transform rotate-6">
                  <div className="border-b pb-2 mb-2">
                    <div className="text-sm text-gray-500">Facture</div>
                    <div className="text-lg font-bold">#FA-2024-0001</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total HT:</span>
                      <span>850,00 €</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total TTC:</span>
                      <span>850,00 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Fonctionnalités adaptées aux auto-entrepreneurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-slate-50 rounded-lg">
            <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg">
              <FaFileInvoiceDollar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Facturation conforme</h3>
            <p className="text-gray-600">
              Créez des factures et devis conformes aux normes légales françaises pour auto-entrepreneurs.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg">
            <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestion clients</h3>
            <p className="text-gray-600">
              Gérez votre portefeuille clients et accédez facilement à leur historique.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg">
            <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg">
              <FaMoneyBillWave className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi des paiements</h3>
            <p className="text-gray-600">
              Suivez les paiements reçus et les factures en attente ou en retard.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg">
            <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg">
              <FaChartLine className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tableau de bord</h3>
            <p className="text-gray-600">
              Visualisez vos performances commerciales et vos indicateurs clés.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Compliance Section */}
      <section className="py-12">
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Conformité légale garantie</h2>
          <p className="mb-4">
            FacturePro vous assure la création de documents conformes aux obligations légales françaises pour les auto-entrepreneurs :
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Mentions légales obligatoires sur toutes les factures</li>
            <li>Numérotation chronologique des factures</li>
            <li>Affichage du numéro SIRET</li>
            <li>Conditions de paiement et pénalités de retard</li>
          </ul>
          <p className="text-sm text-blue-700">
            Préparez-vous à la facturation électronique obligatoire avec notre solution.
          </p>
        </div>
      </section>
    </MainLayout>
  );
} 