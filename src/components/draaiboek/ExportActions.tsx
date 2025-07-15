'use client'

import { useState } from 'react'
import { DraaiboekData } from '@/types/draaiboek'
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import htmlDocx from 'html-docx-js/dist/html-docx'

interface Props {
  data: DraaiboekData
}

export default function ExportActions({ data }: Props) {
  const [isExporting, setIsExporting] = useState(false)

  // Convert HTML to plain text for PDF
  const stripHtml = (html: string): string => {
    // Convert tables to text format
    let text = html.replace(/<table[^>]*>/gi, '\n\n')
    text = text.replace(/<\/table>/gi, '\n\n')
    text = text.replace(/<tr[^>]*>/gi, '')
    text = text.replace(/<\/tr>/gi, '\n')
    text = text.replace(/<t[dh][^>]*>/gi, '')
    text = text.replace(/<\/t[dh]>/gi, '\t')
    
    // Remove other HTML tags
    text = text.replace(/<[^>]*>/g, '')
    
    // Clean up extra whitespace
    text = text.replace(/\n\s*\n/g, '\n\n')
    text = text.replace(/\t+/g, '\t')
    
    return text.trim()
  }

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
${data.sections.inleiding.algemeneInleiding ? `Algemene inleiding:\n${stripHtml(data.sections.inleiding.algemeneInleiding)}\n\n` : ''}
${data.sections.inleiding.verantwoordingActiviteiten ? `Verantwoording van de keuze van de activiteiten:\n${stripHtml(data.sections.inleiding.verantwoordingActiviteiten)}\n\n` : ''}
${data.sections.inleiding.verantwoordingPartner ? `Verantwoording van de keuze van de externe samenwerkingspartner:\n${stripHtml(data.sections.inleiding.verantwoordingPartner)}\n\n` : ''}
${data.sections.inleiding.doelstellingKinderen ? `Doelstelling voor de kinderen:\n${stripHtml(data.sections.inleiding.doelstellingKinderen)}\n\n` : ''}
${data.sections.inleiding.persoonlijkeDoelstelling ? `Persoonlijke doelstelling voor de projectleden:\n${stripHtml(data.sections.inleiding.persoonlijkeDoelstelling)}\n\n` : ''}
        `
      },
      {
        title: '2. PLANNING VOOR-TIJDENS-NA DE ACTIVITEIT',
        content: `
${data.sections.planning.fasenPlanning ? `Planning van alle activiteiten in voorbereidingsfase, uitvoeringsfase en nazorgfase:\n${stripHtml(data.sections.planning.fasenPlanning)}\n\n` : ''}
${data.sections.planning.prStrategie ? `PR van de naschoolse activiteit:\n${stripHtml(data.sections.planning.prStrategie)}\n\n` : ''}
${data.sections.planning.globaalDagprogramma ? `Globale schets van dagprogramma voor de deelnemers:\n${stripHtml(data.sections.planning.globaalDagprogramma)}\n\n` : ''}
${data.sections.planning.sesWs.opening || data.sections.planning.sesWs.dagprogramma || data.sections.planning.sesWs.schema || data.sections.planning.sesWs.afsluiting ? `Gedetailleerde planning van dagprogramma m.b.v. de 6 W's:\n` : ''}
${data.sections.planning.sesWs.opening ? `Opening:\n${stripHtml(data.sections.planning.sesWs.opening)}\n\n` : ''}
${data.sections.planning.sesWs.dagprogramma ? `Dagprogramma:\n${stripHtml(data.sections.planning.sesWs.dagprogramma)}\n\n` : ''}
${data.sections.planning.sesWs.schema ? `Schema met uitgewerkte activiteiten en locatie:\n${stripHtml(data.sections.planning.sesWs.schema)}\n\n` : ''}
${data.sections.planning.sesWs.afsluiting ? `Afsluiting:\n${stripHtml(data.sections.planning.sesWs.afsluiting)}\n\n` : ''}
${data.sections.planning.communicatiematrix ? `Communicatiematrix:\n${stripHtml(data.sections.planning.communicatiematrix)}\n\n` : ''}
        `
      },
      {
        title: '3. GEDETAILLEERDE UITWERKING VAN DE ACTIVITEIT',
        content: `
${data.sections.uitwerking.voorbereiding ? `Voorbereiding a.d.h.v. een LVF:\n${stripHtml(data.sections.uitwerking.voorbereiding)}\n\n` : ''}
${data.sections.uitwerking.openingAfsluiting ? `Opening en afsluiting concreet uitgewerkt:\n${stripHtml(data.sections.uitwerking.openingAfsluiting)}\n\n` : ''}
${data.sections.uitwerking.verantwoordelijkheden ? `Verantwoordelijkheden per onderdeel:\n${stripHtml(data.sections.uitwerking.verantwoordelijkheden)}\n\n` : ''}
${data.sections.uitwerking.wedstrijdschemas ? `Wedstrijdschema's (indien van toepassing):\n${stripHtml(data.sections.uitwerking.wedstrijdschemas)}\n\n` : ''}
${data.sections.uitwerking.spelregels ? `Spelregels:\n${stripHtml(data.sections.uitwerking.spelregels)}\n\n` : ''}
${data.sections.uitwerking.materiaallijst ? `Gedetailleerde materiaallijst:\n${stripHtml(data.sections.uitwerking.materiaallijst)}\n\n` : ''}
        `
      },
      {
        title: '4. CALAMITEITENPLAN',
        content: `
${data.sections.calamiteitenplan.maatregelen ? `Maatregelen n.a.v. risico-analyse:\n${stripHtml(data.sections.calamiteitenplan.maatregelen)}\n\n` : ''}
${data.sections.calamiteitenplan.alternatiefProgramma ? `Alternatief programma:\n${stripHtml(data.sections.calamiteitenplan.alternatiefProgramma)}\n\n` : ''}
${data.sections.calamiteitenplan.plattegrond ? `Plattegrond:\n${stripHtml(data.sections.calamiteitenplan.plattegrond)}\n\n` : ''}
        `
      },
      {
        title: '5. BIJLAGEN',
        content: `
${data.sections.bijlagen.behoefteonderzoek ? `Behoefteonderzoek:\n${stripHtml(data.sections.bijlagen.behoefteonderzoek)}\n\n` : ''}
${data.sections.bijlagen.omgevingsanalyse ? `Omgevingsanalyse:\n${stripHtml(data.sections.bijlagen.omgevingsanalyse)}\n\n` : ''}
${data.sections.bijlagen.promotiemateriaal ? `Promotiemateriaal voor naschoolse activiteit:\n${stripHtml(data.sections.bijlagen.promotiemateriaal)}\n\n` : ''}
        `
      }
    ]

    return sections.map(section => 
      section.title + '\n' + '='.repeat(section.title.length) + '\n\n' + section.content.trim()
    ).join('\n\n')
  }

  // Helper: Genereer volledige HTML van het draaiboek (voor Word-export)
  const generateFullHtml = () => {
    let html = `<h1>${data.title}</h1>`
    html += `<p><b>Gemaakt op:</b> ${data.createdAt.toLocaleDateString('nl-NL')}<br/><b>Laatst bijgewerkt:</b> ${data.updatedAt.toLocaleDateString('nl-NL')}</p>`

    const addSection = (title: string, content: string) => {
      if (content && content.trim()) {
        html += `<h2>${title}</h2>`
        html += `<div>${content}</div>`
      }
    }

    // 1. Inleiding
    html += '<h2>1. INLEIDING</h2>'
    addSection('Algemene inleiding', data.sections.inleiding.algemeneInleiding)
    addSection('Verantwoording van de keuze van de activiteiten', data.sections.inleiding.verantwoordingActiviteiten)
    addSection('Verantwoording van de keuze van de externe samenwerkingspartner', data.sections.inleiding.verantwoordingPartner)
    addSection('Doelstelling voor de kinderen', data.sections.inleiding.doelstellingKinderen)
    addSection('Persoonlijke doelstelling voor de projectleden', data.sections.inleiding.persoonlijkeDoelstelling)

    // 2. Planning
    html += '<h2>2. PLANNING VOOR-TIJDENS-NA DE ACTIVITEIT</h2>'
    addSection('Planning van alle activiteiten', data.sections.planning.fasenPlanning)
    addSection('PR van de naschoolse activiteit', data.sections.planning.prStrategie)
    addSection('Globale schets van dagprogramma', data.sections.planning.globaalDagprogramma)
    addSection('6 W\'s Opening', data.sections.planning.sesWs.opening)
    addSection('6 W\'s Dagprogramma', data.sections.planning.sesWs.dagprogramma)
    addSection('6 W\'s Schema', data.sections.planning.sesWs.schema)
    addSection('6 W\'s Afsluiting', data.sections.planning.sesWs.afsluiting)
    addSection('Communicatiematrix', data.sections.planning.communicatiematrix)

    // 3. Uitwerking
    html += '<h2>3. GEDETAILLEERDE UITWERKING VAN DE ACTIVITEIT</h2>'
    addSection('Voorbereiding a.d.h.v. een LVF', data.sections.uitwerking.voorbereiding)
    addSection('Opening en afsluiting concreet uitgewerkt', data.sections.uitwerking.openingAfsluiting)
    addSection('Verantwoordelijkheden per onderdeel', data.sections.uitwerking.verantwoordelijkheden)
    addSection('Wedstrijdschema\'s', data.sections.uitwerking.wedstrijdschemas)
    addSection('Spelregels', data.sections.uitwerking.spelregels)
    addSection('Gedetailleerde materiaallijst', data.sections.uitwerking.materiaallijst)

    // 4. Calamiteitenplan
    html += '<h2>4. CALAMITEITENPLAN</h2>'
    addSection('Maatregelen n.a.v. risico-analyse', data.sections.calamiteitenplan.maatregelen)
    addSection('Alternatief programma', data.sections.calamiteitenplan.alternatiefProgramma)
    addSection('Plattegrond', data.sections.calamiteitenplan.plattegrond)

    // 5. Bijlagen
    html += '<h2>5. BIJLAGEN</h2>'
    addSection('Behoefteonderzoek', data.sections.bijlagen.behoefteonderzoek)
    addSection('Omgevingsanalyse', data.sections.bijlagen.omgevingsanalyse)
    addSection('Promotiemateriaal', data.sections.bijlagen.promotiemateriaal)

    return `<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>${html}</body></html>`
  }

  // WORD EXPORT
  const handleWordExport = async () => {
    setIsExporting(true)
    try {
      const html = generateFullHtml()
      const docxBlob = htmlDocx.asBlob(html)
      const url = URL.createObjectURL(docxBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.title.replace(/\s+/g, '_')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  // PDF EXPORT
  const handlePDFExport = async () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF('p', 'pt', 'a4')
      let y = 40
      doc.setFontSize(18)
      doc.text(data.title, 40, y)
      y += 24
      doc.setFontSize(10)
      doc.text(`Gemaakt op: ${data.createdAt.toLocaleDateString('nl-NL')}`, 40, y)
      y += 14
      doc.text(`Laatst bijgewerkt: ${data.updatedAt.toLocaleDateString('nl-NL')}`, 40, y)
      y += 20

      // Helper om HTML te extraheren en tabellen te vinden
      const html = generateFullHtml()
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const sections = Array.from(tempDiv.querySelectorAll('h2, h3, div, table, p'))
      for (const el of sections) {
        if (el.tagName === 'H2' || el.tagName === 'H3') {
          y += 18
          doc.setFontSize(14)
          doc.text(el.textContent || '', 40, y)
          y += 6
        } else if (el.tagName === 'DIV' || el.tagName === 'P') {
          doc.setFontSize(10)
          const text = el.textContent || ''
          const lines = doc.splitTextToSize(text, 500)
          doc.text(lines, 40, y)
          y += lines.length * 12
        } else if (el.tagName === 'TABLE') {
          autoTable(doc, {
            html: el as HTMLTableElement,
            startY: y,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [220, 220, 220] },
          })
          y = (doc as any).lastAutoTable.finalY + 10
        }
      }
      doc.save(`${data.title.replace(/\s+/g, '_')}.pdf`)
    } finally {
      setIsExporting(false)
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