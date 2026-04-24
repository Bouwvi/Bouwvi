import { useState, useEffect } from 'react'
import Head from 'next/head'

const USERS = [
  { id:'free_001', naam:'Gratis Gebruiker', email:'testfree@bouwvi.nl', password:'Test123!', plan:'gratis', avatar:'G', lid_sinds:'januari 2025' },
  { id:'prem_001', naam:'Premium Gebruiker', email:'testpremium@bouwvi.nl', password:'Test123!', plan:'premium', avatar:'P', lid_sinds:'februari 2025', sub:{ verlengt:'1 juni 2025', prijs:'19,99', methode:'iDEAL' } },
  { id:'plus_001', naam:'Plus Gebruiker', email:'testplus@bouwvi.nl', password:'Test123!', plan:'plus', avatar:'+', lid_sinds:'januari 2025', sub:{ verlengt:'1 juni 2025', prijs:'29,99', methode:'iDEAL' } },
]
const PROJECTEN = [
  { id:'p1', uid:'prem_001', naam:'Badkamer verdieping', type:'badkamer', icon:'🚿', kleur:'#1F618D', voortgang:35, datum:'12 mrt 2025', bouwjaar:'1987 (voor 1993)', afm:'2.4×3.2m', budget:'8.000–12.000', wens:'Inloopdouche, zweeftoilet, dubbele wastafel. Zwarte kranen, grote tegels 60×120, vloerverwarming.' },
  { id:'p2', uid:'plus_001', naam:'Keuken renovatie', type:'keuken', icon:'🍳', kleur:'#922B21', voortgang:60, datum:'5 mrt 2025', bouwjaar:'2003 (na 1993)', afm:'4.5×3.0m', budget:'15.000–22.000', wens:'Eilandkeuken, inductie, quooker, composiet werkblad, gietvloer.' },
  { id:'p3', uid:'plus_001', naam:'Dakkapel slaapkamer', type:'dakkapel', icon:'🪟', kleur:'#1B4F72', voortgang:15, datum:'20 mrt 2025', bouwjaar:'2003 (na 1993)', afm:'3.0×1.2m', budget:'8.000–14.000', wens:'Dakkapel achterzijde voor meer ruimte, twee openslaande deuren.' },
]
const FACTUREN = [
  { id:'f1', uid:'prem_001', datum:'1 apr 2025', bedrag:'19,99', nr:'BV-2025-041' },
  { id:'f2', uid:'prem_001', datum:'1 mrt 2025', bedrag:'19,99', nr:'BV-2025-031' },
  { id:'f3', uid:'plus_001', datum:'1 apr 2025', bedrag:'29,99', nr:'BV-2025-042' },
]

const N='#0F2D6B', BL='#1A4599', RD='#E8304A', WH='#FFFFFF'
const GR='#7A8FB5', BD='#D8E0F5', OF='#F5F7FF', SD='#EEF1FA'
const OK='#1E8449', GD='#F59E0B'

function getUser(email) { return USERS.find(u=>u.email.toLowerCase()===email.toLowerCase())||null }
function getUserById(id) { return USERS.find(u=>u.id===id)||null }
function getProjs(uid) { return PROJECTEN.filter(p=>p.uid===uid) }
function getFacts(uid) { return FACTUREN.filter(f=>f.uid===uid) }

function Logo({ size=36, dark=false }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:size*.28 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill={N}/>
        <text x="50" y="82" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="88" fill={RD} textAnchor="middle">B</text>
      </svg>
      <span style={{ fontWeight:800, fontSize:size*.58, color:dark?WH:N, letterSpacing:'-.5px', lineHeight:1 }}>bouwvi</span>
    </div>
  )
}

