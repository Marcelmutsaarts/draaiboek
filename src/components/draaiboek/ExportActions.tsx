'use client'

import { useState } from 'react'
import { DraaiboekData } from '@/types/draaiboek'
import { Document, Paragraph, TextRun, HeadingLevel } from 'docx'

interface Props {
  data: DraaiboekData
}

export default function ExportActions({ data }: Props) {
  const [isExporting, setIsExporting] = useState(false)

  // Convert draaiboek data to formatted text
  const formatDraaiboekText = (): string => {
    const sections = [
      {
        title: 'DRAAIBOEK - ' + data.title.toUpperCase(),
        content: `Gemaakt op: ${data.createdAt.toLocaleDateString('nl-NL')}\nLaatst bijgewerkt: ${data.updatedAt.toLocaleDateString('nl-NL')}\n\n`
      },
      {
        title: '1. INLEIDING',
        content: `
${data.sections.inleiding.algemeneInleiding ? `Algemene inleiding:\n${data.sections.inleiding.algemeneInleiding}\n\n` : ''}
${data.sections.inleiding.verantwoordingActiviteiten ? `Verantwoording van de keuze van de activiteiten:\n${data.sections.inleiding.verantwoordingActiviteiten}\n\n` : ''}
${data.sections.inleiding.verantwoordingPartner ? `Verantwoording van de keuze van de externe samenwerkingspartner:\n${data.sections.inleiding.verantwoordingPartner}\n\n` : ''}
${data.sections.inleiding.doelstellingKinderen ? `Doelstelling voor de kinderen:\n${data.sections.inleiding.doelstellingKinderen}\n\n` : ''}
${data.sections.inleiding.persoonlijkeDoelstelling ? `Persoonlijke doelstelling voor de projectleden:\n${data.sections.inleiding.persoonlijkeDoelstelling}\n\n` : ''}
        `
      },
      {
        title: '2. PLANNING VOOR-TIJDENS-NA DE ACTIVITEIT',
        content: `
${data.sections.planning.fasenPlanning ? `Planning van alle activiteiten in voorbereidingsfase, uitvoeringsfase en nazorgfase:\n${data.sections.planning.fasenPlanning}\n\n` : ''}
${data.sections.planning.prStrategie ? `PR van de naschoolse activiteit:\n${data.sections.planning.prStrategie}\n\n` : ''}
${data.sections.planning.globaalDagprogramma ? `Globale schets van dagprogramma voor de deelnemers:\n${data.sections.planning.globaalDagprogramma}\n\n` : ''}
${data.sections.planning.sesWs.opening || data.sections.planning.sesWs.dagprogramma || data.sections.planning.sesWs.schema || data.sections.planning.sesWs.afsluiting ? `Gedetailleerde planning van dagprogramma m.b.v. de 6 W's:\n` : ''}
${data.sections.planning.sesWs.opening ? `Opening:\n${data.sections.planning.sesWs.opening}\n\n` : ''}
${data.sections.planning.sesWs.dagprogramma ? `Dagprogramma:\n${data.sections.planning.sesWs.dagprogramma}\n\n` : ''}
${data.sections.planning.sesWs.schema ? `Schema met uitgewerkte activiteiten en locatie:\n${data.sections.planning.sesWs.schema}\n\n` : ''}
${data.sections.planning.sesWs.afsluiting ? `Afsluiting:\n${data.sections.planning.sesWs.afsluiting}\n\n` : ''}
${data.sections.planning.communicatiematrix ? `Communicatiematrix:\n${data.sections.planning.communicatiematrix}\n\n` : ''}
        `
      },
      {
        title: '3. GEDETAILLEERDE UITWERKING VAN DE ACTIVITEIT',
        content: `
${data.sections.uitwerking.voorbereiding ? `Voorbereiding a.d.h.v. een LVF:\n${data.sections.uitwerking.voorbereiding}\n\n` : ''}
${data.sections.uitwerking.openingAfsluiting ? `Opening en afsluiting concreet uitgewerkt:\n${data.sections.uitwerking.openingAfsluiting}\n\n` : ''}
${data.sections.uitwerking.verantwoordelijkheden ? `Verantwoordelijkheden per onderdeel:\n${data.sections.uitwerking.verantwoordelijkheden}\n\n` : ''}
${data.sections.uitwerking.wedstrijdschemas ? `Wedstrijdschema's (indien van toepassing):\n${data.sections.uitwerking.wedstrijdschemas}\n\n` : ''}
${data.sections.uitwerking.spelregels ? `Spelregels:\n${data.sections.uitwerking.spelregels}\n\n` : ''}
${data.sections.uitwerking.materiaallijst ? `Gedetailleerde materiaallijst:\n${data.sections.uitwerking.materiaallijst}\n\n` : ''}
        `
      },
      {
        title: '4. CALAMITEITENPLAN',
        content: `
${data.sections.calamiteitenplan.maatregelen ? `Maatregelen n.a.v. risico-analyse:\n${data.sections.calamiteitenplan.maatregelen}\n\n` : ''}
${data.sections.calamiteitenplan.alternatiefProgramma ? `Alternatief programma:\n${data.sections.calamiteitenplan.alternatiefProgramma}\n\n` : ''}
${data.sections.calamiteitenplan.plattegrond ? `Plattegrond:\n${data.sections.calamiteitenplan.plattegrond}\n\n` : ''}
        `
      },
      {
        title: '5. BIJLAGEN',
        content: `
${data.sections.bijlagen.behoefteonderzoek ? `Behoefteonderzoek:\n${data.sections.bijlagen.behoefteonderzoek}\n\n` : ''}
${data.sections.bijlagen.omgevingsanalyse ? `Omgevingsanalyse:\n${data.sections.bijlagen.omgevingsanalyse}\n\n` : ''}
${data.sections.bijlagen.promotiemateriaal ? `Promotiemateriaal voor naschoolse activiteit:\n${data.sections.bijlagen.promotiemateriaal}\n\n` : ''}
        `
      }
    ]

    return sections.map(section => 
      section.title + '\n' + '='.repeat(section.title.length) + '\n\n' + section.content.trim()
    ).join('\n\n')
  }

  // Create Word document
  const createWordDocument = (): Document => {
    const paragraphs: Paragraph[] = []

    // Title
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.title, bold: true, size: 32 })],
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      })
    )

    // Metadata
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Gemaakt op: ${data.createdAt.toLocaleDateString('nl-NL')}`, size: 20 }),
          new TextRun({ text: '\n' }),
          new TextRun({ text: `Laatst bijgewerkt: ${data.updatedAt.toLocaleDateString('nl-NL')}`, size: 20 })
        ],
        spacing: { after: 600 }
      })
    )

    // Add sections
    const addSection = (title: string, content: any, isSubsection = false) => {
      if (typeof content === 'string' && content.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: isSubsection ? 24 : 28 })],
            heading: isSubsection ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          })
        )
        
        const lines = content.trim().split('\n')
        lines.forEach(line => {
          if (line.trim()) {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun({ text: line.trim(), size: 22 })],
                spacing: { after: 120 }
              })
            )
          }
        })
      }
    }

    // 1. Inleiding
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '1. INLEIDING', bold: true, size: 30 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 }
      })
    )

    addSection('Algemene inleiding', data.sections.inleiding.algemeneInleiding, true)
    addSection('Verantwoording van de keuze van de activiteiten', data.sections.inleiding.verantwoordingActiviteiten, true)
    addSection('Verantwoording van de keuze van de externe samenwerkingspartner', data.sections.inleiding.verantwoordingPartner, true)
    addSection('Doelstelling voor de kinderen', data.sections.inleiding.doelstellingKinderen, true)
    addSection('Persoonlijke doelstelling voor de projectleden', data.sections.inleiding.persoonlijkeDoelstelling, true)

    // 2. Planning
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '2. PLANNING VOOR-TIJDENS-NA DE ACTIVITEIT', bold: true, size: 30 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 }
      })
    )

    addSection('Planning van alle activiteiten in voorbereidingsfase, uitvoeringsfase en nazorgfase', data.sections.planning.fasenPlanning, true)
    addSection('PR van de naschoolse activiteit', data.sections.planning.prStrategie, true)
    addSection('Globale schets van dagprogramma voor de deelnemers', data.sections.planning.globaalDagprogramma, true)
    
    // 6 W's subsections
    if (data.sections.planning.sesWs.opening || data.sections.planning.sesWs.dagprogramma || data.sections.planning.sesWs.schema || data.sections.planning.sesWs.afsluiting) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Gedetailleerde planning van dagprogramma m.b.v. de 6 W\'s', bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 400, after: 200 }
        })
      )
      
      addSection('Opening', data.sections.planning.sesWs.opening, true)
      addSection('Dagprogramma', data.sections.planning.sesWs.dagprogramma, true)
      addSection('Schema met uitgewerkte activiteiten en locatie', data.sections.planning.sesWs.schema, true)
      addSection('Afsluiting', data.sections.planning.sesWs.afsluiting, true)
    }
    
    addSection('Communicatiematrix', data.sections.planning.communicatiematrix, true)

    // 3. Uitwerking
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '3. GEDETAILLEERDE UITWERKING VAN DE ACTIVITEIT', bold: true, size: 30 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 }
      })
    )

    addSection('Voorbereiding a.d.h.v. een LVF', data.sections.uitwerking.voorbereiding, true)
    addSection('Opening en afsluiting concreet uitgewerkt', data.sections.uitwerking.openingAfsluiting, true)
    addSection('Verantwoordelijkheden per onderdeel', data.sections.uitwerking.verantwoordelijkheden, true)
    addSection('Wedstrijdschema\'s (indien van toepassing)', data.sections.uitwerking.wedstrijdschemas, true)
    addSection('Spelregels', data.sections.uitwerking.spelregels, true)
    addSection('Gedetailleerde materiaallijst', data.sections.uitwerking.materiaallijst, true)

    // 4. Calamiteitenplan
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '4. CALAMITEITENPLAN', bold: true, size: 30 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 }
      })
    )

    addSection('Maatregelen n.a.v. risico-analyse', data.sections.calamiteitenplan.maatregelen, true)
    addSection('Alternatief programma', data.sections.calamiteitenplan.alternatiefProgramma, true)
    addSection('Plattegrond', data.sections.calamiteitenplan.plattegrond, true)

    // 5. Bijlagen
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '5. BIJLAGEN', bold: true, size: 30 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 }
      })
    )

    addSection('Behoefteonderzoek', data.sections.bijlagen.behoefteonderzoek, true)
    addSection('Omgevingsanalyse', data.sections.bijlagen.omgevingsanalyse, true)
    addSection('Promotiemateriaal voor naschoolse activiteit', data.sections.bijlagen.promotiemateriaal, true)

    return new Document({
      creator: 'Draaiboek Generator',
      title: data.title,
      description: 'Professioneel draaiboek voor naschoolse activiteiten',
      sections: [{
        properties: {},
        children: paragraphs
      }]
    })
  }

  const handleWordExport = async () => {
    setIsExporting(true)
    try {
      const { Packer } = await import('docx')
      const doc = createWordDocument()
      const blob = await Packer.toBlob(doc)
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Word export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePDFExport = () => {
    const content = formatDraaiboekText()
    const printWindow = window.open('', '_blank')
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #1f4e79; border-bottom: 2px solid #1f4e79; padding-bottom: 10px; }
              h2 { color: #2f75b5; margin-top: 30px; }
              h3 { color: #4472c4; margin-top: 20px; }
              p { margin-bottom: 10px; }
              pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleWordExport}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporteren...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Word Export
          </>
        )}
      </button>
      
      <button
        onClick={handlePDFExport}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        PDF Export
      </button>
    </div>
  )
}