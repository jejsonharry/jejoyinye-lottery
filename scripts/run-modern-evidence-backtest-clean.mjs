import fs from 'node:fs/promises';

const sourcePath = 'scripts/backtest-modern-evidence-engine.mjs';
const tempPath = 'scripts/.backtest-modern-evidence-engine-clean.mjs';
let source = await fs.readFile(sourcePath, 'utf8');

const oldBlock = `function canonical(raw){
 const map=new Map(); let dup=0; for(const r of raw){ const game=alias.get(r.game); if(!game) continue; const row={...r,game,winning:parse(r.winning),machine:parse(r.machine)}; const k=\`${'${game}|${r.draw_date}'}\`; if(!map.has(k)) map.set(k,row); else { const p=map.get(k); if(JSON.stringify(p.winning)!==JSON.stringify(row.winning)||JSON.stringify(p.machine)!==JSON.stringify(row.machine)) throw new Error(\`Conflicting alias ${'${k}'}\`); dup++; if(r.game==='Golden') map.set(k,row); } }
 return {rows:[...map.values()].sort((a,b)=>a.draw_date.localeCompare(b.draw_date)||(order.get(a.game)-order.get(b.game))),dup};
}`;

const newBlock = `function canonical(raw){
 const grouped=new Map();
 for(const r of raw){
   const game=alias.get(r.game); if(!game) continue;
   const row={...r,game,winning:parse(r.winning),machine:parse(r.machine),source_game:r.game};
   const k=\`${'${game}|${r.draw_date}'}\`;
   if(!grouped.has(k)) grouped.set(k,[]);
   grouped.get(k).push(row);
 }
 const rows=[]; let dup=0, conflicts=0;
 for(const [k,group] of grouped){
   const variants=new Map();
   for(const row of group){
     const sig=JSON.stringify([row.winning,row.machine]);
     if(!variants.has(sig)) variants.set(sig,row);
   }
   dup += Math.max(0,group.length-1);
   if(variants.size>1){ conflicts++; console.warn('Excluded ambiguous historical result',k); continue; }
   const candidates=[...group];
   const preferred=candidates.find(x=>x.source_game==='Golden') || candidates[0];
   rows.push(preferred);
 }
 rows.sort((a,b)=>a.draw_date.localeCompare(b.draw_date)||(order.get(a.game)-order.get(b.game)));
 return {rows,dup,conflicts};
}`;

if (!source.includes(oldBlock)) throw new Error('Backtest canonical block changed; clean-run patch not applied.');
source = source.replace(oldBlock, newBlock)
  .replace(`const conv=conversionRates(prior90.slice().reverse());`, `const conv=conversionRates(prior90);`)
  .replace(`const raw=await fetchAll(),{rows,dup}=canonical(raw),t=await tables();`, `const raw=await fetchAll(),{rows,dup,conflicts}=canonical(raw),t=await tables();`)
  .replace(`data:{raw:raw.length,canonical:rows.length,aliasDuplicatesRemoved:dup,evaluated}`, `data:{raw:raw.length,canonical:rows.length,aliasDuplicatesRemoved:dup,conflictingGameDatesExcluded:conflicts,evaluated}`)
  .replace(`Golden/Golden Night duplicates removed: **${'${dup}'}**.`, `Duplicate rows removed: **${'${dup}'}**. Ambiguous game/date conflicts excluded: **${'${conflicts}'}**.`);

await fs.writeFile(tempPath, source);
await import(`./.backtest-modern-evidence-engine-clean.mjs?ts=${Date.now()}`);
await fs.rm(tempPath, { force: true });