function Btn({ label, onClick, col, full, style }) {
  const bg=col==='red'?RD:col==='ok'?OK:col==='gold'?GD:col==='ghost'?SD:BL
  const fg=col==='gold'?'#78350F':WH
  return (
    <button onClick={onClick} style={{ border:'none', borderRadius:11, padding:'10px 18px', fontWeight:700, fontSize:14, cursor:'pointer', background:bg, color:fg, width:full?'100%':undefined, display:'inline-flex', alignItems:'center', gap:7, justifyContent:'center', fontFamily:'inherit', ...style }}
      onMouseEnter={e=>e.currentTarget.style.opacity='.82'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
      {label}
    </button>
  )
}

function Card({ children, style }) {
  return <div style={{ background:WH, borderRadius:16, padding:20, border:'1px solid '+BD, boxShadow:'0 2px 12px rgba(15,45,107,.06)', ...style }}>{children}</div>
}

function Badge({ label, col='blue' }) {
  const m={ blue:{bg:'#E8EFFE',c:BL,b:'#D0DCFA'}, red:{bg:'#FDEAED',c:RD,b:'#F4A0AE'}, ok:{bg:'#E8F5E9',c:OK,b:'#A5D6A7'}, gold:{bg:'#FEF3C7',c:'#92400E',b:'#FCD34D'}, gray:{bg:SD,c:GR,b:BD}, prem:{bg:RD,c:WH,b:RD} }
  const s=m[col]||m.blue
  return <span style={{ background:s.bg, color:s.c, border:'1px solid '+s.b, fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:20, letterSpacing:.7, whiteSpace:'nowrap' }}>{label}</span>
}

function Bar({ val, color=BL }) {
  return <div style={{ background:SD, borderRadius:8, height:6, overflow:'hidden' }}><div style={{ width:val+'%', height:'100%', background:color, borderRadius:8 }}/></div>
}

function Spin() { return <span style={{ width:15, height:15, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }}/> }

function Txt({ t, ac=BL }) {
  return (
    <div style={{ fontSize:14, lineHeight:1.8, color:'#0A0F1E' }}>
      {t.split('\n').map((line,i)=>{
        if(!line.trim()) return <div key={i} style={{height:6}}/>
        const bull=/^[-•]\s/.test(line)
        const raw=line.replace(/^[-•]\s/,'')
        const parts=raw.split(/\*\*(.*?)\*\*/g)
        const ren=parts.map((p,j)=>j%2===1?<strong key={j}>{p}</strong>:p)
        if(bull) return <div key={i} style={{display:'flex',gap:8,marginBottom:5,alignItems:'flex-start'}}><div style={{width:6,height:6,borderRadius:'50%',background:ac,marginTop:9,flexShrink:0}}/><span>{ren}</span></div>
        return <p key={i} style={{margin:'0 0 5px'}}>{ren}</p>
      })}
    </div>
  )
}

async function ai(prompt, ctx='') {
  try {
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,system:'Je bent Bouwvi, een Nederlandse bouwadviseur. '+ctx+' Geef praktisch advies in helder Nederlands. Gebruik **vet** voor kopjes en - voor lijstjes. Max 200 woorden.',messages:[{role:'user',content:prompt}]})})
    const d=await r.json()
    return d.content?.[0]?.text||'Er ging iets mis.'
  } catch { return 'Verbindingsfout.' }
}

const CATS=[
  {id:'constructie',icon:'🏗️',label:'Constructie & Ruwbouw',k:'#1A3A6B',subs:['Fundering','Draagmuren','Binnenmuren','Vloerconstructies','Balklagen','Betonwerk']},
  {id:'dak',icon:'🏠',label:'Dak & Gevel',k:'#1B5E4B',subs:['Hellend dak','Plat dak','Dakbedekking','Dakisolatie','Dakkapel','Dakgoten']},
  {id:'kozijnen',icon:'🪟',label:'Kozijnen & Deuren',k:'#4A235A',subs:['Buitenkozijnen','Ramen','Voordeuren','Schuifpuien','Binnendeuren','Glas']},
  {id:'installaties',icon:'⚡',label:'Installaties',k:'#7D6608',subs:['Elektra','Meterkast','Waterleiding','Afvoer','Vloerverwarming','Warmtepomp','Zonnepanelen']},
  {id:'vloeren',icon:'🪵',label:'Vloeren & Wanden',k:'#7A5210',subs:['Tegelwerk','PVC','Laminaat','Parket','Gietvloer','Egaliseren']},
  {id:'ruimtes',icon:'🚿',label:'Ruimtes',k:'#1F618D',subs:['Badkamer','Toilet','Keuken','Slaapkamer','Zolder','Kelder']},
  {id:'isolatie',icon:'🌡️',label:'Isolatie & Duurzaamheid',k:'#1E7A40',subs:['Spouwmuurisolatie','Dakisolatie','Vloerisolatie','HR++ glas','Energiebesparing']},
  {id:'kosten',icon:'💰',label:'Kosten & Planning',k:'#1A5276',subs:['Kostenindicaties','Offertes vergelijken','Verbouwbudget','Planning maken']},
  {id:'problemen',icon:'🔍',label:'Problemen & Schade',k:RD,subs:['Lekkage','Scheuren','Vocht','Schimmel','Verzakkingen','Tocht']},
]

