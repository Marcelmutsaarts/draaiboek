'use client'

import { DraaiboekSection } from '@/types/draaiboek'

interface Props {
  activeSection: DraaiboekSection
  activeSubsection: string
  onSectionChange: (section: DraaiboekSection) => void
  onSubsectionChange: (subsection: string) => void
  progress: number
}

const sectionConfig = {
  inleiding: {
    title: '1. Inleiding',
    icon: '📋',
    subsections: [
      { id: 'algemeneInleiding', title: 'Algemene inleiding' },
      { id: 'verantwoordingActiviteiten', title: 'Verantwoording activiteiten' },
      { id: 'verantwoordingPartner', title: 'Verantwoording partner' },
      { id: 'doelstellingKinderen', title: 'Doelstelling kinderen' },
      { id: 'persoonlijkeDoelstelling', title: 'Persoonlijke doelstelling' }
    ]
  },
  planning: {
    title: '2. Planning',
    icon: '📅',
    subsections: [
      { id: 'fasenPlanning', title: 'Fasen planning' },
      { id: 'prStrategie', title: 'PR strategie' },
      { id: 'globaalDagprogramma', title: 'Globaal dagprogramma' },
      { id: 'sesWs', title: '6 W\'s', nested: [
        { id: 'opening', title: 'Opening' },
        { id: 'dagprogramma', title: 'Dagprogramma' },
        { id: 'schema', title: 'Schema' },
        { id: 'afsluiting', title: 'Afsluiting' }
      ]},
      { id: 'communicatiematrix', title: 'Communicatiematrix' }
    ]
  },
  uitwerking: {
    title: '3. Uitwerking',
    icon: '⚙️',
    subsections: [
      { id: 'voorbereiding', title: 'Voorbereiding LVF' },
      { id: 'openingAfsluiting', title: 'Opening/Afsluiting' },
      { id: 'verantwoordelijkheden', title: 'Verantwoordelijkheden' },
      { id: 'wedstrijdschemas', title: 'Wedstrijdschema\'s' },
      { id: 'spelregels', title: 'Spelregels' },
      { id: 'materiaallijst', title: 'Materiaallijst' }
    ]
  },
  calamiteitenplan: {
    title: '4. Calamiteitenplan',
    icon: '🚨',
    subsections: [
      { id: 'maatregelen', title: 'Maatregelen' },
      { id: 'alternatiefProgramma', title: 'Alternatief programma' },
      { id: 'plattegrond', title: 'Plattegrond' }
    ]
  },
  bijlagen: {
    title: '5. Bijlagen',
    icon: '📎',
    subsections: [
      { id: 'behoefteonderzoek', title: 'Behoefteonderzoek' },
      { id: 'omgevingsanalyse', title: 'Omgevingsanalyse' },
      { id: 'promotiemateriaal', title: 'Promotiemateriaal' }
    ]
  }
}

export default function NavigationSidebar({
  activeSection,
  activeSubsection,
  onSectionChange,
  onSubsectionChange,
  progress
}: Props) {
  const handleSubsectionClick = (sectionId: DraaiboekSection, subsectionId: string) => {
    onSectionChange(sectionId)
    onSubsectionChange(subsectionId)
  }

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Draaiboek Onderdelen</h2>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Voortgang</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {Object.entries(sectionConfig).map(([sectionId, section]) => (
          <div key={sectionId} className="mb-4">
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                activeSection === sectionId
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSectionChange(sectionId as DraaiboekSection)}
            >
              <span className="text-lg mr-3">{section.icon}</span>
              <span className="font-medium text-gray-800">{section.title}</span>
            </div>

            {/* Subsections */}
            {activeSection === sectionId && (
              <div className="ml-6 mt-2 space-y-1">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id}>
                    <button
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        activeSubsection === subsection.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSubsectionClick(sectionId as DraaiboekSection, subsection.id)}
                    >
                      {subsection.title}
                    </button>

                    {/* Nested subsections for 6 W's */}
                    {(subsection as any).nested && activeSubsection === subsection.id && (
                      <div className="ml-4 mt-1 space-y-1">
                        {(subsection as any).nested.map((nested: any) => (
                          <button
                            key={nested.id}
                            className={`w-full text-left p-2 rounded text-xs transition-colors ${
                              activeSubsection === nested.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            onClick={() => handleSubsectionClick(sectionId as DraaiboekSection, nested.id)}
                          >
                            • {nested.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}