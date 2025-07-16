'use client'

import { useState, useEffect } from 'react'
import NavigationSidebar from './NavigationSidebar'
import SectionEditor from './SectionEditor'
import ExportActions from './ExportActions'
import { DraaiboekData, DraaiboekSection } from '@/types/draaiboek'

const initialData: DraaiboekData = {
  id: crypto.randomUUID(),
  title: 'Nieuw Draaiboek',
  createdAt: new Date(),
  updatedAt: new Date(),
  sections: {
    inleiding: {
      algemeneInleiding: '',
      verantwoordingActiviteiten: '',
      verantwoordingPartner: '',
      doelstellingKinderen: '',
      persoonlijkeDoelstelling: ''
    },
    planning: {
      fasenPlanning: '',
      prStrategie: '',
      globaalDagprogramma: '',
      sesWs: {
        algemeen: '',
        opening: '',
        dagprogramma: '',
        schema: '',
        afsluiting: ''
      },
      communicatiematrix: ''
    },
    uitwerking: {
      voorbereiding: '',
      openingAfsluiting: '',
      verantwoordelijkheden: '',
      wedstrijdschemas: '',
      spelregels: '',
      materiaallijst: ''
    },
    calamiteitenplan: {
      maatregelen: '',
      alternatiefProgramma: '',
      plattegrond: ''
    },
    bijlagen: {
      behoefteonderzoek: '',
      omgevingsanalyse: '',
      promotiemateriaal: ''
    }
  },
  progress: 0
}

export default function DraaiboekWizard() {
  const [draaiboekData, setDraaiboekData] = useState<DraaiboekData>(initialData)
  const [activeSection, setActiveSection] = useState<DraaiboekSection>('inleiding')
  const [activeSubsection, setActiveSubsection] = useState<string>('algemeneInleiding')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(initialData.title)

  // Luister naar JSON load events
  useEffect(() => {
    const handleLoadData = (event: CustomEvent) => {
      const loadedData = event.detail
      // Valideer en merge met initialData voor missing properties
      const validatedData: DraaiboekData = {
        id: loadedData.id || crypto.randomUUID(),
        title: loadedData.title || 'Geladen Draaiboek',
        createdAt: loadedData.createdAt ? new Date(loadedData.createdAt) : new Date(),
        updatedAt: new Date(),
        sections: {
          inleiding: {
            algemeneInleiding: loadedData.sections?.inleiding?.algemeneInleiding || '',
            verantwoordingActiviteiten: loadedData.sections?.inleiding?.verantwoordingActiviteiten || '',
            verantwoordingPartner: loadedData.sections?.inleiding?.verantwoordingPartner || '',
            doelstellingKinderen: loadedData.sections?.inleiding?.doelstellingKinderen || '',
            persoonlijkeDoelstelling: loadedData.sections?.inleiding?.persoonlijkeDoelstelling || ''
          },
          planning: {
            fasenPlanning: loadedData.sections?.planning?.fasenPlanning || '',
            prStrategie: loadedData.sections?.planning?.prStrategie || '',
            globaalDagprogramma: loadedData.sections?.planning?.globaalDagprogramma || '',
            sesWs: {
              algemeen: loadedData.sections?.planning?.sesWs?.algemeen || '',
              opening: loadedData.sections?.planning?.sesWs?.opening || '',
              dagprogramma: loadedData.sections?.planning?.sesWs?.dagprogramma || '',
              schema: loadedData.sections?.planning?.sesWs?.schema || '',
              afsluiting: loadedData.sections?.planning?.sesWs?.afsluiting || ''
            },
            communicatiematrix: loadedData.sections?.planning?.communicatiematrix || ''
          },
          uitwerking: {
            voorbereiding: loadedData.sections?.uitwerking?.voorbereiding || '',
            openingAfsluiting: loadedData.sections?.uitwerking?.openingAfsluiting || '',
            verantwoordelijkheden: loadedData.sections?.uitwerking?.verantwoordelijkheden || '',
            wedstrijdschemas: loadedData.sections?.uitwerking?.wedstrijdschemas || '',
            spelregels: loadedData.sections?.uitwerking?.spelregels || '',
            materiaallijst: loadedData.sections?.uitwerking?.materiaallijst || ''
          },
          calamiteitenplan: {
            maatregelen: loadedData.sections?.calamiteitenplan?.maatregelen || '',
            alternatiefProgramma: loadedData.sections?.calamiteitenplan?.alternatiefProgramma || '',
            plattegrond: loadedData.sections?.calamiteitenplan?.plattegrond || ''
          },
          bijlagen: {
            behoefteonderzoek: loadedData.sections?.bijlagen?.behoefteonderzoek || '',
            omgevingsanalyse: loadedData.sections?.bijlagen?.omgevingsanalyse || '',
            promotiemateriaal: loadedData.sections?.bijlagen?.promotiemateriaal || ''
          }
        },
        progress: loadedData.progress || 0
      }
      
      setDraaiboekData(validatedData)
      setTitleValue(validatedData.title)
      // Reset naar eerste sectie na laden
      setActiveSection('inleiding')
      setActiveSubsection('algemeneInleiding')
    }

    window.addEventListener('loadDraaiboekData', handleLoadData as EventListener)
    return () => window.removeEventListener('loadDraaiboekData', handleLoadData as EventListener)
  }, [])

  const updateSection = (section: DraaiboekSection, subsection: string, value: string) => {
    setDraaiboekData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [subsection]: value
        } as any
      },
      updatedAt: new Date()
    }))
  }

  const updateNestedSection = (section: DraaiboekSection, parentKey: string, childKey: string, value: string) => {
    setDraaiboekData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [parentKey]: {
            ...(prev.sections[section] as any)[parentKey],
            [childKey]: value
          }
        } as any
      },
      updatedAt: new Date()
    }))
  }

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
    setTitleValue(draaiboekData.title)
  }

  const handleTitleSave = () => {
    setDraaiboekData(prev => ({
      ...prev,
      title: titleValue.trim() || 'Nieuw Draaiboek',
      updatedAt: new Date()
    }))
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setTitleValue(draaiboekData.title)
    setIsEditingTitle(false)
  }

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const calculateProgress = () => {
    const allFields = Object.values(draaiboekData.sections).flatMap(section => 
      Object.values(section).flatMap(value => 
        typeof value === 'string' ? [value] : Object.values(value)
      )
    )
    const filledFields = allFields.filter(field => field.trim() !== '').length
    return Math.round((filledFields / allFields.length) * 100)
  }

  const currentProgress = calculateProgress()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <NavigationSidebar 
        activeSection={activeSection}
        activeSubsection={activeSubsection}
        onSectionChange={setActiveSection}
        onSubsectionChange={setActiveSubsection}
        progress={currentProgress}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              {isEditingTitle ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onKeyPress={handleTitleKeyPress}
                    onBlur={handleTitleSave}
                    className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="text-green-600 hover:text-green-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleTitleCancel}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {draaiboekData.title}
                  </h1>
                  <button
                    onClick={handleTitleEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-gray-600 mt-1">
                Laatst bijgewerkt: {draaiboekData.updatedAt.toLocaleString('nl-NL')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{currentProgress}%</span>
              </div>
              <ExportActions data={draaiboekData} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <SectionEditor
            section={activeSection}
            subsection={activeSubsection}
            data={draaiboekData}
            onUpdate={updateSection}
            onNestedUpdate={updateNestedSection}
          />
        </div>
      </div>
    </div>
  )
}