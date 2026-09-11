import fs from 'node:fs/promises';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing Supabase credentials');
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

const schedule = [
 ['Powerball',['Powerball']],['Awoof',['Awoof']],['Biggest Bet',['Biggest Bet']],['Gold Rush',['Gold Rush']],
 ['Lucky Dollar',['Lucky Dollar']],['Blessing',['Blessing']],['Owo Time',['Owo Time']],['Modern Bingo',['Modern Bingo']],
 ['Bonus Cash',['Bonus Cash']],['Hero',['Hero']],['Golden',['Golden','Golden Night']],['Queen',['Queen']]
].map(([game,names],index)=>({game,names,index}));
const alias = new Map(schedule.flatMap(x=>x.names.map(n=>[n,x.game])));
const order = new Map(schedule.map(x=>[x.game,x.index]));
const categories = ['counterpart','bonanza','malta','stringKey','shadow','partner','equivalent','code','turning'];

function parse(v){ if(Array.isArray(v)) return v.map(Number).filter(n=>n>=1&&n<=90); return (String(v||'').match(/\b\d{1,2}\b/g)||[]).map(Number).filter(n=>n>=1&&n<=90); }
function shift(d,n){ const [y,m,day]=d.split('-').map(Number); const x=new Date(Date.UTC(y,m-1,day)); x.setUTCDate(x.getUTCDate()+n); return `${x.getUTCFullYear()}-${String(x.getUTCMonth()+1).padStart(2,'0')}-${String(x.getUTCDate()).padStart(2,'0')}`; }
function norm(arr,key,out){ const max=Math.max(0,...arr.map(x=>x[key]||0)); for(const x of arr) x[out]=max?100*(x[key]||0)/max:0; }
function pct(x){ return `${(100*x).toFixed(2)}%`; }
function phase(d){ return d<'2026-01-01'?'development':d<'2026-07-01'?'validation':'holdout'; }

