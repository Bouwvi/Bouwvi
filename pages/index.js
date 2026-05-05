import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── LUCIDE ICONS (inline SVG — geen npm nodig) ───────────────────────────────
const Icon = ({ name, size=16, color='currentColor', strokeWidth=1.5, style={} }) => {
  const paths = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
    bookOpen: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    pencilRuler: <><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></>,
    package: <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
    hardHat: <><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></>,
    hammer: <><path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/></>,
    zap: <><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></>,
    wrench: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
    paintbrush: <><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/></>,
    grid: <><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></>,
    plus: <><path d="M5 12h14"/><path d="M12 5v14"/></>,
    chevronRight: <><path d="m9 18 6-6-6-6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    star: <><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></>,
    alertCircle: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>,
    arrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    moreVertical: <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></>,
    mapPin: <><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>,
    fileText: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></>,
    activity: <><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    check: <><path d="M20 6 9 17l-5-5"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
    layoutDashboard: <><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></>,
    construction: <><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14L2.3 6.3"/><path d="M14 6l7.7 7.7"/><path d="m8 6 8 8"/></>,
    clipboardList: <><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
    trendingUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    calendar: <><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  )
}

// ─── KLEUREN ──────────────────────────────────────────────────────────────────
const C = {
  navy:'#0F2D6B', blue:'#1A4599', blueHover:'#153A80',
  blueSoft:'#E8EFFE', blueL:'#D0DCFA',
  red:'#E8304A', redD:'#C01F35', redSoft:'#FDEAED',
  white:'#FFFFFF', off:'#F5F7FF', sand:'#EEF1FA',
  ink:'#0A0F1E', slate:'#3A4A6B', mist:'#7A8FB5', light:'#A0AFCC',
  border:'#D8E0F5', borderDark:'#C0CEEA',
  ok:'#1E8449', okSoft:'#E8F5E9',
  gold:'#F59E0B', goldSoft:'#FEF3C7',
  shadow: '0 2px 8px rgba(15,45,107,0.08), 0 1px 3px rgba(15,45,107,0.04)',
  shadowMd: '0 6px 20px rgba(15,45,107,0.12), 0 2px 8px rgba(15,45,107,0.07)',
  shadowLg: '0 16px 40px rgba(15,45,107,0.16), 0 6px 16px rgba(15,45,107,0.09)',
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const USERS = [
  { id:'free_001', naam:'Gratis Gebruiker', email:'testfree@bouwvi.nl', password:'Test123!', plan:'gratis', initialen:'GG', lid_sinds:'januari 2025' },
  { id:'prem_001', naam:'Premium Gebruiker', email:'testpremium@bouwvi.nl', password:'Test123!', plan:'premium', initialen:'PG', lid_sinds:'februari 2025', sub:{ verlengt:'1 juni 2025', prijs:'19,99', methode:'iDEAL' } },
  { id:'plus_001', naam:'Plus Gebruiker', email:'testplus@bouwvi.nl', password:'Test123!', plan:'plus', initialen:'PL', lid_sinds:'januari 2025', sub:{ verlengt:'1 juni 2025', prijs:'29,99', methode:'iDEAL' } },
]

const INIT_PROJECTEN = [
  { id:'p1', uid:'prem_001', naam:'Badkamer verbouwing', type:'badkamer', voortgang:35, status:'Lopend', datum:'12 mrt 2025', omschrijving:'Complete renovatie badkamer eerste verdieping', bouwjaar:'1987', woningtype:'Tussenwoning', vloertype:'Houten vloer', afm:'2.4 × 3.2m', budget:'€8.000 – €12.000', deadline:'Voor de zomer', zelfdoen:'Deels zelf doen', wens:'Inloopdouche 90×120cm, zweeftoilet, dubbele wastafel met meubel. Zwarte kranen. Grote wandtegels 60×120cm. Vloerverwarming.', extra:'Mogelijk muur weghalen naar aangrenzende kast. Moet nog checken of dragend.', laatste_activiteit:'AI coach geraadpleegd', volgende_stap:'Offerte aanvragen tegelzetter' },
  { id:'p2', uid:'plus_001', naam:'Keuken renovatie', type:'keuken', voortgang:60, status:'Lopend', datum:'5 mrt 2025', omschrijving:'Nieuwe eilandkeuken met schuifpui naar tuin', bouwjaar:'2003', woningtype:'Hoekwoning', vloertype:'Betonnen vloer', afm:'4.5 × 3.0m', budget:'€15.000 – €22.000', deadline:'Oktober 2025', zelfdoen:'Volledig uitbesteden', wens:'Nieuwe eilandkeuken, inductie, quooker, composiet werkblad, gietvloer doortrekken vanuit woonkamer.', extra:'Gaslijn moet verlegd worden. Huidige raam vervangen door schuifpui.', laatste_activiteit:'Plattegrond getekend', volgende_stap:'Materiaallijst opstellen' },
  { id:'p3', uid:'plus_001', naam:'Dakkapel slaapkamer', type:'dakkapel', voortgang:15, status:'In voorbereiding', datum:'20 mrt 2025', omschrijving:'Dakkapel achterzijde voor extra ruimte', bouwjaar:'2003', woningtype:'Hoekwoning', vloertype:'Houten vloer', afm:'3.0 × 1.2m', budget:'€8.000 – €14.000', deadline:'Einde 2025', zelfdoen:'Alles uitbesteden', wens:'Dakkapel achterzijde voor meer ruimte slaapkamer, twee openslaande deuren.', extra:'Omgevingsvergunning aanvragen.', laatste_activiteit:'Project aangemaakt', volgende_stap:'Vergunning aanvragen' },
]

const PARTNERS = [
  { id:'v1', naam:'Loodgieters van Dijk', discipline:'Loodgieter', categorie:'Installaties', afstand:'1.2 km', rating:4.8, reviews:127, prijs:'€€', aanbevolen:true, tel:'010-1234567', website:'https://example.com' },
  { id:'v2', naam:'Tegelwerk Centrum', discipline:'Tegelzetter', categorie:'Afwerking', afstand:'2.4 km', rating:4.9, reviews:89, prijs:'€€', tel:'010-2345678', website:'https://example.com' },
  { id:'v3', naam:'Elektra Service Pro', discipline:'Elektricien', categorie:'Installaties', afstand:'0.8 km', rating:4.7, reviews:203, prijs:'€', tel:'010-3456789', website:'https://example.com' },
  { id:'v4', naam:'Bouwadvies & Constructie BV', discipline:'Constructeur', categorie:'Ruwbouw & constructie', afstand:'3.1 km', rating:4.6, reviews:54, prijs:'€€€', tel:'010-4567890', website:'https://example.com' },
  { id:'v5', naam:'Schildersbedrijf De Vries', discipline:'Schilder', categorie:'Afwerking', afstand:'2.0 km', rating:4.5, reviews:178, prijs:'€€', tel:'010-5678901', website:'https://example.com' },
  { id:'v6', naam:'Dakdekkersbedrijf Noord', discipline:'Dakdekker', categorie:'Dak & gevel', afstand:'4.5 km', rating:4.6, reviews:91, prijs:'€€', tel:'010-6789012', website:'https://example.com' },
]

const FACTUREN = [
  { id:'f1', uid:'prem_001', datum:'1 apr 2025', bedrag:'19,99', nr:'BV-2025-041' },
  { id:'f2', uid:'prem_001', datum:'1 mrt 2025', bedrag:'19,99', nr:'BV-2025-031' },
  { id:'f3', uid:'plus_001', datum:'1 apr 2025', bedrag:'29,99', nr:'BV-2025-042' },
]

const PLAN_LIMIET = { gratis: 0, premium: 1, plus: 3 }

function getUser(email) { return USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null }
function getUserById(id) { return USERS.find(u => u.id === id) || null }
function getFacts(uid) { return FACTUREN.filter(f => f.uid === uid) }

// ─── AI ────────────────────────────────────────────────────────────────────────
async function callAI(prompt, system) {
  try {
    const r = await fetch('/api/ai', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system }),
    })
    const d = await r.json()
    if (d.error) return `Fout: ${d.error}`
    return d.text || 'Geen antwoord ontvangen.'
  } catch { return 'Verbindingsfout. Controleer je internetverbinding.' }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif; }
  input, textarea, button, select { font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.blueL}; border-radius: 4px; }
  .nav-link { transition: color .15s, background .15s; color: rgba(255,255,255,0.75); }
  .nav-link:hover { background: rgba(255,255,255,0.12); color: ${C.white}; }
  .nav-link.active { background: rgba(255,255,255,0.15); color: ${C.white}; font-weight: 600; }
  .card-hover { transition: box-shadow .2s, transform .2s, border-color .2s; }
  .card-hover:hover { box-shadow: ${C.shadowMd}; transform: translateY(-2px); border-color: ${C.blueL} !important; }
  .btn-primary { transition: background .15s, opacity .15s; }
  .btn-primary:hover { opacity: .88; }
  .btn-ghost { transition: background .15s, color .15s; }
  .btn-ghost:hover { background: ${C.sand}; }
