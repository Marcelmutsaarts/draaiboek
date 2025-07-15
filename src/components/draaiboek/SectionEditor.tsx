'use client'

import { useState } from 'react'
import { DraaiboekData, DraaiboekSection } from '@/types/draaiboek'
import AIHelpPanel from './AIHelpPanel'
import TableEditor from './TableEditor'

interface Props {
  section: DraaiboekSection
  subsection: string
  data: DraaiboekData
  onUpdate: (section: DraaiboekSection, subsection: string, value: string) => void
  onNestedUpdate: (section: DraaiboekSection, parentKey: string, childKey: string, value: string) => void
}

const sectionTitles = {
  inleiding: 'Inleiding',
  planning: 'Planning',
  uitwerking: 'Uitwerking',
  calamiteitenplan: 'Calamiteitenplan',
  bijlagen: 'Bijlagen'
}

const subsectionConfig: { [key: string]: { title: string; description: string; placeholder: string; example: string } } = {
  // Inleiding
  algemeneInleiding: {
    title: 'Algemene inleiding',
    description: 'Beschrijf wat je hebt gedaan en waarom je dit project hebt gekozen.',
    placeholder: 'Vertel over je project: wat heb je gedaan en waarom heb je dit gekozen?',
    example: `Voor mijn eerste extracurriculaire project als ALO-student heb ik een multisport clinic georganiseerd voor kinderen van groep 5-8 op basisschool De Regenboog. Ik heb gekozen voor een multisport clinic omdat uit mijn behoefteonderzoek bleek dat 78% van de kinderen graag nieuwe sporten wil proberen en er behoefte was aan meer beweging naast de reguliere gymlessen. Het doel was om kinderen kennis te laten maken met verschillende sporten en ze te laten ervaren dat bewegen leuk en toegankelijk is. De clinic vond plaats op 22 maart 2024 in de sporthal van de school, met hulp van voetbalvereniging FC Vooruit als externe partner die verschillende stations verzorgde. Dit project past bij mijn opleiding omdat ik leer hoe je als toekomstige leerkracht extracurriculaire activiteiten kunt organiseren en samenwerken met externe partners.`
  },
  verantwoordingActiviteiten: {
    title: 'Verantwoording van de keuze van de activiteiten',
    description: 'Onderbouwing waarom specifieke activiteiten gekozen zijn, gebaseerd op omgevingsanalyse en behoefteonderzoek, met bronvermelding.',
    placeholder: 'Beschrijf waarom deze activiteiten gekozen zijn...',
    example: `Uit mijn behoefteonderzoek onder 65 kinderen (groep 5-8) bleek dat 78% van de kinderen graag nieuwe sporten wil proberen en 65% vindt de huidige gymlessen te kort. Daarom heb ik gekozen voor een multisport clinic met 6 verschillende stations: voetbal, basketbal, tennis, atletiek, badminton en een obstakelparcours. Deze mix zorgt voor variatie en ieder kind kan zijn of haar favoriete activiteit vinden. De activiteiten zijn aangepast aan de leeftijd (8-12 jaar) en alle kinderen kunnen meedoen, ook degenen die normaal niet zo sportief zijn. Als ALO-student was het belangrijk dat de clinic educatief is én leuk. Bronnen: enquête onder kinderen (maart 2024), interview met gymleraar (A. Jansen, 5 maart 2024), gesprek met directeur (M. Peters, 8 maart 2024).`
  },
  verantwoordingPartner: {
    title: 'Verantwoording van de keuze van de externe samenwerkingspartner',
    description: 'Uitleg waarom voor een bepaalde externe partner is gekozen en hoe deze bijdraagt aan de doelstellingen.',
    placeholder: 'Beschrijf waarom deze partner gekozen is...',
    example: `Ik heb gekozen voor voetbalvereniging FC Vooruit als externe partner omdat zij veel ervaring hebben met jeugdclinics en beschikken over gekwalificeerde jeugdtrainers. Tijdens mijn oriëntatie bleek dat zij wekelijks clinics geven en alle benodigde materialen hebben. Hun trainers zijn gewend om met kinderen te werken en richten zich op plezier in plaats van prestatie, wat perfect past bij mijn doelstelling. Als ALO-student vond ik het belangrijk om te leren samenwerken met externe partners, zoals beschreven in mijn studieprogramma. FC Vooruit was bereid om gratis mee te werken omdat ze dit zien als maatschappelijke betrokkenheid. Contact: trainer Jan de Vries (j.devries@fcvooruit.nl, 06-12345678).`
  },
  doelstellingKinderen: {
    title: 'Doelstelling voor de kinderen',
    description: 'Concrete, meetbare doelen die de kinderen moeten bereiken tijdens de activiteit.',
    placeholder: 'Formuleer concrete doelen voor de kinderen...',
    example: `Na de multisport clinic kunnen kinderen:
- Minstens 3 nieuwe sporten benoemen die zij hebben geprobeerd
- Aangeven welke sport hen het meest aanspreekt en waarom
- Basisregels uitleggen van minimaal 2 sporten
- Samenwerken in een team tijdens de activiteiten
- Respect tonen voor medespelers en begeleiders
- Plezier hebben in bewegen, onafhankelijk van hun sportniveau
- Vertellen wat ze geleerd hebben van de externe trainer

Meetbaar maken:
- Korte evaluatie na afloop met 5 vragen
- Observatie tijdens activiteit aan de hand van checklijst
- Feedback vragen aan begeleiders en externe partner`
  },
  persoonlijkeDoelstelling: {
    title: 'Persoonlijke doelstelling voor de projectleden',
    description: 'Wat de organisatoren zelf willen bereiken met het organiseren van deze activiteit.',
    placeholder: 'Beschrijf je persoonlijke doelen...',
    example: `Mijn persoonlijke doelen als ALO-student bij dit eerste extracurriculaire project zijn:
- Ervaring opdoen met het organiseren van grote groepsactiviteiten (competentie: onderwijskundig handelen)
- Leren samenwerken met externe partners en netwerken opbouwen
- Mijn communicatieve vaardigheden verbeteren door kinderen te begeleiden
- Inzicht krijgen in de behoeften van kinderen op het gebied van beweging
- Bijdragen aan de sociale ontwikkeling van kinderen in de wijk
- Mijn organisatorische vaardigheden ontwikkelen
- Leren reflecteren op mijn eigen handelen tijdens de activiteit
- Ervaring opdoen met het uitvoeren van een behoefteonderzoek
- Beter begrijpen hoe extracurriculaire activiteiten het reguliere onderwijs kunnen aanvullen

Dit project helpt me om de competenties uit mijn opleiding in de praktijk toe te passen.`
  },
  // Planning
  fasenPlanning: {
    title: 'Planning van alle activiteiten in voor-tijdens-na de activiteit',
    description: 'Overzicht van alle taken en activiteiten verdeeld over de drie fasen van het project.',
    placeholder: 'Beschrijf de planning per fase...',
    example: `<h3>FASENPLANNING</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Fase</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Activiteit</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Tijdstip</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Verantwoordelijke</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Voorbereiding</strong></td>
    <td style="border: 1px solid #ddd; padding: 8px;">Contact leggen externe partner</td>
    <td style="border: 1px solid #ddd; padding: 8px;">4 weken voor</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Hoofdorganisator</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Uitvoering</strong></td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ontvangst deelnemers</td>
    <td style="border: 1px solid #ddd; padding: 8px;">09:00 - 09:30</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Registratieteam</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Nazorg</strong></td>
    <td style="border: 1px solid #ddd; padding: 8px;">Evaluatie team</td>
    <td style="border: 1px solid #ddd; padding: 8px;">1 dag na</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Hoofdorganisator</td>
  </tr>
</table>`
  },
  prStrategie: {
    title: 'PR van de naschoolse activiteit',
    description: 'Strategie om voldoende deelnemers te werven voor de activiteit.',
    placeholder: 'Beschrijf je PR strategie...',
    example: `PROMOTIESTRATEGIE:

WEEK 1: Informatie verzamelen
- Flyers ontwerpen met alle belangrijke info
- Sociale media posts voorbereiden
- Leerkrachten informeren

WEEK 2: Actieve promotie
- Flyers uitdelen bij school (toestemming gevraagd)
- Facebook post in lokale oudergroepen
- Mond-tot-mond reclame bij ouders

WEEK 3: Nazorg en aanmeldingen
- Herinneringen versturen
- Vragen beantwoorden
- Definitieve aanmeldingen verzamelen

DOEL: Minimaal 25 kinderen, maximaal 40 kinderen`
  },
  globaalDagprogramma: {
    title: 'Globale schets van dagprogramma voor de deelnemers',
    description: 'Overzicht van het verloop van de dag vanuit het perspectief van de kinderen.',
    placeholder: 'Schets het globale dagprogramma...',
    example: `SPORTDAG PROGRAMMA - 15 maart 2024

9:00 - 9:30: Aankomst en welkom
→ Kinderen komen binnen, krijgen naamsticker
→ Warme chocolademelk en koekje
→ Kennismaken met begeleiders

9:30 - 10:00: Warming-up en uitleg
→ Gezamenlijke warming-up met muziek
→ Uitleg van het programma
→ Verdeling in groepjes

10:00 - 11:30: Sportactiviteiten ronde 1
→ Groepjes roteren langs verschillende sporten
→ Elke activiteit duurt 15 minuten

11:30 - 12:00: Lunch en rust
→ Broodjes en fruit
→ Vrij spelen op het plein

12:00 - 13:00: Sportactiviteiten ronde 2
→ Nieuwe sporten proberen
→ Afsluiting met gezamenlijk spel

13:00 - 13:30: Diploma uitreiking en afscheid
→ Iedereen krijgt een diploma
→ Foto's maken
→ Ophalen door ouders`
  },
  // 6 W's hoofdcategorie
  sesWs: {
    title: '6 W\'s Algemeen',
    description: 'Algemene informatie over de 6 W\'s van je activiteit. Je kunt hier een overzicht of introductie schrijven.',
    placeholder: 'Schrijf hier een algemene introductie voor je 6 W\'s planning...',
    example: `<h3>6 W'S PLANNING - MULTISPORT CLINIC</h3>

<p>Voor onze multisport clinic hebben we als organisatieteam de volgende taken verdeeld:</p>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Onderdeel</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Hoofdverantwoordelijke</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Belangrijkste taken</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Opening</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma (hoofdorganisator)</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Welkomstwoord, regels uitleggen, groepen indelen</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Dagprogramma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Lisa (timekeeper)</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Tijdschema bewaken, fluitje voor wissel</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Schema</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Mark (materiaal)</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Posten inrichten, materiaal verdelen</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Afsluiting</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Sarah (evaluatie)</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Diploma's uitdelen, evaluatie, groepsfoto</td>
  </tr>
</table>

<p><strong>ALS ORGANISATIETEAM:</strong></p>
<ul>
<li>Iedereen heeft duidelijke taken maar helpt elkaar waar nodig</li>
<li>We hebben backup-plannen voor elke situatie</li>
<li>Communicatie via WhatsApp groep "Sportdag Team"</li>
<li>Evaluatie na afloop om te leren voor volgende keer</li>
</ul>`
  },
  // 6 W's nested
  opening: {
    title: 'Opening',
    description: 'Concrete uitwerking van hoe de activiteit begint, inclusief verwelkoming en uitleg.',
    placeholder: 'Beschrijf de opening van de activiteit...',
    example: `<h3>OPENING ACTIVITEIT</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Tijd</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Activiteit</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Locatie</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Verantwoordelijke</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Materiaal</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:00</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ontvangst en registratie</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ingang sporthal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Lisa & Mark</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Naamstickers, lijst</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:15</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Welkomstwoord</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Grote gymzaal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Microfoon</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:30</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Warming-up</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Grote gymzaal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">FC Vooruit trainer</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Muziekinstallatie</td>
  </tr>
</table>

<p><strong>WELKOMSTWOORD:</strong></p>
<p>"Goedemorgen allemaal! Welkom bij onze sportdag. Ik ben Emma en dit zijn mijn helpers. Vandaag gaan we samen sporten en veel plezier maken!"</p>

<p><strong>UITLEG PROGRAMMA:</strong></p>
<ul>
<li>Tonen van het draaiboek op groot papier</li>
<li>Uitleg rotatie systeem</li>
<li>Spelregels en veiligheidsregels</li>
<li>Verdeling in groepjes van 8 kinderen</li>
</ul>`
  },
  dagprogramma: {
    title: 'Dagprogramma',
    description: 'Gedetailleerd tijdschema met alle activiteiten en hun locaties in chronologische volgorde.',
    placeholder: 'Maak een gedetailleerd tijdschema...',
    example: `<h3>GEDETAILLEERD DAGPROGRAMMA</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Tijd</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Activiteit</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Locatie</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Verantwoordelijke</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Materiaal</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">08:45 - 09:00</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Voorbereiding team</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Sporthal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Alle materialen</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:00 - 09:15</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ontvangst kinderen</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ingang sporthal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Lisa & Mark</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Naamstickers, lijst</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:15 - 09:30</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Welkom en uitleg</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Grote gymzaal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Microfoon, schema</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">12:15 - 12:30</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Afsluiting & diploma's</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Grote gymzaal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Diploma's</td>
  </tr>
</table>

<p><strong>ROTATIESYSTEEM:</strong></p>
<ul>
<li>6 groepjes van 8 kinderen</li>
<li>15 minuten per activiteit</li>
<li>Fluitje voor wisselen</li>
<li>Begeleiders blijven bij hun post</li>
</ul>`
  },
  schema: {
    title: 'Schema met uitgewerkte activiteiten en locatie',
    description: 'Tabel of overzicht met alle onderdelen, hun beschrijving en waar ze plaatsvinden.',
    placeholder: 'Maak een schema van activiteiten en locaties...',
    example: `<h3>ACTIVITEITEN SCHEMA</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Tijd</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Activiteit</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Locatie</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Begeleider</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Materiaal</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">09:45 - 10:00</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Voetbal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Veld 1</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Jan (FC Vooruit)</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Voetballen, pionnen</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">10:00 - 10:15</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Basketbal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Veld 2</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Basketballen, korven</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">12:30 - 12:45</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Prijsuitreiking</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Grote gymzaal</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Emma</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Diploma's</td>
  </tr>
</table>

<p><strong>ROTATIESYSTEEM:</strong></p>
<ul>
<li>6 groepen van 8 kinderen</li>
<li>15 minuten per activiteit</li>
<li>Fluitje voor wisselen</li>
<li>Begeleiders blijven bij hun post</li>
<li>Extra begeleiders als backup beschikbaar</li>
</ul>`
  },
  afsluiting: {
    title: 'Afsluiting',
    description: 'Concrete uitwerking van hoe de activiteit eindigt, inclusief evaluatie en afscheid.',
    placeholder: 'Beschrijf de afsluiting van de activiteit...',
    example: `<h3>AFSLUITING MULTISPORT CLINIC (12:45 - 13:00)</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Stap</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Activiteit</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Tijd</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Wat te zeggen</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">1</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Verzamelen</td>
    <td style="border: 1px solid #ddd; padding: 8px;">2 minuten</td>
    <td style="border: 1px solid #ddd; padding: 8px;">"Iedereen kom maar in een grote kring zitten. Wat hebben jullie veel gesport vandaag!"</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">2</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Evaluatie</td>
    <td style="border: 1px solid #ddd; padding: 8px;">5 minuten</td>
    <td style="border: 1px solid #ddd; padding: 8px;">"Vertel eens: wat vond je het leukste?" [Kinderen laten reageren]</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">3</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Diploma uitreiking</td>
    <td style="border: 1px solid #ddd; padding: 8px;">6 minuten</td>
    <td style="border: 1px solid #ddd; padding: 8px;">"Jullie hebben allemaal zo goed meegedaan dat iedereen een diploma krijgt!"</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">4</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Afscheid</td>
    <td style="border: 1px solid #ddd; padding: 8px;">2 minuten</td>
    <td style="border: 1px solid #ddd; padding: 8px;">"Bedankt voor deze leuke dag! Jullie waren fantastisch. Veel plezier verder met sporten!"</td>
  </tr>
</table>

<p><strong>EXTRA TIPS:</strong></p>
<ul>
<li>Groepsfoto maken na afscheid</li>
<li>Elk kind persoonlijk feliciteren</li>
<li>Ouders bedanken voor het vertrouwen</li>
</ul>

<p><strong>ALS ALO-STUDENT:</strong></p>
<p>Dit was mijn eerste keer dat ik een groep kinderen moest toespreken. Ik heb geleerd hoe belangrijk een goede afsluiting is.</p>`
  },
  communicatiematrix: {
    title: 'Communicatiematrix',
    description: 'Overzicht van wie, wanneer, hoe en over wat gecommuniceerd wordt tijdens de activiteit.',
    placeholder: 'Maak een communicatieoverzicht...',
    example: `<h3>COMMUNICATIEMATRIX</h3>

<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Wie</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Wanneer</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Hoe</th>
    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">Over wat</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Ouders</td>
    <td style="border: 1px solid #ddd; padding: 8px;">3 weken voor</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Flyer + WhatsApp</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Aanmelding, tijd, locatie</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Kinderen</td>
    <td style="border: 1px solid #ddd; padding: 8px;">1 week voor</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Presentatie klas</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Wat gaan we doen, regels</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Leerkrachten</td>
    <td style="border: 1px solid #ddd; padding: 8px;">2 weken voor</td>
    <td style="border: 1px solid #ddd; padding: 8px;">E-mail</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Ondersteuning, informatie</td>
  </tr>
</table>

<p><strong>NOODCONTACTEN:</strong></p>
<ul>
<li>Hoofdorganisator: Emma (06-12345678)</li>
<li>EHBO: Mark (06-87654321)</li>
<li>Facilitaire zaken: Lisa (06-11223344)</li>
</ul>`
  },
  // Uitwerking
  voorbereiding: {
    title: 'Voorbereiding a.d.h.v. een LVF',
    description: 'Lesvoorbereiding formulier of vergelijkbare structuur voor elk onderdeel van de activiteit.',
    placeholder: 'Werk de voorbereiding uit...',
    example: `LESVOORBEREIDING FORMULIER - SPORTDAG

DOELGROEP: Kinderen 8-12 jaar (groep 5-8)
AANTAL DEELNEMERS: 30 kinderen
TIJDSDUUR: 4 uur (9:00-13:00)
LOCATIE: Sporthal De Regenboog

DOELSTELLINGEN:
- Cognitief: Kinderen leren basisregels van 6 verschillende sporten
- Sociaal: Samenwerken in teams, respect voor elkaar
- Motorisch: Verschillende bewegingsvaardigheden ontwikkelen
- Affectief: Plezier hebben in bewegen

VOORKENNIS:
- Kinderen hebben basiservaring met gym op school
- Niet alle kinderen zijn even sportief
- Verschillende motorische vaardigheden

METHODIEK:
- Rotatiesysteem: kleine groepjes, veel variatie
- Positieve benadering: iedereen kan meedoen
- Gedifferentieerd: makkelijker/moeilijker varianten
- Spelgerichte aanpak: plezier centraal

MATERIAAL:
- Sportmateriaal per activiteit (zie materiaallijst)
- EHBO-koffer
- Microfoon voor instructies
- Scorelijsten en stiften

EVALUATIE:
- Tijdens activiteit: observatie engagement
- Na afloop: korte evaluatie met kinderen
- Teambespreking: wat ging goed/beter
- Ouder-feedback via kort formulier`
  },
  openingAfsluiting: {
    title: 'Opening en afsluiting concreet uitgewerkt',
    description: 'Stap-voor-stap beschrijving van wat er precies gezegd en gedaan wordt bij het begin en einde.',
    placeholder: 'Beschrijf opening en afsluiting stap voor stap...',
    example: `OPENING (9:15 - 9:30)

STAP 1: Welkom (2 minuten)
"Goedemorgen allemaal! Welkom bij onze super sportdag! Ik zie alleen maar vrolijke gezichten. Mijn naam is Emma en ik ga jullie vandaag begeleiden. Wie heeft er zin in sporten?" [Wachten op reactie]

STAP 2: Voorstelling team (3 minuten)
"Dit zijn mijn helpers: Lisa, Mark, Sarah en Tom. En dit is Jan van voetbalclub FC Vooruit. Hij gaat ons helpen met alle sporten. Zwaai maar naar Jan!"

STAP 3: Uitleg dag (5 minuten)
"Vandaag gaan we 6 verschillende sporten proberen. Kijk maar..." [Grote poster tonen]
- Voetbal met Jan
- Basketbal met Emma
- Tennis met Lisa
- Atletiek met Mark
- Badminton met Sarah
- Hindernisbaan met Tom

STAP 4: Regels uitleggen (3 minuten)
"Drie belangrijke regels:
1. Luister naar je begeleider
2. Help elkaar en moedig aan
3. Heb plezier, winnen is niet het belangrijkste!"

STAP 5: Groepsindeling (2 minuten)
"Jullie zijn al in groepjes verdeeld. Groep 1 begint bij..." [Alle groepen langs]

AFSLUITING (12:45 - 13:00)

STAP 1: Verzamelen (2 minuten)
"Iedereen kom maar in een grote kring zitten. Wat hebben jullie veel gesport vandaag!"

STAP 2: Evaluatie (5 minuten)
"Vertel eens: wat vond je het leukste?" [Kinderen laten reageren]
"Welke sport ga je misschien thuis verder doen?"

STAP 3: Diploma uitreiking (6 minuten)
"Jullie hebben allemaal zo goed meegedaan dat iedereen een diploma krijgt!"
[Elk kind persoonlijk feliciteren]

STAP 4: Afscheid (2 minuten)
"Bedankt voor deze leuke dag! Jullie waren fantastisch. Veel plezier verder met sporten!"
[Groepsfoto maken]`
  },
  verantwoordelijkheden: {
    title: 'Verantwoordelijkheden per onderdeel',
    description: 'Duidelijke taakverdeling tussen alle betrokkenen voor elk onderdeel van de activiteit.',
    placeholder: 'Verdeel de verantwoordelijkheden...',
    example: `TAAKVERDELING SPORTDAG

HOOFDORGANISATOR: Emma
- Algehele coordinatie
- Communicatie met alle partijen
- Tijdsbewaking
- Microfoontaken (welkom, uitleg, afsluiting)
- Problemen oplossen

EXTERNE PARTNER: Jan (FC Vooruit)
- Voetbalactiviteiten begeleiden
- Warming-up leiden
- Sportadvies aan kinderen
- Materiaal voetbal meenemen

BEGELEIDERS:
Lisa: 
- Basketbal post
- Ontvangst kinderen (9:00-9:15)
- Groepsindeling assisteren

Mark:
- Atletiek post
- EHBO-verantwoordelijke
- Materiaal ophalen/terugbrengen

Sarah:
- Badminton post
- Pauze organiseren
- Foto's maken

Tom:
- Hindernisbaan post
- Opruimen na afloop
- Technische ondersteuning

OUDER-VRIJWILLIGERS:
Mevrouw Jansen: Catering pauze
Meneer Bakker: Registratie + diploma's
Mevrouw Peters: Materiaal uitdelen
Meneer Vos: Algemene ondersteuning

SCHOOL:
Conciërge: Faciliteiten en sleutels
Leerkracht: Backup ondersteuning
Directeur: Eindverantwoordelijkheid

BACKUP-REGELING:
- Bij ziekte begeleider: ouder-vrijwilligers nemen over
- Bij slecht weer: gymleraar assisteert
- Bij technische problemen: conciërge contacteren`
  },
  wedstrijdschemas: {
    title: 'Wedstrijdschema\'s (indien van toepassing)',
    description: 'Overzicht van eventuele competitie-elementen met uitleg waarom deze gekozen zijn.',
    placeholder: 'Beschrijf eventuele wedstrijdschema\'s...',
    example: `WEDSTRIJDSCHEMA SPORTDAG

BELANGRIJKE KEUZE: Geen echte wedstrijden!
Reden: Alle kinderen moeten plezier hebben, niet alleen de beste sporters.

WEL: Leuke uitdagingen en spelletjes

TEAMCHALLENGES (geen punten, wel plezier):

11:45 - 12:00: "Iedereen doet mee" challenges
- Groep 1: Hoeveel keer kunnen we samen de bal overgooien?
- Groep 2: Maken we samen 20 basketbalschoten?
- Groep 3: Wie kan het langst pingpongballen hooghouden?
- Groep 4: Hoeveel meter ver springen we bij elkaar?
- Groep 5: Kunnen we 5 shuttles tegelijk in de lucht houden?

12:00 - 12:15: "Alle groepen samen" uitdaging
- Alle kinderen maken samen 1 grote menselijke piramide
- Foto voor de eeuwigheid
- Iedereen wint!

12:15 - 12:30: "Talent showcase"
- Kinderen mogen laten zien wat ze het best kunnen
- Geen beoordeling, alleen aanmoediging
- Bijzondere talenten worden gevierd

BELONINGEN:
- Iedereen krijgt hetzelfde diploma
- Geen 1e, 2e, 3e plaats
- Wel speciale erkenning voor: mooiste teamwork, beste aanmoediging, grootste inzet

WAAROM DEZE KEUZE?
- Alle kinderen voelen zich succesvol
- Focus op plezier, niet op presteren
- Samenwerking belangrijker dan concurrentie
- Iedereen gaat met een goed gevoel naar huis`
  },
  spelregels: {
    title: 'Spelregels',
    description: 'Duidelijke regels die aangeven hoe de activiteiten verlopen en wat van deelnemers verwacht wordt.',
    placeholder: 'Formuleer duidelijke spelregels...',
    example: `SPELREGELS SPORTDAG

ALGEMENE REGELS:
1. Luister altijd naar je begeleider
2. Help elkaar en moedig elkaar aan
3. Heb plezier - winnen is niet het belangrijkste
4. Respecteer het materiaal
5. Blijf bij je groepje

PER ACTIVITEIT:

VOETBAL:
- Spelen met zachte bal
- Iedereen raakt minstens 1x de bal
- Geen keeper, wel doeltjes
- Bij ruzie: bal naar begeleider

BASKETBAL:
- Lagere basket (2 meter)
- Iedereen mag schieten
- Samen tellen hoeveel raak
- Geen contact, wel verdedigen

TENNIS:
- Grote, zachte ballen
- Korte rackets
- Bal mag 2x stuiten
- Spelletjes, geen echte wedstrijd

ATLETIEK:
- Geen tijden bijhouden
- Iedereen probeert zijn best
- Helpen elkaar met aanmoedigen
- Veiligheid eerst bij springen

BADMINTON:
- Korte service lijn
- Shuttle mag vallen
- Samen rally's maken
- Afwisselend slaan

HINDERNISBAAN:
- Op eigen tempo
- Helpen elkaar
- Niet duwen of voordringen
- Één voor één over moeilijke stukken

PAUZE REGELS:
- Handen wassen voor eten
- Ruimen samen op
- Binnen blijven als het regent
- Rustig praten

VEILIGHEIDSREGELS:
- Pijn of ongelukje? Meteen naar begeleider
- Rennen alleen tijdens de activiteit
- Geen gevaarlijke spelletjes
- Drinken bij elke activiteit

CONSEQUENTIES:
- Regel vergeten? Vriendelijke herinnering
- Blijft moeilijk? Kort time-out
- Echt probleem? Praten met hoofdbegeleider
- Gevaarlijk gedrag? Ouders bellen

POSITIEVE BEKRACHTIGING:
- Complimenten voor good gedrag
- Aanmoedigen van moeite
- Teamwork extra benadrukken
- Plezier staat voorop!`
  },
  materiaallijst: {
    title: 'Gedetailleerde materiaallijst',
    description: 'Compleet overzicht van alle benodigde materialen, inclusief wie wat meeneemt or regelt.',
    placeholder: 'Maak een compleet overzicht van materialen...',
    example: `SPORTMATERIAAL (verzorgd door FC Vooruit):
- 20 voetballen, 10 basketballen, 15 tennisrackets
- 6 basketbalkorven (opblaasbaar)
- Pionnen, hoepels, springtouwen

ORGANISATIE MATERIAAL (verzorgd door school):
- Registratietafels en stoelen
- Geluidsinstallatie met microfoon
- EHBO-koffer
- Naamstickers en stiften

CATERING (verzorgd door vrijwilligers):
- 100 bekers, 50 flessen water
- Fruit voor tussendoor
- Koelbox met ijsjes als beloning

ADMINISTRATIE:
- Deelnemerslijsten
- Evaluatieformulieren
- Camera voor foto's`
  },
  // Calamiteitenplan
  maatregelen: {
    title: 'Maatregelen n.a.v. risico-analyse',
    description: 'Beschrijving van hoe gehandeld wordt bij verschillende soorten calamiteiten.',
    placeholder: 'Beschrijf maatregelen voor verschillende scenario\'s...',
    example: `RISICO-ANALYSE EN MAATREGELEN

| **Risico** | **Kans** | **Impact** | **Preventieve maatregelen** | **Reactieve maatregelen** |
| --- | --- | --- | --- | --- |
| Blessures tijdens sport | Middel | Hoog | EHBO-er aanwezig, warming-up | 112 bellen, ouders informeren |
| Slecht weer | Hoog | Middel | Weersverwachting checken | Alternatief binnenprogramma |
| Onwel worden kind | Laag | Hoog | Rustige plek beschikbaar | Ouders bellen, huisarts |
| Externe partner komt niet | Laag | Hoog | Dag voor bevestiging | Gymleraar als vervanging |
| Te weinig aanmeldingen | Middel | Laag | Goede promotie | Doorgang met meer aandacht |
| Te veel aanmeldingen | Laag | Middel | Maximum aangeven | Wachtlijst, extra begeleiders |
| Conflict tussen kinderen | Middel | Middel | Duidelijke afspraken | Time-out systeem |
| Materiaal defect | Middel | Middel | Dag voor checken | Backup materiaal school |
| Begeleider wordt ziek | Laag | Hoog | Backup begeleiders | Ouder-vrijwilligers |

**NOODPROCEDURE:**
1. Beoordeel situatie
2. Zorg voor veiligheid
3. Bel hulpdiensten indien nodig
4. Informeer ouders
5. Documenteer incident
6. Evalueer na afloop

**NOODNUMMERS:**
- Alarmcentrale: 112
- Huisarts: 088-1234567
- Schoolhoofd: 06-98765432
- Hoofdorganisator: 06-12345678`
  },
  alternatiefProgramma: {
    title: 'Alternatief programma',
    description: 'Complete vervangende activiteit die uitgevoerd kan worden als de oorspronkelijke niet door kan gaan.',
    placeholder: 'Beschrijf het alternatieve programma...',
    example: `SLECHT WEER PROGRAMMA (binnen in gymzaal):

9:00-9:30 Ontvangst en kennismakingsspelletjes
9:30-10:15 Circuittraining met 4 posten
10:15-10:30 Pauze met fruit
10:30-11:15 Teamspelen (trefbal, basketbal)
11:15-11:30 Afsluiting met diploma-uitreiking

BEPERKTE DEELNAME (minder dan 20 kinderen):
- Geen groepsindeling, alle kinderen samen
- Meer persoonlijke aandacht per kind
- Langere tijd per activiteit
- Extra uitdaging voor gevorderden

EXTERNE PARTNER AFWEZIG:
- Activiteiten worden geleid door gymleraar
- Eenvoudigere spelvormen
- Meer focus op plezier dan techniek`
  },
  plattegrond: {
    title: 'Plattegrond',
    description: 'Kaart of tekening die laat zien waar alle activiteiten plaatsvinden.',
    placeholder: 'Beschrijf de plattegrond en locaties...',
    example: `PLATTEGROND SPORTHAL DE REGENBOOG

                    INGANG
                       ↓
    ┌─────────────────────────────────────────┐
    │              ONTVANGST                  │
    │         (Registratie tafel)             │
    └─────────────────────────────────────────┘
              ↓                    
    ┌─────────────────────────────────────────┐
    │                                         │
    │          GROTE GYMZAAL                 │
    │       (Welkom + Afsluiting)            │
    │                                         │
    └─────────────────────────────────────────┘
              ↓                    
    ┌─────────┬─────────┬─────────┬─────────┐
    │  VELD 1 │  VELD 2 │  VELD 3 │  VELD 4 │
    │ Voetbal │Basketball│ Tennis  │Badminton│
    │   🥅    │   🏀    │   🎾    │   🏸    │
    │ (Jan)   │ (Emma)  │ (Lisa)  │ (Sarah) │
    └─────────┴─────────┴─────────┴─────────┘
              ↓                    
    ┌─────────────────┬───────────────────────┐
    │     VELD 5      │       ATLETIEK        │
    │  Hindernisbaan  │        BAAN          │
    │       🏃        │         🏃‍♀️         │
    │     (Tom)       │       (Mark)         │
    └─────────────────┴───────────────────────┘
              ↓                    
    ┌─────────────────────────────────────────┐
    │               KANTINE                   │
    │            (Pauze + Lunch)              │
    │               ☕🍪                     │
    └─────────────────────────────────────────┘
              ↓                    
    ┌─────────────────────────────────────────┐
    │             KLEEDKAMERS                │
    │         🚻    EHBO   🚻                │
    │                 ⛑️                      │
    └─────────────────────────────────────────┘

IMPORTANTE LOCATIES:
🚪 Hoofdingang: Registratie en ontvangst
⛑️ EHBO-post: Bij kleedkamers (Mark)
🚻 Toiletten: Naast kleedkamers
☕ Kantine: Pauze en catering
🏃 Nooduitgang: Achter atletiekbaan
📞 Kantoor: Voor noodgeval (telefoon)

ROUTES:
→ Kinderen route: Ingang → Ontvangst → Grote zaal → Velden → Kantine → Afsluiting
→ Ouders route: Ingang → Wachten kantine → Ophalen grote zaal
→ Noodroute: Alle velden → Directe uitgang achterzijde

AFSTANDEN:
- Ingang naar verste veld: 50 meter
- Velden naar EHBO: Max 30 meter
- Alle locaties naar nooduitgang: Max 40 meter

PARKEEREN:
- Parkeerplaats school: 20 plaatsen
- Straat: Beperkt, ouders vooraf informeren
- Fietsenstalling: Bij hoofdingang`
  },
  // Bijlagen
  behoefteonderzoek: {
    title: 'Behoefteonderzoek',
    description: 'Onderzoeksrapport waarin de wensen en behoeften van de doelgroep in kaart zijn gebracht.',
    placeholder: 'Beschrijf het behoefteonderzoek...',
    example: `BEHOEFTEONDERZOEK MULTISPORT CLINIC

ONDERZOEKSMETHODE:
- Enquête onder 65 kinderen (groep 5-8)
- Interviews met 8 ouders
- Gesprekken met 3 leerkrachten
- Observatie tijdens gymlessen

PERIODE: 1-15 februari 2024

ALS ALO-STUDENT:
Dit is mijn eerste behoefteonderzoek als onderdeel van mijn extracurriculaire project. Ik heb geleerd hoe je onderzoek doet naar de behoeften van kinderen, wat belangrijk is voor mijn toekomstige werk als leerkracht. Begeleiding: docent M. Jansen.

RESULTATEN KINDEREN (65 respondenten):

Vraag 1: "Wat vind je het leukst aan bewegen?"
- Samen spelen met vrienden: 45%
- Nieuwe dingen leren: 32%
- Winnen van spelletjes: 15%
- Gewoon bewegen: 8%

Vraag 2: "Welke sporten zou je graag willen proberen?"
- Voetbal: 48 kinderen
- Basketbal: 38 kinderen
- Tennis: 35 kinderen
- Atletiek: 29 kinderen
- Badminton: 25 kinderen
- Gymnastiek: 22 kinderen

Vraag 3: "Wat vind je moeilijk aan sport?"
- Bang om te verliezen: 28 kinderen
- Anderen zijn veel beter: 24 kinderen
- Begrijp regels niet: 18 kinderen
- Heb geen zin: 12 kinderen

Vraag 4: "Hoe lang mag een sportactiviteit duren?"
- 2-3 uur: 38 kinderen
- 4-5 uur: 21 kinderen
- 1 dag: 6 kinderen

RESULTATEN OUDERS (8 interviews):
- 87% vindt meer beweging belangrijk
- 75% wil dat kind nieuwe sporten leert
- 62% vindt sociale aspect het belangrijkst
- 50% maakt zich zorgen over schermtijd
- 25% vindt competitie element belangrijk

LEERKRACHTEN (3 gesprekken):
- Kinderen bewegen te weinig
- Veel verschillen in motorische vaardigheden
- Samenwerken moet meer geoefend worden
- Positieve houding naar sport stimuleren

CONCLUSIES:
1. Kinderen willen graag sporten, maar zijn bang om te falen
2. Sociale aspect is belangrijker dan prestatie
3. Variatie in sporten is gewenst
4. Begeleiding en uitleg cruciaal
5. Duur van 3-4 uur is ideaal

IMPLICATIES VOOR MULTISPORT CLINIC:
→ Focus op plezier, niet op winnen
→ Veel verschillende sporten aanbieden
→ Kleine groepjes voor veilig gevoel
→ Duidelijke, eenvoudige instructies
→ Positieve begeleiding
→ Iedereen doet mee, niemand wordt uitgesloten`
  },
  omgevingsanalyse: {
    title: 'Omgevingsanalyse',
    description: 'Analyse van beschikbare faciliteiten, organisaties en mogelijkheden in de omgeving.',
    placeholder: 'Beschrijf de omgevingsanalyse...',
    example: `OMGEVINGSANALYSE MULTISPORT CLINIC

LOCATIE: Wijk Regenboog, Amersfoort

BESCHIKBARE FACILITEITEN:

Sporthal De Regenboog:
+ Grote gymzaal voor groepsactiviteiten
+ 4 kleine zalen voor verschillende sporten
+ Kleedkamers en douches
+ Kantine voor pauzes
+ Gratis gebruik voor schoolactiviteiten
+ Parkeergelegenheid
- Beperkte beschikbaarheid weekenden
- Geen buitenruimte

Basisschool De Regenboog:
+ Eigen gymzaal als backup
+ Schoolplein voor buitenactiviteiten
+ Keuken voor catering
+ Bekend terrein voor kinderen
+ Directe samenwerking mogelijk
- Kleinere ruimtes
- Beperkt sportmateriaal

Sportpark Regenboog:
+ Grote buitenruimte
+ Voetbalvelden
+ Atletiekbaan
+ Kantine
- Afhankelijk van weer
- Verder van school
- Kosten voor gebruik

ORGANISATIES IN DE OMGEVING:

FC Vooruit (voetbalclub):
+ Ervaren jeugdtrainers
+ Compleet voetbalmateriaal
+ Bereid tot samenwerking
+ Goede reputatie
+ Dichtbij gelegen
- Beperkt tot voetbalactiviteiten
- Kosten voor trainer

TV Regenboog (tennisclub):
+ Tennismateriaal beschikbaar
+ Trainer beschikbaar
+ Kennis van aangepaste regels
- Hogere kosten
- Minder ervaring met kinderen

Atletiekvereniging Snel:
+ Atletiekmateriaal
+ Ervaring met jeugd
+ Veilige aanpak
- Niet op zaterdag beschikbaar
- Vervoer nodig naar locatie

GYMVERENIGING LENIG:
+ Zeer ervaren met kinderen
+ Veiligheidsmateriaal
+ Leuke aanpak
- Geen beschikbaarheid
- Materiaal niet mobiel

ANDERE MOGELIJKHEDEN:

Gemeente Amersfoort:
+ Subsidie mogelijk voor jeugdactiviteiten
+ Gratis gebruik openbare ruimtes
+ Ondersteuning bij promotie
- Bureaucratie
- Lange aanvraagtermijnen

Oudervereniging:
+ Vrijwilligers beschikbaar
+ Kennis van kinderen
+ Helpen bij catering
+ Financiële ondersteuning
- Beperkte sportkennis
- Niet iedereen beschikbaar

Ziekenhuis Meander:
+ EHBO-cursus voor vrijwilligers
+ Medische ondersteuning
+ Voorlichting over veiligheid
- Geen directe betrokkenheid

KEUZES OP BASIS VAN ANALYSE:
1. Locatie: Sporthal De Regenboog (beste faciliteiten)
2. Partner: FC Vooruit (ervaring + materiaal)
3. Ondersteuning: Oudervereniging (vrijwilligers)
4. Backup: School gymzaal (slecht weer)
5. Financiering: Combinatie school + ouders

RISICO'S OMGEVING:
- Beperkte parkeergelegenheid
- Drukke weg naar sporthal
- Afhankelijkheid van externe partners
- Concurrentie andere activiteiten

KANSEN:
- Veel sportieve organisaties
- Enthousiaste ouders
- Goede faciliteiten
- Ondersteuning gemeente
- Samenwerking met meerdere clubs mogelijk`
  },
  promotiemateriaal: {
    title: 'Promotiemateriaal voor naschoolse activiteit',
    description: 'Flyers, posters of andere materialen om de activiteit onder de aandacht te brengen.',
    placeholder: 'Beschrijf het promotiemateriaal...',
    example: `FLYER VOOR OUDERS:
- A5 formaat, kleurrijk ontwerp
- Titel: "Sportdag voor iedereen!"
- Datum, tijd en locatie duidelijk vermeld
- Foto's van vrolijke kinderen die sporten
- Informatie over aanmelden
- Contact gegevens

POSTER VOOR SCHOOL:
- A3 formaat voor prikbord
- Opvallende kleuren en grote letters
- "Doe jij ook mee?" als aanspreektekst

DIGITALE PROMOTIE:
- Bericht op school-app
- Facebook post (met toestemming)
- Nieuwsbrief van de school

MOND-TOT-MOND:
- Korte presentatie in klassen
- Enthousiaste verhalen van organisatoren`
  }
}

