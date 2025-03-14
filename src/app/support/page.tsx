"use client";

import Layout from '../components/Layout';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaQuestionCircle, FaBook, FaVideo, FaFileAlt, FaComments } from 'react-icons/fa';
import { ChangeEvent, FormEvent } from 'react';

export default function Support() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleContactFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique d'envoi du formulaire de contact
    alert('Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  // FAQ
  const faqs = [
    {
      question: "Comment créer mon premier devis ?",
      answer: "Pour créer votre premier devis, cliquez sur 'Devis' dans le menu principal, puis sur le bouton 'Nouveau devis'. Remplissez les informations du client, ajoutez les prestations et les montants, puis enregistrez le devis. Vous pourrez ensuite l'envoyer par email ou le télécharger en PDF."
    },
    {
      question: "Comment convertir un devis en facture ?",
      answer: "Pour convertir un devis en facture, allez dans la section 'Devis', trouvez le devis que vous souhaitez convertir, puis cliquez sur l'icône de conversion (flèche vers la facture) dans la colonne 'Actions'. Vous serez redirigé vers un formulaire pré-rempli que vous pourrez modifier avant de créer la facture."
    },
    {
      question: "Comment enregistrer un paiement ?",
      answer: "Pour enregistrer un paiement, allez dans la section 'Paiements', puis cliquez sur 'Nouveau paiement'. Sélectionnez la facture concernée, indiquez le montant, la date et le mode de paiement, puis enregistrez. La facture sera automatiquement marquée comme payée si le montant correspond."
    },
    {
      question: "Comment personnaliser mes factures ?",
      answer: "Pour personnaliser vos factures, allez dans la section 'Paramètres', puis dans l'onglet 'Devis et Factures'. Vous pourrez y modifier les préfixes, les délais de paiement et les mentions légales qui apparaîtront sur vos documents."
    },
    {
      question: "Comment générer des rapports financiers ?",
      answer: "Pour générer des rapports financiers, allez dans la section 'Rapports', sélectionnez la période souhaitée (mois, trimestre, année), puis cliquez sur le bouton 'Générer' à côté du type de rapport que vous souhaitez obtenir. Vous pourrez ensuite télécharger le rapport au format PDF ou Excel."
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Support et assistance</h1>
        </div>

        {/* Bannière d'aide */}
        <div className="bg-indigo-50 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-indigo-800">Besoin d'aide avec FacturePro ?</h2>
              <p className="mt-1 text-sm text-indigo-600">
                Notre équipe est là pour vous aider à tirer le meilleur parti de votre application de facturation.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <a
                href="#contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FaEnvelope className="mr-2" /> Nous contacter
              </a>
              <a
                href="#faq"
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                <FaQuestionCircle className="mr-2" /> Consulter la FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Options de support */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <FaBook className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Consultez notre documentation détaillée pour apprendre à utiliser toutes les fonctionnalités.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Accéder à la documentation →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <FaVideo className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Tutoriels vidéo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Regardez nos tutoriels vidéo pour apprendre à utiliser l'application étape par étape.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Voir les tutoriels →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <FaFileAlt className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Guides pratiques</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Téléchargez nos guides pratiques pour vous aider dans votre gestion quotidienne.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Télécharger les guides →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaQuestionCircle className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Questions fréquemment posées</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="px-4 py-5 sm:px-6">
                  <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div id="contact" className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">Contactez-nous</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-3">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">support@facturepro.fr</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">01 23 45 67 89 (Lun-Ven, 9h-18h)</span>
                </div>
              </div>
              <div className="sm:col-span-3">
                <div className="flex items-center mb-4">
                  <FaComments className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Chat en direct disponible</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Démarrer un chat
                </button>
              </div>
              <div className="sm:col-span-6">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900">Envoyez-nous un message</h3>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="sm:col-span-6 space-y-4">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={contactForm.subject}
                      onChange={handleContactFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleContactFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 