`

// ─── UI COMPONENTEN ───────────────────────────────────────────────────────────
function Spinner({ size=18 }) {
  return <span style={{ width:size, height:size, border:`2px solid currentColor`, borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite', flexShrink:0 }}/>
}

function Card({ children, style, className='' }) {
  return <div className={className} style={{ background:C.white, borderRadius:10, border:`1px solid ${C.border}`, boxShadow:C.shadow, ...style }}>{children}</div>
}

function Badge({ label, variant='default' }) {
  const v = {
    default:{ bg:C.sand, c:C.slate, b:C.border },
    blue:{ bg:C.blueSoft, c:C.blue, b:C.blueL },
    ok:{ bg:C.okSoft, c:C.ok, b:'#86EFAC' },
    gold:{ bg:C.goldSoft, c:C.gold, b:'#FCD34D' },
    red:{ bg:C.redSoft, c:C.red, b:'#FCA5A5' },
    navy:{ bg:C.navy, c:C.white, b:C.navy },
  }[variant] || { bg:C.sand, c:C.slate, b:C.border }
  return <span style={{ background:v.bg, color:v.c, border:`1px solid ${v.b}`, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, whiteSpace:'nowrap', letterSpacing:.3 }}>{label}</span>
}

function Btn({ children, onClick, variant='primary', disabled, full, size='md', style={} }) {
  const sizes = { sm:'7px 12px', md:'9px 16px', lg:'11px 20px' }
  const fontSizes = { sm:12, md:13.5, lg:15 }
  const variants = {
    primary:{ bg:C.red, c:C.white, border:`1px solid ${C.red}` },
    secondary:{ bg:C.white, c:C.slate, border:`1px solid ${C.border}` },
    danger:{ bg:C.red, c:C.white, border:`1px solid ${C.red}` },
    ghost:{ bg:'transparent', c:C.slate, border:'1px solid transparent' },
    navy:{ bg:C.navy, c:C.white, border:`1px solid ${C.navy}` },
    blue:{ bg:C.blue, c:C.white, border:`1px solid ${C.blue}` },
  }
  const v = variants[variant] || variants.primary
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      className={variant === 'primary' || variant === 'navy' || variant === 'danger' ? 'btn-primary' : 'btn-ghost'}
      style={{ background:v.bg, color:v.c, border:v.border, borderRadius:7, padding:sizes[size], fontSize:fontSizes[size], fontWeight:600, cursor:disabled?'not-allowed':'pointer', opacity:disabled?.5:1, display:'inline-flex', alignItems:'center', gap:6, justifyContent:'center', width:full?'100%':undefined, ...style }}>
      {children}
    </button>
  )
}

function ProgressBar({ value, color=C.blue }) {
  return (
    <div style={{ background:C.sand, borderRadius:4, height:4, overflow:'hidden' }}>
      <div style={{ width:`${Math.min(100,value)}%`, height:'100%', background:color, borderRadius:4, transition:'width .5s' }}/>
    </div>
  )
}

function RenderMarkdown({ text, accentColor=C.blue }) {
  if (!text) return null
  return (
    <div style={{ fontSize:14, lineHeight:1.75, color:C.slate }}>
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height:8 }}/>
        const isBullet = /^[-•]\s/.test(line)
        const raw = line.replace(/^[-•]\s/, '')
        const parts = raw.split(/\*\*(.*?)\*\*/g)
        const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color:C.ink, fontWeight:600 }}>{p}</strong> : p)
        if (isBullet) return (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:5, alignItems:'flex-start' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:accentColor, marginTop:9, flexShrink:0 }}/>
            <span>{rendered}</span>
          </div>
        )
        return <p key={i} style={{ margin:'0 0 6px' }}>{rendered}</p>
      })}
    </div>
  )
}

function PlanBadge({ plan }) {
  if (plan === 'plus') return <Badge label="Premium Plus" variant="gold"/>
  if (plan === 'premium') return <Badge label="Premium" variant="blue"/>
  return <Badge label="Gratis" variant="default"/>
}

// ─── NAVIGATIE ────────────────────────────────────────────────────────────────
function Nav({ user, tab, setTab, projecten, onNieuwProject, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef(null)

  const isPremium = user && (user.plan === 'premium' || user.plan === 'plus')
  const isGratis = user && user.plan === 'gratis'
  const actieveProj = projecten.filter(p => p.status !== 'Afgerond')
  const limiet = user ? PLAN_LIMIET[user.plan] : 0
  const kanNieuwProject = isPremium && actieveProj.length < limiet

  const navLinks = user
    ? isPremium
      ? [{ id:'home', label:'Home', icon:'home' }, { id:'projecten', label:'Mijn projecten', icon:'folder' }, { id:'bibliotheek', label:'Bibliotheek', icon:'bookOpen' }]
      : [{ id:'home', label:'Home', icon:'home' }, { id:'bibliotheek', label:'Bibliotheek', icon:'bookOpen' }, { id:'vakmannen', label:'Vakmannen', icon:'hardHat' }]
    : [{ id:'home', label:'Home', icon:'home' }, { id:'bibliotheek', label:'Bibliotheek', icon:'bookOpen' }]

  useEffect(() => {
    function handleClick(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav style={{ background:C.navy, borderBottom:`3px solid ${C.red}`, position:'sticky', top:0, zIndex:300, boxShadow:'0 2px 12px rgba(15,45,107,0.25)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', height:56, gap:8 }}>
        {/* Logo */}
        <button onClick={() => setTab('home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:9, padding:'0 4px 0 0', marginRight:16, flexShrink:0 }}>
          <div style={{ width:30, height:30, background:C.blue, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:C.red, fontWeight:800, fontSize:16, letterSpacing:'-1px', fontFamily:'Georgia, serif' }}>B</span>
          </div>
          <span style={{ fontWeight:700, fontSize:15.5, color:C.white, letterSpacing:'-.3px' }}>Bouwvi</span>
        </button>

        {/* Nav links */}
        <div style={{ display:'flex', gap:2, flex:1, overflowX:'auto' }}>
          {navLinks.map(link => (
            <button key={link.id} onClick={() => setTab(link.id)}
              className={`nav-link ${tab === link.id ? 'active' : ''}`}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 12px', borderRadius:7, border:'none', background:'none', fontSize:13.5, color:tab===link.id?C.white:'rgba(255,255,255,0.72)', cursor:'pointer', whiteSpace:'nowrap', fontWeight:tab===link.id?600:400 }}>
              <Icon name={link.icon} size={15} color={tab===link.id?C.white:'rgba(255,255,255,0.55)'}/>
              {link.label}
            </button>
          ))}
        </div>

        {/* Rechts: nieuw project + account */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          {isPremium && (
            <Btn onClick={onNieuwProject} disabled={!kanNieuwProject} variant="primary" size="sm" style={{ gap:5, background:C.red, borderColor:C.red }}>
              <Icon name="plus" size={14} color={C.white}/>
              Nieuw project
            </Btn>
          )}
          {!user && (
            <Btn onClick={() => setTab('login')} variant="primary" size="sm">Inloggen</Btn>
          )}
          {user && (
            <div ref={dropRef} style={{ position:'relative' }}>
              <button onClick={() => setDropdownOpen(d => !d)}
                style={{ width:34, height:34, borderRadius:8, background:C.navy, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.white, fontWeight:700, fontSize:13 }}>
                {user.initialen}
              </button>
              {dropdownOpen && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', background:C.white, border:`1px solid ${C.border}`, borderRadius:10, boxShadow:C.shadowLg, minWidth:200, padding:6, zIndex:400 }}>
                  <div style={{ padding:'8px 12px', borderBottom:`1px solid ${C.border}`, marginBottom:4 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{user.naam}</div>
                    <div style={{ fontSize:11.5, color:C.mist, marginTop:2 }}>{user.email}</div>
                    <div style={{ marginTop:5 }}><PlanBadge plan={user.plan}/></div>
                  </div>
                  <button onClick={() => { setTab('account'); setDropdownOpen(false) }}
                    style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', border:'none', background:'none', cursor:'pointer', fontSize:13, color:C.slate, borderRadius:6 }}
                    className="btn-ghost">
                    <Icon name="settings" size={14} color={C.mist}/> Account
                  </button>
                  <button onClick={() => { onLogout(); setDropdownOpen(false) }}
                    style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', border:'none', background:'none', cursor:'pointer', fontSize:13, color:C.red, borderRadius:6 }}
                    className="btn-ghost">
                    <Icon name="logOut" size={14} color={C.red}/> Uitloggen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ user, setTab, projecten, onNieuwProject }) {
  const isPremium = user && (user.plan === 'premium' || user.plan === 'plus')
  const actief = projecten.filter(p => p.status !== 'Afgerond')
  const limiet = user ? PLAN_LIMIET[user.plan] : 0
  const kanNieuwProject = isPremium && actief.length < limiet

  if (!user) return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'60px 24px', animation:'fadeIn .3s ease' }}>
      <div style={{ textAlign:'center', marginBottom:56 }}>
        <h1 style={{ fontWeight:700, fontSize:36, color:C.navy, letterSpacing:'-.5px', margin:'0 0 14px' }}>Bouwadvies voor particulieren</h1>
        <p style={{ fontSize:17, color:C.mist, lineHeight:1.6, maxWidth:540, margin:'0 auto 28px' }}>Van bouwvraag naar project naar vakman — alles op één plek. Begin gratis met de kennisbibliotheek.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <Btn onClick={() => setTab('bibliotheek')} variant="navy" size="lg" style={{ gap:8 }}><Icon name="bookOpen" size={17} color={C.white}/> Bibliotheek bekijken</Btn>
          <Btn onClick={() => setTab('login')} variant="secondary" size="lg">Inloggen</Btn>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          { icon:'bookOpen', title:'Kennisbibliotheek', desc:'Gratis toegang tot honderden bouwartikelen. Van fundering tot afwerking.', free:true },
          { icon:'folder', title:'Persoonlijk project', desc:'Maak een eigen project aan met AI-begeleiding, plattegrond en materiaaladvies.', free:false },
          { icon:'hardHat', title:'Vakmannen vinden', desc:'Vind erkende specialisten bij jou in de buurt op basis van vakdiscipline.', free:true },
        ].map(f => (
          <Card key={f.title} className="card-hover" style={{ padding:'24px', cursor:'pointer' }}>
            <div style={{ width:40, height:40, background:f.free?C.okSoft:C.blueSoft, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
              <Icon name={f.icon} size={20} color={f.free?C.ok:C.blue}/>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <h3 style={{ fontWeight:600, fontSize:15, color:C.ink, margin:0 }}>{f.title}</h3>
              <Badge label={f.free?'Gratis':'Premium'} variant={f.free?'ok':'blue'}/>
            </div>
            <p style={{ fontSize:13.5, color:C.mist, lineHeight:1.6, margin:0 }}>{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )

  if (isPremium) return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'36px 24px 60px', animation:'fadeIn .3s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:26, color:C.navy, margin:'0 0 4px', letterSpacing:'-.4px' }}>Welkom, {user.naam.split(' ')[0]}</h1>
          <p style={{ fontSize:14, color:C.mist, margin:0 }}>
            {actief.length === 0 ? 'Nog geen actieve projecten. Start je eerste project.' : `${actief.length} actief project${actief.length !== 1 ? 'en' : ''} — ${limiet - actief.length} slot${limiet - actief.length !== 1 ? 's' : ''} beschikbaar`}
          </p>
        </div>
        <Btn onClick={onNieuwProject} disabled={!kanNieuwProject} variant="primary" size="md" style={{ gap:6 }}>
          <Icon name="plus" size={15} color={C.white}/> Nieuw project starten
        </Btn>
      </div>

      {actief.length === 0 ? (
        <Card style={{ padding:'48px 24px', textAlign:'center', marginBottom:20 }}>
          <div style={{ width:52, height:52, background:C.blueSoft, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <Icon name="folder" size={24} color={C.blue}/>
          </div>
          <h3 style={{ fontWeight:600, fontSize:17, color:C.ink, margin:'0 0 8px' }}>Geen actieve projecten</h3>
          <p style={{ fontSize:14, color:C.mist, margin:'0 0 20px' }}>Maak je eerste project aan en ontvang persoonlijk AI-advies.</p>
          <Btn onClick={onNieuwProject} variant="primary">Eerste project starten</Btn>
        </Card>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
          {actief.map(p => (
            <ProjectKaart key={p.id} project={p} onClick={() => setTab('projecten')}/>
          ))}
        </div>
      )}

      {!kanNieuwProject && actief.length >= limiet && (
        <div style={{ background:C.goldSoft, border:`1px solid ${C.gold}44`, borderRadius:9, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <Icon name="alertCircle" size={16} color={C.gold}/>
          <span style={{ fontSize:13.5, color:'#92400E' }}>Limiet bereikt ({limiet} van {limiet} projecten actief). Rond een project af of upgrade naar Premium Plus.</span>
        </div>
      )}

      <Card style={{ padding:'18px 20px' }}>
        <div style={{ fontWeight:600, fontSize:13, color:C.mist, marginBottom:12, textTransform:'uppercase', letterSpacing:.7 }}>Snelle toegang</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <Btn onClick={() => setTab('bibliotheek')} variant="secondary" size="sm" style={{ gap:6 }}>
            <Icon name="bookOpen" size={13} color={C.mist}/> Kennisbibliotheek
          </Btn>
          <Btn onClick={() => setTab('vakmannen')} variant="secondary" size="sm" style={{ gap:6 }}>
            <Icon name="hardHat" size={13} color={C.mist}/> Vakmannen
          </Btn>
        </div>
      </Card>
    </div>
  )

  // Gratis user
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 24px 60px', animation:'fadeIn .3s ease' }}>
      <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, #1A3D8A 100%)`, borderRadius:14, padding:'28px 28px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, boxShadow:'0 8px 32px rgba(15,45,107,0.2)' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:12, fontWeight:600, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:.7 }}>Gratis account</p>
          <h2 style={{ fontWeight:700, fontSize:20, color:C.white, margin:'0 0 8px', letterSpacing:'-.2px' }}>Goedendag, {user.naam.split(' ')[0]}</h2>
          <p style={{ fontSize:13.5, color:'rgba(255,255,255,.65)', margin:0 }}>Je hebt toegang tot de kennisbibliotheek en vakmannen. Upgrade voor projecten met AI-begeleiding.</p>
        </div>
        <Btn onClick={() => setTab('upgrade')} variant="secondary" size="md" style={{ gap:7, background:C.red, border:`1px solid ${C.red}`, color:C.white }}>
          <Icon name="star" size={14} color={C.white}/> Upgraden naar Premium
        </Btn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card className="card-hover" style={{ padding:20, cursor:'pointer' }} onClick={() => setTab('bibliotheek')}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <div style={{ width:36, height:36, background:C.blueSoft, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="bookOpen" size={18} color={C.blue}/>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:C.ink }}>Kennisbibliotheek</div>
              <div style={{ fontSize:12, color:C.mist }}>Altijd gratis</div>
            </div>
          </div>
          <p style={{ fontSize:13, color:C.mist, margin:0, lineHeight:1.6 }}>Stel bouwvragen en lees artikelen over alle verbouwthema's.</p>
        </Card>
        <Card className="card-hover" style={{ padding:20, cursor:'pointer' }} onClick={() => setTab('vakmannen')}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <div style={{ width:36, height:36, background:C.blueSoft, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="hardHat" size={18} color={C.blue}/>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:C.ink }}>Vakmannen</div>
              <div style={{ fontSize:12, color:C.mist }}>Altijd gratis</div>
            </div>
          </div>
          <p style={{ fontSize:13, color:C.mist, margin:0, lineHeight:1.6 }}>Vind erkende vakmensen bij jou in de buurt op vakdiscipline.</p>
        </Card>
      </div>
    </div>
  )
}

