'use client'

import { useState } from 'react'

interface TableEditorProps {
  onInsertTable: (tableHtml: string) => void
}

interface TableCell {
  content: string
  isHeader: boolean
}

export default function TableEditor({ onInsertTable }: TableEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [tableData, setTableData] = useState<TableCell[][]>([])
  const [firstRowHeader, setFirstRowHeader] = useState(true)

  const initializeTable = (newRows: number, newCols: number) => {
    const newTable: TableCell[][] = []
    for (let i = 0; i < newRows; i++) {
      const row: TableCell[] = []
      for (let j = 0; j < newCols; j++) {
        row.push({
          content: i === 0 && firstRowHeader ? `Header ${j + 1}` : `Cel ${i + 1}-${j + 1}`,
          isHeader: i === 0 && firstRowHeader
        })
      }
      newTable.push(row)
    }
    setTableData(newTable)
  }

  const handleOpen = () => {
    setIsOpen(true)
    initializeTable(rows, cols)
  }

  const handleRowsChange = (newRows: number) => {
    setRows(newRows)
    if (tableData.length > 0) {
      initializeTable(newRows, cols)
    }
  }

  const handleColsChange = (newCols: number) => {
    setCols(newCols)
    if (tableData.length > 0) {
      initializeTable(rows, newCols)
    }
  }

  const handleHeaderToggle = (checked: boolean) => {
    setFirstRowHeader(checked)
    if (tableData.length > 0) {
      initializeTable(rows, cols)
    }
  }

  const updateCell = (rowIndex: number, colIndex: number, content: string) => {
    const newTableData = [...tableData]
    newTableData[rowIndex][colIndex].content = content
    setTableData(newTableData)
  }

  const generateTableHtml = () => {
    let html = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">\n'
    
    tableData.forEach((row, rowIndex) => {
      html += '  <tr>\n'
      row.forEach((cell, colIndex) => {
        const tag = cell.isHeader ? 'th' : 'td'
        const style = cell.isHeader 
          ? 'border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;'
          : 'border: 1px solid #ddd; padding: 8px;'
        html += `    <${tag} style="${style}">${cell.content}</${tag}>\n`
      })
      html += '  </tr>\n'
    })
    
    html += '</table>'
    return html
  }

  const insertPresetTable = (preset: string) => {
    let presetData: TableCell[][] = []
    
    switch (preset) {
      case 'communicatiematrix':
        presetData = [
          [
            { content: 'Wanneer', isHeader: true },
            { content: 'Wat', isHeader: true },
            { content: 'Wie', isHeader: true },
            { content: 'Wie is verantwoordelijk (naam)', isHeader: true },
            { content: 'Hoe', isHeader: true },
            { content: 'Opmerkingen', isHeader: true }
          ],
          [
            { content: '3 weken voor', isHeader: false },
            { content: 'Aanmelding activiteit', isHeader: false },
            { content: 'Ouders', isHeader: false },
            { content: 'Emma (hoofdorganisator)', isHeader: false },
            { content: 'Flyer + WhatsApp', isHeader: false },
            { content: 'Deadline 1 week voor', isHeader: false }
          ],
          [
            { content: '1 week voor', isHeader: false },
            { content: 'Programma uitleg', isHeader: false },
            { content: 'Kinderen', isHeader: false },
            { content: 'Lisa (begeleider)', isHeader: false },
            { content: 'Presentatie in klas', isHeader: false },
            { content: 'Regels en verwachtingen', isHeader: false }
          ],
          [
            { content: 'Dag zelf', isHeader: false },
            { content: 'Dagcoördinatie', isHeader: false },
            { content: 'Team', isHeader: false },
            { content: 'Mark (coördinator)', isHeader: false },
            { content: 'WhatsApp groep', isHeader: false },
            { content: 'Alleen voor urgente zaken', isHeader: false }
          ]
        ]
        break
      case 'fasenplanning':
        presetData = [
          [
            { content: 'Fase', isHeader: true },
            { content: 'Activiteit', isHeader: true },
            { content: 'Tijdstip', isHeader: true },
            { content: 'Verantwoordelijke', isHeader: true }
          ],
          [
            { content: 'Voorbereiding', isHeader: false },
            { content: 'Contact externe partner', isHeader: false },
            { content: '4 weken voor', isHeader: false },
            { content: 'Hoofdorganisator', isHeader: false }
          ],
          [
            { content: 'Uitvoering', isHeader: false },
            { content: 'Ontvangst deelnemers', isHeader: false },
            { content: '09:00 - 09:30', isHeader: false },
            { content: 'Registratieteam', isHeader: false }
          ],
          [
            { content: 'Nazorg', isHeader: false },
            { content: 'Evaluatie', isHeader: false },
            { content: '1 dag na', isHeader: false },
            { content: 'Hoofdorganisator', isHeader: false }
          ]
        ]
        break
      case '6ws':
        presetData = [
          [
            { content: 'Wie', isHeader: true },
            { content: 'Wat', isHeader: true },
            { content: 'Waar', isHeader: true },
            { content: 'Wanneer', isHeader: true },
            { content: 'Waarom', isHeader: true },
            { content: 'Wie organiseert', isHeader: true }
          ],
          [
            { content: 'Kinderen groep 5-8', isHeader: false },
            { content: 'Multisport clinic', isHeader: false },
            { content: 'Sporthal De Regenboog', isHeader: false },
            { content: 'Zaterdag 22 maart, 09:00-12:30', isHeader: false },
            { content: 'Kinderen laten kennismaken met sport', isHeader: false },
            { content: 'ALO-studenten + FC Vooruit', isHeader: false }
          ],
          [
            { content: '40 deelnemers, 8-12 jaar', isHeader: false },
            { content: '6 verschillende sporten', isHeader: false },
            { content: 'Grote zaal + 4 kleine ruimtes', isHeader: false },
            { content: '3,5 uur inclusief pauze', isHeader: false },
            { content: 'Behoefteonderzoek toont interesse', isHeader: false },
            { content: '4 studenten + 2 trainers', isHeader: false }
          ]
        ]
        break
      case 'calamiteitenplan':
        presetData = [
          [
            { content: 'Risico', isHeader: true },
            { content: 'Kans', isHeader: true },
            { content: 'Impact', isHeader: true },
            { content: 'Maatregel', isHeader: true }
          ],
          [
            { content: 'Blessure kind', isHeader: false },
            { content: 'Middel', isHeader: false },
            { content: 'Hoog', isHeader: false },
            { content: 'EHBO-er aanwezig', isHeader: false }
          ],
          [
            { content: 'Slecht weer', isHeader: false },
            { content: 'Hoog', isHeader: false },
            { content: 'Middel', isHeader: false },
            { content: 'Binnen programma', isHeader: false }
          ],
          [
            { content: 'Partner komt niet', isHeader: false },
            { content: 'Laag', isHeader: false },
            { content: 'Hoog', isHeader: false },
            { content: 'Backup begeleider', isHeader: false }
          ]
        ]
        break
    }
    
    if (presetData.length > 0) {
      setTableData(presetData)
      setRows(presetData.length)
      setCols(presetData[0].length)
      setFirstRowHeader(true)
    }
  }

  const handleInsertTable = () => {
    const tableHtml = generateTableHtml()
    onInsertTable(tableHtml)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center text-sm"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M8 4v16m8-16v16" />
        </svg>
        Tabel
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Tabel maken</h3>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Voorgemaakte tabellen:</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => insertPresetTable('communicatiematrix')}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Communicatiematrix
            </button>
            <button
              onClick={() => insertPresetTable('fasenplanning')}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Fasenplanning
            </button>
            <button
              onClick={() => insertPresetTable('6ws')}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              6 W's
            </button>
            <button
              onClick={() => insertPresetTable('calamiteitenplan')}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Calamiteitenplan
            </button>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rijen:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => handleRowsChange(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kolommen:</label>
              <input
                type="number"
                min="1"
                max="8"
                value={cols}
                onChange={(e) => handleColsChange(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={firstRowHeader}
                  onChange={(e) => handleHeaderToggle(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Eerste rij als header</span>
              </label>
            </div>
          </div>
        </div>

        {tableData.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Tabel bewerken:</h4>
            <div className="border rounded overflow-hidden">
              <table className="w-full">
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className={`border p-2 ${cell.isHeader ? 'bg-gray-100' : ''}`}>
                          <input
                            type="text"
                            value={cell.content}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            className={`w-full p-1 border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 ${cell.isHeader ? 'font-bold' : ''}`}
                            placeholder={cell.isHeader ? 'Header' : 'Cel inhoud'}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuleren
          </button>
          <button
            onClick={handleInsertTable}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={tableData.length === 0}
          >
            Tabel invoegen
          </button>
        </div>
      </div>
    </div>
  )
}