function Bibliotheek({ user, goUp }) {
  const [cat,setCat]=useState(null)
  const [sub,setSub]=useState(null)
  const [antw,setAntw]=useState('')
  const [loadA,setLoadA]=useState(false)
  const [fIn,setFIn]=useState('')
  const [fups,setFups]=useState([])
  const [loadF,setLoadF]=useState(false)
  const c=CATS.find(x=>x.id===cat)

  async function openSub(s){setSub(s);setAntw('');setFups([]);setLoadA(true);const t=await ai('Geef praktisch advies over "'+s+'" voor particulieren die willen verbouwen. Wat is het, wat kost het, zelf doen of professional?');setAntw(t);setLoadA(false)}
  async function sendF(){if(!fIn.trim()||loadF)return;const v=fIn.trim();setFIn('');setLoadF(true);const t=await ai('Vervolgvraag over '+sub+': '+v);setFups(p=>[...p,{v,a:t}]);setLoadF(false)}

  if(!cat) return(
    <div style={{maxWidth:780,margin:'0 auto',padding:'28px 20px 60px'}}>
      <div style={{background:'linear-gradient(135deg,'+N+','+BL+')',borderRadius:20,padding:'28px 24px',marginBottom:24,textAlign:'center'}}>
        <h2 style={{fontWeight:800,fontSize:22,color:WH,margin:'0 0 8px'}}>📚 Kennisbibliotheek</h2>
        <p style={{fontSize:14,color:'rgba(255,255,255,.7)',margin:0}}>Alles over verbouwen · altijd gratis</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:10}}>
        {CATS.map(ct=>(
          <button key={ct.id} onClick={()=>{setCat(ct.id);setSub(null)}}
            style={{background:WH,border:'1.5px solid '+BD,borderRadius:13,padding:'16px 12px',textAlign:'center',cursor:'pointer',transition:'all .18s',fontFamily:'inherit'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ct.k;e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{fontSize:26,marginBottom:8}}>{ct.icon}</div>
            <div style={{fontSize:12.5,fontWeight:700,color:'#0A0F1E',lineHeight:1.3}}>{ct.label}</div>
            <div style={{marginTop:7,width:20,height:3,background:ct.k,borderRadius:2,margin:'7px auto 0'}}/>
          </button>
        ))}
      </div>
    </div>
  )

  if(!sub&&c) return(
    <div style={{maxWidth:680,margin:'0 auto',padding:'28px 20px 60px'}}>
      <button onClick={()=>setCat(null)} style={{background:'none',border:'none',color:GR,cursor:'pointer',fontSize:13,fontWeight:600,marginBottom:20,fontFamily:'inherit'}}>← Alle categorieën</button>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
        <div style={{width:52,height:52,background:c.k,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>{c.icon}</div>
        <div><h2 style={{fontWeight:800,fontSize:20,color:N,margin:0}}>{c.label}</h2><p style={{fontSize:13,color:GR,margin:'3px 0 0'}}>Kies een onderwerp</p></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {c.subs.map(s=>(
          <button key={s} onClick={()=>openSub(s)}
            style={{background:WH,border:'1.5px solid '+BD,borderRadius:12,padding:'14px 17px',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,transition:'all .18s',fontFamily:'inherit'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c.k;e.currentTarget.style.transform='translateX(4px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.transform='translateX(0)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:7,height:7,borderRadius:'50%',background:c.k,flexShrink:0}}/><span style={{fontSize:14,color:'#0A0F1E',fontWeight:600}}>{s}</span></div>
            <span style={{color:c.k,fontSize:16}}>→</span>
          </button>
        ))}
      </div>
    </div>
  )

  return(
    <div style={{maxWidth:700,margin:'0 auto',padding:'28px 20px 60px'}}>
      <button onClick={()=>{setSub(null);setAntw('');setFups([])}} style={{background:'none',border:'none',color:GR,cursor:'pointer',fontSize:13,fontWeight:600,marginBottom:18,fontFamily:'inherit'}}>← {c.label}</button>
      <div style={{background:c.k,borderRadius:13,padding:'14px 18px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
        <span style={{fontSize:22}}>{c.icon}</span>
        <div><div style={{color:'rgba(255,255,255,.6)',fontSize:11,marginBottom:2}}>{c.label}</div><div style={{color:WH,fontSize:15,fontWeight:700}}>{sub}</div></div>
      </div>
      <Card style={{marginBottom:14,minHeight:80}}>
        {loadA?<div style={{display:'flex',alignItems:'center',gap:10,color:GR,fontSize:14}}><Spin/> Bouwvi zoekt het op...</div>:<Txt t={antw} ac={c.k}/>}
      </Card>
      {fups.map((f,i)=>(
        <div key={i} style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}><div style={{background:c.k,color:WH,borderRadius:'12px 12px 4px 12px',padding:'9px 14px',fontSize:13.5,maxWidth:'85%'}}>{f.v}</div></div>
          <Card style={{borderTopLeftRadius:4}}><Txt t={f.a} ac={c.k}/></Card>
        </div>
      ))}
      {!loadA&&antw&&(
        <div style={{marginTop:14}}>
          <div style={{display:'flex',gap:9}}>
            <textarea value={fIn} onChange={e=>setFIn(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendF()}}} placeholder="Stel een vervolgvraag..." rows={1}
              style={{flex:1,border:'1.5px solid '+BD,borderRadius:10,padding:'10px 13px',fontSize:13.5,resize:'none',outline:'none',minHeight:44,maxHeight:100,fontFamily:'inherit'}}/>
            <button onClick={sendF} disabled={loadF||!fIn.trim()} style={{width:44,height:44,background:loadF||!fIn.trim()?'#CCC':c.k,border:'none',borderRadius:10,color:WH,fontSize:17,cursor:'pointer',flexShrink:0}}>{loadF?'…':'➤'}</button>
          </div>
          {user.plan==='gratis'&&(
            <div style={{marginTop:18,background:'linear-gradient(135deg,'+N+','+BL+')',borderRadius:14,padding:'16px 18px',border:'1.5px solid '+RD,display:'flex',alignItems:'center',justifyContent:'space-between',gap:14,flexWrap:'wrap'}}>
              <div><div style={{fontWeight:700,fontSize:14,color:WH,marginBottom:3}}>🚀 Eigen verbouwproject?</div><div style={{fontSize:12.5,color:'rgba(255,255,255,.65)'}}>Persoonlijk AI advies op basis van jouw situatie</div></div>
              <Btn label="Upgrade →" onClick={goUp} col="red" style={{flexShrink:0,fontSize:13,padding:'9px 16px'}}/>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Projecten({ user, goUp }) {
  const [ap,setAp]=useState(null)
  const [tab,setTab]=useState('analyse')
  const [analyse,setAnalyse]=useState('')
  const [loadA,setLoadA]=useState(false)
  const [cin,setCin]=useState('')
  const [msgs,setMsgs]=useState([])
  const [loadC,setLoadC]=useState(false)
  const projs=getProjs(user.id)

  if(user.plan==='gratis') return(
    <div style={{maxWidth:600,margin:'0 auto',padding:'60px 20px',textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:16}}>🔒</div>
      <h2 style={{fontWeight:800,fontSize:22,color:N,margin:'0 0 10px'}}>Premium functie</h2>
      <p style={{fontSize:14,color:GR,lineHeight:1.65,margin:'0 0 24px'}}>Maak je eigen verbouwproject aan en krijg een persoonlijke AI bouwcoach, kostenoverzicht en planning.</p>
      <Btn label="⭐ Upgrade naar Premium — €19,99/mnd" onClick={goUp} col="red" style={{fontSize:15,padding:'13px 28px'}}/>
    </div>
  )

  async function open(p){
    setAp(p);setTab('analyse');setAnalyse('');setLoadA(true)
    setMsgs([{r:'bot',t:'Hoi! Ik ben je Bouwvi coach voor '+p.naam+'. Vraag me alles! 💪'}])
    const txt=await ai('Bouwanalyse voor "'+p.naam+'". Bouwjaar: '+p.bouwjaar+'. Afm: '+p.afm+'. Budget: €'+p.budget+'. Wens: '+p.wens+'. Geef: **Aandachtspunten**, **Volgorde werkzaamheden** (genummerd), **Kostenindicatie** (budget/gemiddeld/premium), **Zelf doen vs professional**.','Persoonlijk verbouwproject.')
    setAnalyse(txt);setLoadA(false)
  }

  async function sendC(){if(!cin.trim()||loadC)return;const v=cin.trim();setCin('');setLoadC(true);setMsgs(p=>[...p,{r:'user',t:v}]);const txt=await ai(v,ap?'Project: '+ap.naam+'. Budget: €'+ap.budget+'. '+ap.wens:'');setMsgs(p=>[...p,{r:'bot',t:txt}]);setLoadC(false)}

  if(ap) return(
    <div style={{maxWidth:760,margin:'0 auto',padding:'0 20px 60px'}}>
      <button onClick={()=>setAp(null)} style={{background:'none',border:'none',color:GR,cursor:'pointer',fontSize:13,fontWeight:600,padding:'20px 0 16px',display:'block',fontFamily:'inherit'}}>← Mijn projecten</button>
      <div style={{background:'linear-gradient(135deg,'+ap.kleur+','+ap.kleur+'CC)',borderRadius:18,padding:22,marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
          <span style={{fontSize:40}}>{ap.icon}</span>
          <div style={{flex:1}}><Badge label="PREMIUM PROJECT" col="prem"/><h2 style={{fontWeight:800,fontSize:20,color:WH,margin:'6px 0 4px'}}>{ap.naam}</h2><div style={{fontSize:12,color:'rgba(255,255,255,.65)'}}>{ap.bouwjaar} · {ap.afm} · €{ap.budget}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontWeight:800,fontSize:24,color:WH}}>{ap.voortgang}%</div><div style={{fontSize:11,color:'rgba(255,255,255,.55)'}}>voortgang</div></div>
        </div>
        <div style={{marginTop:12}}><Bar val={ap.voortgang} color="rgba(255,255,255,.6)"/></div>
      </div>
      <div style={{display:'flex',gap:4,background:SD,padding:4,borderRadius:12,marginBottom:18}}>
        {[['analyse','📊 Analyse'],['coach','💬 Coach'],['wensen','✨ Wensen']].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,border:'none',borderRadius:9,padding:'9px 6px',fontSize:12,fontWeight:700,cursor:'pointer',background:tab===id?WH:'transparent',color:tab===id?N:GR,boxShadow:tab===id?'0 1px 4px rgba(15,45,107,.1)':'none',fontFamily:'inherit'}}>{l}</button>
        ))}
      </div>
      <Card>
        {tab==='analyse'&&(loadA?<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,padding:'24px 0',color:GR}}><Spin/><div style={{fontSize:14}}>Analyseren...</div></div>:<Txt t={analyse} ac={ap.kleur}/>)}
        {tab==='coach'&&(
          <div>
            <div style={{display:'flex',flexDirection:'column',gap:10,minHeight:260,maxHeight:380,overflowY:'auto',marginBottom:12}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',gap:8,flexDirection:m.r==='user'?'row-reverse':'row'}}>
                  <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:m.r==='user'?'#3A4A6B':ap.kleur,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{m.r==='user'?'👤':'🏗️'}</div>
                  <div style={{maxWidth:'80%',padding:'10px 14px',borderRadius:12,fontSize:13.5,background:m.r==='user'?BL:OF,color:m.r==='user'?WH:'#0A0F1E',borderBottomLeftRadius:m.r==='bot'?4:12,borderBottomRightRadius:m.r==='user'?4:12}}>
                    {m.r==='bot'?<Txt t={m.t} ac={ap.kleur}/>:m.t}
                  </div>
                </div>
              ))}
              {loadC&&<div style={{display:'flex',gap:8}}><div style={{width:30,height:30,borderRadius:8,background:ap.kleur,display:'flex',alignItems:'center',justifyContent:'center'}}>🏗️</div><div style={{background:OF,borderRadius:'12px 12px 12px 4px',padding:'12px 14px',display:'flex',gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:GR,animation:'blink 1.2s ease '+(i*.2)+'s infinite'}}/>)}</div></div>}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
              {['Kan ik de muur weghalen?','Wat kost tegelwerk?','Heb ik een vergunning nodig?','Maak een planning'].map(q=>(
                <button key={q} onClick={()=>setCin(q)} style={{background:OF,border:'1px solid '+BD,borderRadius:20,padding:'5px 11px',fontSize:12,color:N,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{q}</button>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <textarea value={cin} onChange={e=>setCin(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendC()}}} placeholder="Stel een vraag..." rows={1}
                style={{flex:1,border:'1.5px solid '+BD,borderRadius:10,padding:'10px 12px',fontSize:13.5,resize:'none',outline:'none',minHeight:44,maxHeight:100,fontFamily:'inherit'}}/>
              <button onClick={sendC} disabled={loadC||!cin.trim()} style={{width:44,height:44,background:loadC||!cin.trim()?'#CCC':ap.kleur,border:'none',borderRadius:9,color:WH,fontSize:17,cursor:'pointer',flexShrink:0}}>{loadC?'…':'➤'}</button>
            </div>
          </div>
        )}
        {tab==='wensen'&&(
          <div>
            {[['Project',ap.naam],['Bouwjaar',ap.bouwjaar],['Afmetingen',ap.afm],['Budget','€'+ap.budget]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid '+BD,fontSize:13.5}}><span style={{color:GR}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{marginTop:14,padding:12,background:OF,borderRadius:10}}><div style={{fontSize:12,fontWeight:700,color:GR,marginBottom:6}}>Wensen</div><div style={{fontSize:13.5,lineHeight:1.65}}>{ap.wens}</div></div>
          </div>
        )}
      </Card>
    </div>
  )

  return(
    <div style={{maxWidth:760,margin:'0 auto',padding:'28px 20px 60px'}}>
      <h2 style={{fontWeight:800,fontSize:22,color:N,margin:'0 0 4px'}}>Mijn projecten</h2>
      <p style={{fontSize:13,color:GR,margin:'0 0 20px'}}>{projs.length} actief · max {user.plan==='plus'?3:1}</p>
      {projs.length===0?<Card style={{textAlign:'center',padding:'40px 24px'}}><div style={{fontSize:48,marginBottom:14}}>🏗️</div><p style={{fontSize:14,color:GR}}>Geen projecten voor dit account.</p></Card>:(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {projs.map(p=>(
            <button key={p.id} onClick={()=>open(p)}
              style={{background:WH,border:'1.5px solid '+BD,borderRadius:16,padding:'18px 20px',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:16,transition:'all .18s',fontFamily:'inherit'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=p.kleur;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(15,45,107,.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
              <div style={{width:52,height:52,background:p.kleur,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{p.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,color:'#0A0F1E',marginBottom:3}}>{p.naam}</div>
                <div style={{fontSize:12,color:GR,marginBottom:8}}>{p.datum} · {p.afm}</div>
                <Bar val={p.voortgang} color={p.kleur}/>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}><div style={{fontWeight:800,fontSize:18,color:p.kleur}}>{p.voortgang}%</div><div style={{fontSize:11,color:GR}}>voortgang</div></div>
              <span style={{color:p.kleur,fontSize:20}}>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Account({ user, goUp, onOut }) {
  const [tab,setTab]=useState('profiel')
  const facts=getFacts(user.id)
  const planL={gratis:'Gratis',premium:'Premium',plus:'Premium Plus'}[user.plan]
  const planP={gratis:0,premium:19.99,plus:29.99}[user.plan]
  const pc=user.plan==='plus'?GD:user.plan==='premium'?BL:GR
  return(
    <div style={{maxWidth:680,margin:'0 auto',padding:'28px 20px 60px'}}>
      <div style={{background:'linear-gradient(135deg,'+N+','+BL+')',borderRadius:20,padding:22,marginBottom:18,display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:56,height:56,background:pc,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:WH,fontWeight:800,flexShrink:0}}>{user.avatar}</div>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:17,color:WH}}>{user.naam}</div><div style={{fontSize:13,color:'rgba(255,255,255,.65)',marginTop:2}}>{user.email}</div><div style={{marginTop:6}}><Badge label={planL.toUpperCase()} col={user.plan==='plus'?'gold':user.plan==='premium'?'blue':'gray'}/></div></div>
        <button onClick={onOut} style={{background:'rgba(255,255,255,.12)',border:'none',color:WH,borderRadius:8,padding:'7px 12px',fontSize:12.5,cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>Uitloggen</button>
      </div>
      <div style={{display:'flex',gap:4,background:SD,padding:4,borderRadius:12,marginBottom:18}}>
        {[['profiel','👤 Profiel'],['abo','💳 Abonnement'],['facts','🧾 Facturen']].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,border:'none',borderRadius:9,padding:'9px 6px',fontSize:12,fontWeight:700,cursor:'pointer',background:tab===id?WH:'transparent',color:tab===id?N:GR,fontFamily:'inherit'}}>{l}</button>
        ))}
      </div>
      {tab==='profiel'&&<Card>{[['Naam',user.naam],['E-mail',user.email],['Lid sinds',user.lid_sinds],['Plan',planL]].map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid '+BD,fontSize:13.5}}><span style={{color:GR}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>)}<div style={{marginTop:14,padding:'10px 14px',background:'#E8EFFE',borderRadius:10,fontSize:12.5,color:BL}}>🔒 Demo account.</div></Card>}
      {tab==='abo'&&<div><Card style={{marginBottom:14}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}><div><div style={{fontSize:11,fontWeight:700,color:GR,marginBottom:4}}>HUIDIG PLAN</div><div style={{fontWeight:800,fontSize:20,color:N}}>{planL}</div>{user.sub&&<div style={{fontSize:13,color:GR,marginTop:3}}>Verlengt {user.sub.verlengt} · {user.sub.methode}</div>}</div>{planP>0&&<div style={{textAlign:'right'}}><div style={{fontWeight:800,fontSize:26,color:pc}}>€{planP}</div><div style={{fontSize:11,color:GR}}>per maand</div></div>}</div>{user.plan==='gratis'&&<Btn label="⭐ Upgrade →" onClick={goUp} style={{width:'100%',fontSize:14}}/>}{user.plan==='premium'&&<Btn label="⭐ Upgrade naar Plus" onClick={goUp} col="gold" style={{fontSize:13}}/>}</Card><div style={{padding:'10px 14px',background:SD,borderRadius:10,fontSize:12,color:GR,textAlign:'center'}}>Demo: betalingen via Mollie in productie</div></div>}
      {tab==='facts'&&<Card><div style={{fontWeight:700,fontSize:14,color:N,marginBottom:14}}>Betalingsgeschiedenis</div>{facts.length===0?<div style={{textAlign:'center',padding:'20px 0',color:GR,fontSize:14}}>Geen facturen.</div>:facts.map(f=><div key={f.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid '+BD}}><div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{fontSize:20}}>🧾</span><div><div style={{fontWeight:700,fontSize:13.5}}>Bouwvi {planL}</div><div style={{fontSize:12,color:GR}}>{f.datum} · {f.nr}</div></div></div><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontWeight:800,fontSize:15}}>€{f.bedrag}</span><Badge label="Betaald" col="ok"/></div></div>)}</Card>}
    </div>
  )
}

function Upgrade({ user, onUp }) {
  const [load,setLoad]=useState(null)
  async function doPlan(p){setLoad(p);await new Promise(r=>setTimeout(r,1200));setLoad(null);onUp(p)}
  return(
    <div style={{maxWidth:680,margin:'0 auto',padding:'40px 20px 60px'}}>
      <div style={{textAlign:'center',marginBottom:32}}><h2 style={{fontWeight:800,fontSize:26,color:N,margin:'0 0 8px'}}>Kies jouw plan</h2><p style={{fontSize:14,color:GR}}>Maandelijks opzegbaar · iDEAL · geen verborgen kosten</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {[
          {id:'gratis',l:'Gratis',p:0,feats:['Kennisbibliotheek','AI vragen stellen'],locked:['Eigen projecten','AI coach']},
          {id:'premium',l:'Premium',p:19.99,feats:['1 actief project','Persoonlijke AI coach','Tekenmodule','Kostenoverzicht'],locked:['Meerdere projecten']},
          {id:'plus',l:'Premium Plus',p:29.99,pop:true,feats:['3 actieve projecten','Alles van Premium','PDF rapport','Offertes vergelijken'],locked:[]},
        ].map(pl=>(
          <div key={pl.id} style={{border:'2px solid '+(pl.pop?GD:user.plan===pl.id?BL:BD),borderRadius:18,padding:'22px 18px',background:WH,position:'relative'}}>
            {pl.pop&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:GD,color:'#78350F',fontSize:9,fontWeight:800,padding:'3px 12px',borderRadius:20,whiteSpace:'nowrap'}}>MEEST POPULAIR</div>}
            <div style={{fontWeight:800,fontSize:15,color:N,marginBottom:4}}>{pl.l}</div>
            <div style={{fontWeight:800,fontSize:24,color:pl.id==='plus'?GD:pl.id==='gratis'?GR:BL,marginBottom:14}}>{pl.p===0?'Gratis':'€'+pl.p}<span style={{fontSize:12,fontWeight:500,color:GR}}>{pl.p>0?'/mnd':''}</span></div>
            {pl.feats.map(f=><div key={f} style={{fontSize:12.5,color:'#3A4A6B',marginBottom:4,display:'flex',gap:6}}><span style={{color:OK}}>✓</span>{f}</div>)}
            {pl.locked.map(f=><div key={f} style={{fontSize:12.5,color:GR,marginBottom:4,display:'flex',gap:6}}><span>—</span>{f}</div>)}
            <div style={{marginTop:16}}>{user.plan===pl.id?<div style={{textAlign:'center',fontSize:12.5,color:OK,fontWeight:700}}>✓ Huidig plan</div>:<button onClick={()=>doPlan(pl.id)} style={{width:'100%',border:'none',borderRadius:10,padding:10,fontSize:13,fontWeight:700,cursor:'pointer',background:pl.id==='plus'?GD:pl.id==='gratis'?SD:BL,color:pl.id==='plus'?'#78350F':pl.id==='gratis'?'#3A4A6B':WH,display:'flex',alignItems:'center',gap:7,justifyContent:'center',fontFamily:'inherit'}}>{load===pl.id?<Spin/>:null} {pl.id==='gratis'?'Downgrade':'Upgraden'}</button>}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [user,setUser]=useState(null)
  const [tab,setTab]=useState('home')
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    setReady(true)
    try{const s=sessionStorage.getItem('bv');if(s){const u=getUserById(JSON.parse(s).id);if(u)setUser(u)}}catch{}
  },[])

  function login(u){sessionStorage.setItem('bv',JSON.stringify({id:u.id}));setUser(u);setTab('home')}
  function logout(){sessionStorage.removeItem('bv');setUser(null);setTab('home')}
  function upgrade(plan){setUser(u=>({...u,plan}));setTab('account')}
  const goUp=()=>setTab('upgrade')

  if(!ready) return null

  if(!user) return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20,background:'linear-gradient(140deg,'+N+','+BL+')'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
      <div style={{background:WH,borderRadius:24,padding:'36px 32px',maxWidth:400,width:'100%',boxShadow:'0 24px 60px rgba(0,0,0,.25)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{display:'flex',justifyContent:'center'}}><Logo size={44}/></div>
          <h1 style={{fontWeight:800,fontSize:22,color:N,margin:'16px 0 4px'}}>Welkom bij Bouwvi</h1>
          <p style={{fontSize:13,color:GR}}>Bouwadvies in je broekzak</p>
        </div>
        <LoginForm onLogin={login}/>
      </div>
    </div>
  )

  const pc=user.plan==='plus'?GD:user.plan==='premium'?BL:GR
  return(
    <div style={{minHeight:'100vh',background:OF}}>
      <Head><title>Bouwvi — Bouwadvies in je broekzak</title></Head>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}} *{box-sizing:border-box;} input,textarea,button,select{font-family:-apple-system,'Segoe UI',system-ui,sans-serif;}`}</style>
      <nav style={{background:WH,borderBottom:'3px solid '+N,position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 12px rgba(15,45,107,.08)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',gap:6,height:58}}>
          <button onClick={()=>setTab('home')} style={{background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0}}><Logo size={34}/></button>
          <div style={{display:'flex',gap:2,marginLeft:12,overflowX:'auto'}}>
            {[['home','🏠 Home'],['bibliotheek','📚 Bibliotheek'],['projecten','🏗️ Projecten'],['account','👤 Account']].map(([id,l])=>(
              <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?'#E8EFFE':'none',border:tab===id?'1px solid #D0DCFA':'1px solid transparent',color:tab===id?BL:'#3A4A6B',borderRadius:8,padding:'6px 11px',fontSize:12.5,cursor:'pointer',fontWeight:600,whiteSpace:'nowrap',fontFamily:'inherit'}}>{l}</button>
            ))}
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            {user.plan==='gratis'&&<button onClick={goUp} style={{border:'none',borderRadius:11,padding:'7px 13px',fontWeight:700,fontSize:12,cursor:'pointer',background:RD,color:WH,fontFamily:'inherit'}}>⭐ Upgrade</button>}
            <div onClick={()=>setTab('account')} style={{width:34,height:34,borderRadius:10,background:pc,display:'flex',alignItems:'center',justifyContent:'center',color:user.plan==='plus'?'#78350F':WH,fontWeight:800,fontSize:15,cursor:'pointer'}}>{user.avatar}</div>
          </div>
        </div>
      </nav>
      {tab==='home'&&<HomeTab user={user} goUp={goUp} setTab={setTab}/>}
      {tab==='bibliotheek'&&<Bibliotheek user={user} goUp={goUp}/>}
      {tab==='projecten'&&<Projecten user={user} goUp={goUp}/>}
      {tab==='account'&&<Account user={user} goUp={goUp} onOut={logout}/>}
      {tab==='upgrade'&&<Upgrade user={user} onUp={upgrade}/>}
      <div style={{background:N,padding:'20px 24px',textAlign:'center',marginTop:40}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:10}}><Logo size={26} dark={true}/></div>
        <p style={{fontSize:11,color:'rgba(255,255,255,.3)',margin:0}}>⚠️ Demo versie · Bouwvi geeft algemeen advies</p>
      </div>
    </div>
  )
}

function LoginForm({ onLogin }) {
  const [email,setEmail]=useState('')
  const [pw,setPw]=useState('')
  const [err,setErr]=useState('')
  const [load,setLoad]=useState(false)
  async function doLogin(){setLoad(true);setErr('');await new Promise(r=>setTimeout(r,500));const u=getUser(email);if(!u){setErr('E-mailadres niet gevonden');setLoad(false);return}if(u.password!==pw){setErr('Verkeerd wachtwoord');setLoad(false);return}onLogin(u)}
  return(
    <div>
      {err&&<div style={{background:'#FDEAED',border:'1px solid '+RD,borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13.5,color:RD,fontWeight:600}}>⚠ {err}</div>}
      <div style={{marginBottom:12}}><label style={{fontSize:12.5,fontWeight:700,color:N,display:'block',marginBottom:5}}>E-mailadres</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="naam@email.nl" onKeyDown={e=>e.key==='Enter'&&doLogin()} style={{width:'100%',border:'1.5px solid '+BD,borderRadius:10,padding:'11px 14px',fontSize:14,outline:'none'}}/></div>
      <div style={{marginBottom:20}}><label style={{fontSize:12.5,fontWeight:700,color:N,display:'block',marginBottom:5}}>Wachtwoord</label><input value={pw} onChange={e=>setPw(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&doLogin()} style={{width:'100%',border:'1.5px solid '+BD,borderRadius:10,padding:'11px 14px',fontSize:14,outline:'none'}}/></div>
      <button onClick={doLogin} style={{width:'100%',border:'none',borderRadius:11,padding:13,fontWeight:700,fontSize:15,cursor:'pointer',background:BL,color:WH,display:'flex',alignItems:'center',gap:8,justifyContent:'center',fontFamily:'inherit'}}>{load?<Spin/>:null} {load?'Inloggen...':'Inloggen →'}</button>
      <div style={{marginTop:22,padding:14,background:OF,borderRadius:12,border:'1px solid '+BD}}>
        <p style={{fontSize:11,fontWeight:700,color:GR,letterSpacing:.8,textTransform:'uppercase',marginBottom:8}}>Demo accounts — wachtwoord: Test123!</p>
        {[['testfree@bouwvi.nl','Gratis','gray'],['testpremium@bouwvi.nl','Premium','blue'],['testplus@bouwvi.nl','Premium Plus','gold']].map(([e,l,v])=>(
          <button key={e} onClick={()=>{setEmail(e);setPw('Test123!')}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',background:WH,border:'1px solid '+BD,borderRadius:8,padding:'7px 10px',marginBottom:5,cursor:'pointer',fontFamily:'inherit'}}>
            <span style={{fontSize:12,color:'#3A4A6B'}}>{e}</span><Badge label={l} col={v}/>
          </button>
        ))}
      </div>
    </div>
  )
}

function HomeTab({ user, goUp, setTab }) {
  const projs=getProjs(user.id)
  return(
    <div style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px 60px'}}>
      <div style={{background:'linear-gradient(135deg,'+N+','+BL+')',borderRadius:20,padding:'32px 28px',marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <Badge label={user.plan==='plus'?'⭐ PREMIUM PLUS':user.plan==='premium'?'⭐ PREMIUM':'GRATIS'} col={user.plan==='plus'?'gold':user.plan==='premium'?'prem':'gray'}/>
          <h1 style={{fontWeight:800,fontSize:'clamp(20px,3vw,28px)',color:WH,margin:'10px 0 6px'}}>Hoi {user.naam.split(' ')[0]}! 👋</h1>
          <p style={{fontSize:14,color:'rgba(255,255,255,.7)',margin:0}}>Bouwadvies in je broekzak</p>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button onClick={()=>setTab('bibliotheek')} style={{border:'none',borderRadius:11,padding:'10px 18px',fontWeight:700,fontSize:13,cursor:'pointer',background:SD,color:'#3A4A6B',fontFamily:'inherit'}}>📚 Bibliotheek</button>
          {user.plan!=='gratis'?<button onClick={()=>setTab('projecten')} style={{border:'none',borderRadius:11,padding:'10px 18px',fontWeight:700,fontSize:13,cursor:'pointer',background:BL,color:WH,fontFamily:'inherit'}}>🏗️ Mijn projecten</button>:<button onClick={goUp} style={{border:'none',borderRadius:11,padding:'10px 18px',fontWeight:700,fontSize:13,cursor:'pointer',background:RD,color:WH,fontFamily:'inherit'}}>⭐ Upgrade</button>}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
        {[{icon:'📚',t:'Kennisbibliotheek',s:'9 categorieën · altijd gratis',to:'bibliotheek'},{icon:'🏗️',t:'Mijn Projecten',s:user.plan!=='gratis'?projs.length+' actief project':'Premium feature',to:user.plan!=='gratis'?'projecten':'upgrade'},{icon:'👤',t:'Account',s:'Profiel & abonnement',to:'account'}].map(item=>(
          <button key={item.t} onClick={()=>setTab(item.to)} style={{background:WH,border:'1px solid '+BD,borderRadius:14,padding:18,textAlign:'left',cursor:'pointer',transition:'all .18s',fontFamily:'inherit'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=BL;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(15,45,107,.1)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
            <div style={{fontSize:28,marginBottom:8}}>{item.icon}</div>
            <div style={{fontWeight:700,fontSize:14,color:N,marginBottom:3}}>{item.t}</div>
            <div style={{fontSize:12,color:GR}}>{item.s}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