async function fetchAll(){
 const rows=[]; for(let start=0;start<30000;start+=1000){ const r=await fetch(`${SUPABASE_URL}/rest/v1/results?select=game,draw_date,winning,machine,created_at&lottery=eq.modern-billionaire&order=draw_date.asc,created_at.asc`,{headers:{...headers,Range:`${start}-${start+999}`}}); if(!r.ok) throw new Error(await r.text()); const page=await r.json(); rows.push(...page); if(page.length<1000) break; } return rows;
}
async function tables(){
 const src=await fs.readFile('predictions.js','utf8');
 const ct=src.match(/const MODERN_CLASSIFICATION_ROWS = `([\s\S]*?)`;/)?.[1];
 const mt=src.match(/const MODERN_MOVING_ROWS = `([\s\S]*?)`;/)?.[1];
 if(!ct||!mt) throw new Error('Relationship tables not found');
 const classification={}; for(const row of ct.trim().split(/\n+/)){ const vals=row.trim().split(/\s+/).map(Number); const n=vals.shift(); classification[n]=Object.fromEntries(categories.map((c,i)=>[c,vals[i]])); }
 const g=Object.fromEntries(Array.from({length:90},(_,i)=>[i+1,new Set()]));
 for(const row of mt.trim().split(/\n+/)) for(const entry of row.split(';')){ const [h,moves]=entry.split(':'); const a=Number(h); for(const b of moves.split(',').map(Number)){ if(a>=1&&a<=90&&b>=1&&b<=90&&a!==b){g[a].add(b);g[b].add(a);} } }
 return {classification,moving:Object.fromEntries(Object.entries(g).map(([k,v])=>[k,[...v]]))};
}
function canonical(raw){
 const map=new Map(); let dup=0; for(const r of raw){ const game=alias.get(r.game); if(!game) continue; const row={...r,game,winning:parse(r.winning),machine:parse(r.machine)}; const k=`${game}|${r.draw_date}`; if(!map.has(k)) map.set(k,row); else { const p=map.get(k); if(JSON.stringify(p.winning)!==JSON.stringify(row.winning)||JSON.stringify(p.machine)!==JSON.stringify(row.machine)) throw new Error(`Conflicting alias ${k}`); dup++; if(r.game==='Golden') map.set(k,row); } }
 return {rows:[...map.values()].sort((a,b)=>a.draw_date.localeCompare(b.draw_date)||(order.get(a.game)-order.get(b.game))),dup};
}
function relationshipScores(last5,today,t){
 const a=Array.from({length:90},(_,i)=>({number:i+1,classRaw:0,moveRaw:0})); const by=Object.fromEntries(a.map(x=>[x.number,x]));
 const add=(source,w)=>{ const rel=t.classification[source]; if(rel) for(const n of new Set(Object.values(rel))) if(by[n]) by[n].classRaw+=w; for(const n of new Set(t.moving[source]||[])) by[n].moveRaw+=w; };
 last5.forEach((r,i)=>{ const w=[1.45,1.30,1.15,.90,.75][i]||.6; for(const n of r.winning)add(n,w); for(const n of r.machine)add(n,w*.45); });
 const tw=today.length?.9/today.length:0; for(const r of today){ for(const n of r.winning)add(n,tw); for(const n of r.machine)add(n,tw*.45); }
 norm(a,'classRaw','classification'); norm(a,'moveRaw','moving'); return by;
}
function conversionRates(prior){
 const base=1-Math.pow(85/90,3), strength=6; const out={}; for(let n=1;n<=90;n++){ let opp=0,conv=0; for(let i=0;i<prior.length-1;i++){ if(!prior[i].machine.includes(n)) continue; opp++; let hit=false; for(let j=i+1;j<=Math.min(i+3,prior.length-1);j++) if(prior[j].winning.includes(n)){hit=true;break;} if(hit)conv++; } out[n]=(conv+strength*base)/(opp+strength); } return out;
}
function components(history7,prior90,today,t){
 const rel=relationshipScores(history7.slice(0,5),today,t); const conv=conversionRates(prior90.slice().reverse());
 const uniqueToday=new Set(today.flatMap(r=>[...r.winning,...r.machine])).size; const coverageFactor=Math.max(.25,1-.8*(uniqueToday/90));
 const arr=[]; for(let n=1;n<=90;n++){
   let wRec=0,mRec=0,wCount=0,mCount=0,recentMachine=0;
   history7.forEach((r,i)=>{ const d=Math.exp(-.38*i); if(r.winning.includes(n)){wRec+=d;wCount++;} if(r.machine.includes(n)){mRec+=d;mCount++; if(i<3) recentMachine+=d;} });
   const sameGameRaw=3.0*Math.log1p(2*wRec)+.95*Math.log1p(2*mRec)+.55*Math.log1p(wCount)+.20*Math.log1p(mCount);
   let dayRaw=0; for(const r of today){ if(r.winning.includes(n))dayRaw+=1; if(r.machine.includes(n))dayRaw+=.35; } dayRaw=(dayRaw/Math.max(1,today.length))*coverageFactor;
   const conversionRaw=recentMachine*conv[n];
   arr.push({number:n,sameGameRaw,dayRaw,conversionRaw,classification:rel[n].classification,moving:rel[n].moving});
 }
 norm(arr,'sameGameRaw','sameGame'); norm(arr,'dayRaw','sameDay'); norm(arr,'conversionRaw','conversion');
 for(const x of arr){ x.cross=Math.sqrt(x.sameGame*x.sameDay); x.breadth=[x.sameGame>=45,x.conversion>=40,x.cross>=35,x.classification>=45,x.moving>=45].filter(Boolean).length; }
 return arr;
}

const MODELS=[
 {id:'R1-60-30-10',legacy:true,w:{stat:.60,class:.30,move:.10}},
 {id:'EF-A',w:{same:.45,conv:.20,cross:.15,class:.10,move:.10},breadth:2},
 {id:'EF-B',w:{same:.40,conv:.20,cross:.20,class:.10,move:.10},breadth:2},
 {id:'EF-C',w:{same:.45,conv:.15,cross:.20,class:.10,move:.10},breadth:2},
 {id:'EF-D',w:{same:.50,conv:.15,cross:.15,class:.10,move:.10},breadth:2},
 {id:'EF-E',w:{same:.45,conv:.20,cross:.20,class:.05,move:.10},breadth:2},
 {id:'EF-F',w:{same:.45,conv:.20,cross:.20,class:.10,move:.05},breadth:2},
 {id:'EF-G',w:{same:.45,conv:.20,cross:.15,class:.05,move:.05,day:.10},breadth:2},
 {id:'EF-H',w:{same:.50,conv:.20,cross:.20,class:.05,move:.05},breadth:3}
];
function metric(){return{draws:0,hits:0,any:0,two:0,sure:0,direct:0,machine:0};}
function addMetric(m,pred,w,mach){ const ws=new Set(w),ms=new Set(mach), top=pred.slice(0,5),h=top.filter(n=>ws.has(n)).length; m.draws++;m.hits+=h;m.any+=h>0;m.two+=h>=2;m.sure+=top.slice(0,2).filter(n=>ws.has(n)).length;m.direct+=top.slice(2).filter(n=>ws.has(n)).length;m.machine+=top.filter(n=>ms.has(n)).length; }
function fin(m){return{...m,avg:m.draws?m.hits/m.draws:0,anyRate:m.draws?m.any/m.draws:0,twoRate:m.draws?m.two/m.draws:0};}
function legacyComponents(history,today,t){
 const score=Object.fromEntries(Array.from({length:90},(_,i)=>[i+1,{number:i+1,statRaw:0,classRaw:0,moveRaw:0}]));
 history.forEach((r,i)=>{const base=Math.max(.25,1-(i/Math.max(history.length,1))*.75),rec=base*([1.45,1.30,1.15][i]||1);for(const n of r.winning)score[n].statRaw+=3.5+2.4*rec;for(const n of r.machine)score[n].statRaw+=.8+.7*rec;});
 const tw=today.length?1.2/today.length:0,tm=today.length?.36/today.length:0; for(const r of today){for(const n of r.winning)score[n].statRaw+=tw;for(const n of r.machine)score[n].statRaw+=tm;}
 const rel=relationshipScores(history.slice(0,5),today,t); const arr=Object.values(score); for(const x of arr){x.classification=rel[x.number].classification;x.moving=rel[x.number].moving;} norm(arr,'statRaw','sameGame'); return arr;
}
function rank(model,c){ return c.map(x=>{ let s;if(model.legacy)s=x.sameGame*model.w.stat+x.classification*model.w.class+x.moving*model.w.move;else{s=(x.sameGame*(model.w.same||0))+(x.conversion*(model.w.conv||0))+(x.cross*(model.w.cross||0))+(x.classification*(model.w.class||0))+(x.moving*(model.w.move||0))+(x.sameDay*(model.w.day||0))+(x.breadth*(model.breadth||0));} return{n:x.number,s};}).sort((a,b)=>b.s-a.s||a.n-b.n).slice(0,5).map(x=>x.n); }

