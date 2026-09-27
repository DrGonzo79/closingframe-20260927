"use client";
import {useMemo,useState} from "react";
import {Activity,ArrowRight,BarChart3,Check,Clipboard,Eye,Film,Home,RefreshCw,TriangleAlert} from "lucide-react";
import demo from "../data/demo.json";

type EventType="lead"|"showing"|"close";
type Result={leads:number;showings:number;revenue:number;confidence:number;topVideo:string;recommendation:string;rows:{id:string;title:string;views:number;score:number;outcomes:number}[]};

export default function Dashboard(){
  const [listingId,setListingId]=useState("L-104");
  const [windowDays,setWindowDays]=useState(30);
  const [model,setModel]=useState("balanced");
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState<Result|null>(null);
  const [error,setError]=useState("");
  const [selectedVideo,setSelectedVideo]=useState<string|null>(null);
  const [copied,setCopied]=useState(false);
  const listing=demo.listings.find(x=>x.id===listingId)!;
  const videos=useMemo(()=>demo.videos.filter(v=>v.listingId===listingId),[listingId]);
  const selected=videos.find(v=>v.id===selectedVideo);

  function resetResult(){setResult(null);setError("");setSelectedVideo(null);setCopied(false)}
  function run(){
    if(!listingId||windowDays<7||windowDays>90){setError("Choose a listing and an attribution window from 7 to 90 days.");return}
    setError("");setBusy(true);setResult(null);setSelectedVideo(null);
    window.setTimeout(()=>{
      const events=demo.events.filter(e=>e.listingId===listingId&&e.daysAfter<=windowDays);
      if(!events.length){setBusy(false);setError("No linked demo outcomes fall inside this window. Try a longer window.");return}
      const rows=videos.map(video=>{
        const outcomes=events.filter(e=>e.videoId===video.id);
        const eventValue=outcomes.reduce((sum,e)=>sum+(e.type==="close"?12:e.type==="showing"?4:1),0);
        const engagement=(video.saves/video.views)*100;
        const weight=model==="outcomes"?1.45:model==="reach"?.65:1;
        return {id:video.id,title:video.title,views:video.views,score:Math.min(99,Math.round(eventValue*9*weight+engagement*6)),outcomes:outcomes.length};
      }).sort((a,b)=>b.score-a.score);
      const count=(type:EventType)=>events.filter(e=>e.type===type).length;
      const revenue=events.filter(e=>e.type==="close").reduce((sum,e)=>sum+e.value,0);
      setResult({leads:count("lead"),showings:count("showing"),revenue,confidence:Math.min(96,58+events.length*7),topVideo:rows[0].title,recommendation:rows[0].outcomes?`Repeat the ${videos.find(v=>v.id===rows[0].id)?.format.toLowerCase()} format and open with “${videos.find(v=>v.id===rows[0].id)?.hook}”.`:`Collect tagged CRM outcomes before changing creative.`,rows});
      setBusy(false);
    },600)
  }
  async function copy(){
    if(!result)return;
    try{await navigator.clipboard.writeText(`ClosingFrame demo — ${listing.address}: ${result.leads} leads, ${result.showings} showings, $${result.revenue.toLocaleString()} linked revenue. Top video: ${result.topVideo}. Fictional data.`);setCopied(true)}catch{setError("Clipboard access was blocked. The report remains visible on screen.")}
  }

  return <main>
    <aside className="rail"><div className="mark"><Film size={21}/></div><nav aria-label="Prototype navigation"><button className="active" aria-label="Attribution dashboard"><BarChart3/></button><button aria-label="Listings" disabled><Home/></button><button aria-label="Activity" disabled><Activity/></button></nav><span>CF</span></aside>
    <div className="shell">
      <header><a className="brand" href="#top">ClosingFrame</a><span className="demo-tag">Fictional brokerage demo</span></header>
      <section id="top" className="hero"><div><p className="eyebrow">VIDEO → PIPELINE → COMMISSION</p><h1>Stop reporting views.<br/><em>Prove what moved the listing.</em></h1><p>Connect listing videos to lead, showing and close signals—then learn which creative deserves the next shoot.</p></div><div className="hero-card"><Eye/><strong>4th</strong><span>Real estate’s reported rank among TikTok search topics</span><small>Source newsletter claim; independently validate before use.</small></div></section>
      <div className="notice" role="note"><TriangleAlert/><span><b>Simulation only.</b> All properties, videos, outcomes and revenue are fictional. No TikTok, MLS or CRM connection is live.</span></div>
      <section className="control-card"><div className="section-title"><div><p>01 · ATTRIBUTION RUN</p><h2>Choose the question</h2></div><button className="icon" onClick={()=>{setListingId("L-104");setWindowDays(30);setModel("balanced");resetResult()}} aria-label="Reset attribution"><RefreshCw/></button></div>
        <div className="controls"><label>Listing<select aria-label="Listing" value={listingId} onChange={e=>{setListingId(e.target.value);resetResult()}}>{demo.listings.map(x=><option key={x.id} value={x.id}>{x.address}</option>)}</select></label><label>Attribution window<input aria-label="Attribution window" type="number" min="7" max="90" value={windowDays} onChange={e=>{setWindowDays(Number(e.target.value));resetResult()}}/><span>days after publish</span></label><label>Evidence model<select aria-label="Evidence model" value={model} onChange={e=>{setModel(e.target.value);resetResult()}}><option value="balanced">Balanced</option><option value="outcomes">Outcome-heavy</option><option value="reach">Reach-aware</option></select></label></div>
        <div className="listing-line"><div><small>{listing.status}</small><b>{listing.address}</b><span>${listing.price.toLocaleString()} · {videos.length} linked videos</span></div><button className="primary" onClick={run} disabled={busy}>{busy?"Matching events…":"Run attribution"}<ArrowRight/></button></div>{error&&<p className="error" role="alert">{error}</p>}</section>
      <section className="results" aria-live="polite">{!result?<div className="empty"><BarChart3/><div><b>No model run yet</b><span>Pick a listing and window to connect demo video signals with downstream events.</span></div></div>:<>
        <div className="section-title"><div><p>02 · LINKED OUTCOMES</p><h2>{listing.address}</h2></div><span className="confidence">{result.confidence}% demo confidence</span></div>
        <div className="metrics"><article><span>CRM leads</span><strong>{result.leads}</strong><small>linked inside window</small></article><article><span>Showings</span><strong>{result.showings}</strong><small>scheduled after video</small></article><article><span>Closed revenue</span><strong>${result.revenue.toLocaleString()}</strong><small>gross commission proxy</small></article></div>
        <div className="table-wrap"><table><thead><tr><th>Video</th><th>Views</th><th>Outcomes</th><th>Signal</th><th></th></tr></thead><tbody>{result.rows.map(row=><tr key={row.id}><td>{row.title}</td><td>{row.views.toLocaleString()}</td><td>{row.outcomes}</td><td><div className="score"><span style={{width:`${row.score}%`}}></span></div>{row.score}</td><td><button onClick={()=>setSelectedVideo(row.id)}>Inspect</button></td></tr>)}</tbody></table></div>
        <div className="recommend"><Check/><div><small>NEXT SHOOT</small><b>{result.recommendation}</b></div></div>
        {selected&&<div className="drawer" role="dialog" aria-label="Video evidence"><button aria-label="Close evidence" onClick={()=>setSelectedVideo(null)}>×</button><p>VIDEO EVIDENCE</p><h3>{selected.title}</h3><dl><div><dt>Hook</dt><dd>{selected.hook}</dd></div><div><dt>Format</dt><dd>{selected.format}</dd></div><div><dt>Length</dt><dd>{selected.length}s</dd></div><div><dt>Saves</dt><dd>{selected.saves.toLocaleString()}</dd></div></dl><small>Correlation is not causation. Production must show identity resolution and competing touchpoints.</small></div>}
        <button className="secondary" onClick={copy}><Clipboard/>{copied?"Report copied":"Copy broker report"}</button>
      </>}</section>
      <footer><span>ClosingFrame · Prototype, September 2026</span><a href="https://www.ideabrowser.com/hub/ideas/video-marketing-analytics-for-real-estate-brokerages-31270ea8">Public source idea ↗</a></footer>
    </div>
  </main>
}
