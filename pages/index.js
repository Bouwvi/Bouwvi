import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── KLEUREN ──────────────────────────────────────────────────────────────────
const C = {
  navy:'#0F2D6B', blue:'#1A4599', blueM:'#2558C0',
  blueSoft:'#E8EFFE', blueL:'#D0DCFA',
  red:'#E8304A', redD:'#C01F35', redSoft:'#FDEAED',
  white:'#FFFFFF', off:'#F5F7FF', sand:'#EEF1FA',
  ink:'#0A0F1E', slate:'#3A4A6B', mist:'#7A8FB5', border:'#D8E0F5',
  ok:'#1E8449', okSoft:'#E8F5E9',
  gold:'#F59E0B', goldSoft:'#FEF3C7',
  purple:'#7C3AED', purpleSoft:'#EDE9FE',
  orange:'#EA580C',
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const USERS = [
  { id:'free_001', naam:'Gratis Gebruiker', email:'testfree@bouwvi.nl', password:'Test123!', plan:'gratis', avatar:'G', lid_sinds:'januari 2025' },
  { id:'prem_001', naam:'Premium Gebruiker', email:'testpremium@bouwvi.nl', password:'Test123!', plan:'premium', avatar:'P', lid_sinds:'februari 2025', sub:{ verlengt:'1 juni 2025', prijs:'19,99', methode:'iDEAL' } },
  { id:'plus_001', naam:'Plus Gebruiker', email:'testplus@bouwvi.nl', password:'Test123!', plan:'plus', avatar:'+', lid_sinds:'januari 2025', sub:{ verlengt:'1 juni 2025', prijs:'29,99', methode:'iDEAL' } },
]
const PROJECTEN = [
  { id:'p1', uid:'prem_001', naam:'Badkamer verdieping', type:'badkamer', icon:'🚿', kleur:'#1F618D', voortgang:35, datum:'12 mrt 2025', bouwjaar:'1987', woningtype:'Tussenwoning', vloertype:'Houten vloer', afm:'2.4 × 3.2m = 7.7m²', budget:'€8.000 – €12.000', deadline:'Voor de zomer', zelfdoen:'Deels zelf doen', wens:'Inloopdouche 90×120cm, zweeftoilet, dubbele wastafel met meubel. Zwarte kranen. Grote wandtegels 60×120cm. Vloerverwarming.', extra:'Mogelijk muur weghalen naar aangrenzende kast (1.5m²). Moet nog checken of dragend.' },
  { id:'p2', uid:'plus_001', naam:'Keuken renovatie', type:'keuken', icon:'🍳', kleur:'#922B21', voortgang:60, datum:'5 mrt 2025', bouwjaar:'2003', woningtype:'Hoekwoning', vloertype:'Betonnen vloer', afm:'4.5 × 3.0m = 13.5m²', budget:'€15.000 – €22.000', deadline:'Oktober 2025', zelfdoen:'Volledig uitbesteden', wens:'Nieuwe eilandkeuken, inductie, quooker, composiet werkblad, gietvloer doortrekken vanuit woonkamer.', extra:'Gaslijn moet verlegd worden. Huidige raam vervangen door schuifpui.' },
  { id:'p3', uid:'plus_001', naam:'Dakkapel slaapkamer', type:'dakkapel', icon:'🪟', kleur:'#1B4F72', voortgang:15, datum:'20 mrt 2025', bouwjaar:'2003', woningtype:'Hoekwoning', vloertype:'Houten vloer', afm:'3.0 × 1.2m', budget:'€8.000 – €14.000', deadline:'Einde 2025', zelfdoen:'Alles uitbesteden', wens:'Dakkapel achterzijde voor meer ruimte slaapkamer, twee openslaande deuren.', extra:'Omgevingsvergunning aanvragen.' },
]
const FACTUREN = [
  { id:'f1', uid:'prem_001', datum:'1 apr 2025', bedrag:'19,99', nr:'BV-2025-041' },
  { id:'f2', uid:'prem_001', datum:'1 mrt 2025', bedrag:'19,99', nr:'BV-2025-031' },
  { id:'f3', uid:'prem_001', datum:'1 feb 2025', bedrag:'19,99', nr:'BV-2025-021' },
  { id:'f4', uid:'plus_001', datum:'1 apr 2025', bedrag:'29,99', nr:'BV-2025-042' },
  { id:'f5', uid:'plus_001', datum:'1 mrt 2025', bedrag:'29,99', nr:'BV-2025-032' },
]
const PARTNERS = [
  { icon:'🔧', naam:'Loodgieters van Dijk', type:'Loodgieter', afstand:'1.2 km', rating:4.8, reviews:127, prijs:'€€', sponsored:true, tel:'010-1234567' },
  { icon:'⬜', naam:'Tegelwerk Centrum', type:'Tegelzetter', afstand:'2.4 km', rating:4.9, reviews:89, prijs:'€€', tel:'010-2345678' },
  { icon:'⚡', naam:'Elektra Service Pro', type:'Erkend elektricien', afstand:'0.8 km', rating:4.7, reviews:203, prijs:'€', tel:'010-3456789' },
  { icon:'🏗️', naam:'Bouwadvies & Constructie', type:'Constructeur', afstand:'3.1 km', rating:4.6, reviews:54, prijs:'€€€', tel:'010-4567890' },
  { icon:'📦', naam:'Container Verhuur West', type:'Container verhuur', afstand:'4.2 km', rating:4.5, reviews:312, prijs:'€', tel:'010-5678901' },
  { icon:'🟠', naam:'Hornbach Rotterdam', type:'Bouwmarkt', afstand:'5.8 km', rating:4.3, reviews:1847, prijs:'€', sponsored:true, tel:'010-6789012' },
  { icon:'🔴', naam:'Bauhaus Rotterdam', type:'Bouwmarkt', afstand:'7.2 km', rating:4.4, reviews:923, prijs:'€', tel:'010-7890123' },
  { icon:'🟡', naam:'Gamma Rotterdam-Noord', type:'Bouwmarkt', afstand:'3.9 km', rating:4.2, reviews:651, prijs:'€', tel:'010-8901234' },
]

function getUser(email) { return USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null }
function getUserById(id) { return USERS.find(u => u.id === id) || null }
function getProjs(uid) { return PROJECTEN.filter(p => p.uid === uid) }
function getFacts(uid) { return FACTUREN.filter(f => f.uid === uid) }

// ─── AI ────────────────────────────────────────────────────────────────────────
async function ai(prompt, systemCtx) {
  try {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: systemCtx }),
    })
    const d = await r.json()
    if (d.error) return `⚠️ ${d.error}\n\nTip: Voeg een ANTHROPIC_API_KEY toe in Vercel → Settings → Environment Variables voor live AI advies.`
    return d.text || 'Er ging iets mis.'
  } catch {
    return '⚠️ Verbindingsfout. Controleer je internetverbinding en Vercel environment variables.'
  }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
  @keyframes pop{0%{transform:scale(.94);opacity:0}100%{transform:scale(1);opacity:1}}
  *{box-sizing:border-box}
  input,textarea,button,select{font-family:inherit}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:${C.blueL};border-radius:10px}