export default function SectionEditor({ section, subsection, data, onUpdate, onNestedUpdate }: Props) {
  const [isAIHelpOpen, setIsAIHelpOpen] = useState(false)
  
  const config = subsectionConfig[subsection]
  if (!config) return null

  const getCurrentValue = () => {
    // Handle nested values for 6 W's
    if (section === 'planning' && ['opening', 'dagprogramma', 'schema', 'afsluiting'].includes(subsection)) {
      return (data.sections.planning.sesWs as any)[subsection] || ''
    }
    // Handle 6 W's overview (sesWs itself)
    if (section === 'planning' && subsection === 'sesWs') {
      return data.sections.planning.sesWs.algemeen || ''
    }
    return (data.sections[section] as any)[subsection] || ''
  }

  const handleTextChange = (value: string) => {
    if (section === 'planning' && ['opening', 'dagprogramma', 'schema', 'afsluiting'].includes(subsection)) {
      onNestedUpdate(section, 'sesWs', subsection, value)
    } else if (section === 'planning' && subsection === 'sesWs') {
      onNestedUpdate(section, 'sesWs', 'algemeen', value)
    } else {
      onUpdate(section, subsection, value)
    }
  }

  const handleInsertExample = () => {
    const currentValue = getCurrentValue()
    const newValue = config.example + (currentValue ? '\n\n' + currentValue : '')
    handleTextChange(newValue)
  }

  const handleAIContentInsert = (content: string) => {
    const currentValue = getCurrentValue()
    const newValue = currentValue + (currentValue ? '\n\n' : '') + content
    handleTextChange(newValue)
  }

  const handleTableInsert = (tableHtml: string) => {
    const currentValue = getCurrentValue()
    const newValue = currentValue + (currentValue ? '\n\n' : '') + tableHtml
    handleTextChange(newValue)
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{config.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{config.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsAIHelpOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.126A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                AI Hulp
              </button>
              <TableEditor onInsertTable={handleTableInsert} />
              <button 
                onClick={handleInsertExample}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Voorbeeld
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="h-full">
            <div className="w-full h-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <div
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => handleTextChange(e.currentTarget.innerHTML)}
                onBlur={(e) => handleTextChange(e.currentTarget.innerHTML)}
                className="w-full h-full p-4 outline-none overflow-y-auto"
                style={{ minHeight: '400px' }}
                dangerouslySetInnerHTML={{ 
                  __html: getCurrentValue() || `<p style="color: #999; font-style: italic; margin: 0;">${config.placeholder}</p>` 
                }}
                onFocus={(e) => {
                  const content = e.currentTarget.innerHTML
                  if (content.includes(config.placeholder)) {
                    e.currentTarget.innerHTML = ''
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Help Panel */}
      <AIHelpPanel
        isOpen={isAIHelpOpen}
        onClose={() => setIsAIHelpOpen(false)}
        sectionTitle={config.title}
        sectionDescription={config.description}
        onSendToEditor={handleAIContentInsert}
        draaiboekData={data}
        currentSection={section}
        currentSubsection={subsection}
      />
    </>
  )
}