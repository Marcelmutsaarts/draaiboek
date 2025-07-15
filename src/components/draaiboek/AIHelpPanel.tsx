'use client'

import { useState } from 'react'

import { DraaiboekData } from '@/types/draaiboek'

interface Props {
  isOpen: boolean
  onClose: () => void
  sectionTitle: string
  sectionDescription: string
  onSendToEditor: (content: string) => void
  draaiboekData: DraaiboekData
  currentSection: string
  currentSubsection: string
}

export default function AIHelpPanel({ isOpen, onClose, sectionTitle, sectionDescription, onSendToEditor, draaiboekData, currentSection, currentSubsection }: Props) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Helper function to format draaiboek data for AI context
      const formatDraaiboekContext = (data: DraaiboekData) => {
        const sections = [
          {
            name: 'Inleiding',
            content: `
- Algemene inleiding: ${data.sections.inleiding.algemeneInleiding || 'Nog niet ingevuld'}
- Verantwoording activiteiten: ${data.sections.inleiding.verantwoordingActiviteiten || 'Nog niet ingevuld'}
- Verantwoording partner: ${data.sections.inleiding.verantwoordingPartner || 'Nog niet ingevuld'}
- Doelstelling kinderen: ${data.sections.inleiding.doelstellingKinderen || 'Nog niet ingevuld'}
- Persoonlijke doelstelling: ${data.sections.inleiding.persoonlijkeDoelstelling || 'Nog niet ingevuld'}`
          },
          {
            name: 'Planning',
            content: `
- Fasen planning: ${data.sections.planning.fasenPlanning || 'Nog niet ingevuld'}
- PR strategie: ${data.sections.planning.prStrategie || 'Nog niet ingevuld'}
- Globaal dagprogramma: ${data.sections.planning.globaalDagprogramma || 'Nog niet ingevuld'}
- 6 W's:
  * Opening: ${data.sections.planning.sesWs.opening || 'Nog niet ingevuld'}
  * Dagprogramma: ${data.sections.planning.sesWs.dagprogramma || 'Nog niet ingevuld'}
  * Schema: ${data.sections.planning.sesWs.schema || 'Nog niet ingevuld'}
  * Afsluiting: ${data.sections.planning.sesWs.afsluiting || 'Nog niet ingevuld'}
- Communicatiematrix: ${data.sections.planning.communicatiematrix || 'Nog niet ingevuld'}`
          },
          {
            name: 'Uitwerking',
            content: `
- Voorbereiding: ${data.sections.uitwerking.voorbereiding || 'Nog niet ingevuld'}
- Opening/Afsluiting: ${data.sections.uitwerking.openingAfsluiting || 'Nog niet ingevuld'}
- Verantwoordelijkheden: ${data.sections.uitwerking.verantwoordelijkheden || 'Nog niet ingevuld'}
- Wedstrijdschema's: ${data.sections.uitwerking.wedstrijdschemas || 'Nog niet ingevuld'}
- Spelregels: ${data.sections.uitwerking.spelregels || 'Nog niet ingevuld'}
- Materiaallijst: ${data.sections.uitwerking.materiaallijst || 'Nog niet ingevuld'}`
          },
          {
            name: 'Calamiteitenplan',
            content: `
- Maatregelen: ${data.sections.calamiteitenplan.maatregelen || 'Nog niet ingevuld'}
- Alternatief programma: ${data.sections.calamiteitenplan.alternatiefProgramma || 'Nog niet ingevuld'}
- Plattegrond: ${data.sections.calamiteitenplan.plattegrond || 'Nog niet ingevuld'}`
          },
          {
            name: 'Bijlagen',
            content: `
- Behoefteonderzoek: ${data.sections.bijlagen.behoefteonderzoek || 'Nog niet ingevuld'}
- Omgevingsanalyse: ${data.sections.bijlagen.omgevingsanalyse || 'Nog niet ingevuld'}
- Promotiemateriaal: ${data.sections.bijlagen.promotiemateriaal || 'Nog niet ingevuld'}`
          }
        ]
        
        return sections.map(section => `${section.name}:${section.content}`).join('\n\n')
      }

      const systemPrompt = `Je bent een vriendelijke studiecoach die PABO-ALO en ALO studenten helpt bij hun eerste extracurriculaire project. Je spreekt op HBO propedeuse niveau - dus vriendelijk, begrijpelijk en niet te technisch.

CONTEXT: 
- Dit is hun eerste project waarbij ze een extracurriculaire activiteit voor PO kinderen organiseren
- Ze moeten een externe partner zoeken (sportvereniging, drama-groep, etc.) voor een clinic
- Ze moeten een behoefteonderzoek doen

BEOORDELINGSCRITERIA die je ALTIJD moet meenemen in je feedback:
1. De onderlinge taakverdeling tijdens de uitvoering is adequaat beschreven
2. Planning van activiteiten voor, tijdens en na de uitvoering is realistisch uitgewerkt
3. Er is sprake van voldoende samenhang tussen het projectplan en het draaiboek (inleiding)
4. De organisatorische handelingen van het dagprogramma zijn gedetailleerd beschreven met behulp van de 6 W's
5. PR van de naschoolse activiteit is opgenomen en verantwoord
6. De communicatie tijdens het evenement is helder beschreven
7. De opening & afsluiting zijn in grote lijnen vooraf goed beschreven
8. De activiteiten zijn gedetailleerd en kloppend (speelschema's) uitgewerkt
9. Het calamiteitenplan is volgens een realistische risicoanalyse uitgewerkt
10. Een concreet alternatief programma is uitgewerkt in het calamiteitenplan
11. Looproutes en plattegrond zijn helder weergegeven in het geval van calamiteiten

HUIDIGE DRAAIBOEK CONTEXT:
Titel: ${draaiboekData.title}
Voortgang: ${Math.round(((Object.values(draaiboekData.sections).flatMap(section => 
  Object.values(section).flatMap(value => 
    typeof value === 'string' ? [value] : Object.values(value)
  )
).filter(field => field.trim() !== '').length) / 
(Object.values(draaiboekData.sections).flatMap(section => 
  Object.values(section).flatMap(value => 
    typeof value === 'string' ? [value] : Object.values(value)
  )
).length)) * 100)}%

INHOUD VAN HET DRAAIBOEK:
${formatDraaiboekContext(draaiboekData)}

HUIDIGE SECTIE: ${currentSection} - ${currentSubsection}
De student werkt nu aan: "${sectionTitle}"
Beschrijving: "${sectionDescription}"

JE DOEL:
- Geef gerichte feedback op de huidige sectie, maar houd het grote geheel in de gaten
- Wijs op verbanden met andere secties waar relevant
- Controleer of beoordelingscriteria worden nageleefd
- Geef concrete, praktische tips
- Stel doorvragen om de student te laten nadenken
- Wees bemoedigend maar kritisch waar nodig

Antwoord in maximaal 3-4 zinnen en eindig vaak met een vraag om het gesprek gaande te houden.`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt,
          model: 'smart'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: result.response }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-purple-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-800 flex items-center">
            <span className="mr-2">🤖</span>
            AI Hulp
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-purple-600 mt-1">
          Chat met AI over: {sectionTitle}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-sm">
              Hoi! Ik help je graag met dit onderdeel.<br />
              Stel gerust een vraag!
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.role === 'assistant' && (
                <button
                  onClick={() => onSendToEditor(message.content)}
                  className="text-xs text-purple-600 hover:text-purple-800 mt-2 underline"
                >
                  Voeg toe aan tekst
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Typ je vraag hier..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}