// ─── PROJECT KAART ────────────────────────────────────────────────────────────
function ProjectKaart({ project: p, onClick, onEdit, onDelete, compact=false }) {
  const statusKleur = { 'In voorbereiding':C.gold, 'Lopend':C.ok, 'Afgerond':C.mist }[p.status] || C.mist
  const statusVariant = { 'In voorbereiding':'gold', 'Lopend':'ok', 'Afgerond':'default' }[p.status] || 'default'

  return (
    <Card className="card-hover" style={{ padding:0, cursor:'pointer', overflow:'hidden', borderTop:`3px solid ${statusKleur}` }} onClick={onClick}>
      <div style={{ padding:'18px 18px 14px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:15.5, color:C.ink, marginBottom:5, letterSpacing:'-.2px' }}>{p.naam}</div>
            <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
              <Badge label={p.status} variant={statusVariant}/>
              <span style={{ fontSize:12, color:C.light }}>{p.datum}</span>
            </div>
          </div>
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit(p) }} style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:C.light, borderRadius:5 }} className="btn-ghost">
              <Icon name="moreVertical" size={15} color={C.mist}/>
            </button>
          )}
        </div>
        {p.omschrijving && <p style={{ fontSize:13, color:C.mist, margin:'0 0 12px', lineHeight:1.5 }}>{p.omschrijving}</p>}
        <div style={{ marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.light, marginBottom:5 }}>
            <span>Voortgang</span><span>{p.voortgang}%</span>
          </div>
          <ProgressBar value={p.voortgang} color={statusKleur}/>
        </div>
        {p.volgende_stap && (
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.blue }}>
            <Icon name="arrowRight" size={12} color={C.blue}/>
            <span>{p.volgende_stap}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── NIEUW PROJECT MODAL ──────────────────────────────────────────────────────
