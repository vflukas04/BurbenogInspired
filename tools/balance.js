// Balance-Test ohne Browser: node tools/balance.js [schnell|elemente]
//   (ohne Zusatz)  alles, mehrere Seeds (einige Minuten)
//   schnell        alles mit einem Seed
//   elemente       nur Element-Vergleich (Nur-X-Spiele und Tabelle je Runde)
// Lädt das Spielskript aus index.html und spielt mit einem einfachen Computerspieler ganze Partien.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const game = scripts[scripts.length - 1];
const el = () => new Proxy({ style:{}, dataset:{}, classList:{ toggle(){} }, addEventListener(){}, querySelectorAll:() => [], clientWidth:0, oninput(){}, value:'10' },
  { get:(t,k) => k in t ? t[k] : undefined, set:(t,k,v) => (t[k] = v, true) });
const els = {};
global.document = { getElementById:id => els[id] || (els[id] = el()), querySelectorAll:() => [], documentElement:{}, fonts:null };
global.window = { addEventListener(){} }; global.localStorage = { getItem:() => null, setItem(){}, removeItem(){} };
global.getComputedStyle = () => ({ getPropertyValue:() => '' }); global.performance = { now:() => 0 };
global.requestAnimationFrame = () => {}; global.setInterval = () => {}; global.Image = function(){ return {}; };
const TESTMODE = process.argv[2] || 'voll', ONLY = process.argv[3];
eval(game + `
;(function(){
const EL=['Feuer','Eis','Schatten','Stein'];
// Computerspieler: baut den teuersten bezahlbaren Turm, danach Upgrades.
// Luftabwehr nur einmal vor den Fliegenden, Irrlichter neben die eigenen Schatten-Türme.
function cellsFree(i,l){ const f=[]; for(let y=0;y<8;y++)for(let x=0;x<12;x++) if(!MAPS[i].cells.has(x+','+y)&&!l.towers.some(t=>t.x===x&&t.y===y)) f.push([x,y]); return f; }
const pathScore=(i,[x,y])=>{ let c=0; MAPS[i].cells.forEach(k=>{const[a,b]=k.split(',').map(Number); if(Math.hypot(a-x,b-y)<=2) c++;}); return c; };
function botBuild(l, i, gold, day, ahead=1){
  const RS=curRes(); let spent=0;
  const flyerSoon = MONSTERS.slice(day-1, day+ahead).some(m=>m.fly);
  for(let guard=0;guard<300;guard++){
    const free=cellsFree(i,l); if(!free.length) break;
    free.sort((a,b)=>(pathScore(i,b)-MAPS[i].terrain[b[1]][b[0]]*1.5)-(pathScore(i,a)-MAPS[i].terrain[a[1]][a[0]]*1.5));
    const has=k=>l.towers.some(t=>t.idx===k);
    // Irrlicht: sobald 2 Schatten-Türme unbeleuchtet sind
    const lightIdx=ELEMENTS[l.el].towers.findIndex(t=>t[9]&&t[9].light);
    if(lightIdx>=0){ const dark=l.towers.filter(t=>!towerBase(t.el,t.idx).light && !isLit(t,l.towers));
      if(dark.length>=2 && l.towers.filter(t=>towerBase(t.el,t.idx).light).length<3){ let best=null,bs=-1; for(const c of free){ const n=dark.filter(t=>Math.hypot(t.x-c[0],t.y-c[1])<=towerBase(l.el,lightIdx).light).length*10+pathScore(i,c)/10; if(n>bs){bs=n;best=c;} }
        const c=buildCost(l.el,lightIdx,i,best[0],best[1]); if(bs>=10&&c<=gold-spent){ l.towers.push({x:best[0],y:best[1],el:l.el,idx:lightIdx,lvl:1,invested:c}); spent+=c; continue; } } }
    let pick=-1;
    // Fliegende in Sicht und kaum Türme dagegen: zuerst einen Turm, der Fliegende trifft
    const flyCap=l.towers.filter(t=>towerBase(t.el,t.idx).hitsFly).length, needFly=flyerSoon && flyCap<3;
    for(let k=7;k>=0;k--){ const b=towerBase(l.el,k); if(LOCKS[k]&&!RS.has(LOCKS[k])) continue; if(b.light) continue;
      if(b.air && (!flyerSoon || l.towers.some(t=>towerBase(t.el,t.idx).air))) continue;
      if(needFly && !b.hitsFly && ELEMENTS[l.el].towers.some((_,j)=>j<=k && towerBase(l.el,j).hitsFly && !(LOCKS[j]&&!RS.has(LOCKS[j])) && buildCost(l.el,j,i,free[0][0],free[0][1])<=gold-spent)) continue;
      if(buildCost(l.el,k,i,free[0][0],free[0][1])<=gold-spent){pick=k;break;} }
    const up=l.towers.filter(t=>(t.lvl||1)<6 && !towerBase(t.el,t.idx).air && !towerBase(t.el,t.idx).light).sort((a,b)=>b.idx-a.idx||(a.lvl||1)-(b.lvl||1))[0];
    if(pick>=0 && (l.towers.length<8 || !up || towerBase(l.el,pick).cost>=upgradeCost(up) || towerBase(l.el,pick).air)){
      const [x,y]=free[0]; const c=buildCost(l.el,pick,i,x,y); l.towers.push({x,y,el:l.el,idx:pick,lvl:1,invested:c}); spent+=c; }
    else if(up && upgradeCost(up)<=gold-spent){ const c=upgradeCost(up); up.lvl=(up.lvl||1)+1; up.invested+=c; spent+=c; }
    else break; }
  return spent;
}
function play(N, els, seed, research, noLoss){
  const LL=CONFIG.lossLimit; if(noLoss) CONFIG.lossLimit=1e9;
  let g=newGameState({players:N,timing:'manual',startAt:seed,slots:CONFIG.slotPlan[N]});
  L=[...Array(N)].map((_,i)=>({el:els[i],towers:[],spent:0,gifts:[],pot:0,research:[],gid:seed})); G=g;
  const st={dayLeaks:[]};
  while(!g.over){
    G=g;
    for(let i=0;i<N;i++){ const l=L[i];
      if(research){ const give=Math.floor(goldOf(i)*0.15); if(give>0) l.pot+=give;
        for(const id of ['t5','el'+l.el,'t7','cheap','gold']){ const R=RESEARCH.find(r=>r.id===id); const have=curRes();
          if(!have.has(id) && (!R.need||have.has(R.need)) && potOf()>=R.cost) l.research.push(id); } }
      l.spent+=botBuild(l,i,goldOf(i),g.day); }
    const d=g.day, before=g.passed; g=resolveSlot(g,L);
    if(process.env.LOG) console.log('Tag '+d+' Welle '+G.slot+' durch '+(g.passed-before)+' | '+L.map((l,i)=>goldOf(i)+'G '+l.towers.map(t=>(t.idx+1)+'.'+(t.lvl||1)+(ELEMENTS[t.el].dayOnly&&isLit(t,l.towers)?'*':'')).join(' ')).join(' | '));
    st.dayLeaks[d]=(st.dayLeaks[d]||0)+g.passed-before;
    if(g.day===9&&!st.gold8) st.gold8=Math.round(g.earned.reduce((a,b)=>a+b,0)/N);
  }
  CONFIG.lossLimit=LL;
  st.over=g.over; st.day=g.day; st.passed=g.passed; st.earned=g.earned;
  return st;
}
const seeds = TESTMODE==='voll'?[11,22,33]:[11];
const tag=r=>r.over==='won'?'gewonnen ('+r.passed+')':'verloren Tag '+r.day;
const worst=r=>r.dayLeaks.map((v,d)=>[d,v]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([d,v])=>'T'+d+':'+v).join(' ');

if (TESTMODE==='spiel') { const e=ONLY.split(',').map(Number); const r=play(e.length,e,11000,true); console.log(r.over, r.day, r.passed); return; }
if (TESTMODE!=='elemente' && TESTMODE!=='bedarf') {
  for (const N of [2,3,4]) {
    const res=[]; for (const seed of seeds) for (const e of [[0,1,2,3],[3,2,1,0],[2,3,0,1]]) res.push(play(N,e.slice(0,N),seed*1000,true));
    const lost=res.filter(r=>r.over==='lost');
    console.log('Gemischt, '+N+' Spieler: gewonnen '+(res.length-lost.length)+'/'+res.length+(lost.length?' · verloren an Tag '+lost.map(r=>r.day).join(','):'')+' · Durchbrüche '+res.map(r=>r.passed).join(','));
  }
  const share=[0,0,0,0], cnt=[0,0,0,0], top=[0,0,0,0];
  for (const N of [3,4]) for (const p of [[0,1,2,3],[1,2,3,0],[2,3,0,1],[3,0,1,2]]) {
    const e=p.slice(0,N), st=play(N,e,11000,true), tot=st.earned.reduce((a,b)=>a+b,0)||1;
    st.earned.forEach((v,i)=>{ share[e[i]]+=v/tot; cnt[e[i]]++; }); top[e[st.earned.indexOf(Math.max(...st.earned))]]++;
  }
  console.log('Anteil am Gold (Schnitt):', EL.map((n,k)=>n+' '+Math.round(share[k]/cnt[k]*100)+'%').join(', '));
  console.log('Reichster Spieler:', EL.map((n,k)=>n+' '+top[k]+'x').join(', '));
}
// Element allein: alle Spieler dasselbe Element, mit Forschung. Zeigt auch die schlimmsten Tage.
if(TESTMODE!=='bedarf'){ console.log('\\nNur ein Element (alle Spieler gleich, mit Forschung, ohne Spielende) – Durchbrüche gesamt · schlimmste Tage');
for (let k=0;k<4;k++) for (const N of [2,4]) {
  const r=seeds.slice(0,2).map(s=>play(N,Array(N).fill(k),s*1000,true,true));
  console.log((EL[k]+' ×'+N).padEnd(12)+r.map(x=>String(x.passed).padStart(4)+' Gold bis T8 '+String(x.gold8||0).padStart(4)+'  '+worst(x).padEnd(24)).join(' | '));
} }
// Gold-Bedarf je Runde: Wie viel Gold braucht ein Element (Bot baut auf Feld 0), um 18 von 20 zu töten?
// Angegeben als Vielfaches eines Richtwerts. < 1 = stark, > 2 = schwacher Tag. Mit Forschung t5/t7, Tageslicht, Mittel aus Sonnig/Bewölkt/Regen.
const budget=r=>Math.round(30+60*(Math.pow(1.38,r)-1));
function killsWith(k,r,gold,weather){ L=[{el:k,towers:[],spent:0,gifts:[],research:['t5','t7'],gid:0}]; G={cfg:{startAt:0,players:2},day:r};
  botBuild(L[0],0,gold,r,0); return simulate({lane:0,players:2,towers:L[0].towers,res:['t5','t7'],incoming:waveSpecs(r),weather,seed:r}).kills; }
function need(k,r,weather){ const n=MONSTERS[r-1].count||20, goal=Math.ceil(n*0.9); let lo=0.125, hi=16;
  if(killsWith(k,r,budget(r)*hi,weather)<goal) return Infinity;
  for(let it=0;it<6;it++){ const mid=Math.sqrt(lo*hi); if(killsWith(k,r,budget(r)*mid,weather)>=goal) hi=mid; else lo=mid; } return hi; }
const fmt=v=>v===Infinity?'   –':v>=10?v.toFixed(0).padStart(4):v.toFixed(1).padStart(4);
console.log('\\nGold-Bedarf je Runde (× Richtwert, 18 von 20 töten). Spalten: Feuer Eis Schatten Stein');
const sumLog=[0,0,0,0], bad=[[],[],[],[]], VAL=[];
const WX=[0,1,2]; // Sonnig, Bewölkt, Regen (häufigstes Wetter), geometrisch gemittelt
for (let r=1;r<=20;r++){ const v=EL.map((n,k)=>{ const a=WX.map(w=>need(k,r,w)); return a.includes(Infinity)?Infinity:Math.exp(a.reduce((x,y)=>x+Math.log(y),0)/a.length); }); VAL[r]=v;
  v.forEach((x,k)=>{ sumLog[k]+=Math.log(Math.min(x,32)); if(x>=2.5) bad[k].push(r); });
  console.log(String(r).padStart(2)+' '+MONSTERS[r-1].name.padEnd(18)+String(budget(r)).padStart(6)+' '+v.map(fmt).join(' '));
}
console.log('Schnitt (geom.):   '+EL.map((n,k)=>n+' '+Math.exp(sumLog[k]/20).toFixed(2)).join(' · '));
for (const [a,b,lbl] of [[1,8,'früh 1–8'],[9,14,'mitte 9–14'],[15,20,'spät 15–20']])
  console.log(('  '+lbl).padEnd(19)+EL.map((n,k)=>{ let x=0; for(let r=a;r<=b;r++) x+=Math.log(Math.min(VAL[r][k],32)); return n+' '+Math.exp(x/(b-a+1)).toFixed(2); }).join(' · '));
console.log('Schwache Tage (≥2,5×): '+EL.map((n,k)=>n+' '+(bad[k].join(',')||'keine')).join(' · '));
})();`);