`

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Logo({ size=36, dark=false }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:size*.28 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill={C.navy}/>
        <text x="50" y="82" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="88" fill={C.red} textAnchor="middle">B</text>
      </svg>
      <span style={{ fontWeight:800, fontSize:size*.58, color:dark?C.white:C.navy, letterSpacing:'-.5px', lineHeight:1 }}>bouwvi</span>
    </div>
  )
}

function Card({ children, style }) {
  return <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:'0 2px 12px rgba(15,45,107,.06)', ...style }}>{children}</div>
}

function Badge({ label, col='blue' }) {
  const m = {
    blue:{ bg:C.blueSoft, c:C.blue, b:C.blueL },
    red:{ bg:C.redSoft, c:C.red, b:'#F4A0AE' },
    ok:{ bg:C.okSoft, c:C.ok, b:'#A5D6A7' },
    gold:{ bg:C.goldSoft, c:'#92400E', b:'#FCD34D' },
    gray:{ bg:C.sand, c:C.mist, b:C.border },
    premium:{ bg:C.red, c:C.white, b:C.red },
    purple:{ bg:C.purpleSoft, c:C.purple, b:'#C4B5FD' },
    sponsored:{ bg:'#FEF9C3', c:'#854D0E', b:'#FDE047' },
  }
  const s = m[col] || m.blue
  return <span style={{ background:s.bg, color:s.c, border:`1px solid ${s.b}`, fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:20, letterSpacing:.7, whiteSpace:'nowrap' }}>{label}</span>
}

function Btn({ label, onClick, col, full, disabled, style }) {
  const bg = col==='red'?C.red : col==='ok'?C.ok : col==='gold'?C.gold : col==='ghost'?C.sand : col==='navy'?C.navy : col==='purple'?C.purple : C.blue
  const fg = col==='gold'?'#78350F' : C.white
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{ border:'none', borderRadius:11, padding:'10px 18px', fontWeight:700, fontSize:14, cursor:disabled?'not-allowed':'pointer', background:bg, color:fg, width:full?'100%':undefined, display:'inline-flex', alignItems:'center', gap:7, justifyContent:'center', opacity:disabled?.5:1, transition:'opacity .15s', ...style }}
      onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.opacity='.82' }}
      onMouseLeave={e=>{ e.currentTarget.style.opacity='1' }}>
      {label}
    </button>
  )
}

function Bar({ val, color=C.blue }) {
  return <div style={{ background:C.sand, borderRadius:8, height:6, overflow:'hidden' }}><div style={{ width:`${val}%`, height:'100%', background:color, borderRadius:8, transition:'width .4s' }}/></div>
}

function Spin({ size=18 }) {
  return <span style={{ width:size, height:size, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite', flexShrink:0 }}/>
}

function Txt({ t, ac=C.blue }) {
  if (!t) return null
  return (
    <div style={{ fontSize:14.5, lineHeight:1.8, color:C.ink }}>
      {t.split('\n').map((line,i) => {
        if (!line.trim()) return <div key={i} style={{ height:6 }}/>
        const bull = /^[-•]\s/.test(line)
        const raw = line.replace(/^[-•]\s/, '')
        const parts = raw.split(/\*\*(.*?)\*\*/g)
        const ren = parts.map((p,j) => j%2===1 ? <strong key={j}>{p}</strong> : p)
        if (bull) return <div key={i} style={{ display:'flex', gap:8, marginBottom:5, alignItems:'flex-start' }}><div style={{ width:6, height:6, borderRadius:'50%', background:ac, marginTop:10, flexShrink:0 }}/><span>{ren}</span></div>
        return <p key={i} style={{ margin:'0 0 5px' }}>{ren}</p>
      })}
    </div>
  )
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:4, background:C.sand, padding:4, borderRadius:12, overflowX:'auto' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ flex:1, border:'none', borderRadius:9, padding:'9px 6px', fontSize:12, fontWeight:700, cursor:'pointer', background:active===t.id?C.white:'transparent', color:active===t.id?C.navy:C.mist, boxShadow:active===t.id?'0 1px 4px rgba(15,45,107,.1)':'none', transition:'all .18s', whiteSpace:'nowrap' }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── BIBLIOTHEEK DATA ─────────────────────────────────────────────────────────
const CATS = [
  { id:'constructie', icon:'🏗️', label:'Constructie & Ruwbouw', k:'#1A3A6B', omschrijving:'Alles over de dragende structuur van je woning', subs:['Fundering','Draagmuren','Binnenmuren','Vloerconstructies','Balklagen','Betonwerk','Staalconstructies'], vragen:['Hoe weet ik of mijn muur dragend is?','Wat kost funderingsherstel?','Wanneer heb ik een constructeur nodig?','Wat zijn de gevaren bij het weghalen van een muur?'], populair:['Draagmuren','Fundering','Binnenmuren'] },
  { id:'dak', icon:'🏠', label:'Dak & Gevel', k:'#1B5E4B', omschrijving:'Hellend dak, platdak, gevels en dakgoten', subs:['Hellend dak','Plat dak','Dakbedekking','Dakisolatie','Dakkapel','Gevels','Gevelbekleding','Dakgoten / HWA'], vragen:['Wat kost een nieuw dak?','Hoe herken ik een lekkend dak?','Heb ik een vergunning nodig voor een dakkapel?','Wanneer moet ik mijn dakgoten vervangen?'], populair:['Dakkapel','Plat dak','Dakbedekking'] },
  { id:'kozijnen', icon:'🪟', label:'Kozijnen, Ramen & Deuren', k:'#4A235A', omschrijving:'Buitenkozijnen, ramen, deuren en hang- en sluitwerk', subs:['Buitenkozijnen','Ramen','Voordeuren','Schuifpuien','Binnendeuren','Hang- en sluitwerk','Glas'], vragen:['Hout, kunststof of aluminium kozijnen?','Wat kost een nieuwe voordeur?','Wanneer dubbel glas vervangen?','Hoe vervang ik een binnendeur?'], populair:['Buitenkozijnen','Ramen','Schuifpuien'] },
  { id:'installaties', icon:'⚡', label:'Installaties', k:'#7D6608', omschrijving:'Elektra, loodgieter, verwarming, ventilatie en zonnepanelen', subs:['Elektra','Meterkast','Verlichting','Waterleiding','Afvoer','Verwarming','Vloerverwarming','Warmtepomp','Ventilatie','Airco','Zonnepanelen'], vragen:['Wat mag ik zelf doen aan elektra?','Hoe werkt een warmtepomp?','Wat kost vloerverwarming aanleggen?','Zijn zonnepanelen rendabel in Nederland?'], populair:['Elektra','Vloerverwarming','Zonnepanelen'] },
  { id:'binnenafbouw', icon:'🖌️', label:'Binnenafbouw', k:'#4A4A5A', omschrijving:'Stucwerk, plafonds, voorzetwanden en timmerwerk', subs:['Stucwerk','Plafonds','Voorzetwanden','Timmerwerk','Traprenovatie'], vragen:['Kan ik zelf stucken?','Wat kost een nieuwe trap?','Hoe maak ik een voorzetwand?','Hoe repareer ik een gat in het plafond?'], populair:['Stucwerk','Traprenovatie','Plafonds'] },
  { id:'vloeren', icon:'🪵', label:'Vloeren & Wandafwerking', k:'#7A5210', omschrijving:'Tegelwerk, PVC, laminaat, parket en gietvloeren', subs:['Tegelwerk','PVC','Laminaat','Parket','Gietvloer','Egaliseren','Wandbekleding'], vragen:['Welke vloer past bij mij?','Hoe leg ik laminaat zelf?','Wat kost een gietvloer?','Hoe egaliser ik een vloer?'], populair:['Laminaat','Tegelwerk','PVC'] },
  { id:'ruimtes', icon:'🚿', label:'Ruimtes', k:'#1F618D', omschrijving:'Badkamer, toilet, keuken, slaapkamer en meer', subs:['Badkamer','Toilet','Keuken','Slaapkamer','Woonkamer','Zolder','Kelder','Garage'], vragen:['Wat kost een badkamer verbouwen?','Hoe pak ik een keukenrenovatie aan?','In welke volgorde verbouw ik een badkamer?','Hoe maak ik mijn zolder bewoonbaar?'], populair:['Badkamer','Keuken','Zolder'] },
  { id:'isolatie', icon:'🌡️', label:'Isolatie & Duurzaamheid', k:C.ok, omschrijving:'Spouwmuur, dak, vloer, glas en energiebesparing', subs:['Spouwmuurisolatie','Dakisolatie','Vloerisolatie','Geluidsisolatie','HR++ glas','Energiebesparing'], vragen:['Welke isolatie levert het meest op?','Hoe vraag ik ISDE subsidie aan?','Wat kost spouwmuurisolatie?','Wanneer is mijn woning energieneutraal?'], populair:['Spouwmuurisolatie','HR++ glas','Energiebesparing'] },
  { id:'buiten', icon:'🌿', label:'Buitenruimte', k:'#2E5D1B', omschrijving:'Veranda, schuur, terras, oprit en bestrating', subs:['Veranda','Schuur','Tuinhuis','Terras','Oprit','Schutting','Bestrating'], vragen:['Heb ik een vergunning nodig voor een schuur?','Wat kost een houten veranda?','Hoe leg ik een terras aan?','Welke bestrating is het onderhoudsvriendelijkst?'], populair:['Veranda','Terras','Schuur'] },
  { id:'vergunningen', icon:'📋', label:'Vergunningen & Regelgeving', k:'#5C3A1A', omschrijving:'Omgevingsvergunning, burenrecht en VvE regels', subs:['Omgevingsvergunning','Constructieberekening','Burenrecht','VvE regels','Energielabel'], vragen:['Wanneer heb ik een vergunning nodig?','Hoe vraag ik een omgevingsvergunning aan?','Wat zijn mijn rechten bij burengeschil?','Hoe verbeter ik mijn energielabel?'], populair:['Omgevingsvergunning','Burenrecht','VvE regels'] },
  { id:'kosten', icon:'💰', label:'Kosten & Planning', k:'#1A5276', omschrijving:'Budgetteren, offertes, planning en fasering', subs:['Kostenindicaties','Offertes vergelijken','Verbouwbudget','Planning maken','Fases verbouwing','Zelf doen of uitbesteden'], vragen:['Hoe maak ik een realistisch verbouwbudget?','Waar let ik op bij een offerte?','In welke volgorde pak ik mijn verbouwing aan?','Wanneer doe ik het zelf en wanneer niet?'], populair:['Kostenindicaties','Verbouwbudget','Offertes vergelijken'] },
  { id:'problemen', icon:'🔍', label:'Problemen & Schade', k:C.red, omschrijving:'Lekkage, scheuren, vocht, schimmel en verzakkingen', subs:['Lekkage','Scheuren','Vocht','Schimmel','Verzakkingen','Tocht','Geluidsoverlast'], vragen:['Wat doe ik bij een lekkage?','Wanneer zijn scheuren in muren gevaarlijk?','Hoe los ik vochtproblemen op?','Hoe herken ik schimmel achter de muur?'], populair:['Lekkage','Vocht','Scheuren'] },
]

const POPULAIRE_ZOEKOPDRACHTEN = ['draagmuur weghalen','badkamer verbouwen','dakkapel vergunning','vloerverwarming aanleggen','spouwmuurisolatie','keuken renoveren','laminaat leggen','zonnepanelen']

// ─── BIBLIOTHEEK MODULE ───────────────────────────────────────────────────────
function Bibliotheek({ user, goUpgrade }) {
  const [view, setView] = useState('home') // home | cat | sub
  const [catId, setCatId] = useState(null)
  const [subNaam, setSubNaam] = useState(null)
  const [antw, setAntw] = useState('')
  const [loadA, setLoadA] = useState(false)
  const [fupIn, setFupIn] = useState('')
  const [fups, setFups] = useState([])
  const [loadF, setLoadF] = useState(false)
  const [zoek, setZoek] = useState('')
  const topRef = useRef(null)

  const cat = CATS.find(c => c.id === catId)

  useEffect(() => { topRef.current?.scrollIntoView({ behavior:'smooth' }) }, [view])

  const geladen = useRef(false)
  useEffect(() => {
    if (view !== 'sub' || !subNaam || !cat) return
    geladen.current = false
  }, [subNaam])

  useEffect(() => {
    if (view !== 'sub' || !subNaam || !cat || geladen.current) return
    geladen.current = true
    setLoadA(true); setAntw(''); setFups([])
    ai(`Geef uitgebreid en praktisch advies over "${subNaam}" in de categorie "${cat.label}" voor particulieren die gaan verbouwen. Vertel: wat is het, wat zijn de kosten, wat kun je zelf doen, wanneer professional nodig, veelgemaakte fouten en tips. Wees concreet met Nederlandse prijzen.`,
       `Je bent Bouwvi kennisadviseur. Geef altijd veilig, eerlijk en praktisch advies.`
    ).then(t => { setAntw(t); setLoadA(false) })
  }, [view, subNaam, cat])

  async function sendFup() {
    if (!fupIn.trim() || loadF) return
    const v = fupIn.trim(); setFupIn(''); setLoadF(true)
    const t = await ai(`Vervolgvraag over "${subNaam}" (categorie: ${cat?.label}): ${v}`)
    setFups(p => [...p, { v, a:t }]); setLoadF(false)
  }

  const gefilterd = zoek ? CATS.filter(c => c.label.toLowerCase().includes(zoek.toLowerCase()) || c.subs.some(s => s.toLowerCase().includes(zoek.toLowerCase()))) : CATS

  if (view === 'home') return (
    <div ref={topRef} style={{ maxWidth:780, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:'32px 24px', marginBottom:28, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <Badge label="GRATIS · ALTIJD BESCHIKBAAR" col="ok"/>
        <h2 style={{ fontWeight:800, fontSize:'clamp(20px,4vw,28px)', color:C.white, margin:'12px 0 8px' }}>Kennisbibliotheek</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', margin:'0 0 20px' }}>Alles over verbouwen, renoveren en klussen</p>
        <div style={{ display:'flex', maxWidth:500, margin:'0 auto', background:C.white, borderRadius:12, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>
          <span style={{ padding:'0 14px', display:'flex', alignItems:'center', fontSize:18 }}>🔍</span>
          <input value={zoek} onChange={e => setZoek(e.target.value)} placeholder="Waar heb je hulp bij? bijv. dakkapel, laminaat..."
            style={{ flex:1, border:'none', outline:'none', fontSize:14, padding:'14px 0', color:C.ink }}/>
        </div>
        <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
          {POPULAIRE_ZOEKOPDRACHTEN.map(q => (
            <button key={q} onClick={() => setZoek(q)} style={{ background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.8)', borderRadius:20, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Categorieën grid */}
      <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>Alle categorieën</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))', gap:10 }}>
        {gefilterd.map(ct => (
          <button key={ct.id} onClick={() => { setCatId(ct.id); setView('cat') }}
            style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'16px 12px', textAlign:'left', cursor:'pointer', transition:'all .18s', boxShadow:'0 1px 5px rgba(15,45,107,.05)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=ct.k; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 16px ${ct.k}22` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 5px rgba(15,45,107,.05)' }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{ct.icon}</div>
            <div style={{ fontSize:12.5, fontWeight:700, color:C.ink, lineHeight:1.3, marginBottom:5 }}>{ct.label}</div>
            <div style={{ height:3, width:20, background:ct.k, borderRadius:2 }}/>
            <div style={{ marginTop:6, fontSize:10, color:C.mist }}>{ct.subs.length} onderwerpen</div>
          </button>
        ))}
      </div>

      {/* Premium upsell */}
      {user.plan === 'gratis' && (
        <div style={{ marginTop:28, background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:18, padding:'22px 24px', border:`1.5px solid ${C.red}` }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <Badge label="⭐ BOUWVI PREMIUM" col="premium"/>
              <h3 style={{ fontWeight:800, fontSize:18, color:C.white, margin:'8px 0 6px' }}>Advies op jouw eigen woning</h3>
              <p style={{ fontSize:13.5, color:'rgba(255,255,255,.7)', margin:'0 0 14px', lineHeight:1.6 }}>Persoonlijk projectplan, AI bouwcoach, tekenmodule en specialisten bij jou in de buurt.</p>
              <Btn label="Mijn project starten →" onClick={goUpgrade} col="red" style={{ fontSize:14 }}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (view === 'cat' && cat) return (
    <div ref={topRef} style={{ maxWidth:700, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:13 }}>
        <button onClick={() => setView('home')} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontFamily:'inherit' }}>Bibliotheek</button>
        <span style={{ color:C.border }}>›</span>
        <span style={{ color:C.navy, fontWeight:600 }}>{cat.label}</span>
      </div>
      <div style={{ background:cat.k, borderRadius:18, padding:'22px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
        <div style={{ fontSize:40, marginBottom:8 }}>{cat.icon}</div>
        <h2 style={{ fontWeight:800, fontSize:20, color:C.white, margin:'0 0 6px' }}>{cat.label}</h2>
        <p style={{ fontSize:13.5, color:'rgba(255,255,255,.7)', margin:0 }}>{cat.omschrijving}</p>
      </div>

      {/* Populair */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 10px' }}>🔥 Populair</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {cat.populair.map(s => (
            <button key={s} onClick={() => { setSubNaam(s); setView('sub') }}
              style={{ background:cat.k+'15', border:`1.5px solid ${cat.k}44`, borderRadius:20, padding:'8px 16px', fontSize:13, color:cat.k, fontWeight:700, cursor:'pointer', transition:'all .15s', fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background=cat.k; e.currentTarget.style.color=C.white }}
              onMouseLeave={e => { e.currentTarget.style.background=cat.k+'15'; e.currentTarget.style.color=cat.k }}>
              🔥 {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alle subs */}
      <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 10px' }}>Alle onderwerpen</p>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {cat.subs.map(s => (
          <button key={s} onClick={() => { setSubNaam(s); setView('sub') }}
            style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px 17px', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, transition:'all .18s', fontFamily:'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=cat.k; e.currentTarget.style.transform='translateX(4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateX(0)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:cat.k, flexShrink:0 }}/>
              <span style={{ fontSize:14, fontWeight:600, color:C.ink }}>{s}</span>
            </div>
            <span style={{ color:cat.k, fontSize:16 }}>→</span>
          </button>
        ))}
      </div>

      {/* Veelgestelde vragen */}
      <div style={{ marginTop:22 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 10px' }}>💬 Veelgestelde vragen</p>
        {cat.vragen.map((v,i) => (
          <button key={i} onClick={() => { setSubNaam(cat.subs[0]); setView('sub') }}
            style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px', width:'100%', textAlign:'left', cursor:'pointer', fontSize:13.5, color:C.slate, display:'flex', alignItems:'center', gap:10, marginBottom:7, transition:'all .15s', fontFamily:'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=cat.k; e.currentTarget.style.color=C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.slate }}>
            <span style={{ color:cat.k }}>?</span>{v}
          </button>
        ))}
      </div>
    </div>
  )

  // Sub artikel pagina
  return (
    <div ref={topRef} style={{ maxWidth:720, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, fontSize:13 }}>
        <button onClick={() => setView('home')} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontFamily:'inherit' }}>Bibliotheek</button>
        <span style={{ color:C.border }}>›</span>
        <button onClick={() => setView('cat')} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontFamily:'inherit' }}>{cat?.label}</button>
        <span style={{ color:C.border }}>›</span>
        <span style={{ color:C.navy, fontWeight:600 }}>{subNaam}</span>
      </div>

      <div style={{ background:cat?.k, borderRadius:14, padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:26 }}>{cat?.icon}</span>
        <div>
          <div style={{ color:'rgba(255,255,255,.6)', fontSize:11 }}>{cat?.label}</div>
          <div style={{ color:C.white, fontSize:16, fontWeight:700 }}>{subNaam}</div>
        </div>
        <div style={{ marginLeft:'auto' }}><Badge label="GRATIS" col="ok"/></div>
      </div>

      <Card style={{ marginBottom:16, minHeight:100 }}>
        {loadA ? <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}><Spin/> Bouwvi zoekt het op...</div>
          : <Txt t={antw} ac={cat?.k}/>}
      </Card>

      {/* Veelgestelde vragen */}
      {!loadA && antw && (
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 10px' }}>Veel gestelde vragen</p>
          {cat?.vragen.map((v,i) => (
            <button key={i} onClick={() => setFupIn(v)}
              style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:9, padding:'10px 13px', width:'100%', textAlign:'left', cursor:'pointer', fontSize:13.5, color:C.navy, fontWeight:600, display:'flex', justifyContent:'space-between', gap:10, marginBottom:7, transition:'all .15s', fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=cat.k; e.currentTarget.style.background=C.off }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.white }}>
              <span>💬 {v}</span>
              <span style={{ color:cat?.k, flexShrink:0 }}>→</span>
            </button>
          ))}
        </div>
      )}

      {/* Fup chat */}
      {fups.map((f,i) => (
        <div key={i} style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
            <div style={{ background:cat?.k, color:C.white, borderRadius:'12px 12px 4px 12px', padding:'10px 14px', fontSize:13.5, maxWidth:'85%' }}>{f.v}</div>
          </div>
          <Card style={{ borderTopLeftRadius:4 }}><Txt t={f.a} ac={cat?.k}/></Card>
        </div>
      ))}

      {!loadA && antw && (
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, color:C.mist, textAlign:'center', margin:'0 0 10px' }}>💬 Stel je eigen vraag</p>
          <div style={{ display:'flex', gap:8 }}>
            <textarea value={fupIn} onChange={e => setFupIn(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendFup() }}}
              placeholder={`Vraag over ${subNaam}...`} rows={1}
              style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 13px', fontSize:14, resize:'none', outline:'none', minHeight:44, maxHeight:100 }}
              onFocus={e => e.target.style.borderColor=cat?.k}
              onBlur={e => e.target.style.borderColor=C.border}/>
            <button onClick={sendFup} disabled={loadF||!fupIn.trim()}
              style={{ width:44, height:44, background:loadF||!fupIn.trim()?'#CCC':cat?.k, border:'none', borderRadius:10, color:C.white, fontSize:18, cursor:'pointer', flexShrink:0 }}>
              {loadF?'…':'➤'}
            </button>
          </div>
        </div>
      )}

      {/* Gerelateerde onderwerpen */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 10px' }}>Gerelateerde onderwerpen</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
          {cat?.subs.filter(s => s!==subNaam).slice(0,5).map(s => (
            <button key={s} onClick={() => { setSubNaam(s) }}
              style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:'7px 14px', fontSize:13, color:C.navy, fontWeight:600, cursor:'pointer', transition:'all .15s', fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=cat?.k }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {user.plan === 'gratis' && (
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:16, padding:'18px 20px', border:`1.5px solid ${C.red}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:C.white, marginBottom:3 }}>🚀 Bezig met dit project?</div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.65)' }}>Persoonlijk AI advies op basis van jouw situatie</div>
          </div>
          <Btn label="Mijn project starten →" onClick={goUpgrade} col="red" style={{ flexShrink:0, fontSize:13 }}/>
        </div>
      )}
    </div>
  )
}

// ─── PREMIUM PROJECT MODULE ───────────────────────────────────────────────────
function ProjectenModule({ user, goUpgrade }) {
  const [ap, setAp] = useState(null)
  const [tab, setTab] = useState('analyse')
  const [analyse, setAnalyse] = useState('')
  const [kosten, setKosten] = useState('')
  const [planning, setPlanning] = useState('')
  const [materialen, setMateriaal] = useState('')
  const [loadA, setLoadA] = useState(false)
  const [loadK, setLoadK] = useState(false)
  const [loadP, setLoadP] = useState(false)
  const [loadM, setLoadM] = useState(false)
  const [chatIn, setChatIn] = useState('')
  const [msgs, setMsgs] = useState([])
  const [loadC, setLoadC] = useState(false)
  const [nieuwStap, setNieuwStap] = useState(1)
  const [toonNieuw, setToonNieuw] = useState(false)
  const projs = getProjs(user.id)
  const chatBottom = useRef(null)

  useEffect(() => { chatBottom.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  if (user.plan === 'gratis') return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'60px 20px', textAlign:'center' }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C.navy, margin:'0 0 10px' }}>Premium functie</h2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.65, margin:'0 0 24px' }}>Maak je eigen verbouwproject aan en krijg een persoonlijke AI bouwcoach, kostenoverzicht, planning en materiaallijst.</p>
      <Btn label="⭐ Upgrade naar Premium — €19,99/mnd" onClick={goUpgrade} col="red" style={{ fontSize:15, padding:'13px 28px' }}/>
    </div>
  )

  const sys = ap ? `Je bent Bouwvi Premium Coach — ervaren Nederlandse aannemer, projectleider en bouwadviseur. PROJECTCONTEXT: Project: ${ap.naam} (${ap.type}). Bouwjaar: ${ap.bouwjaar}. Woningtype: ${ap.woningtype}. Vloertype: ${ap.vloertype}. Afmetingen: ${ap.afm}. Budget: ${ap.budget}. Voorkeur: ${ap.zelfdoen}. Wensen: ${ap.wens}. Extra: ${ap.extra}. Geef altijd persoonlijk advies op basis van deze context.` : ''

  async function openProject(p) {
    setAp(p); setTab('analyse'); setAnalyse(''); setKosten(''); setPlanning(''); setMateriaal('')
    setMsgs([{ r:'bot', t:`Hoi! Ik ben je Bouwvi coach voor **${p.naam}**. Ik ken alle details van jouw project — bouwjaar ${p.bouwjaar}, ${p.woningtype}, budget ${p.budget}. Stel me alles wat je wilt weten! 💪` }])
    setLoadA(true)
    const s = `Je bent Bouwvi Premium Coach. PROJECTCONTEXT: ${p.naam} (${p.type}). Bouwjaar: ${p.bouwjaar}. Type: ${p.woningtype}. Vloer: ${p.vloertype}. Maten: ${p.afm}. Budget: ${p.budget}. Wens: ${p.wens}. Extra: ${p.extra}.`
    const t = await ai(`Genereer een complete bouwanalyse. Gebruik **vetgedrukte** kopjes:\n\n**Aandachtspunten & risico's** (asbest, draagmuur, vergunning, vocht)\n**Slimste aanpak**\n**Volgorde werkzaamheden** (genummerd)\n**Kostenindicatie** (budget €X-Y / gemiddeld €X-Y / premium €X-Y)\n**Tijdsduur**\n**Zelf doen vs professional**\n**Veelgemaakte fouten**`, s)
    setAnalyse(t); setLoadA(false)
  }

  async function loadTab(t) {
    setTab(t)
    const s = sys
    if (t === 'kosten' && !kosten) {
      setLoadK(true)
      const r = await ai('Geef gedetailleerd kostenoverzicht in 3 varianten (budget/gemiddeld/premium) met uitsplitsing materiaalkosten, arbeidskosten en bijkomende kosten. Geef ook bespaartips.', s)
      setKosten(r); setLoadK(false)
    }
    if (t === 'planning' && !planning) {
      setLoadP(true)
      const r = await ai('Maak een concrete weekplanning per fase. Geef voor elke fase: wat er gedaan wordt, wie het doet (zelf/professional), hoelang het duurt. Begin met voorbereiding en vergunningen.', s)
      setPlanning(r); setLoadP(false)
    }
    if (t === 'materialen' && !materialen) {
      setLoadM(true)
      const r = await ai('Maak volledige materiaallijst met hoeveelheden en prijsindicaties. Split op in: materialen (met m² of stuks en prijs), gereedschap (kopen vs huren bij Boels/Cramo), en inkoptips (Hornbach, Gamma, Praxis).', s)
      setMateriaal(r); setLoadM(false)
    }
  }

  async function sendChat() {
    if (!chatIn.trim() || loadC) return
    const v = chatIn.trim(); setChatIn(''); setLoadC(true)
    const newMsgs = [...msgs, { r:'user', t:v }]
    setMsgs(newMsgs)
    const t = await ai(v, sys)
    setMsgs(p => [...p, { r:'bot', t }]); setLoadC(false)
  }

  const SNELLE_VRAGEN = ['Kan ik de muur slopen?','Wat kost tegelwerk per m²?','Heb ik een vergunning nodig?','Welke materialen heb ik nodig?','Maak een planning voor mij','Wat zijn de risico\'s?']

  if (ap) return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'0 20px 60px', animation:'up .3s ease' }}>
      <button onClick={() => setAp(null)} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontSize:13, fontWeight:600, padding:'20px 0 16px', display:'block', fontFamily:'inherit' }}>← Mijn projecten</button>

      <div style={{ background:`linear-gradient(135deg,${ap.kleur},${ap.kleur}CC)`, borderRadius:18, padding:22, marginBottom:18, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <span style={{ fontSize:40 }}>{ap.icon}</span>
          <div style={{ flex:1 }}>
            <Badge label="PREMIUM PROJECT" col="premium"/>
            <h2 style={{ fontWeight:800, fontSize:20, color:C.white, margin:'6px 0 4px' }}>{ap.naam}</h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[ap.bouwjaar, ap.afm, ap.budget, ap.zelfdoen].filter(Boolean).map(v => (
                <span key={v} style={{ fontSize:12, color:'rgba(255,255,255,.65)' }}>{v}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:800, fontSize:24, color:C.white }}>{ap.voortgang}%</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.55)' }}>voortgang</div>
          </div>
        </div>
        <div style={{ marginTop:12 }}><Bar val={ap.voortgang} color="rgba(255,255,255,.55)"/></div>
      </div>

      <div style={{ marginBottom:18 }}>
        <Tabs active={tab} onChange={loadTab} tabs={[
          { id:'analyse', label:'📊 Analyse' },
          { id:'coach', label:'💬 Coach' },
          { id:'kosten', label:'💰 Kosten' },
          { id:'planning', label:'📅 Planning' },
          { id:'materialen', label:'🧱 Materialen' },
          { id:'wensen', label:'✨ Wensen' },
        ]}/>
      </div>

      <Card>
        {tab === 'analyse' && (
          loadA ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'28px 0', color:C.mist }}><Spin size={28}/><div>Bouwvi analyseert jouw project...</div></div>
            : <Txt t={analyse} ac={ap.kleur}/>
        )}

        {tab === 'coach' && (
          <div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, minHeight:280, maxHeight:420, overflowY:'auto', marginBottom:14 }}>
              {msgs.map((m,i) => (
                <div key={i} style={{ display:'flex', gap:8, flexDirection:m.r==='user'?'row-reverse':'row', animation:'up .2s ease' }}>
                  <div style={{ width:32, height:32, borderRadius:9, flexShrink:0, background:m.r==='user'?C.slate:ap.kleur, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                    {m.r==='user'?'👤':'🏗️'}
                  </div>
                  <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:14, fontSize:13.5, background:m.r==='user'?C.blue:C.off, color:m.r==='user'?C.white:C.ink, borderBottomLeftRadius:m.r==='bot'?4:14, borderBottomRightRadius:m.r==='user'?4:14 }}>
                    {m.r==='bot'?<Txt t={m.t} ac={ap.kleur}/>:m.t}
                  </div>
                </div>
              ))}
              {loadC && (
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:ap.kleur, display:'flex', alignItems:'center', justifyContent:'center' }}>🏗️</div>
                  <div style={{ background:C.off, borderRadius:'14px 14px 14px 4px', padding:'12px 14px', display:'flex', gap:4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.mist, animation:`blink 1.2s ease ${i*.2}s infinite` }}/>)}
                  </div>
                </div>
              )}
              <div ref={chatBottom}/>
            </div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.mist, letterSpacing:.8, textTransform:'uppercase', margin:'0 0 8px' }}>Snelle vragen</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {SNELLE_VRAGEN.map(q => (
                  <button key={q} onClick={() => setChatIn(q)} style={{ background:C.off, border:`1px solid ${C.border}`, borderRadius:20, padding:'5px 11px', fontSize:12, color:C.navy, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>{q}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <textarea value={chatIn} onChange={e => setChatIn(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendChat() }}}
                placeholder="Stel een vraag over jouw project..." rows={1}
                style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 12px', fontSize:13.5, resize:'none', outline:'none', minHeight:44, maxHeight:100 }}
                onFocus={e => e.target.style.borderColor=ap.kleur}
                onBlur={e => e.target.style.borderColor=C.border}/>
              <button onClick={sendChat} disabled={loadC||!chatIn.trim()}
                style={{ width:44, height:44, background:loadC||!chatIn.trim()?'#CCC':ap.kleur, border:'none', borderRadius:10, color:C.white, fontSize:18, cursor:'pointer', flexShrink:0 }}>
                {loadC?'…':'➤'}
              </button>
            </div>
          </div>
        )}

        {tab === 'kosten' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
              {[['Budget','Sober maar netjes',C.ok],['Gemiddeld','Goede kwaliteit',C.blue],['Premium','Topkwaliteit',C.gold]].map(([t,s,k]) => (
                <div key={t} style={{ background:C.off, border:`1.5px solid ${k}33`, borderRadius:12, padding:14, textAlign:'center' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.ink }}>{t}</div>
                  <div style={{ fontSize:11, color:C.mist, marginTop:3 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.blueSoft, borderRadius:10, padding:'9px 13px', marginBottom:14, fontSize:13, color:C.blue }}>
              💡 Jouw budget: <strong>{ap.budget}</strong>
            </div>
            {loadK ? <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}><Spin/> Kosten berekenen...</div>
              : <Txt t={kosten} ac={ap.kleur}/>}
          </div>
        )}

        {tab === 'planning' && (
          loadP ? <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}><Spin/> Planning opstellen...</div>
            : <Txt t={planning} ac={ap.kleur}/>
        )}

        {tab === 'materialen' && (
          loadM ? <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}><Spin/> Materiaallijst samenstellen...</div>
            : <Txt t={materialen} ac={ap.kleur}/>
        )}

        {tab === 'wensen' && (
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 12px' }}>Jouw projectdetails</p>
            {[['Project',ap.naam],['Type',ap.type],['Bouwjaar',ap.bouwjaar],['Woningtype',ap.woningtype],['Vloertype',ap.vloertype],['Afmetingen',ap.afm],['Budget',ap.budget],['Deadline',ap.deadline],['Voorkeur',ap.zelfdoen]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:13.5 }}>
                <span style={{ color:C.mist }}>{k}</span>
                <span style={{ fontWeight:600, color:C.ink, textAlign:'right', maxWidth:'60%' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:14, padding:12, background:C.off, borderRadius:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.mist, marginBottom:6 }}>Wensen</div>
              <div style={{ fontSize:13.5, color:C.ink, lineHeight:1.65 }}>{ap.wens}</div>
              {ap.extra && <div style={{ marginTop:10, fontSize:13, color:C.mist }}><strong>Extra:</strong> {ap.extra}</div>}
            </div>
          </div>
        )}
      </Card>
    </div>
  )

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:22, color:C.navy, margin:0 }}>Mijn projecten</h2>
          <p style={{ fontSize:13, color:C.mist, margin:'3px 0 0' }}>{projs.length} actief · max {user.plan==='plus'?3:1} voor jouw plan</p>
        </div>
      </div>

      {projs.length === 0 ? (
        <Card style={{ textAlign:'center', padding:'40px 24px' }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🏗️</div>
          <h3 style={{ fontWeight:800, fontSize:18, color:C.navy, margin:'0 0 8px' }}>Nog geen projecten</h3>
          <p style={{ fontSize:14, color:C.mist }}>Log in als testpremium@bouwvi.nl om demo projecten te zien.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {projs.map(p => (
            <button key={p.id} onClick={() => openProject(p)}
              style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'18px 20px', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:16, transition:'all .18s', fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=p.kleur; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${p.kleur}18` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ width:52, height:52, background:p.kleur, borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{p.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:15, color:C.ink, marginBottom:3 }}>{p.naam}</div>
                <div style={{ fontSize:12, color:C.mist, marginBottom:8 }}>{p.datum} · {p.afm} · {p.budget}</div>
                <Bar val={p.voortgang} color={p.kleur}/>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontWeight:800, fontSize:18, color:p.kleur }}>{p.voortgang}%</div>
                <div style={{ fontSize:11, color:C.mist }}>voortgang</div>
              </div>
              <span style={{ color:p.kleur, fontSize:20 }}>→</span>
            </button>
          ))}
        </div>
      )}

      {/* Plus upgrade als vol */}
      {user.plan === 'premium' && projs.length >= 1 && (
        <div style={{ marginTop:20, background:`linear-gradient(135deg,${C.navy},#1A3A8B)`, borderRadius:18, padding:'22px', border:`2px solid ${C.gold}` }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <Badge label="⭐ PREMIUM PLUS" col="gold"/>
              <h3 style={{ fontWeight:800, fontSize:17, color:C.white, margin:'8px 0 6px' }}>3 projecten tegelijk</h3>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.65)', margin:'0 0 14px' }}>Met Premium Plus verbouw je meerdere ruimtes tegelijk. Perfect voor een complete woningrenovatie.</p>
              <Btn label="Upgrade naar Premium Plus →" col="gold" style={{ fontSize:13 }}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PARTNERS MODULE ──────────────────────────────────────────────────────────
function PartnersModule({ user }) {
  const [stad, setStad] = useState('Rotterdam')
  const [project, setProject] = useState('Badkamer renovatie')
  const [fase, setFase] = useState('alle')
  const [aiTip, setAiTip] = useState('')
  const [loadAi, setLoadAi] = useState(false)
  const [offerteP, setOfferteP] = useState(null)
  const [offerteDone, setOfferteDone] = useState(false)

  const FASES = ['alle','ontwerp','sloop','constructie','installatie','afwerking','inkoop']
  const PROJECTEN = ['Badkamer renovatie','Keuken renovatie','Dakrenovatie','Uitbouw','Vloer leggen','Schilderwerk','Isolatie']

  async function getAdvies() {
    setLoadAi(true)
    const t = await ai(`Voor project "${project}" in ${stad}, fase "${fase}": welke specialisten zijn nu het meest nodig en waarom? Kort en praktisch, max 100 woorden. Gebruik **vet** voor specialist namen.`)
    setAiTip(t); setLoadAi(false)
  }

  const gefilterd = PARTNERS.filter(p => {
    if (fase === 'alle') return true
    if (fase === 'sloop') return ['Sloopbedrijf','Container verhuur'].includes(p.type)
    if (fase === 'installatie') return ['Erkend elektricien','Loodgieter'].includes(p.type)
    if (fase === 'afwerking') return ['Tegelzetter','Schilder'].includes(p.type)
    if (fase === 'inkoop') return ['Bouwmarkt'].includes(p.type)
    return true
  })

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:'24px', marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:20, color:C.white, margin:'0 0 16px' }}>🤝 Vakmannen & Partners</h2>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <div style={{ display:'flex', flex:1, minWidth:150, background:C.white, borderRadius:10, overflow:'hidden' }}>
            <span style={{ padding:'0 12px', display:'flex', alignItems:'center', fontSize:16 }}>📍</span>
            <input value={stad} onChange={e => setStad(e.target.value)} placeholder="Jouw stad"
              style={{ flex:1, border:'none', outline:'none', fontSize:14, padding:'11px 0', color:C.ink }}/>
          </div>
          <select value={project} onChange={e => setProject(e.target.value)}
            style={{ border:'none', borderRadius:10, padding:'0 14px', fontSize:13.5, color:C.ink, background:C.white, outline:'none', minWidth:160, cursor:'pointer' }}>
            {PROJECTEN.map(p => <option key={p}>{p}</option>)}
          </select>
          <Btn label="AI advies" onClick={getAdvies} col="red" style={{ fontSize:13 }}/>
        </div>
      </div>

      {/* AI advies */}
      {(loadAi || aiTip) && (
        <div style={{ background:`linear-gradient(135deg,${C.blueSoft},#E0E8FF)`, border:`1.5px solid ${C.blueL}`, borderRadius:13, padding:'14px 16px', marginBottom:18, display:'flex', gap:10 }}>
          <span style={{ fontSize:18, flexShrink:0 }}>🧠</span>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.blue, marginBottom:5, letterSpacing:.7 }}>BOUWVI AI ADVIES</div>
            {loadAi ? <div style={{ display:'flex', alignItems:'center', gap:8, color:C.mist, fontSize:13 }}><Spin size={15}/> Beste matches bepalen...</div>
              : <Txt t={aiTip} ac={C.blue}/>}
          </div>
        </div>
      )}

      {/* Fase filter */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', marginBottom:16, paddingBottom:4 }}>
        {FASES.map(f => (
          <button key={f} onClick={() => setFase(f)}
            style={{ flexShrink:0, border:`1.5px solid ${fase===f?C.blue:C.border}`, borderRadius:20, padding:'7px 14px', fontSize:12.5, fontWeight:700, cursor:'pointer', background:fase===f?C.blue:C.white, color:fase===f?C.white:C.slate, fontFamily:'inherit', transition:'all .18s', textTransform:'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Partners */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {/* Sponsored eerst */}
        {gefilterd.filter(p => p.sponsored).length > 0 && (
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 8px' }}>⭐ Aanbevolen partners</p>
            {gefilterd.filter(p => p.sponsored).map((p,i) => (
              <PartnerKaart key={i} partner={p} onOfferte={setOfferteP}/>
            ))}
          </div>
        )}
        <p style={{ fontSize:11, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'8px 0' }}>🎯 Beste matches voor {stad}</p>
        {gefilterd.filter(p => !p.sponsored).map((p,i) => (
          <PartnerKaart key={i} partner={p} onOfferte={setOfferteP}/>
        ))}
      </div>

      <div style={{ marginTop:14, padding:'10px 14px', background:C.sand, borderRadius:10, fontSize:11.5, color:C.mist, textAlign:'center' }}>
        🔍 Bouwvi toont eerst objectieve matches. Gesponsorde partners worden duidelijk gelabeld.
      </div>

      {/* Offerte modal */}
      {offerteP && !offerteDone && (
        <OfferteModal partner={offerteP} onClose={() => setOfferteP(null)} onDone={() => { setOfferteDone(true); setOfferteP(null) }}/>
      )}
      {offerteDone && (
        <div style={{ position:'fixed', bottom:20, right:20, background:C.ok, color:C.white, borderRadius:14, padding:'14px 20px', fontSize:14, fontWeight:700, animation:'up .3s ease', zIndex:999 }}>
          ✅ Offerte aanvraag verstuurd!
          <button onClick={() => setOfferteDone(false)} style={{ background:'none', border:'none', color:C.white, cursor:'pointer', marginLeft:10, fontSize:16 }}>×</button>
        </div>
      )}
    </div>
  )
}

function PartnerKaart({ partner: p, onOfferte }) {
  return (
    <div style={{ background:C.white, border:`1.5px solid ${p.sponsored?C.gold:C.border}`, borderRadius:14, marginBottom:10, overflow:'hidden', boxShadow:p.sponsored?`0 2px 12px ${C.gold}22`:'0 1px 6px rgba(15,45,107,.05)' }}>
      {p.sponsored && <div style={{ background:`linear-gradient(90deg,${C.gold},#D97706)`, padding:'4px 14px', fontSize:10, fontWeight:800, color:C.white }}>⭐ AANBEVOLEN PARTNER</div>}
      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, background:C.off, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{p.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.ink }}>{p.naam}</div>
            <div style={{ fontSize:12, color:C.mist, marginTop:2 }}>{p.type} · 📍 {p.afstand} · {p.prijs}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
              <div style={{ display:'flex', gap:2 }}>{[1,2,3,4,5].map(s => <div key={s} style={{ width:8, height:8, borderRadius:2, background:s<=Math.round(p.rating)?C.gold:C.border }}/>)}</div>
              <span style={{ fontSize:12, fontWeight:700, color:C.ink }}>{p.rating}</span>
              <span style={{ fontSize:11, color:C.mist }}>({p.reviews} reviews)</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
            <button onClick={() => window.open(`tel:${p.tel}`,'_self')} style={{ background:C.okSoft, border:`1px solid ${C.ok}`, color:C.ok, borderRadius:8, padding:'7px 12px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>📞 Bel</button>
            <button onClick={() => onOfferte(p)} style={{ background:C.blue, border:'none', color:C.white, borderRadius:8, padding:'7px 12px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>📨 Offerte</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OfferteModal({ partner, onClose, onDone }) {
  const [naam, setNaam] = useState(''); const [email, setEmail] = useState(''); const [beschr, setBeschr] = useState('')
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(5,15,40,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16, backdropFilter:'blur(6px)', animation:'pop .3s ease' }}>
      <div style={{ background:C.white, borderRadius:20, padding:0, maxWidth:460, width:'100%', animation:'pop .3s ease', boxShadow:'0 30px 60px rgba(0,0,0,.3)' }}>
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:'20px 20px 0 0', padding:'20px 22px', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>{partner.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:16, color:C.white }}>{partner.naam}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', marginTop:2 }}>Offerte aanvragen</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', color:C.white, width:30, height:30, borderRadius:8, cursor:'pointer', fontSize:16 }}>×</button>
        </div>
        <div style={{ padding:'20px 22px' }}>
          {[['Jouw naam','text',naam,setNaam,'Jan de Vries'],['E-mailadres','email',email,setEmail,'jan@email.nl']].map(([l,t,v,s,ph]) => (
            <div key={l} style={{ marginBottom:12 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:C.navy, display:'block', marginBottom:5 }}>{l}</label>
              <input type={t} value={v} onChange={e => s(e.target.value)} placeholder={ph}
                style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 13px', fontSize:14, outline:'none' }}/>
            </div>
          ))}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12.5, fontWeight:700, color:C.navy, display:'block', marginBottom:5 }}>Omschrijving klus</label>
            <textarea value={beschr} onChange={e => setBeschr(e.target.value)} placeholder="Beschrijf wat je wilt laten doen..." rows={3}
              style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 13px', fontSize:14, resize:'vertical', outline:'none', minHeight:70 }}/>
          </div>
          <Btn label="📨 Offerte aanvragen" onClick={onDone} col="ok" full disabled={!naam||!email||!beschr} style={{ fontSize:15, padding:13 }}/>
        </div>
      </div>
    </div>
  )
}

// ─── MATERIALEN MODULE ────────────────────────────────────────────────────────
function MaterialenModule() {
  const [klus, setKlus] = useState(null)
  const [vraag, setVraag] = useState('')
  const [antw, setAntw] = useState('')
  const [loadA, setLoadA] = useState(false)
  const [fupIn, setFupIn] = useState('')
  const [fups, setFups] = useState([])
  const [loadF, setLoadF] = useState(false)
  const [breedte, setBreedte] = useState(''); const [lengte, setLengte] = useState('')
  const [boodschappen, setBoodschappen] = useState([])
  const [matTab, setMatTab] = useState('advies')

  const KLUSSEN = [
    { id:'tegelwerk', icon:'⬜', label:'Tegelwerk', sub:'Vloer of wand tegelen' },
    { id:'schilderwerk', icon:'🖌️', label:'Schilderwerk', sub:'Muren, plafond, kozijnen' },
    { id:'laminaat', icon:'🪵', label:'Vloer leggen', sub:'Laminaat, PVC of parket' },
    { id:'badkamer', icon:'🚿', label:'Badkamer', sub:'Sanitair & afwerking' },
    { id:'keuken', icon:'🍳', label:'Keuken', sub:'Keuken plaatsen' },
    { id:'isolatie', icon:'🌡️', label:'Isolatie', sub:'Spouwmuur, dak, vloer' },
    { id:'elektra', icon:'⚡', label:'Elektra', sub:'Bedrading & stopcontacten' },
    { id:'dak', icon:'🏠', label:'Dakrenovatie', sub:'Dakbedekking & isolatie' },
    { id:'tuin', icon:'🌿', label:'Tuin & veranda', sub:'Terras, bestrating' },
    { id:'stucwerk', icon:'🖼️', label:'Stucwerk', sub:'Muren en plafond' },
  ]

  const WINKELS = [
    { naam:'Hornbach', icon:'🟠', k:'#E85D04', url:'https://www.hornbach.nl' },
    { naam:'Praxis', icon:'🔵', k:'#003087', url:'https://www.praxis.nl' },
    { naam:'Gamma', icon:'🟡', k:'#F5C400', url:'https://www.gamma.nl' },
    { naam:'Bauhaus', icon:'🔴', k:'#CC0000', url:'https://www.bauhaus.nl' },
    { naam:'Formido', icon:'🟢', k:'#2E7D32', url:'https://www.formido.nl' },
  ]

  const opp = breedte && lengte ? parseFloat(breedte) * parseFloat(lengte) : null

  async function getAdvies() {
    if (!vraag.trim() || !klus) return
    setLoadA(true); setAntw(''); setFups([])
    const t = await ai(`Materiaaladvies voor ${klus.label}: ${vraag}. Geef: benodigde materialen met hoeveelheden en prijzen, gereedschap (kopen vs huren), kwaliteitskeuze (budget vs premium), veiligheid, bespaartips.`,
      'Je bent Bouwvi materiaaladviseur. Geef concrete Nederlandse prijzen en merknamen.')
    setAntw(t); setLoadA(false)
  }

  async function sendFup() {
    if (!fupIn.trim() || loadF) return
    const v = fupIn.trim(); setFupIn(''); setLoadF(true)
    const t = await ai(`Vervolgvraag over materialen voor ${klus?.label}: ${v}`)
    setFups(p => [...p, { v, a:t }]); setLoadF(false)
  }

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:'24px', marginBottom:24, textAlign:'center' }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C.white, margin:'0 0 8px' }}>🧱 Materialen & Koopadvies</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', margin:0 }}>Wat heb ik nodig? Hoeveel? Waar koop ik het?</p>
      </div>

      {!klus ? (
        <div>
          <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 14px' }}>Waar ben jij mee bezig?</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10 }}>
            {KLUSSEN.map(k => (
              <button key={k.id} onClick={() => setKlus(k)}
                style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'16px 12px', textAlign:'left', cursor:'pointer', transition:'all .18s', fontFamily:'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)' }}>
                <div style={{ fontSize:26, marginBottom:8 }}>{k.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.ink }}>{k.label}</div>
                <div style={{ fontSize:11, color:C.mist, marginTop:3 }}>{k.sub}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:48, height:48, background:C.blue, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{klus.icon}</div>
            <div>
              <h3 style={{ fontWeight:800, fontSize:18, color:C.navy, margin:0 }}>{klus.label}</h3>
              <button onClick={() => { setKlus(null); setAntw(''); setFups([]) }} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>← Ander klus kiezen</button>
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <Tabs active={matTab} onChange={setMatTab} tabs={[
              { id:'advies', label:'🧠 Advies' },
              { id:'rekenen', label:'📐 Rekenen' },
              { id:'winkels', label:'🛒 Winkels' },
              { id:'lijst', label:`📋 Lijst${boodschappen.length?` (${boodschappen.length})`:''}`},
            ]}/>
          </div>

          {matTab === 'advies' && (
            <Card>
              <div style={{ marginBottom:14 }}>
                <textarea value={vraag} onChange={e => setVraag(e.target.value)} rows={2}
                  placeholder={`Stel een vraag over materialen voor ${klus.label}... bijv. "Ik ga 15m² tegelen, wat heb ik nodig?"`}
                  style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:11, padding:'11px 14px', fontSize:14, resize:'vertical', outline:'none', minHeight:70 }}
                  onFocus={e => e.target.style.borderColor=C.blue}
                  onBlur={e => e.target.style.borderColor=C.border}/>
                <Btn label="🧠 Materiaaladvies ophalen" onClick={getAdvies} disabled={!vraag.trim()} full style={{ marginTop:10, fontSize:14 }}/>
              </div>
              {loadA && <div style={{ display:'flex', alignItems:'center', gap:10, color:C.mist }}><Spin/> Advies ophalen...</div>}
              {antw && <Txt t={antw} ac={C.blue}/>}
              {fups.map((f,i) => (
                <div key={i} style={{ marginTop:12 }}>
                  <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
                    <div style={{ background:C.blue, color:C.white, borderRadius:'12px 12px 4px 12px', padding:'9px 14px', fontSize:13.5, maxWidth:'85%' }}>{f.v}</div>
                  </div>
                  <Card style={{ borderTopLeftRadius:4 }}><Txt t={f.a}/></Card>
                </div>
              ))}
              {antw && (
                <div style={{ marginTop:14, display:'flex', gap:8 }}>
                  <textarea value={fupIn} onChange={e => setFupIn(e.target.value)}
                    onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendFup() }}}
                    placeholder="Vervolgvraag..." rows={1}
                    style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 13px', fontSize:13.5, resize:'none', outline:'none', minHeight:44, maxHeight:100 }}/>
                  <button onClick={sendFup} disabled={loadF||!fupIn.trim()}
                    style={{ width:44, height:44, background:loadF||!fupIn.trim()?'#CCC':C.blue, border:'none', borderRadius:10, color:C.white, fontSize:18, cursor:'pointer', flexShrink:0 }}>
                    {loadF?'…':'➤'}
                  </button>
                </div>
              )}
            </Card>
          )}

          {matTab === 'rekenen' && (
            <Card>
              <p style={{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:12 }}>📐 Hoeveelheidsberekening</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                {[['Breedte (m)',breedte,setBreedte,'3.00'],['Lengte (m)',lengte,setLengte,'4.00']].map(([l,v,s,ph]) => (
                  <div key={l} style={{ background:C.off, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 13px' }}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.mist, display:'block', marginBottom:4 }}>{l.toUpperCase()}</label>
                    <input type="number" step="0.1" value={v} onChange={e => s(e.target.value)} placeholder={ph}
                      style={{ width:'100%', border:'none', outline:'none', fontSize:20, fontWeight:800, color:C.navy, background:'transparent' }}/>
                  </div>
                ))}
              </div>
              {opp && (
                <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:700 }}>OPPERVLAK</div>
                    <div style={{ fontSize:28, fontWeight:800, color:C.white }}>{Math.round(opp*100)/100} m²</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>Incl. 10% snijverlies</div>
                    <div style={{ fontSize:22, fontWeight:800, color:'#93C5FD' }}>{Math.round(opp*1.1*100)/100} m²</div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {matTab === 'winkels' && (
            <Card>
              <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', margin:'0 0 14px' }}>🛒 Kopen bij</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {WINKELS.map(w => (
                  <button key={w.naam} onClick={() => window.open(w.url,'_blank')}
                    style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px', textAlign:'left', cursor:'pointer', transition:'all .18s', fontFamily:'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=w.k; e.currentTarget.style.transform='translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:20 }}>{w.icon}</span>
                      <div style={{ fontWeight:700, fontSize:14, color:C.ink }}>{w.naam}</div>
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color:w.k }}>Bekijk {klus.label} →</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop:12, padding:'8px 12px', background:C.sand, borderRadius:9, fontSize:11.5, color:C.mist, textAlign:'center' }}>
                Bouwvi ontvangt geen commissie. Advies is altijd objectief.
              </div>
            </Card>
          )}

          {matTab === 'lijst' && (
            <Card>
              <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>📋 Boodschappenlijst</div>
              {boodschappen.length === 0 ? (
                <div style={{ textAlign:'center', padding:'24px 0', color:C.mist, fontSize:14 }}>
                  Gebruik het Advies tabblad en voeg materialen toe aan je lijst.
                </div>
              ) : (
                boodschappen.map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, flex:1 }}>{item}</span>
                    <button onClick={() => setBoodschappen(p => p.filter((_,j) => j!==i))} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontSize:18 }}>×</button>
                  </div>
                ))
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