const raw=await fetchAll(),{rows,dup}=canonical(raw),t=await tables();
const hist=Object.fromEntries(schedule.map(x=>[x.game,[]])); let date='',today=[]; const results=Object.fromEntries(MODELS.map(m=>[m.id,{development:metric(),validation:metric(),holdout:metric(),all:metric()}])); let evaluated=0;
for(const row of rows){ if(row.draw_date!==date){date=row.draw_date;today=[];} const prior=hist[row.game]; const h7=prior.filter(x=>x.draw_date>=shift(row.draw_date,-7)).slice().reverse(); if(h7.length>=5){ const newC=components(h7,prior.slice(-90),today,t), oldC=legacyComponents(h7,today,t); for(const m of MODELS){const p=rank(m,m.legacy?oldC:newC); addMetric(results[m.id][phase(row.draw_date)],p,row.winning,row.machine); addMetric(results[m.id].all,p,row.winning,row.machine);} evaluated++; } hist[row.game].push(row);today.push(row); }
for(const m of MODELS) for(const k of Object.keys(results[m.id])) results[m.id][k]=fin(results[m.id][k]);
const ranked=MODELS.map(m=>({model:m,...results[m.id]})).sort((a,b)=>b.validation.avg-a.validation.avg||b.validation.anyRate-a.validation.anyRate||b.development.avg-a.development.avg);
const random={avg:25/90,anyRate:1-(85*84*83*82*81)/(90*89*88*87*86)};
const report={generatedAt:new Date().toISOString(),data:{raw:raw.length,canonical:rows.length,aliasDuplicatesRemoved:dup,evaluated},random,ranked};
await fs.mkdir('reports',{recursive:true}); await fs.writeFile('reports/modern-evidence-engine-backtest.json',JSON.stringify(report,null,2)+'\n');
let md=`# Modern Evidence Engine Backtest\n\nEvaluated **${evaluated}** walk-forward draws. Golden/Golden Night duplicates removed: **${dup}**.\n\nRandom reference: avg hits/draw **${random.avg.toFixed(4)}**, any-hit rate **${pct(random.anyRate)}**.\n\n| Rank | Model | Validation avg | Validation any-hit | Holdout avg | Holdout any-hit | Development avg |\n|---:|---|---:|---:|---:|---:|---:|\n`;
ranked.forEach((x,i)=>{md+=`| ${i+1} | ${x.model.id} | ${x.validation.avg.toFixed(4)} | ${pct(x.validation.anyRate)} | ${x.holdout.avg.toFixed(4)} | ${pct(x.holdout.anyRate)} | ${x.development.avg.toFixed(4)} |\n`;});
md+=`\nSelection must be based on validation, then checked against untouched holdout. The live engine must not be changed solely because a model wins development data.\n`;
await fs.writeFile('reports/modern-evidence-engine-backtest.md',md);
console.log(JSON.stringify({evaluated,top:ranked.slice(0,4).map(x=>({id:x.model.id,validation:x.validation,holdout:x.holdout})),baseline:results['R1-60-30-10']},null,2));