function NieuwProjectModal({ onClose, onSave, user }) {
  const [form, setForm] = useState({ naam:'', type:'badkamer', omschrijving:'', bouwjaar:'', woningtype:'Tussenwoning', budget:'', wens:'', status:'In voorbereiding' })
  const [stap, setStap] = useState(1)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isValid1 = form.naam.trim().length > 0
  const isValid2 = form.wens.trim().length > 0

  const types = ['badkamer','keuken','dakkapel','uitbouw','slaapkamer','toilet','zolder','garage','tuin','gevel','dak','overig']
  const woning = ['Tussenwoning','Hoekwoning','Vrijstaande woning','2-onder-1-kapwoning','Appartement']

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(11,31,75,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16, backdropFilter:'blur(4px)' }}>
      <div style={{ background:C.white, borderRadius:14, maxWidth:520, width:'100%', boxShadow:'0 25px 60px rgba(0,0,0,.25)', animation:'fadeIn .25s ease', maxHeight:'90vh', overflowY:'auto' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontWeight:700, fontSize:17, color:C.navy, margin:0 }}>Nieuw project starten</h2>
            <p style={{ fontSize:12.5, color:C.mist, margin:'3px 0 0' }}>Stap {stap} van 2</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:C.mist, padding:4 }}>
            <Icon name="x" size={20} color={C.mist}/>
          </button>
        </div>

        <div style={{ padding:'24px' }}>
          {stap === 1 && (
            <div style={{ animation:'fadeIn .2s ease' }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Projectnaam *</label>
                <input value={form.naam} onChange={e => set('naam', e.target.value)} placeholder="bijv. Badkamer renovatie" style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none' }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Type verbouwing</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none', background:C.white }}>
                  {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Korte omschrijving</label>
                <input value={form.omschrijving} onChange={e => set('omschrijving', e.target.value)} placeholder="Korte beschrijving van je project" style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none' }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Bouwjaar woning</label>
                  <input value={form.bouwjaar} onChange={e => set('bouwjaar', e.target.value)} placeholder="bijv. 1987" style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none' }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Woningtype</label>
                  <select value={form.woningtype} onChange={e => set('woningtype', e.target.value)} style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none', background:C.white }}>
                    {woning.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {stap === 2 && (
            <div style={{ animation:'fadeIn .2s ease' }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Budget indicatie</label>
                <input value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="bijv. €8.000 – €12.000" style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none' }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:C.ink, marginBottom:6 }}>Wat wil je bereiken? *</label>
                <textarea value={form.wens} onChange={e => set('wens', e.target.value)} placeholder="Beschrijf zo concreet mogelijk wat je wil verbouwen en wat jouw wensen zijn..." rows={5} style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none', resize:'vertical', minHeight:100 }} onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
                <p style={{ fontSize:11.5, color:C.light, margin:'5px 0 0' }}>Hoe meer detail, hoe beter het AI-advies.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', gap:10 }}>
          {stap === 1 ? (
            <Btn onClick={onClose} variant="ghost">Annuleren</Btn>
          ) : (
            <Btn onClick={() => setStap(1)} variant="secondary" style={{ gap:6 }}>Terug</Btn>
          )}
          {stap === 1 ? (
            <Btn onClick={() => setStap(2)} disabled={!isValid1} variant="primary" style={{ gap:6 }}>
              Volgende <Icon name="arrowRight" size={14} color={C.white}/>
            </Btn>
          ) : (
            <Btn onClick={() => { if (isValid2) onSave(form) }} disabled={!isValid2} variant="primary" style={{ gap:6 }}>
              <Icon name="check" size={14} color={C.white}/> Project aanmaken
            </Btn>
          )}
        </div>
      </div>
    </div>
  )
}


// ─── OVERZICHT TAB ────────────────────────────────────────────────────────────
// Volledig bewerkbaar projectoverzicht met AI samenvatting
// Props: project, onSave(updates), statusKleur
function OverzichtTab({ project, onSave, statusKleur }) {
  // ── State: bewerkbaar formulier ──────────────────────────────────────────
  const [bewerken, setBewerken] = useState(false)
  const [form, setForm] = useState({
    naam:        project.naam        || '',
    omschrijving:project.omschrijving|| '',
    budget:      project.budget      || '',
    wens:        project.wens        || '',
    bouwjaar:    project.bouwjaar    || '',
    woningtype:  project.woningtype  || 'Tussenwoning',
    status:      project.status      || 'In voorbereiding',
    voortgang:   project.voortgang   ?? 0,
    volgende_stap: project.volgende_stap || '',
  })
  const [opgeslagen, setOpgeslagen] = useState(false)

  // ── State: AI samenvatting ───────────────────────────────────────────────
  const [analyse, setAnalyse] = useState('')
  const [loadA, setLoadA]     = useState(false)
  const [aiError, setAiError] = useState('')

  const woning = ['Tussenwoning','Hoekwoning','Vrijstaande woning','2-onder-1-kapwoning','Appartement']

  // Laad AI samenvatting bij eerste render
  useEffect(() => {
    laadAnalyse(project)
  }, [project.id])

  function laadAnalyse(p) {
    setLoadA(true); setAiError(''); setAnalyse('')
    const sys = `Je bent Bouwvi AI bouwcoach. PROJECTGEGEVENS: Naam: ${p.naam}. Type: ${p.type}. Bouwjaar: ${p.bouwjaar||'onbekend'}. Woningtype: ${p.woningtype||'onbekend'}. Budget: ${p.budget||'onbekend'}. Wensen: ${p.wens||'niet ingevuld'}. Extra: ${p.extra||'geen'}. Status: ${p.status}. Voortgang: ${p.voortgang}%. Geef concreet, praktisch advies in helder Nederlands. Gebruik **vet** voor kopjes en - voor opsommingen.`
    callAI(
      `Geef een beknopt projectoverzicht met: **Status & voortgang** (één zin), **Top 3 aandachtspunten** voor dit type verbouwing (veiligheid, vergunningen, volgorde), **Kostenindicatie** (budget/midden/premium range voor ${p.type}), **Aanbevolen volgende stap** (concreet en uitvoerbaar). Wees specifiek voor dit project, niet generiek.`,
      sys
    ).then(t => {
      if (t.startsWith('Fout:') || t.startsWith('Verbinding')) {
        setAiError(t)
      } else {
        setAnalyse(t)
      }
      setLoadA(false)
    })
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function slaOp() {
    onSave(form)
    setBewerken(false)
    setOpgeslagen(true)
    setTimeout(() => setOpgeslagen(false), 3000)
  }

  function annuleer() {
    setForm({
      naam:        project.naam        || '',
      omschrijving:project.omschrijving|| '',
      budget:      project.budget      || '',
      wens:        project.wens        || '',
      bouwjaar:    project.bouwjaar    || '',
      woningtype:  project.woningtype  || 'Tussenwoning',
      status:      project.status      || 'In voorbereiding',
      voortgang:   project.voortgang   ?? 0,
      volgende_stap: project.volgende_stap || '',
    })
    setBewerken(false)
  }

  // Invoer helpers
  const inputSt = { width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:14, outline:'none', background:C.white, fontFamily:'inherit' }
  const labelSt = { display:'block', fontSize:12, fontWeight:600, color:C.slate, marginBottom:5, textTransform:'uppercase', letterSpacing:.5 }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* ── Projectgegevens kaart ─────────────────────────────────────────── */}
      <Card style={{ padding:'20px 22px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="clipboardList" size={16} color={C.blue}/>
            <span style={{ fontWeight:700, fontSize:15, color:C.ink }}>Projectgegevens</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {opgeslagen && (
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:C.ok, animation:'fadeIn .2s ease' }}>
                <Icon name="checkCircle" size={14} color={C.ok}/> Opgeslagen
              </div>
            )}
            {!bewerken ? (
              <Btn onClick={() => setBewerken(true)} variant="secondary" size="sm" style={{ gap:5 }}>
                <Icon name="edit" size={13} color={C.slate}/> Bewerken
              </Btn>
            ) : (
              <div style={{ display:'flex', gap:6 }}>
                <Btn onClick={annuleer} variant="ghost" size="sm">Annuleren</Btn>
                <Btn onClick={slaOp} variant="primary" size="sm" style={{ gap:5 }}>
                  <Icon name="check" size={13} color={C.white}/> Opslaan
                </Btn>
              </div>
            )}
          </div>
        </div>

        {!bewerken ? (
          /* ── Leesmodus ── */
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 24px' }}>
            {[
              ['Projectnaam',  form.naam],
              ['Type',         project.type.charAt(0).toUpperCase()+project.type.slice(1)],
              ['Woningtype',   form.woningtype],
              ['Bouwjaar',     form.bouwjaar || '—'],
              ['Budget',       form.budget   || '—'],
              ['Status',       form.status],
            ].map(([k, v]) => (
              <div key={k} style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>
                <div style={{ fontSize:11.5, color:C.mist, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:14, color:C.ink, fontWeight:500 }}>{v}</div>
              </div>
            ))}
            <div style={{ gridColumn:'1/-1', borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>
              <div style={{ fontSize:11.5, color:C.mist, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, marginBottom:3 }}>Omschrijving</div>
              <div style={{ fontSize:14, color:C.ink }}>{form.omschrijving || '—'}</div>
            </div>
            <div style={{ gridColumn:'1/-1', borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>
              <div style={{ fontSize:11.5, color:C.mist, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, marginBottom:3 }}>Wensen & doelen</div>
              <div style={{ fontSize:14, color:C.ink, lineHeight:1.6 }}>{form.wens || '—'}</div>
            </div>
          </div>
        ) : (
          /* ── Bewerkingsmodus ── */
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={labelSt}>Projectnaam</label>
                <input value={form.naam} onChange={e => setField('naam', e.target.value)} style={inputSt}
                  onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
              <div>
                <label style={labelSt}>Woningtype</label>
                <select value={form.woningtype} onChange={e => setField('woningtype', e.target.value)} style={{ ...inputSt }}>
                  {woning.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Bouwjaar woning</label>
                <input value={form.bouwjaar} onChange={e => setField('bouwjaar', e.target.value)} placeholder="bijv. 1987" style={inputSt}
                  onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
              <div>
                <label style={labelSt}>Budget indicatie</label>
                <input value={form.budget} onChange={e => setField('budget', e.target.value)} placeholder="bijv. €8.000 – €12.000" style={inputSt}
                  onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              </div>
            </div>
            <div>
              <label style={labelSt}>Omschrijving</label>
              <input value={form.omschrijving} onChange={e => setField('omschrijving', e.target.value)} placeholder="Korte beschrijving van het project" style={inputSt}
                onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
            </div>
            <div>
              <label style={labelSt}>Wensen & doelen</label>
              <textarea value={form.wens} onChange={e => setField('wens', e.target.value)} rows={4}
                placeholder="Wat wil je bereiken? Hoe specifieker, hoe beter het AI-advies."
                style={{ ...inputSt, resize:'vertical', minHeight:80, lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
            </div>
          </div>
        )}
      </Card>

      {/* ── Voortgang & status kaart ──────────────────────────────────────── */}
      <Card style={{ padding:'20px 22px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <Icon name="trendingUp" size={16} color={C.blue}/>
          <span style={{ fontWeight:700, fontSize:15, color:C.ink }}>Voortgang & status</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Voortgang schuifbalk */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <label style={labelSt}>Voortgang</label>
              <span style={{ fontSize:13, fontWeight:700, color:statusKleur }}>{form.voortgang}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={form.voortgang}
              onChange={e => setField('voortgang', Number(e.target.value))}
              style={{ width:'100%', accentColor:statusKleur, cursor:'pointer', height:4 }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.light, marginTop:4 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div style={{ marginTop:10, background:C.sand, borderRadius:4, height:6, overflow:'hidden' }}>
              <div style={{ width:`${form.voortgang}%`, height:'100%', background:statusKleur, borderRadius:4, transition:'width .3s' }}/>
            </div>
          </div>
          {/* Status */}
          <div>
            <label style={labelSt}>Status</label>
            <div style={{ display:'flex', flexDirection:'column', gap:7, marginTop:2 }}>
              {['In voorbereiding','Lopend','Afgerond'].map(s => {
                const kleur = { 'In voorbereiding':C.gold, 'Lopend':C.ok, 'Afgerond':C.mist }[s]
                const actief = form.status === s
                return (
                  <button key={s} onClick={() => setField('status', s)}
                    style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 12px', border:`1.5px solid ${actief?kleur:C.border}`, borderRadius:7, background:actief?`${kleur}15`:C.white, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all .15s' }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:actief?kleur:C.border, flexShrink:0, transition:'background .15s' }}/>
                    <span style={{ fontSize:13.5, fontWeight:actief?600:400, color:actief?kleur:C.slate }}>{s}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        {/* Volgende stap */}
        <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
          <label style={labelSt}>Volgende stap</label>
          <div style={{ display:'flex', gap:8, marginTop:2 }}>
            <input value={form.volgende_stap} onChange={e => setField('volgende_stap', e.target.value)}
              placeholder="bijv. Offerte aanvragen tegelzetter"
              style={{ ...inputSt }}
              onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
          </div>
        </div>
        {/* Opslaan knop onder voortgang */}
        <div style={{ marginTop:14, display:'flex', justifyContent:'flex-end' }}>
          <Btn onClick={slaOp} variant="primary" size="sm" style={{ gap:5 }}>
            <Icon name="check" size={13} color={C.white}/> Wijzigingen opslaan
          </Btn>
        </div>
      </Card>

      {/* ── AI Samenvatting kaart ─────────────────────────────────────────── */}
      <Card style={{ padding:'20px 22px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="activity" size={16} color={C.blue}/>
            <span style={{ fontWeight:700, fontSize:15, color:C.ink }}>AI projectanalyse</span>
          </div>
          <button onClick={() => laadAnalyse(project)} disabled={loadA}
            style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:C.mist, background:'none', border:`1px solid ${C.border}`, borderRadius:6, padding:'5px 10px', cursor:'pointer', fontFamily:'inherit', opacity:loadA?.5:1 }}>
            <Icon name="arrowRight" size={12} color={C.mist}/> Vernieuwen
          </button>
        </div>
        {loadA ? (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 0', color:C.mist }}>
            <Spinner size={18}/> <span style={{ fontSize:14 }}>AI analyseert jouw project...</span>
          </div>
        ) : aiError ? (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', background:C.redSoft, borderRadius:8, fontSize:13.5, color:C.red }}>
            <Icon name="alertCircle" size={15} color={C.red}/> {aiError}
          </div>
        ) : (
          <RenderMarkdown text={analyse} accentColor={statusKleur}/>
        )}
      </Card>

    </div>
  )
}
// ─── EINDE OVERZICHT TAB ──────────────────────────────────────────────────────

// ─── PROJECTEN ────────────────────────────────────────────────────────────────
function ProjectenModule({ user, projecten, setProjecten, setTab, onNieuwProject }) {
  const [activeProj, setActiveProj] = useState(null)
  const [activeTab, setActiveTab] = useState('overzicht')
  const [editModal, setEditModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [chatIn, setChatIn] = useState('')
  const [msgs, setMsgs] = useState([])
  const [loadC, setLoadC] = useState(false)
  const [statusFilter, setStatusFilter] = useState('alle')
  const chatRef = useRef(null)

  const isPremium = user.plan === 'premium' || user.plan === 'plus'
  const limiet = PLAN_LIMIET[user.plan]
  const userProjs = projecten.filter(p => p.uid === user.id)
  const actief = userProjs.filter(p => p.status !== 'Afgerond')
  const kanNieuwProject = isPremium && actief.length < limiet

  useEffect(() => { chatRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  if (!isPremium) return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'80px 24px', textAlign:'center', animation:'fadeIn .3s ease' }}>
      <div style={{ width:56, height:56, background:C.sand, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <Icon name="lock" size={24} color={C.mist}/>
      </div>
      <h2 style={{ fontWeight:700, fontSize:22, color:C.navy, margin:'0 0 10px' }}>Premium vereist</h2>
      <p style={{ fontSize:15, color:C.mist, lineHeight:1.65, margin:'0 0 28px' }}>Projecten zijn beschikbaar voor Premium en Premium Plus gebruikers. Maak een persoonlijk project aan met AI-begeleiding, tekenmodule en materiaaladvies.</p>
      <Btn onClick={() => setTab('upgrade')} variant="primary" size="lg" style={{ gap:8 }}>
        <Icon name="star" size={16} color={C.white}/> Bekijk plannen
      </Btn>
    </div>
  )

  function openProject(p) {
    setActiveProj(p)
    setActiveTab('overzicht')
    setMsgs([])
  }

  function buildSysPrompt(p) {
    return `Je bent Bouwvi AI bouwcoach. PROJECTGEGEVENS: Naam: ${p.naam}. Type: ${p.type}. Bouwjaar: ${p.bouwjaar}. Woningtype: ${p.woningtype}. Afmetingen: ${p.afm||'onbekend'}. Budget: ${p.budget}. Wensen: ${p.wens}. Extra: ${p.extra||'geen'}. Vorige stap: ${p.laatste_activiteit||'n.v.t.'}. Geef altijd concreet, praktisch en veiligheids-bewust advies in helder Nederlands. Gebruik **vet** voor kopjes en - voor punten.`
  }

  async function sendChat() {
    if (!chatIn.trim() || loadC) return
    const v = chatIn.trim(); setChatIn(''); setLoadC(true)
    setMsgs(m => [...m, { r:'user', t:v }])
    const t = await callAI(v, buildSysPrompt(activeProj))
    setMsgs(m => [...m, { r:'bot', t }]); setLoadC(false)
  }

  function verwijder(id) {
    setProjecten(p => p.filter(x => x.id !== id))
    setDeleteConfirm(null); setActiveProj(null)
  }

  function updateStatus(id, status) {
    setProjecten(p => p.map(x => x.id === id ? { ...x, status } : x))
    if (activeProj?.id === id) setActiveProj(p => ({ ...p, status }))
  }

  // Project detail view
  if (activeProj) {
    const TABS = [
      { id:'overzicht', label:'Overzicht', icon:'layoutDashboard' },
      { id:'coach', label:'AI Coach', icon:'activity' },
      { id:'tekenen', label:'Teken & Plan', icon:'pencilRuler' },
      { id:'materialen', label:'Materialen', icon:'package' },
      { id:'vakmannen', label:'Vakmannen', icon:'hardHat' },
    ]
    const statusKleur = { 'In voorbereiding':C.gold, 'Lopend':C.ok, 'Afgerond':C.mist }[activeProj.status]

    return (
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 24px 60px', animation:'fadeIn .3s ease' }}>
        {/* Breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'18px 0 14px', fontSize:13 }}>
          <button onClick={() => setActiveProj(null)} style={{ background:'none', border:'none', cursor:'pointer', color:C.mist, display:'flex', alignItems:'center', gap:5, padding:0 }}>
            <Icon name="folder" size={13} color={C.mist}/> Mijn projecten
          </button>
          <Icon name="chevronRight" size={13} color={C.light}/>
          <span style={{ color:C.ink, fontWeight:500 }}>{activeProj.naam}</span>
        </div>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, #1A3D8A 100%)`, borderRadius:12, padding:'20px 22px', marginBottom:20, borderLeft:`4px solid ${statusKleur}`, boxShadow:'0 6px 24px rgba(15,45,107,0.2)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
                <Badge label={activeProj.status} variant={activeProj.status==='Lopend'?'ok':activeProj.status==='Afgerond'?'default':'gold'}/>
                <Badge label={activeProj.type.charAt(0).toUpperCase()+activeProj.type.slice(1)} variant="default"/>
              </div>
              <h2 style={{ fontWeight:700, fontSize:20, color:C.white, margin:'0 0 8px', letterSpacing:'-.2px' }}>{activeProj.naam}</h2>
              {activeProj.omschrijving && <p style={{ fontSize:13.5, color:'rgba(255,255,255,.6)', margin:'0 0 12px' }}>{activeProj.omschrijving}</p>}
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {[activeProj.bouwjaar&&`Bouw ${activeProj.bouwjaar}`, activeProj.afm, activeProj.budget].filter(Boolean).map(v => (
                  <span key={v} style={{ fontSize:12.5, color:'rgba(255,255,255,.55)' }}>{v}</span>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <select value={activeProj.status} onChange={e => updateStatus(activeProj.id, e.target.value)}
                style={{ border:`1px solid rgba(255,255,255,.2)`, borderRadius:7, padding:'6px 10px', fontSize:12.5, color:C.white, background:'rgba(255,255,255,.1)', outline:'none', cursor:'pointer' }}>
                {['In voorbereiding','Lopend','Afgerond'].map(s => <option key={s} value={s} style={{ color:C.ink, background:C.white }}>{s}</option>)}
              </select>
              <button onClick={() => setDeleteConfirm(activeProj)} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:7, padding:'6px 10px', color:'rgba(255,255,255,.7)', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:12.5 }}>
                <Icon name="trash" size={13} color="rgba(255,255,255,.7)"/>
              </button>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,.5)', marginBottom:6 }}>
              <span>Voortgang</span><span>{activeProj.voortgang}%</span>
            </div>
            <div style={{ background:'rgba(255,255,255,.15)', borderRadius:4, height:4 }}>
              <div style={{ width:`${activeProj.voortgang}%`, height:'100%', background:statusKleur, borderRadius:4, transition:'width .5s' }}/>
            </div>
          </div>
        </div>

        {/* Project tabs */}
        <div style={{ display:'flex', gap:2, borderBottom:`1px solid ${C.border}`, marginBottom:20, overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 14px', border:'none', background:'none', fontSize:13.5, color:activeTab===t.id?C.blue:C.mist, fontWeight:activeTab===t.id?600:400, cursor:'pointer', borderBottom:`2px solid ${activeTab===t.id?C.blue:'transparent'}`, marginBottom:-1, whiteSpace:'nowrap' }}>
              <Icon name={t.icon} size={14} color={activeTab===t.id?C.blue:C.mist}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overzicht' && (
          <OverzichtTab
            project={activeProj}
            statusKleur={statusKleur}
            onSave={updates => {
              // Update project in state en sync activeProj
              const updated = { ...activeProj, ...updates }
              setProjecten(p => p.map(x => x.id === activeProj.id ? updated : x))
              setActiveProj(updated)
            }}
          />
        )}

        {activeTab === 'coach' && (
          <Card style={{ padding:'20px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:12, minHeight:280, maxHeight:420, overflowY:'auto', marginBottom:16 }}>
              {msgs.length === 0 && (
                <div style={{ textAlign:'center', padding:'28px 0', color:C.mist }}>
                  <Icon name="activity" size={28} color={C.border} style={{ display:'block', margin:'0 auto 12px' }}/>
                  <p style={{ fontSize:14, margin:0 }}>Stel je eerste vraag aan de AI bouwcoach</p>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} style={{ display:'flex', gap:10, flexDirection:m.r==='user'?'row-reverse':'row', animation:'fadeIn .2s ease' }}>
                  <div style={{ width:30, height:30, borderRadius:7, flexShrink:0, background:m.r==='user'?C.blue:C.sand, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name={m.r==='user'?'user':'activity'} size={14} color={m.r==='user'?C.white:C.slate}/>
                  </div>
                  <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:10, fontSize:13.5, background:m.r==='user'?C.blue:C.off, color:m.r==='user'?C.white:C.ink, borderBottomLeftRadius:m.r==='bot'?3:10, borderBottomRightRadius:m.r==='user'?3:10 }}>
                    {m.r==='bot' ? <RenderMarkdown text={m.t} accentColor={C.blue}/> : m.t}
                  </div>
                </div>
              ))}
              {loadC && (
                <div style={{ display:'flex', gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:7, background:C.sand, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="activity" size={14} color={C.slate}/>
                  </div>
                  <div style={{ background:C.off, borderRadius:'10px 10px 10px 3px', padding:'12px 14px', display:'flex', gap:4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.light, animation:`blink 1.2s ease ${i*.2}s infinite` }}/>)}
                  </div>
                </div>
              )}
              <div ref={chatRef}/>
            </div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginBottom:10 }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                {['Wat zijn de risico\'s?','Welke vergunning nodig?','Maak een planning','Welke vakman inschakelen?'].map(q => (
                  <button key={q} onClick={() => setChatIn(q)} style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:'5px 10px', fontSize:12, color:C.slate, background:C.white, cursor:'pointer', fontFamily:'inherit' }} className="btn-ghost">{q}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <textarea value={chatIn} onChange={e => setChatIn(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendChat() }}}
                placeholder="Stel een vraag over jouw project..." rows={1}
                style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:7, padding:'10px 12px', fontSize:13.5, resize:'none', outline:'none', minHeight:42, maxHeight:120 }}
                onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              <button onClick={sendChat} disabled={loadC||!chatIn.trim()}
                style={{ width:42, height:42, background:loadC||!chatIn.trim()?C.border:C.blue, border:'none', borderRadius:7, color:C.white, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="arrowRight" size={16} color={C.white}/>
              </button>
            </div>
          </Card>
        )}

        {activeTab === 'tekenen' && (
          <Card style={{ padding:'36px 24px', textAlign:'center' }}>
            <div style={{ width:52, height:52, background:C.blueSoft, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Icon name="pencilRuler" size={24} color={C.blue}/>
            </div>
            <h3 style={{ fontWeight:600, fontSize:17, color:C.ink, margin:'0 0 8px' }}>Teken & Plan — Fase 2</h3>
            <p style={{ fontSize:13.5, color:C.mist, margin:'0 0 6px', lineHeight:1.6 }}>De volledige 2D plattegrond-editor wordt in Fase 2 gebouwd. Je kunt hier binnenkort:</p>
            <ul style={{ textAlign:'left', display:'inline-block', fontSize:13.5, color:C.mist, lineHeight:2 }}>
              {['Muren tekenen op schaal','Deuren en ramen plaatsen','Sanitair en meubilair toevoegen','Huidige en gewenste situatie vergelijken','Plattegrond exporteren als PDF'].map(f => (
                <li key={f} style={{ display:'flex', alignItems:'center', gap:8 }}><Icon name="check" size={13} color={C.ok}/> {f}</li>
              ))}
            </ul>
          </Card>
        )}

        {activeTab === 'materialen' && (
          <Card style={{ padding:'36px 24px', textAlign:'center' }}>
            <div style={{ width:52, height:52, background:C.blueSoft, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Icon name="package" size={24} color={C.blue}/>
            </div>
            <h3 style={{ fontWeight:600, fontSize:17, color:C.ink, margin:'0 0 8px' }}>Materialen & Klusadvies — Fase 2</h3>
            <p style={{ fontSize:13.5, color:C.mist, margin:'0 0 6px', lineHeight:1.6 }}>Geïntegreerd materiaaladvies op basis van jouw project komt in Fase 2. Inclusief:</p>
            <ul style={{ textAlign:'left', display:'inline-block', fontSize:13.5, color:C.mist, lineHeight:2 }}>
              {['Volledige materiaallijst met hoeveelheden','Stap-voor-stap werkuitleg','Kostenindicatie budget/midden/premium','Winkels in de buurt','Koppeling met vakmannen'].map(f => (
                <li key={f} style={{ display:'flex', alignItems:'center', gap:8 }}><Icon name="check" size={13} color={C.ok}/> {f}</li>
              ))}
            </ul>
          </Card>
        )}

        {activeTab === 'vakmannen' && (
          <div>
            <p style={{ fontSize:13.5, color:C.mist, marginBottom:14 }}>Relevante vakmannen voor een <strong style={{ color:C.ink }}>{activeProj.type}</strong> verbouwing:</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {PARTNERS.filter(v => {
                const relevantie = { badkamer:['Loodgieter','Tegelzetter','Elektricien'], keuken:['Loodgieter','Elektricien','Timmerman'], dakkapel:['Dakdekker','Timmerman','Constructeur'] }
                const rel = relevantie[activeProj.type] || []
                return rel.includes(v.discipline) || rel.length === 0
              }).slice(0,4).map(v => <VakmanKaart key={v.id} vakman={v}/>)}
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {deleteConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(11,31,75,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
            <Card style={{ maxWidth:420, width:'100%', padding:'28px', boxShadow:C.shadowLg }}>
              <div style={{ width:44, height:44, background:C.redSoft, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon name="trash" size={20} color={C.red}/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:17, color:C.ink, margin:'0 0 8px' }}>Project verwijderen?</h3>
              <p style={{ fontSize:14, color:C.mist, margin:'0 0 22px' }}>"{deleteConfirm.naam}" wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.</p>
              <div style={{ display:'flex', gap:10 }}>
                <Btn onClick={() => setDeleteConfirm(null)} variant="secondary" full>Annuleren</Btn>
                <Btn onClick={() => verwijder(deleteConfirm.id)} variant="danger" full>Verwijderen</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Projectoverzicht
  const gefilterd = userProjs.filter(p => statusFilter === 'alle' ? true : p.status === statusFilter)

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 24px 60px', animation:'fadeIn .3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:24, color:C.navy, margin:'0 0 4px', letterSpacing:'-.4px' }}>Mijn projecten</h1>
          <p style={{ fontSize:13.5, color:C.mist, margin:0 }}>
            {actief.length} actief van {limiet} — {limiet - actief.length} slot{limiet - actief.length !== 1 ? 's' : ''} beschikbaar
          </p>
        </div>
        <Btn onClick={onNieuwProject} disabled={!kanNieuwProject} variant="primary" size="md" style={{ gap:6 }}>
          <Icon name="plus" size={15} color={C.white}/> Nieuw project
        </Btn>
      </div>

      {/* Status filter */}
      <div style={{ display:'flex', gap:6, marginBottom:18 }}>
        {['alle','In voorbereiding','Lopend','Afgerond'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ border:`1px solid ${statusFilter===s?C.blue:C.border}`, borderRadius:6, padding:'5px 12px', fontSize:12.5, fontWeight:statusFilter===s?600:400, color:statusFilter===s?C.blue:C.slate, background:statusFilter===s?C.blueSoft:C.white, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
            {s === 'alle' ? 'Alle projecten' : s}
          </button>
        ))}
      </div>

      {!kanNieuwProject && actief.length >= limiet && limiet > 0 && (
        <div style={{ background:C.goldSoft, border:`1px solid ${C.gold}44`, borderRadius:8, padding:'11px 14px', display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <Icon name="alertCircle" size={15} color={C.gold}/>
          <span style={{ fontSize:13, color:'#92400E' }}>Limiet bereikt. Rond een project af of upgrade naar Premium Plus voor meer projecten.</span>
        </div>
      )}

      {gefilterd.length === 0 ? (
        <Card style={{ padding:'48px 24px', textAlign:'center' }}>
          <Icon name="folder" size={32} color={C.border} style={{ display:'block', margin:'0 auto 14px' }}/>
          <h3 style={{ fontWeight:600, fontSize:16, color:C.ink, margin:'0 0 8px' }}>Geen projecten gevonden</h3>
          <p style={{ fontSize:13.5, color:C.mist, margin:'0 0 18px' }}>{statusFilter === 'alle' ? 'Maak je eerste project aan.' : `Geen projecten met status "${statusFilter}".`}</p>
          {statusFilter === 'alle' && <Btn onClick={onNieuwProject} disabled={!kanNieuwProject} variant="primary">Project starten</Btn>}
        </Card>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
          {gefilterd.map(p => (
            <ProjectKaart key={p.id} project={p} onClick={() => openProject(p)} onEdit={() => {}} onDelete={() => setDeleteConfirm(p)}/>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── BIBLIOTHEEK DATA ─────────────────────────────────────────────────────────
const CATS = [
  { id:'constructie', label:'Constructie & Ruwbouw', icon:'construction', subs:['Fundering','Draagmuren','Binnenmuren','Vloerconstructies','Balklagen','Betonwerk'], vragen:['Hoe herken ik een draagmuur?','Wat kost funderingsherstel?','Wanneer heb ik een constructeur nodig?'] },
  { id:'dak', label:'Dak & Gevel', icon:'home', subs:['Hellend dak','Plat dak','Dakbedekking','Dakisolatie','Dakkapel','Dakgoten'], vragen:['Wat kost een nieuw dak?','Heb ik vergunning nodig voor dakkapel?','Wanneer dakgoten vervangen?'] },
  { id:'kozijnen', label:'Kozijnen, Ramen & Deuren', icon:'grid', subs:['Buitenkozijnen','Ramen','Voordeuren','Schuifpuien','Binnendeuren','Glas'], vragen:['Hout, kunststof of aluminium?','Wat kost een nieuwe voordeur?','Wanneer dubbel glas vervangen?'] },
  { id:'installaties', label:'Installaties', icon:'zap', subs:['Elektra','Meterkast','Waterleiding','Afvoer','Vloerverwarming','Warmtepomp','Zonnepanelen'], vragen:['Wat mag ik zelf doen aan elektra?','Hoe werkt een warmtepomp?','Wat kost vloerverwarming?'] },
  { id:'binnenafbouw', label:'Binnenafbouw', icon:'hammer', subs:['Stucwerk','Plafonds','Voorzetwanden','Timmerwerk','Traprenovatie'], vragen:['Kan ik zelf stucken?','Wat kost traprenovatie?','Hoe maak ik een voorzetwand?'] },
  { id:'vloeren', label:'Vloeren & Wandafwerking', icon:'grid', subs:['Tegelwerk','PVC','Laminaat','Parket','Gietvloer','Egaliseren'], vragen:['Welke vloer past bij mij?','Hoe leg ik laminaat?','Wat kost een gietvloer?'] },
  { id:'ruimtes', label:'Ruimtes', icon:'layoutDashboard', subs:['Badkamer','Toilet','Keuken','Slaapkamer','Zolder','Kelder'], vragen:['Wat kost badkamer verbouwen?','In welke volgorde badkamer renoveren?','Hoe maak ik zolder bewoonbaar?'] },
  { id:'isolatie', label:'Isolatie & Duurzaamheid', icon:'award', subs:['Spouwmuurisolatie','Dakisolatie','Vloerisolatie','HR++ glas','Energiebesparing'], vragen:['Welke isolatie levert het meest op?','Hoe vraag ik ISDE subsidie aan?','Wat kost spouwmuurisolatie?'] },
  { id:'buiten', label:'Buitenruimte', icon:'mapPin', subs:['Veranda','Schuur','Terras','Oprit','Schutting','Bestrating'], vragen:['Heb ik vergunning nodig voor schuur?','Wat kost een houten veranda?','Hoe leg ik een terras aan?'] },
  { id:'vergunningen', label:'Vergunningen & Regelgeving', icon:'clipboardList', subs:['Omgevingsvergunning','Constructieberekening','Burenrecht','VvE regels','Energielabel'], vragen:['Wanneer heb ik een vergunning nodig?','Hoe vraag ik omgevingsvergunning aan?','Wat zijn mijn rechten bij burengeschil?'] },
  { id:'kosten', label:'Kosten & Planning', icon:'trendingUp', subs:['Kostenindicaties','Offertes vergelijken','Verbouwbudget','Planning maken'], vragen:['Hoe maak ik een realistisch budget?','Waar let ik op bij een offerte?','In welke volgorde pak ik de verbouwing aan?'] },
  { id:'problemen', label:'Problemen & Schade', icon:'alertCircle', subs:['Lekkage','Scheuren','Vocht','Schimmel','Verzakkingen','Tocht'], vragen:['Wat doe ik bij een lekkage?','Wanneer zijn scheuren gevaarlijk?','Hoe los ik vochtproblemen op?'] },
]

// ─── BIBLIOTHEEK ──────────────────────────────────────────────────────────────
function Bibliotheek({ user, setTab }) {
  const [view, setView] = useState('home')
  const [catId, setCatId] = useState(null)
  const [subNaam, setSubNaam] = useState(null)
  const [antw, setAntw] = useState('')
  const [loadA, setLoadA] = useState(false)
  const [fupIn, setFupIn] = useState('')
  const [fups, setFups] = useState([])
  const [loadF, setLoadF] = useState(false)
  const [zoek, setZoek] = useState('')
  const [vrageIn, setVrageIn] = useState('')
  const [vrageAntw, setVrageAntw] = useState('')
  const [loadV, setLoadV] = useState(false)
  const topRef = useRef(null)
  const isPremium = user && (user.plan === 'premium' || user.plan === 'plus')

  const cat = CATS.find(c => c.id === catId)
  useEffect(() => { topRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }) }, [view, subNaam])

  const geladen = useRef(false)
  useEffect(() => {
    if (view !== 'sub' || !subNaam || !cat) return
    geladen.current = false
  }, [subNaam])
  useEffect(() => {
    if (view !== 'sub' || !subNaam || !cat || geladen.current) return
    geladen.current = true; setLoadA(true); setAntw(''); setFups([])
    callAI(
      `Geef uitgebreid praktisch advies over "${subNaam}" voor particulieren. Bespreek: wat is het, typische kosten in Nederland, wat kun je zelf doen vs professional, veelgemaakte fouten, veiligheidsaandachtspunten, handige tips. Wees concreet en volledig.`,
      `Je bent Bouwvi kennisadviseur. Geef altijd veilig, eerlijk en praktisch advies voor Nederlandse particulieren. Sluit af met: voor maatwerk advies op jouw specifieke situatie, start een Premium project.`
    ).then(t => { setAntw(t); setLoadA(false) })
  }, [view, subNaam, cat])

  async function sendFup() {
    if (!fupIn.trim() || loadF) return
    const v = fupIn.trim(); setFupIn(''); setLoadF(true)
    const t = await callAI(`Vervolgvraag over "${subNaam}": ${v}`)
    setFups(p => [...p, { v, a:t }]); setLoadF(false)
  }

  async function sendVraag() {
    if (!vrageIn.trim() || loadV) return
    setLoadV(true); setVrageAntw('')
    const t = await callAI(
      vrageIn,
      `Je bent Bouwvi kennisadviseur. Geef een algemeen, richtinggevend antwoord. Dit is de gratis versie — geef geen diep maatwerkadvies maar wel nuttige informatie. Sluit altijd af met een korte CTA richting Premium als het vraagstuk specifiek is voor hun situatie.`
    )
    setVrageAntw(t); setLoadV(false)
  }

  const gefilterd = zoek ? CATS.filter(c => c.label.toLowerCase().includes(zoek.toLowerCase()) || c.subs.some(s => s.toLowerCase().includes(zoek.toLowerCase()))) : CATS

  if (view === 'home') return (
    <div ref={topRef} style={{ maxWidth:860, margin:'0 auto', padding:'32px 24px 60px', animation:'fadeIn .3s ease' }}>
      {/* Hero */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontWeight:800, fontSize:26, color:C.navy, margin:'0 0 6px', letterSpacing:'-.4px' }}>Kennisbibliotheek</h1>
        <p style={{ fontSize:14, color:C.mist, margin:'0 0 18px' }}>Praktische informatie over verbouwen en renoveren — altijd gratis toegankelijk.</p>
        <div style={{ display:'flex', background:C.white, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden', boxShadow:C.shadow, maxWidth:500 }}>
          <div style={{ padding:'0 12px', display:'flex', alignItems:'center' }}>
            <Icon name="search" size={15} color={C.mist}/>
          </div>
          <input value={zoek} onChange={e => setZoek(e.target.value)} placeholder="Zoek een onderwerp..."
            style={{ flex:1, border:'none', outline:'none', fontSize:14, padding:'11px 0', color:C.ink }}/>
        </div>
      </div>

      {/* Vrije vraag module */}
      <Card style={{ padding:'20px', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
          <div style={{ width:36, height:36, background:C.blueSoft, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon name="activity" size={18} color={C.blue}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14, color:C.ink, marginBottom:3 }}>Stel je bouwvraag</div>
            <p style={{ fontSize:13, color:C.mist, margin:'0 0 12px' }}>Stel een algemene vraag over verbouwen en ontvang direct een antwoord.</p>
            <div style={{ display:'flex', gap:8 }}>
              <textarea value={vrageIn} onChange={e => setVrageIn(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendVraag() }}}
                placeholder="bijv. Wanneer heb ik een vergunning nodig voor een dakkapel?" rows={2}
                style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 12px', fontSize:13.5, resize:'none', outline:'none', minHeight:60 }}
                onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
              <Btn onClick={sendVraag} disabled={loadV||!vrageIn.trim()} variant="primary" style={{ alignSelf:'flex-end', gap:6 }}>
                {loadV ? <Spinner size={14}/> : <Icon name="arrowRight" size={14} color={C.white}/>}
              </Btn>
            </div>
            {loadV && <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, color:C.mist, fontSize:13 }}><Spinner size={14}/>Even geduld...</div>}
            {vrageAntw && (
              <div style={{ marginTop:14, padding:'14px 16px', background:C.off, borderRadius:8, border:`1px solid ${C.border}` }}>
                <RenderMarkdown text={vrageAntw} accentColor={C.blue}/>
                {!isPremium && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
                    <span style={{ fontSize:13, color:C.mist }}>Wil je advies voor jouw specifieke situatie?</span>
                    <Btn onClick={() => setTab('upgrade')} variant="primary" size="sm" style={{ gap:5 }}>
                      <Icon name="star" size={12} color={C.white}/> Start Premium project
                    </Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Categorieën */}
      <div style={{ fontWeight:600, fontSize:12.5, color:C.mist, marginBottom:12, textTransform:'uppercase', letterSpacing:.7 }}>Alle categorieën</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10 }}>
        {gefilterd.map(ct => (
          <button key={ct.id} onClick={() => { setCatId(ct.id); setView('cat') }}
            className="card-hover"
            style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:9, padding:'16px', textAlign:'left', cursor:'pointer', boxShadow:C.shadow, display:'block', width:'100%' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:32, height:32, background:C.sand, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={ct.icon} size={16} color={C.slate}/>
              </div>
              <div style={{ fontWeight:600, fontSize:13.5, color:C.ink, lineHeight:1.3 }}>{ct.label}</div>
            </div>
            <div style={{ fontSize:12, color:C.light }}>{ct.subs.length} onderwerpen</div>
          </button>
        ))}
      </div>
    </div>
  )

  if (view === 'cat' && cat) return (
    <div ref={topRef} style={{ maxWidth:720, margin:'0 auto', padding:'28px 24px 60px', animation:'fadeIn .3s ease' }}>
      <nav style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22, fontSize:13 }}>
        <button onClick={() => setView('home')} style={{ background:'none', border:'none', cursor:'pointer', color:C.mist, padding:0, display:'flex', alignItems:'center', gap:5 }}>
          <Icon name="bookOpen" size={13} color={C.mist}/> Bibliotheek
        </button>
        <Icon name="chevronRight" size={13} color={C.light}/>
        <span style={{ color:C.ink, fontWeight:500 }}>{cat.label}</span>
      </nav>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:44, height:44, background:C.sand, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name={cat.icon} size={22} color={C.slate}/>
        </div>
        <div>
          <h2 style={{ fontWeight:700, fontSize:20, color:C.navy, margin:'0 0 3px', letterSpacing:'-.2px' }}>{cat.label}</h2>
          <p style={{ fontSize:13, color:C.mist, margin:0 }}>Kies een onderwerp voor uitgebreide informatie</p>
        </div>
      </div>

      {cat.vragen.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:600, fontSize:12, color:C.mist, marginBottom:10, textTransform:'uppercase', letterSpacing:.7 }}>Veelgestelde vragen</div>
          {cat.vragen.map((v,i) => (
            <button key={i} onClick={() => { setSubNaam(cat.subs[0]); setView('sub') }}
              className="btn-ghost"
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', border:`1px solid ${C.border}`, borderRadius:7, marginBottom:6, cursor:'pointer', fontSize:13.5, color:C.slate, background:C.white, textAlign:'left', fontFamily:'inherit' }}>
              <Icon name="chevronRight" size={13} color={C.light}/>{v}
            </button>
          ))}
        </div>
      )}

      <div style={{ fontWeight:600, fontSize:12, color:C.mist, marginBottom:10, textTransform:'uppercase', letterSpacing:.7 }}>Alle onderwerpen</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {cat.subs.map(s => (
          <button key={s} onClick={() => { setSubNaam(s); setView('sub') }}
            className="card-hover"
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', border:`1px solid ${C.border}`, borderRadius:8, background:C.white, cursor:'pointer', fontSize:14, color:C.ink, fontFamily:'inherit', boxShadow:C.shadow }}>
            <span style={{ fontWeight:500 }}>{s}</span>
            <Icon name="chevronRight" size={14} color={C.light}/>
          </button>
        ))}
      </div>
    </div>
  )

  // Sub artikel
  return (
    <div ref={topRef} style={{ maxWidth:720, margin:'0 auto', padding:'28px 24px 60px', animation:'fadeIn .3s ease' }}>
      <nav style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22, fontSize:13 }}>
        <button onClick={() => setView('home')} style={{ background:'none', border:'none', cursor:'pointer', color:C.mist, padding:0 }}>Bibliotheek</button>
        <Icon name="chevronRight" size={13} color={C.light}/>
        <button onClick={() => setView('cat')} style={{ background:'none', border:'none', cursor:'pointer', color:C.mist, padding:0 }}>{cat?.label}</button>
        <Icon name="chevronRight" size={13} color={C.light}/>
        <span style={{ color:C.ink, fontWeight:500 }}>{subNaam}</span>
      </nav>

      <h1 style={{ fontWeight:700, fontSize:22, color:C.navy, margin:'0 0 6px', letterSpacing:'-.3px' }}>{subNaam}</h1>
      <p style={{ fontSize:13.5, color:C.mist, margin:'0 0 22px' }}>{cat?.label}</p>

      <Card style={{ padding:'22px', marginBottom:16, minHeight:80 }}>
        {loadA ? (
          <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}>
            <Spinner/> Informatie ophalen...
          </div>
        ) : <RenderMarkdown text={antw} accentColor={C.blue}/>}
      </Card>

      {/* Veelgestelde vragen */}
      {!loadA && antw && cat?.vragen.length > 0 && (
        <div style={{ marginBottom:18 }}>
          <div style={{ fontWeight:600, fontSize:12, color:C.mist, marginBottom:10, textTransform:'uppercase', letterSpacing:.7 }}>Gerelateerde vragen</div>
          {cat.vragen.map((v,i) => (
            <button key={i} onClick={() => setFupIn(v)}
              className="btn-ghost"
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', border:`1px solid ${C.border}`, borderRadius:7, marginBottom:6, cursor:'pointer', fontSize:13.5, color:C.slate, background:C.white, textAlign:'left', fontFamily:'inherit' }}>
              <Icon name="chevronRight" size={13} color={C.light}/>{v}
            </button>
          ))}
        </div>
      )}

      {/* Fup chat */}
      {fups.map((f,i) => (
        <div key={i} style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
            <div style={{ background:C.navy, color:C.white, borderRadius:'10px 10px 3px 10px', padding:'9px 14px', fontSize:13.5, maxWidth:'85%' }}>{f.v}</div>
          </div>
          <Card style={{ padding:'18px', borderTopLeftRadius:3 }}><RenderMarkdown text={f.a}/></Card>
        </div>
      ))}

      {!loadA && antw && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, color:C.mist, marginBottom:8 }}>Stel een vervolgvraag</div>
          <div style={{ display:'flex', gap:8 }}>
            <textarea value={fupIn} onChange={e => setFupIn(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendFup() }}}
              placeholder={`Vraag over ${subNaam}...`} rows={1}
              style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:7, padding:'10px 12px', fontSize:13.5, resize:'none', outline:'none', minHeight:42, maxHeight:120 }}
              onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
            <button onClick={sendFup} disabled={loadF||!fupIn.trim()}
              style={{ width:42, height:42, background:loadF||!fupIn.trim()?C.border:C.blue, border:'none', borderRadius:7, color:C.white, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="arrowRight" size={15} color={C.white}/>
            </button>
          </div>
        </div>
      )}

      {/* Gerelateerde onderwerpen */}
      {cat && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:600, fontSize:12, color:C.mist, marginBottom:10, textTransform:'uppercase', letterSpacing:.7 }}>Gerelateerde onderwerpen</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {cat.subs.filter(s => s !== subNaam).slice(0,5).map(s => (
              <button key={s} onClick={() => setSubNaam(s)} className="btn-ghost"
                style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:'5px 12px', fontSize:13, color:C.slate, background:C.white, cursor:'pointer', fontFamily:'inherit' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {!isPremium && (
        <div style={{ background:C.navy, borderRadius:10, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontWeight:600, fontSize:14, color:C.white, marginBottom:3 }}>Advies voor jouw specifieke situatie?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.6)' }}>Met Premium maak je een persoonlijk project met AI-begeleiding op maat.</div>
          </div>
          <Btn onClick={() => setTab('upgrade')} variant="secondary" size="sm" style={{ gap:6, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', color:C.white, flexShrink:0 }}>
            <Icon name="star" size={13} color={C.white}/> Meer info
          </Btn>
        </div>
      )}
    </div>
  )
}

// ─── VAKMAN KAART ─────────────────────────────────────────────────────────────
function VakmanKaart({ vakman: v }) {
  return (
    <Card className="card-hover" style={{ padding:'16px 18px' }}>
      {v.aanbevolen && (
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:C.goldSoft, border:`1px solid ${C.gold}33`, borderRadius:5, padding:'3px 9px', fontSize:11, fontWeight:600, color:C.gold, marginBottom:10 }}>
          <Icon name="star" size={11} color={C.gold}/> Aanbevolen
        </div>
      )}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:40, height:40, background:C.sand, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name="hardHat" size={18} color={C.slate}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:14, color:C.ink, marginBottom:2 }}>{v.naam}</div>
          <div style={{ fontSize:12.5, color:C.mist, marginBottom:6 }}>{v.discipline} · {v.categorie} · {v.afstand} · {v.prijs}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3,4,5].map(s => <div key={s} style={{ width:9, height:9, borderRadius:2, background:s<=Math.round(v.rating)?C.gold:C.border }}/>)}
            </div>
            <span style={{ fontSize:12.5, fontWeight:600, color:C.ink }}>{v.rating}</span>
            <span style={{ fontSize:12, color:C.light }}>({v.reviews} reviews)</span>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
          <button onClick={() => window.open(`tel:${v.tel}`)} style={{ display:'flex', alignItems:'center', gap:6, background:C.okSoft, border:`1px solid ${C.ok}33`, borderRadius:6, padding:'6px 10px', fontSize:12.5, fontWeight:600, color:C.ok, cursor:'pointer', fontFamily:'inherit' }}>
            <Icon name="phone" size={12} color={C.ok}/> Bellen
          </button>
          {v.website && (
            <button onClick={() => window.open(v.website,'_blank')} style={{ display:'flex', alignItems:'center', gap:6, background:C.white, border:`1px solid ${C.border}`, borderRadius:6, padding:'6px 10px', fontSize:12.5, fontWeight:600, color:C.slate, cursor:'pointer', fontFamily:'inherit' }}>
              <Icon name="globe" size={12} color={C.mist}/> Website
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── VAKMANNEN ────────────────────────────────────────────────────────────────
const DISCIPLINES = {
  'Ruwbouw & constructie':['Aannemer','Metselaar','Betonwerker','Constructeur'],
  'Timmerwerk & afbouw':['Timmerman','Interieurbouwer','Kozijnspecialist'],
  'Afwerking':['Schilder','Stukadoor','Tegelzetter','Vloerenlegger'],
  'Installaties':['Elektricien','Loodgieter','CV-installateur','Ventilatiespecialist'],
  'Dak & gevel':['Dakdekker','Gevelspecialist','Isolatiespecialist'],
  'Overig':['Steigerbouwer','Sloopbedrijf','Containerverhuur'],
}

function Vakmannen() {
  const [stad, setStad] = useState('')
  const [actieveCat, setActieveCat] = useState('Alle disciplines')
  const [actieveDiscipline, setActieveDiscipline] = useState(null)

  const alle = ['Alle disciplines', ...Object.keys(DISCIPLINES)]
  const gefilterd = PARTNERS.filter(v => {
    if (actieveCat === 'Alle disciplines') return true
    const disc = DISCIPLINES[actieveCat] || []
    return disc.includes(v.discipline)
  })

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 24px 60px', animation:'fadeIn .3s ease' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontWeight:700, fontSize:22, color:C.navy, margin:'0 0 6px', letterSpacing:'-.3px' }}>Vakmannen</h1>
        <p style={{ fontSize:14, color:C.mist, margin:'0 0 18px' }}>Vind erkende vakmensen bij jou in de buurt op vakdiscipline.</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', background:C.white, border:`1px solid ${C.border}`, borderRadius:7, overflow:'hidden', boxShadow:C.shadow, flex:1, minWidth:200, maxWidth:360 }}>
            <div style={{ padding:'0 11px', display:'flex', alignItems:'center' }}>
              <Icon name="mapPin" size={14} color={C.mist}/>
            </div>
            <input value={stad} onChange={e => setStad(e.target.value)} placeholder="Stad of postcode..."
              style={{ flex:1, border:'none', outline:'none', fontSize:14, padding:'10px 0', color:C.ink }}/>
          </div>
        </div>
      </div>

      {/* Discipline filter */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', marginBottom:20, paddingBottom:4 }}>
        {alle.map(cat => (
          <button key={cat} onClick={() => setActieveCat(cat)}
            style={{ flexShrink:0, border:`1px solid ${actieveCat===cat?C.blue:C.border}`, borderRadius:6, padding:'6px 12px', fontSize:12.5, fontWeight:actieveCat===cat?600:400, color:actieveCat===cat?C.blue:C.slate, background:actieveCat===cat?C.blueSoft:C.white, cursor:'pointer', fontFamily:'inherit', transition:'all .15s', whiteSpace:'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-discipline filter */}
      {actieveCat !== 'Alle disciplines' && DISCIPLINES[actieveCat] && (
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:16 }}>
          {DISCIPLINES[actieveCat].map(d => (
            <button key={d} onClick={() => setActieveDiscipline(actieveDiscipline===d?null:d)}
              style={{ border:`1px solid ${actieveDiscipline===d?C.navy:C.border}`, borderRadius:5, padding:'4px 10px', fontSize:12, color:actieveDiscipline===d?C.navy:C.mist, background:actieveDiscipline===d?C.blueSoft:C.white, cursor:'pointer', fontFamily:'inherit' }}>
              {d}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {gefilterd.length === 0 ? (
          <Card style={{ padding:'36px 24px', textAlign:'center' }}>
            <p style={{ color:C.mist, fontSize:14 }}>Geen vakmannen gevonden voor deze selectie.</p>
          </Card>
        ) : (
          gefilterd.map(v => <VakmanKaart key={v.id} vakman={v}/>)
        )}
      </div>
      <p style={{ fontSize:12, color:C.light, marginTop:12, textAlign:'center' }}>Bouwvi toont objectieve matches. Gesponsorde partners worden duidelijk gelabeld.</p>
    </div>
  )
}

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────
function Account({ user, setTab, onLogout }) {
  const [tab, setAccountTab] = useState('profiel')
  const facts = getFacts(user.id)
  const planLabel = { gratis:'Gratis', premium:'Premium', plus:'Premium Plus' }[user.plan]
  const planPrijs = { gratis:0, premium:19.99, plus:29.99 }[user.plan]

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'32px 24px 60px', animation:'fadeIn .3s ease' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24, padding:'20px', background:C.navy, borderRadius:12 }}>
        <div style={{ width:52, height:52, background:'rgba(255,255,255,.15)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:20, color:C.white, flexShrink:0 }}>
          {user.initialen}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:17, color:C.white }}>{user.naam}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', marginTop:2 }}>{user.email}</div>
          <div style={{ marginTop:7 }}><PlanBadge plan={user.plan}/></div>
        </div>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:7, padding:'7px 12px', fontSize:12.5, color:'rgba(255,255,255,.8)', cursor:'pointer', fontFamily:'inherit' }}>
          <Icon name="logOut" size={13} color="rgba(255,255,255,.7)"/> Uitloggen
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, marginBottom:22 }}>
        {[['profiel','Profiel','user'],['abo','Abonnement','star'],['facts','Facturen','fileText'],['beveiliging','Beveiliging','lock']].map(([id,l,ico]) => (
          <button key={id} onClick={() => setAccountTab(id)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 14px', border:'none', background:'none', fontSize:13.5, color:tab===id?C.blue:C.mist, fontWeight:tab===id?600:400, cursor:'pointer', borderBottom:`2px solid ${tab===id?C.blue:'transparent'}`, marginBottom:-1 }}>
            <Icon name={ico} size={14} color={tab===id?C.blue:C.mist}/>{l}
          </button>
        ))}
      </div>

      {tab === 'profiel' && (
        <Card style={{ padding:'20px' }}>
          {[['Naam',user.naam],['E-mail',user.email],['Lid sinds',user.lid_sinds],['Plan',planLabel]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
              <span style={{ color:C.mist, fontWeight:500 }}>{k}</span><span style={{ fontWeight:600, color:C.ink }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'10px 14px', background:C.blueSoft, borderRadius:8, fontSize:13, color:C.blue, display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="alertCircle" size={14} color={C.blue}/> Dit is een demo account. Gegevens aanpassen is beschikbaar in de productieversie.
          </div>
        </Card>
      )}

      {tab === 'abo' && (
        <div>
          <Card style={{ padding:'20px', marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.mist, textTransform:'uppercase', letterSpacing:.7, marginBottom:5 }}>Huidig abonnement</div>
                <div style={{ fontWeight:700, fontSize:20, color:C.navy }}>{planLabel}</div>
                {user.sub && <div style={{ fontSize:13, color:C.mist, marginTop:4 }}>Verlengt {user.sub.verlengt} · {user.sub.methode}</div>}
              </div>
              {planPrijs > 0 && (
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, fontSize:24, color:C.blue }}>€{planPrijs}</div>
                  <div style={{ fontSize:12, color:C.mist }}>per maand</div>
                </div>
              )}
            </div>
            {user.plan === 'gratis' && <Btn onClick={() => setTab('upgrade')} variant="primary" full style={{ gap:7 }}><Icon name="star" size={14} color={C.white}/> Upgraden naar Premium</Btn>}
            {user.plan === 'premium' && <Btn onClick={() => setTab('upgrade')} variant="secondary" style={{ gap:7 }}><Icon name="star" size={14} color={C.slate}/> Upgraden naar Plus</Btn>}
          </Card>
          <p style={{ fontSize:12.5, color:C.light, textAlign:'center' }}>Demo: betalingen werken in productie via Mollie · iDEAL · Apple Pay · creditcard</p>
        </div>
      )}

      {tab === 'facts' && (
        <Card style={{ padding:'20px' }}>
          <div style={{ fontWeight:600, fontSize:14, color:C.navy, marginBottom:14 }}>Betalingsgeschiedenis</div>
          {facts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'24px 0', color:C.mist, fontSize:14 }}>Geen facturen beschikbaar.</div>
          ) : facts.map(f => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <Icon name="fileText" size={16} color={C.mist}/>
                <div>
                  <div style={{ fontWeight:600, fontSize:13.5, color:C.ink }}>Bouwvi {planLabel}</div>
                  <div style={{ fontSize:12, color:C.mist }}>{f.datum} · {f.nr}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontWeight:700, fontSize:14, color:C.ink }}>€{f.bedrag}</span>
                <Badge label="Betaald" variant="ok"/>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'beveiliging' && (
        <Card style={{ padding:'20px' }}>
          {[
            { icon:'lock', label:'Wachtwoord wijzigen', sub:'Laatste wijziging: niet van toepassing (demo)', aan:true },
            { icon:'checkCircle', label:'Twee-factor authenticatie', sub:'Extra beveiligingslaag via SMS of app', aan:false },
            { icon:'fileText', label:'GDPR — Gegevens exporteren', sub:'Download al jouw Bouwvi data', aan:true },
          ].map(item => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <Icon name={item.icon} size={16} color={C.mist}/>
                <div>
                  <div style={{ fontWeight:500, fontSize:14, color:C.ink }}>{item.label}</div>
                  <div style={{ fontSize:12, color:C.mist }}>{item.sub}</div>
                </div>
              </div>
              <div style={{ width:40, height:22, borderRadius:11, background:item.aan?C.ok:C.border, position:'relative', cursor:'pointer', flexShrink:0 }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:C.white, position:'absolute', top:3, left:item.aan?21:3, transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

// ─── UPGRADE ──────────────────────────────────────────────────────────────────
function Upgrade({ user, onUpgrade }) {
  const [load, setLoad] = useState(null)
  async function doPlan(p) {
    setLoad(p); await new Promise(r => setTimeout(r, 1000)); setLoad(null); onUpgrade(p)
  }
  const plannen = [
    { id:'gratis', label:'Gratis', prijs:0, feats:['Kennisbibliotheek','AI vraag stellen','Vakmannen bekijken'], locked:['Eigen projecten','AI bouwcoach','Teken & Plan','Materiaaladvies'] },
    { id:'premium', label:'Premium', prijs:19.99, feats:['1 actief project','Persoonlijke AI bouwcoach','Teken & Plan','Materiaaladvies','Vakmannen koppelen'], locked:['Meerdere projecten'], populair:false },
    { id:'plus', label:'Premium Plus', prijs:29.99, feats:['3 actieve projecten','Alles van Premium','Uitgebreide AI begeleiding','Projecten vergelijken','Prioriteit support'], locked:[], populair:true },
  ]
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'48px 24px 60px', animation:'fadeIn .3s ease' }}>
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <h1 style={{ fontWeight:800, fontSize:28, color:C.navy, margin:'0 0 8px', letterSpacing:'-.5px' }}>Kies jouw plan</h1>
        <p style={{ fontSize:15, color:C.mist, margin:0 }}>Maandelijks opzegbaar · iDEAL · geen verborgen kosten</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {plannen.map(pl => (
          <div key={pl.id} style={{ border:`1.5px solid ${pl.populair?C.blue:user.plan===pl.id?C.blueL:C.border}`, borderRadius:12, padding:'22px 18px', background:C.white, position:'relative', boxShadow:pl.populair?C.shadowMd:C.shadow }}>
            {pl.populair && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:C.blue, color:C.white, fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:20, whiteSpace:'nowrap', letterSpacing:.5 }}>MEEST GEKOZEN</div>}
            <div style={{ fontWeight:700, fontSize:15, color:C.navy, marginBottom:5 }}>{pl.label}</div>
            <div style={{ fontWeight:700, fontSize:26, color:pl.id==='plus'?C.blue:pl.id==='gratis'?C.mist:C.blue, marginBottom:16 }}>
              {pl.prijs === 0 ? 'Gratis' : `€${pl.prijs}`}<span style={{ fontSize:12, fontWeight:400, color:C.light }}>{pl.prijs > 0 ? '/mnd' : ''}</span>
            </div>
            {pl.feats.map(f => (
              <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                <Icon name="check" size={13} color={C.ok} style={{ marginTop:2, flexShrink:0 }}/><span style={{ fontSize:13, color:C.slate }}>{f}</span>
              </div>
            ))}
            {pl.locked.map(f => (
              <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                <Icon name="x" size={13} color={C.light} style={{ marginTop:2, flexShrink:0 }}/><span style={{ fontSize:13, color:C.light }}>{f}</span>
              </div>
            ))}
            <div style={{ marginTop:18 }}>
              {user.plan === pl.id ? (
                <div style={{ textAlign:'center', fontSize:13, color:C.ok, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <Icon name="checkCircle" size={14} color={C.ok}/> Huidig plan
                </div>
              ) : (
                <Btn onClick={() => doPlan(pl.id)} variant={pl.populair?'primary':pl.id==='gratis'?'ghost':'secondary'} full style={{ gap:6 }}>
                  {load === pl.id ? <Spinner size={14}/> : null}
                  {pl.id === 'gratis' ? 'Downgraden' : 'Upgraden'}
                </Btn>
              )}
            </div>
          </div>
        ))}
      </div>
      <p style={{ textAlign:'center', fontSize:12.5, color:C.light, marginTop:18 }}>
        Veilig betalen via Mollie · iDEAL · Apple Pay · creditcard · 30 dagen geld-terug-garantie
      </p>
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [load, setLoad] = useState(false)

  async function doLogin() {
    setLoad(true); setErr('')
    await new Promise(r => setTimeout(r, 500))
    const u = getUser(email)
    if (!u) { setErr('E-mailadres niet gevonden'); setLoad(false); return }
    if (u.password !== pw) { setErr('Onjuist wachtwoord'); setLoad(false); return }
    onLogin(u)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:C.off }}>
      <div style={{ background:C.white, borderRadius:14, padding:'36px 32px', maxWidth:400, width:'100%', boxShadow:C.shadowLg, animation:'fadeIn .3s ease' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:40, height:40, background:C.blue, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <span style={{ color:C.red, fontWeight:800, fontSize:20, fontFamily:'Georgia, serif' }}>B</span>
          </div>
          <h1 style={{ fontWeight:800, fontSize:22, color:C.navy, margin:'0 0 4px', letterSpacing:'-.3px' }}>Inloggen bij Bouwvi</h1>
          <p style={{ fontSize:13, color:C.mist, margin:0 }}>Bouwadvies in je broekzak</p>
        </div>

        {err && (
          <div style={{ background:C.redSoft, border:`1px solid ${C.red}33`, borderRadius:7, padding:'10px 14px', marginBottom:16, fontSize:13.5, color:C.red, display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="alertCircle" size={14} color={C.red}/>{err}
          </div>
        )}

        {[['E-mailadres','email',email,setEmail,'naam@email.nl'],['Wachtwoord','password',pw,setPw,'••••••••']].map(([l,t,v,s,ph]) => (
          <div key={l} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12.5, fontWeight:600, color:C.ink, display:'block', marginBottom:5 }}>{l}</label>
            <input type={t} value={v} onChange={e => s(e.target.value)} placeholder={ph}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              style={{ width:'100%', border:`1px solid ${C.border}`, borderRadius:7, padding:'10px 12px', fontSize:14, outline:'none' }}
              onFocus={e => e.target.style.borderColor=C.blue} onBlur={e => e.target.style.borderColor=C.border}/>
          </div>
        ))}

        <Btn onClick={doLogin} variant="navy" full style={{ fontSize:15, padding:'11px', gap:8, marginBottom:22 }}>
          {load ? <Spinner size={16}/> : null} {load ? 'Bezig...' : 'Inloggen'}
        </Btn>

        <div style={{ padding:14, background:C.off, borderRadius:9, border:`1px solid ${C.border}` }}>
          <p style={{ fontSize:11.5, fontWeight:600, color:C.mist, textTransform:'uppercase', letterSpacing:.7, margin:'0 0 10px' }}>Demo testaccounts · wachtwoord: Test123!</p>
          {[['testfree@bouwvi.nl','Gratis','default'],['testpremium@bouwvi.nl','Premium','blue'],['testplus@bouwvi.nl','Premium Plus','gold']].map(([e,l,v]) => (
            <button key={e} onClick={() => { setEmail(e); setPw('Test123!') }}
              className="btn-ghost"
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:C.white, border:`1px solid ${C.border}`, borderRadius:7, padding:'8px 10px', marginBottom:5, cursor:'pointer', fontFamily:'inherit' }}>
              <span style={{ fontSize:12.5, color:C.slate }}>{e}</span>
              <Badge label={l} variant={v}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('home')
  const [ready, setReady] = useState(false)
  const [projecten, setProjecten] = useState(INIT_PROJECTEN)
  const [nieuwProjModal, setNieuwProjModal] = useState(false)

  useEffect(() => {
    setReady(true)
    try {
      const s = sessionStorage.getItem('bv_session')
      if (s) { const u = getUserById(JSON.parse(s).id); if (u) setUser(u) }
    } catch {}
  }, [])

  function login(u) { sessionStorage.setItem('bv_session', JSON.stringify({ id:u.id })); setUser(u); setTab('home') }
  function logout() { sessionStorage.removeItem('bv_session'); setUser(null); setTab('home') }
  function upgrade(plan) {
    const updated = { ...user, plan }; setUser(updated)
    try { const s = JSON.parse(sessionStorage.getItem('bv_session')||'{}'); sessionStorage.setItem('bv_session', JSON.stringify({...s,plan})) } catch {}
    setTab('home')
  }

  function saveNieuwProject(form) {
    const np = {
      ...form,
      id: 'p_' + Date.now(),
      uid: user.id,
      voortgang: 0,
      datum: new Date().toLocaleDateString('nl-NL', { day:'numeric', month:'short', year:'numeric' }),
      laatste_activiteit: 'Project aangemaakt',
      volgende_stap: 'AI analyse uitvoeren',
    }
    setProjecten(p => [...p, np])
    setNieuwProjModal(false)
    setTab('projecten')
  }

  if (!ready) return null
  if (!user) return <Login onLogin={login}/>

  return (
    <div style={{ minHeight:'100vh', background:C.off }}>
      <Head><title>Bouwvi — Bouwadvies in je broekzak</title></Head>
      <style>{CSS}</style>

      <Nav user={user} tab={tab} setTab={setTab} projecten={projecten} onNieuwProject={() => setNieuwProjModal(true)} onLogout={logout}/>

      <main>
        {tab === 'home' && <Home user={user} setTab={setTab} projecten={projecten} onNieuwProject={() => setNieuwProjModal(true)}/>}
        {tab === 'projecten' && <ProjectenModule user={user} projecten={projecten} setProjecten={setProjecten} setTab={setTab} onNieuwProject={() => setNieuwProjModal(true)}/>}
        {tab === 'bibliotheek' && <Bibliotheek user={user} setTab={setTab}/>}
        {tab === 'vakmannen' && <Vakmannen/>}
        {tab === 'account' && <Account user={user} setTab={setTab} onLogout={logout}/>}
        {tab === 'upgrade' && <Upgrade user={user} onUpgrade={upgrade}/>}
      </main>

      <footer style={{ background:C.navy, borderTop:`1px solid rgba(255,255,255,0.1)`, padding:'18px 24px', textAlign:'center', marginTop:40 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:24, height:24, background:C.blue, borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:C.red, fontWeight:800, fontSize:13, fontFamily:'Georgia, serif' }}>B</span>
            </div>
            <span style={{ fontWeight:600, fontSize:13.5, color:'rgba(255,255,255,0.8)' }}>Bouwvi</span>
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', margin:0 }}>Demo versie · Bouwvi geeft algemeen advies · Raadpleeg altijd een professional voor constructie, elektra en loodgieterwerk</p>
        </div>
      </footer>

      {nieuwProjModal && (
        <NieuwProjectModal onClose={() => setNieuwProjModal(false)} onSave={saveNieuwProject} user={user}/>
      )}
    </div>
  )
}