// ─── TEKEN MODULE ─────────────────────────────────────────────────────────────
function TekenModule({ user, goUpgrade }) {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState('muur')
  const [fase, setFase] = useState('huidig')
  const [elementen, setElementen] = useState([])
  const [drawing, setDrawing] = useState(null)
  const [afm, setAfm] = useState({ b:'300', l:'400' })
  const [analyse, setAnalyse] = useState('')
  const [loadA, setLoadA] = useState(false)
  const [showAnalyse, setShowAnalyse] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const topRef = useRef({ elementen:[], drawing:null })

  const GRID = 20
  const TOOLS = [
    { id:'muur', icon:'▬', label:'Muur' },
    { id:'deur', icon:'🚪', label:'Deur' },
    { id:'raam', icon:'🪟', label:'Raam' },
    { id:'douche', icon:'🚿', label:'Douche' },
    { id:'toilet', icon:'🚽', label:'Toilet' },
    { id:'bad', icon:'🛁', label:'Bad' },
    { id:'wastafel', icon:'🪥', label:'Wastafel' },
    { id:'kast', icon:'📦', label:'Kast' },
    { id:'delete', icon:'🗑️', label:'Wis' },
  ]
  const KLEUREN = { muur:C.navy, deur:'#7A5210', raam:'#1F618D', douche:'#1A5276', toilet:'#4A235A', bad:'#1B5E4B', wastafel:'#6E2F1A', kast:'#4A4A5A' }

  useEffect(() => { topRef.current.elementen = elementen }, [elementen])

  function snap(v) { return Math.round(v/GRID)*GRID }

  const redraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,canvas.width,canvas.height)
    // Grid
    ctx.strokeStyle = '#E8EFFE'; ctx.lineWidth = .5
    for(let x=0;x<=canvas.width;x+=GRID){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<=canvas.height;y+=GRID){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}
    // Ruimte
    const W=parseInt(afm.b)/100*GRID*5, H=parseInt(afm.l)/100*GRID*5
    const OX=GRID*2, OY=GRID*2
    ctx.strokeStyle=C.navy; ctx.lineWidth=3; ctx.strokeRect(OX,OY,W,H)
    ctx.fillStyle='rgba(232,239,254,.25)'; ctx.fillRect(OX,OY,W,H)
    ctx.fillStyle=C.navy; ctx.font='bold 11px system-ui'; ctx.textAlign='center'
    ctx.fillText(`${afm.b} cm`,OX+W/2,OY-6)
    ctx.textAlign='right'; ctx.fillText(`${afm.l} cm`,OX-6,OY+H/2+4)
    // Elementen
    topRef.current.elementen.forEach(el => {
      ctx.save()
      if(el.type==='muur'){
        ctx.strokeStyle=KLEUREN.muur; ctx.lineWidth=6; ctx.lineCap='round'
        ctx.beginPath(); ctx.moveTo(el.x1,el.y1); ctx.lineTo(el.x2,el.y2); ctx.stroke()
        const dx=el.x2-el.x1, dy=el.y2-el.y1
        const len=Math.round(Math.sqrt(dx*dx+dy*dy)/GRID*20)
        ctx.fillStyle=C.navy; ctx.font='10px system-ui'; ctx.textAlign='center'
        ctx.fillText(`${len}cm`,(el.x1+el.x2)/2,(el.y1+el.y2)/2-8)
      } else {
        const k=KLEUREN[el.type]||'#666'
        ctx.fillStyle=k+'22'; ctx.strokeStyle=k; ctx.lineWidth=1.5
        ctx.beginPath(); ctx.roundRect(el.x,el.y,el.w,el.h,4); ctx.fill(); ctx.stroke()
        ctx.fillStyle=k; ctx.font='bold 13px system-ui'; ctx.textAlign='center'
        ctx.fillText(TOOLS.find(t=>t.id===el.type)?.icon||'?',el.x+el.w/2,el.y+el.h/2+5)
      }
      ctx.restore()
    })
    // Drawing preview
    const dr = topRef.current.drawing
    if(dr){ ctx.strokeStyle=C.red; ctx.lineWidth=2; ctx.setLineDash([6,3])
      if(dr.type==='muur'){ctx.beginPath();ctx.moveTo(dr.x1,dr.y1);ctx.lineTo(dr.x2,dr.y2);ctx.stroke()}
      else{ctx.beginPath();ctx.roundRect(Math.min(dr.sx,dr.ex),Math.min(dr.sy,dr.ey),Math.abs(dr.ex-dr.sx),Math.abs(dr.ey-dr.sy),4);ctx.stroke()}
    }
  }

  useEffect(redraw, [elementen, drawing, afm])

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect()
    return { x:snap((e.touches?.[0]?.clientX??e.clientX)-r.left), y:snap((e.touches?.[0]?.clientY??e.clientY)-r.top) }
  }

  function onDown(e) {
    e.preventDefault()
    const {x,y}=getPos(e)
    if(tool==='delete'){
      const idx=topRef.current.elementen.findIndex(el=>el.type!=='muur'&&x>=el.x&&x<=el.x+el.w&&y>=el.y&&y<=el.y+el.h)
      if(idx>=0) setElementen(p=>p.filter((_,i)=>i!==idx)); return
    }
    const dr = tool==='muur' ? {type:'muur',x1:x,y1:y,x2:x,y2:y} : {type:tool,sx:x,sy:y,ex:x+GRID*3,ey:y+GRID*3}
    topRef.current.drawing=dr; setDrawing(dr)
  }

  function onMove(e) {
    e.preventDefault()
    const dr=topRef.current.drawing; if(!dr) return
    const {x,y}=getPos(e)
    const updated = dr.type==='muur' ? {...dr,x2:x,y2:y} : {...dr,ex:x,ey:y}
    topRef.current.drawing=updated; setDrawing({...updated}); redraw()
  }

  function onUp(e) {
    e.preventDefault()
    const dr=topRef.current.drawing; if(!dr) return
    if(dr.type==='muur'){
      if(Math.abs(dr.x2-dr.x1)>GRID||Math.abs(dr.y2-dr.y1)>GRID) setElementen(p=>[...p,dr])
    } else {
      const x=Math.min(dr.sx,dr.ex), y=Math.min(dr.sy,dr.ey)
      const w=Math.abs(dr.ex-dr.sx), h=Math.abs(dr.ey-dr.sy)
      if(w>GRID&&h>GRID) setElementen(p=>[...p,{type:dr.type,x,y,w,h}])
    }
    topRef.current.drawing=null; setDrawing(null)
  }

  async function doAnalyse() {
    setShowAnalyse(true); setLoadA(true)
    const muren=elementen.filter(e=>e.type==='muur').length
    const items=elementen.filter(e=>e.type!=='muur').map(e=>TOOLS.find(t=>t.id===e.type)?.label||e.type).join(', ')
    const t = await ai(
      `Analyseer deze ruimtetekening: ${fase} situatie, ${afm.b}×${afm.l}cm. ${muren} muren getekend. Elementen: ${items||'geen'}. Geef: **Slimste indeling**, **⚠️ Risico's** (draagmuur, asbest, vergunning), **Leidingwerk advies**, **Werkvolgorde**, **Kostenindicatie** (budget/gemiddeld/premium), **Materiaallijst** (top 6), **Zelf doen vs professional**, **Bespaartips**.`,
      'Je bent Bouwvi bouwcoach. Analyseer ruimtetekeningen van particulieren.'
    )
    setAnalyse(t); setLoadA(false)
  }

  if (!user || user.plan === 'gratis') return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(140deg,${C.navy},${C.blue})`, borderRadius:20, padding:'28px 24px', textAlign:'center', marginBottom:20 }}>
        <Badge label="🔒 EXCLUSIEVE PREMIUM FUNCTIE" col="premium"/>
        <h2 style={{ fontWeight:800, fontSize:22, color:C.white, margin:'12px 0 8px' }}>Teken & Plan jouw verbouwing</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.65 }}>Teken jouw ruimte op schaal en ontvang direct een volledig persoonlijk AI-advies. Bespaar gemiddeld €500–€2.000 aan advieskosten.</p>
      </div>

      {/* Demo preview blurred */}
      <div style={{ position:'relative', borderRadius:16, overflow:'hidden', marginBottom:20 }}>
        <svg width="100%" viewBox="0 0 680 300" style={{ display:'block', filter:'blur(4px)', opacity:.5, background:'#E8EFFE' }}>
          {Array.from({length:35}).map((_,i)=><line key={`v${i}`} x1={i*20} y1={0} x2={i*20} y2={300} stroke="#D0DCFA" strokeWidth=".5"/>)}
          {Array.from({length:16}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*20} x2={680} y2={i*20} stroke="#D0DCFA" strokeWidth=".5"/>)}
          <rect x="40" y="40" width="360" height="220" fill="rgba(232,239,254,.4)" stroke="#0F2D6B" strokeWidth="3" rx="2"/>
          <rect x="60" y="60" width="100" height="100" fill="rgba(26,82,118,.15)" stroke="#1A5276" strokeWidth="2" rx="4"/>
          <text x="110" y="118" textAnchor="middle" fontSize="24">🚿</text>
          <rect x="60" y="200" width="60" height="50" fill="rgba(74,35,90,.15)" stroke="#4A235A" strokeWidth="2" rx="4"/>
          <text x="90" y="230" textAnchor="middle" fontSize="20">🚽</text>
          <rect x="260" y="60" width="80" height="55" fill="rgba(110,47,26,.15)" stroke="#6E2F1A" strokeWidth="2" rx="4"/>
          <text x="300" y="95" textAnchor="middle" fontSize="18">🪥</text>
        </svg>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(15,45,107,.05) 0%,rgba(15,45,107,.85) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'28px 24px' }}>
          <div style={{ fontSize:56, marginBottom:12, animation:'up .4s ease' }}>🔒</div>
          <h3 style={{ fontWeight:800, fontSize:20, color:C.white, margin:'0 0 8px', textAlign:'center' }}>Ontgrendel Teken & Plan</h3>
          <p style={{ fontSize:13.5, color:'rgba(255,255,255,.75)', margin:'0 0 16px', textAlign:'center', lineHeight:1.6 }}>Teken jouw ruimte en ontvang direct een persoonlijk verbouwplan van je AI bouwcoach.</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginBottom:18 }}>
            {['✓ Draagmuur check','✓ Kostenindicatie','✓ Materiaallijst','✓ Stappenplan'].map(t=>(
              <span key={t} style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600 }}>{t}</span>
            ))}
          </div>
          <Btn label="🔓 Ontgrendel — €19,99/mnd" onClick={goUpgrade} col="gold" style={{ fontSize:15, padding:'12px 28px' }}/>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {[
          { plan:'Premium', prijs:'€19,99/mnd', slots:'1 project', feats:['Tekenmodule','Volledige AI coach','Kosten & planning','Specialisten matchen'] },
          { plan:'Premium Plus', prijs:'€29,99/mnd', slots:'3 projecten', feats:['Alles van Premium','3 projecten tegelijk','PDF export','Prioriteit support'], best:true },
        ].map(p => (
          <div key={p.plan} style={{ background:C.white, border:`2px solid ${p.best?C.gold:C.border}`, borderRadius:16, padding:'18px', position:'relative' }}>
            {p.best && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'#78350F', fontSize:9, fontWeight:800, padding:'3px 12px', borderRadius:20, whiteSpace:'nowrap' }}>MEEST POPULAIR</div>}
            <div style={{ fontWeight:800, fontSize:15, color:C.navy, marginBottom:3 }}>{p.plan}</div>
            <div style={{ fontWeight:800, fontSize:20, color:p.best?C.gold:C.blue, marginBottom:10 }}>{p.prijs}</div>
            {p.feats.map(f => <div key={f} style={{ fontSize:12.5, color:C.slate, marginBottom:4, display:'flex', gap:6 }}><span style={{ color:C.ok }}>✓</span>{f}</div>)}
            <Btn label="Upgraden" onClick={goUpgrade} col={p.best?'gold':'primary'} full style={{ marginTop:12, fontSize:13 }}/>
          </div>
        ))}
      </div>
    </div>
  )

  // Premium teken interface
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ flex:1 }}>
          <Badge label="✨ PREMIUM FUNCTIE" col="purple"/>
          <h2 style={{ fontWeight:800, fontSize:20, color:C.navy, margin:'6px 0 3px' }}>Teken & Plan</h2>
          <p style={{ fontSize:13, color:C.mist }}>Teken jouw ruimte — ontvang direct persoonlijk AI-advies</p>
        </div>
      </div>

      {showAnalyse ? (
        <div style={{ animation:'up .3s ease' }}>
          <button onClick={() => setShowAnalyse(false)} style={{ background:'none', border:'none', color:C.mist, cursor:'pointer', fontSize:13, fontWeight:600, marginBottom:16, display:'flex', alignItems:'center', gap:5, fontFamily:'inherit' }}>← Terug naar tekening</button>
          <div style={{ background:`linear-gradient(135deg,${C.purple},#6D28D9)`, borderRadius:16, padding:'20px', marginBottom:18, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:36 }}>🧠</div>
            <div>
              <Badge label="AI ANALYSE" col="purple"/>
              <h3 style={{ fontWeight:800, fontSize:18, color:C.white, margin:'6px 0 3px' }}>Jouw persoonlijk verbouwadvies</h3>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.65)', margin:0 }}>Op basis van jouw tekening · {afm.b}×{afm.l}cm</p>
            </div>
          </div>
          <Card style={{ minHeight:120 }}>
            {loadA ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'32px 0', color:C.mist }}><Spin size={32}/><div>Analyse genereren...</div></div>
              : <Txt t={analyse} ac={C.purple}/>}
          </Card>
          {!loadA && <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <Btn label="🖨️ Print rapport" onClick={() => window.print()} col="ghost" style={{ flex:1 }}/>
            <Btn label="✏️ Tekening aanpassen" onClick={() => setShowAnalyse(false)} col="outline" style={{ flex:1 }}/>
          </div>}
        </div>
      ) : (
        <>
          {/* Fase */}
          <div style={{ marginBottom:14 }}>
            <Tabs active={fase} onChange={setFase} tabs={[{ id:'huidig', label:'📍 Huidige situatie' },{ id:'gewenst', label:'✨ Gewenste situatie' }]}/>
          </div>

          {/* Afmetingen */}
          <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
            {[['Breedte',afm.b,'b','300'],['Lengte',afm.l,'l','400']].map(([l,v,k,ph]) => (
              <div key={k} style={{ display:'flex', alignItems:'center', gap:8, background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:'8px 14px' }}>
                <span style={{ fontSize:12, color:C.mist, fontWeight:600 }}>{l}:</span>
                <input type="number" value={v} onChange={e => setAfm(p=>({...p,[k]:e.target.value}))}
                  style={{ width:60, border:'none', outline:'none', fontSize:15, fontWeight:700, color:C.navy, textAlign:'right' }}/>
                <span style={{ fontSize:12, color:C.mist }}>cm</span>
              </div>
            ))}
            <div style={{ marginLeft:'auto', fontSize:12, color:C.mist }}>{elementen.filter(e=>e.type==='muur').length} muren · {elementen.filter(e=>e.type!=='muur').length} elementen</div>
          </div>

          {/* Toolbar */}
          <div style={{ display:'flex', gap:5, marginBottom:10, flexWrap:'wrap' }}>
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                style={{ width:46, height:46, border:`1.5px solid ${tool===t.id?C.blue:C.border}`, borderRadius:10, background:tool===t.id?C.blueSoft:C.white, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:1, boxShadow:tool===t.id?`0 0 0 3px ${C.blueL}`:'none', transition:'all .15s' }}>
                <span>{t.icon}</span>
                <span style={{ fontSize:7, color:C.mist, fontWeight:600 }}>{t.label}</span>
              </button>
            ))}
            <button onClick={() => setElementen([])} style={{ height:46, border:`1px solid ${C.border}`, borderRadius:10, background:C.white, padding:'0 12px', fontSize:12, fontWeight:600, color:C.mist, cursor:'pointer', fontFamily:'inherit' }}>Leeg</button>
          </div>

          {/* Canvas */}
          <div style={{ border:`2px solid ${C.border}`, borderRadius:16, overflow:'hidden', background:C.white, boxShadow:'0 4px 16px rgba(15,45,107,.08)', position:'relative' }}>
            <div style={{ position:'absolute', top:10, left:10, background:'rgba(15,45,107,.08)', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:700, color:C.navy, zIndex:10 }}>
              {fase==='huidig'?'📍 HUIDIGE SITUATIE':'✨ GEWENSTE SITUATIE'}
            </div>
            <canvas ref={canvasRef} width={680} height={420} style={{ display:'block', width:'100%', height:'auto', cursor:'crosshair' }}
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
              onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}/>
          </div>

          <div style={{ marginTop:10, padding:'9px 13px', background:C.blueSoft, borderRadius:10, fontSize:12.5, color:C.blue }}>
            💡 {tool==='muur'?'Klik en sleep om een muur te tekenen':tool==='delete'?'Klik op een element om het te verwijderen':`Klik en sleep om een ${TOOLS.find(t=>t.id===tool)?.label} te plaatsen`}
          </div>

          {elementen.length > 0 && (
            <div style={{ marginTop:16, textAlign:'center' }}>
              <Btn label="🧠 Analyseer mijn tekening →" onClick={doAnalyse} col="purple" style={{ fontSize:15, padding:'13px 28px', borderRadius:14 }}/>
              <p style={{ fontSize:11.5, color:C.mist, marginTop:8 }}>Bouwvi AI analyseert jouw indeling en geeft persoonlijk advies</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── ACCOUNT MODULE ───────────────────────────────────────────────────────────
function AccountModule({ user, goUpgrade, onLogout }) {
  const [tab, setTab] = useState('profiel')
  const facts = getFacts(user.id)
  const planL = { gratis:'Gratis', premium:'Premium', plus:'Premium Plus' }[user.plan]
  const planP = { gratis:0, premium:19.99, plus:29.99 }[user.plan]
  const pc = user.plan==='plus'?C.gold : user.plan==='premium'?C.blue : C.mist

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'28px 20px 60px', animation:'up .3s ease' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:22, marginBottom:18, display:'flex', alignItems:'center', gap:14, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }}/>
        <div style={{ width:56, height:56, background:pc, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:C.white, fontWeight:800, flexShrink:0 }}>{user.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:17, color:C.white }}>{user.naam}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.65)', marginTop:2 }}>{user.email}</div>
          <div style={{ marginTop:6 }}><Badge label={planL.toUpperCase()} col={user.plan==='plus'?'gold':user.plan==='premium'?'premium':'gray'}/></div>
        </div>
        <button onClick={onLogout} style={{ background:'rgba(255,255,255,.12)', border:'none', color:C.white, borderRadius:8, padding:'7px 12px', fontSize:12.5, cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>Uitloggen</button>
      </div>

      <div style={{ marginBottom:18 }}>
        <Tabs active={tab} onChange={setTab} tabs={[
          { id:'profiel', label:'👤 Profiel' },
          { id:'abo', label:'💳 Abonnement' },
          { id:'facts', label:'🧾 Facturen' },
          { id:'beveiliging', label:'🔒 Beveiliging' },
        ]}/>
      </div>

      {tab === 'profiel' && (
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Persoonlijke gegevens</div>
          {[['Naam',user.naam],['E-mail',user.email],['Lid sinds',user.lid_sinds],['Plan',planL]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:13.5 }}>
              <span style={{ color:C.mist }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'10px 14px', background:C.blueSoft, borderRadius:10, fontSize:12.5, color:C.blue }}>
            🔒 Dit is een demo account. In productie kun je hier je gegevens wijzigen.
          </div>
        </Card>
      )}

      {tab === 'abo' && (
        <div>
          <Card style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.mist, letterSpacing:.6, marginBottom:4 }}>HUIDIG ABONNEMENT</div>
                <div style={{ fontWeight:800, fontSize:20, color:C.navy }}>{planL}</div>
                {user.sub && <div style={{ fontSize:13, color:C.mist, marginTop:3 }}>Verlengt {user.sub.verlengt} · {user.sub.methode}</div>}
              </div>
              {planP > 0 && <div style={{ textAlign:'right' }}><div style={{ fontWeight:800, fontSize:26, color:pc }}>€{planP}</div><div style={{ fontSize:11, color:C.mist }}>per maand</div></div>}
            </div>
            {user.plan === 'gratis' && <Btn label="⭐ Upgrade naar Premium →" onClick={goUpgrade} full style={{ fontSize:14 }}/>}
            {user.plan === 'premium' && <Btn label="⭐ Upgrade naar Plus" onClick={goUpgrade} col="gold" style={{ fontSize:13 }}/>}
          </Card>

          {/* Plannen vergelijken */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { id:'gratis', l:'Gratis', p:0, feats:['Bibliotheek','AI vragen'], locked:['Projecten','Tekenen'] },
              { id:'premium', l:'Premium', p:19.99, feats:['1 project','AI coach','Tekenen','Kosten'], locked:['Meerdere projecten'] },
              { id:'plus', l:'Plus', p:29.99, feats:['3 projecten','Alles','PDF','Offertes'], locked:[], pop:true },
            ].map(pl => (
              <div key={pl.id} style={{ border:`2px solid ${pl.pop?C.gold:user.plan===pl.id?C.blue:C.border}`, borderRadius:14, padding:'14px 12px', background:C.white, position:'relative' }}>
                {pl.pop && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'#78350F', fontSize:8, fontWeight:800, padding:'2px 10px', borderRadius:20, whiteSpace:'nowrap' }}>POPULAIR</div>}
                <div style={{ fontWeight:700, fontSize:13, color:C.navy, marginBottom:3 }}>{pl.l}</div>
                <div style={{ fontWeight:800, fontSize:18, color:pl.id==='plus'?C.gold:pl.id==='gratis'?C.mist:C.blue, marginBottom:10 }}>{pl.p===0?'Gratis':`€${pl.p}`}{pl.p>0&&<span style={{ fontSize:10, color:C.mist }}>/mnd</span>}</div>
                {pl.feats.map(f => <div key={f} style={{ fontSize:11, color:C.slate, marginBottom:3, display:'flex', gap:5 }}><span style={{ color:C.ok }}>✓</span>{f}</div>)}
                {user.plan !== pl.id && pl.p > 0 && <button onClick={goUpgrade} style={{ width:'100%', marginTop:10, background:pl.id==='plus'?C.gold:C.blue, color:pl.id==='plus'?'#78350F':C.white, border:'none', borderRadius:8, padding:'7px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Upgraden</button>}
                {user.plan === pl.id && <div style={{ marginTop:10, fontSize:11, color:C.ok, fontWeight:700, textAlign:'center' }}>✓ Huidig</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:'9px 14px', background:C.sand, borderRadius:10, fontSize:12, color:C.mist, textAlign:'center' }}>
            Demo: betalingen werken in productie via Mollie · iDEAL · Apple Pay · creditcard
          </div>
        </div>
      )}

      {tab === 'facts' && (
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Betalingsgeschiedenis</div>
          {facts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:C.mist, fontSize:14 }}>Geen facturen beschikbaar.</div>
          ) : facts.map(f => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontSize:20 }}>🧾</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13.5 }}>Bouwvi {planL}</div>
                  <div style={{ fontSize:12, color:C.mist }}>{f.datum} · {f.nr}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontWeight:800, fontSize:15 }}>€{f.bedrag}</span>
                <Badge label="Betaald" col="ok"/>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'beveiliging' && (
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Beveiliging & Privacy</div>
          {[
            { icon:'🔒', t:'Wachtwoord wijzigen', s:'Laatste wijziging: niet van toepassing (demo)', actief:true },
            { icon:'📱', t:'Twee-factor authenticatie', s:'Extra beveiligingslaag via SMS of app', actief:false },
            { icon:'🔔', t:'Inlogmeldingen', s:'Ontvang e-mail bij onbekende inlog', actief:true },
            { icon:'📥', t:'GDPR — Gegevens exporteren', s:'Download al jouw Bouwvi data', actief:true },
          ].map(item => (
            <div key={item.t} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:13.5, color:C.ink }}>{item.t}</div>
                  <div style={{ fontSize:12, color:C.mist }}>{item.s}</div>
                </div>
              </div>
              <div style={{ width:44, height:24, borderRadius:12, background:item.actief?C.ok:C.border, position:'relative', cursor:'pointer', flexShrink:0 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:C.white, position:'absolute', top:3, left:item.actief?23:3, transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

// ─── UPGRADE SCHERM ───────────────────────────────────────────────────────────
function UpgradeScherm({ user, onUpgrade }) {
  const [load, setLoad] = useState(null)
  async function doPlan(p) {
    setLoad(p); await new Promise(r=>setTimeout(r,1400)); setLoad(null); onUpgrade(p)
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px 60px', animation:'up .3s ease' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <h2 style={{ fontWeight:800, fontSize:26, color:C.navy, margin:'0 0 8px' }}>Kies jouw plan</h2>
        <p style={{ fontSize:14, color:C.mist }}>Maandelijks opzegbaar · iDEAL · Apple Pay · geen verborgen kosten</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { id:'gratis', l:'Gratis', p:0, feats:['Kennisbibliotheek','AI artikelen','Boodschappenlijst basis','Vakmannen zoeken'], locked:['Eigen projecten','AI coach','Tekenmodule','Materiaalmodule'] },
          { id:'premium', l:'Premium', p:19.99, feats:['1 actief project','Persoonlijke AI coach','Tekenmodule','Kostenoverzicht','Planning','Materiaallijst','Specialisten matchen'], locked:['Meerdere projecten'] },
          { id:'plus', l:'Premium Plus', p:29.99, pop:true, feats:['3 actieve projecten','Alles van Premium','PDF rapport export','Offertes vergelijken','Projectbriefing delen','Prioriteit support'], locked:[] },
        ].map(pl => (
          <div key={pl.id} style={{ border:`2px solid ${pl.pop?C.gold:user.plan===pl.id?C.blue:C.border}`, borderRadius:18, padding:'22px 18px', background:C.white, position:'relative' }}>
            {pl.pop && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'#78350F', fontSize:9, fontWeight:800, padding:'3px 12px', borderRadius:20, whiteSpace:'nowrap' }}>MEEST POPULAIR</div>}
            <div style={{ fontWeight:800, fontSize:15, color:C.navy, marginBottom:4 }}>{pl.l}</div>
            <div style={{ fontWeight:800, fontSize:24, color:pl.id==='plus'?C.gold:pl.id==='gratis'?C.mist:C.blue, marginBottom:14 }}>
              {pl.p===0?'Gratis':`€${pl.p}`}<span style={{ fontSize:12, fontWeight:500, color:C.mist }}>{pl.p>0?'/mnd':''}</span>
            </div>
            {pl.feats.map(f => <div key={f} style={{ fontSize:12.5, color:C.slate, marginBottom:4, display:'flex', gap:6 }}><span style={{ color:C.ok }}>✓</span>{f}</div>)}
            {pl.locked.map(f => <div key={f} style={{ fontSize:12.5, color:C.mist, marginBottom:4, display:'flex', gap:6 }}><span>—</span>{f}</div>)}
            <div style={{ marginTop:16 }}>
              {user.plan === pl.id ? (
                <div style={{ textAlign:'center', fontSize:12.5, color:C.ok, fontWeight:700 }}>✓ Huidig plan</div>
              ) : (
                <button onClick={() => doPlan(pl.id)}
                  style={{ width:'100%', border:'none', borderRadius:10, padding:10, fontSize:13, fontWeight:700, cursor:'pointer', background:pl.id==='plus'?C.gold:pl.id==='gratis'?C.sand:C.blue, color:pl.id==='plus'?'#78350F':pl.id==='gratis'?C.slate:C.white, display:'flex', alignItems:'center', gap:7, justifyContent:'center', fontFamily:'inherit' }}>
                  {load===pl.id?<Spin size={14}/>:null} {pl.id==='gratis'?'Downgrade':'Upgraden'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:20, textAlign:'center', fontSize:12, color:C.mist }}>
        🔒 Veilig betalen · Maandelijks opzegbaar · Geen verborgen kosten · Bouwvi is AVG/GDPR-conform
      </div>
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScherm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [load, setLoad] = useState(false)

  async function doLogin() {
    setLoad(true); setErr('')
    await new Promise(r=>setTimeout(r,500))
    const u = getUser(email)
    if (!u) { setErr('E-mailadres niet gevonden'); setLoad(false); return }
    if (u.password !== pw) { setErr('Verkeerd wachtwoord'); setLoad(false); return }
    onLogin(u)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:`linear-gradient(140deg,${C.navy},${C.blue})` }}>
      <div style={{ background:C.white, borderRadius:24, padding:'36px 32px', maxWidth:400, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,.25)', animation:'up .4s ease' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'center' }}><Logo size={48}/></div>
          <h1 style={{ fontWeight:800, fontSize:22, color:C.navy, margin:'16px 0 4px' }}>Welkom bij Bouwvi</h1>
          <p style={{ fontSize:13, color:C.mist }}>Bouwadvies in je broekzak</p>
        </div>

        {err && <div style={{ background:C.redSoft, border:`1px solid ${C.red}`, borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13.5, color:C.red, fontWeight:600 }}>⚠ {err}</div>}

        {[['E-mailadres','email',email,setEmail,'naam@email.nl'],['Wachtwoord','password',pw,setPw,'••••••••']].map(([l,t,v,s,ph]) => (
          <div key={l} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12.5, fontWeight:700, color:C.navy, display:'block', marginBottom:5 }}>{l}</label>
            <input type={t} value={v} onChange={e => s(e.target.value)} placeholder={ph}
              onKeyDown={e => e.key==='Enter'&&doLogin()}
              style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}
              onFocus={e => e.target.style.borderColor=C.blue}
              onBlur={e => e.target.style.borderColor=C.border}/>
          </div>
        ))}

        <button onClick={doLogin} style={{ width:'100%', border:'none', borderRadius:11, padding:13, fontWeight:700, fontSize:15, cursor:'pointer', background:C.blue, color:C.white, display:'flex', alignItems:'center', gap:8, justifyContent:'center', fontFamily:'inherit', marginBottom:20 }}>
          {load?<Spin/>:null} {load?'Inloggen...':'Inloggen →'}
        </button>

        {/* Demo accounts */}
        <div style={{ padding:14, background:C.off, borderRadius:12, border:`1px solid ${C.border}` }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.mist, letterSpacing:.8, textTransform:'uppercase', marginBottom:10 }}>Demo testaccounts · wachtwoord: Test123!</p>
          {[
            ['testfree@bouwvi.nl','Gratis','gray'],
            ['testpremium@bouwvi.nl','Premium','blue'],
            ['testplus@bouwvi.nl','Premium Plus','gold'],
          ].map(([e,l,v]) => (
            <button key={e} onClick={() => { setEmail(e); setPw('Test123!') }}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 10px', marginBottom:5, cursor:'pointer', fontFamily:'inherit', transition:'border-color .15s' }}
              onMouseEnter={el => el.currentTarget.style.borderColor=C.blue}
              onMouseLeave={el => el.currentTarget.style.borderColor=C.border}>
              <span style={{ fontSize:12, color:C.slate }}>{e}</span>
              <Badge label={l} col={v}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScherm({ user, setTab, goUpgrade }) {
  const projs = getProjs(user.id)
  const pc = user.plan==='plus'?C.gold : user.plan==='premium'?C.blue : C.mist

  const MODULES = [
    { icon:'📚', t:'Kennisbibliotheek', s:'12 cat. · altijd gratis', tab:'bibliotheek', vrij:true },
    { icon:'🏗️', t:'Mijn Projecten', s:user.plan!=='gratis'?`${projs.length} actief project`:'Premium feature', tab:user.plan!=='gratis'?'projecten':'upgrade', slot:user.plan!=='gratis' },
    { icon:'✏️', t:'Teken & Plan', s:user.plan!=='gratis'?'Ruimte tekenen + AI analyse':'Premium feature', tab:'tekenen', slot:user.plan!=='gratis' },
    { icon:'🧱', t:'Materialen', s:'Koopadvies per klus', tab:'materialen', vrij:true },
    { icon:'🤝', t:'Vakmannen', s:'Partners bij jou in buurt', tab:'partners', vrij:true },
    { icon:'👤', t:'Account', s:'Profiel & abonnement', tab:'account', vrij:true },
  ]

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px 60px', animation:'up .3s ease' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:'32px 28px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>
        <div>
          <Badge label={user.plan==='plus'?'⭐ PREMIUM PLUS':user.plan==='premium'?'⭐ PREMIUM':'GRATIS'} col={user.plan==='plus'?'gold':user.plan==='premium'?'premium':'gray'}/>
          <h1 style={{ fontWeight:800, fontSize:'clamp(20px,3vw,28px)', color:C.white, margin:'10px 0 6px' }}>Hoi {user.naam.split(' ')[0]}! 👋</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', margin:0 }}>Bouwadvies in je broekzak</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <Btn label="📚 Bibliotheek" onClick={() => setTab('bibliotheek')} col="ghost" style={{ fontSize:13 }}/>
          {user.plan !== 'gratis'
            ? <Btn label="🏗️ Mijn projecten" onClick={() => setTab('projecten')} style={{ fontSize:13 }}/>
            : <Btn label="⭐ Upgrade naar Premium" onClick={goUpgrade} col="red" style={{ fontSize:13 }}/>
          }
        </div>
      </div>

      {/* Modules grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:12 }}>
        {MODULES.map(m => (
          <button key={m.t} onClick={() => setTab(m.tab)}
            style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:18, textAlign:'left', cursor:'pointer', transition:'all .18s', position:'relative', fontFamily:'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(15,45,107,.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
            {!m.vrij && !m.slot && <div style={{ position:'absolute', top:10, right:10, fontSize:14 }}>🔒</div>}
            <div style={{ fontSize:28, marginBottom:8 }}>{m.icon}</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:3 }}>{m.t}</div>
            <div style={{ fontSize:12, color:C.mist }}>{m.s}</div>
          </button>
        ))}
      </div>

      {/* Populaire onderwerpen */}
      <div style={{ marginTop:28 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.mist, letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>🔥 Populaire onderwerpen</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {['Draagmuur weghalen','Badkamer verbouwen','Dakkapel vergunning','Vloerverwarming aanleggen','Spouwmuurisolatie','Laminaat leggen','Elektra regels','Offerte aanvragen'].map(t => (
            <button key={t} onClick={() => setTab('bibliotheek')}
              style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:'7px 14px', fontSize:13, color:C.navy, fontWeight:600, cursor:'pointer', transition:'all .15s', fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.background=C.blueSoft }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.white }}>
              {t}
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
  const topRef = useRef(null)

  useEffect(() => {
    setReady(true)
    try {
      const s = sessionStorage.getItem('bv_session')
      if (s) { const u = getUserById(JSON.parse(s).id); if (u) setUser(u) }
    } catch {}
  }, [])

  useEffect(() => { topRef.current?.scrollIntoView({ behavior:'smooth' }) }, [tab])

  function login(u) { sessionStorage.setItem('bv_session', JSON.stringify({ id:u.id })); setUser(u); setTab('home') }
  function logout() { sessionStorage.removeItem('bv_session'); setUser(null); setTab('home') }
  function upgrade(plan) {
    const updated = { ...user, plan }
    setUser(updated)
    try { const s = JSON.parse(sessionStorage.getItem('bv_session')||'{}'); sessionStorage.setItem('bv_session', JSON.stringify({...s, plan})) } catch {}
    setTab('account')
  }
  const goUpgrade = () => setTab('upgrade')

  if (!ready) return null
  if (!user) return <LoginScherm onLogin={login}/>

  const pc = user.plan==='plus'?C.gold : user.plan==='premium'?C.blue : C.mist
  const NAV_TABS = [
    { id:'home', l:'🏠 Home' },
    { id:'bibliotheek', l:'📚 Bibliotheek' },
    { id:'projecten', l:'🏗️ Projecten' },
    { id:'tekenen', l:'✏️ Tekenen' },
    { id:'materialen', l:'🧱 Materialen' },
    { id:'partners', l:'🤝 Vakmannen' },
    { id:'account', l:'👤 Account' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.off }}>
      <Head><title>Bouwvi — Bouwadvies in je broekzak</title></Head>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ background:C.white, borderBottom:`3px solid ${C.navy}`, position:'sticky', top:0, zIndex:200, boxShadow:'0 2px 12px rgba(15,45,107,.08)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', gap:4, height:58 }}>
          <button onClick={() => setTab('home')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0, marginRight:8 }}>
            <Logo size={34}/>
          </button>
          <div style={{ display:'flex', gap:1, overflowX:'auto', flex:1 }}>
            {NAV_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ background:tab===t.id?C.blueSoft:'none', border:`1px solid ${tab===t.id?C.blueL:'transparent'}`, color:tab===t.id?C.blue:C.slate, borderRadius:8, padding:'6px 10px', fontSize:12, cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', transition:'all .18s', fontFamily:'inherit' }}>
                {t.l}
                {(t.id==='projecten'||t.id==='tekenen') && user.plan==='gratis' && <span style={{ fontSize:9, marginLeft:3 }}>🔒</span>}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, marginLeft:8 }}>
            {user.plan === 'gratis' && <Btn label="⭐ Upgrade" onClick={goUpgrade} col="red" style={{ fontSize:12, padding:'7px 12px' }}/>}
            <div onClick={() => setTab('account')} style={{ width:34, height:34, borderRadius:10, background:pc, display:'flex', alignItems:'center', justifyContent:'center', color:user.plan==='plus'?'#78350F':C.white, fontWeight:800, fontSize:15, cursor:'pointer', flexShrink:0 }}>
              {user.avatar}
            </div>
          </div>
        </div>
      </nav>

      <div ref={topRef}/>

      {/* MODULES */}
      {tab === 'home' && <HomeScherm user={user} setTab={setTab} goUpgrade={goUpgrade}/>}
      {tab === 'bibliotheek' && <Bibliotheek user={user} goUpgrade={goUpgrade}/>}
      {tab === 'projecten' && <ProjectenModule user={user} goUpgrade={goUpgrade}/>}
      {tab === 'tekenen' && <TekenModule user={user} goUpgrade={goUpgrade}/>}
      {tab === 'materialen' && <MaterialenModule/>}
      {tab === 'partners' && <PartnersModule user={user}/>}
      {tab === 'account' && <AccountModule user={user} goUpgrade={goUpgrade} onLogout={logout}/>}
      {tab === 'upgrade' && <UpgradeScherm user={user} onUpgrade={upgrade}/>}

      {/* FOOTER */}
      <div style={{ background:C.navy, padding:'20px 24px', textAlign:'center', marginTop:40 }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}><Logo size={26} dark={true}/></div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', margin:0 }}>
          ⚠️ Demo versie · Bouwvi geeft algemeen advies · Schakel professionals in voor constructie, elektra en loodgieterwerk
        </p>
      </div>
    </div>
  )
}
