export interface DraaiboekData {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  sections: {
    inleiding: {
      algemeneInleiding: string
      verantwoordingActiviteiten: string
      verantwoordingPartner: string
      doelstellingKinderen: string
      persoonlijkeDoelstelling: string
    }
    planning: {
      fasenPlanning: string
      prStrategie: string
      globaalDagprogramma: string
      sesWs: {
        algemeen: string
        opening: string
        dagprogramma: string
        schema: string
        afsluiting: string
      }
      communicatiematrix: string
    }
    uitwerking: {
      voorbereiding: string
      openingAfsluiting: string
      verantwoordelijkheden: string
      wedstrijdschemas: string
      spelregels: string
      materiaallijst: string
    }
    calamiteitenplan: {
      maatregelen: string
      alternatiefProgramma: string
      plattegrond: string
    }
    bijlagen: {
      behoefteonderzoek: string
      omgevingsanalyse: string
      promotiemateriaal: string
    }
  }
  progress: number
}

export type DraaiboekSection = 'inleiding' | 'planning' | 'uitwerking' | 'calamiteitenplan' | 'bijlagen'

export interface SectionConfig {
  id: DraaiboekSection
  title: string
  icon: string
  subsections: {
    id: string
    title: string
    description: string
    placeholder?: string
  }[]
}