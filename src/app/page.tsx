'use client'

import { useState } from 'react'
import Image from 'next/image'
import DraaiboekWizard from '@/components/draaiboek/DraaiboekWizard'

export default function Home() {
  const [showWizard, setShowWizard] = useState(false)

  if (showWizard) {
    return <DraaiboekWizard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Draaiboek Generator
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Maak professionele draaiboeken voor naschoolse activiteiten met AI-ondersteuning
          </p>

          {/* AI voor Docenten Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <Image 
                src="/images/ai-voor-docenten-logo.png" 
                alt="AI voor Docenten Logo" 
                width={192} 
                height={96}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                ✨
              </span>
              Wat kun je met deze app?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Stap-voor-stap begeleiding</h3>
                    <p className="text-gray-600 text-sm">Doorloop alle onderdelen van een draaiboek systematisch</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-purple-600 text-sm">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI-ondersteuning</h3>
                    <p className="text-gray-600 text-sm">Krijg hulp bij het schrijven van elke sectie</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Volledig draaiboek</h3>
                    <p className="text-gray-600 text-sm">Alle vereiste onderdelen volgens de standaard</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 text-sm">💾</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Automatisch opslaan</h3>
                    <p className="text-gray-600 text-sm">Verlies nooit je werk dankzij auto-save</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 text-sm">📄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Export naar Word</h3>
                    <p className="text-gray-600 text-sm">Download je draaiboek als Word document</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-yellow-600 text-sm">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Validatie</h3>
                    <p className="text-gray-600 text-sm">Controleer of alle onderdelen compleet zijn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Maak je eerste draaiboek in een paar eenvoudige stappen
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <span>Nieuw draaiboek maken</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span>📚</span>
              <span>Veel succes met je draaiboek!</span>
              <span>📚</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Draaiboek Generator • Powered by AI voor Docenten
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}