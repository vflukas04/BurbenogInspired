// Balance-Test ohne Browser: node tools/balance.js [schnell]
// Lädt das Spielskript aus index.html, spielt mit einem einfachen Computerspieler ganze Partien
// und gibt Siegquoten, Goldverteilung je Element und Kills je Element und Runde aus.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const game = scripts[scripts.length - 1];
const el = () => new Proxy({ style:{}, dataset:{}, classList:{ toggle(){} }, addEventListener(){}, querySelectorAll:() => [], clientWidth:0, oninput(){}, value:'10' },
  { get:(t,k) => k in t ? t[k] : undefined, set:(t,k,v) => (t[k] = v, true) });
const els = {};
global.document = { getElementById:id => els[id] || (els[id] = el()), querySelectorAll:() => [], documentElement:{} };
global.window = { addEventListener(){} }; global.localStorage = { getItem:() => null, setItem(){}, removeItem(){} };
global.getComputedStyle = () => ({ getPropertyValue:() => '' }); global.performance = { now:() => 0 };
global.requestAnimationFrame = () => {}; global.setInterval = () => {};
const QUICK = process.argv.includes('schnell');
eval(game + `
;(function(){
function play(N, els, seed, research){
  let g=newGameState({players:N,timing:'manual',startAt:seed,slots:CONFIG.slotPlan[N]});
  L=[...Array(N)].map((_,i)=>({el:els[i],towers:[],spent:0,gifts:[],pot:0,research:[],gid:seed})); G=g;
  const stats={lossDay:null, dayPass:[], earned:null, towers:null};
  while(!g.over){
    G=g;
    for(let i=0;i<N;i++){ const l=L[i];
      if(research){ // 15 % in die Kasse, Forschung nach Priorität
        const give=Math.floor(goldOf(i)*0.15); if(give>0){ l.pot+=give; }
        for(const id of ['t5','el'+l.el,'t7','cheap','gold']){ const R=RESEARCH.find(r=>r.id===id); const have=curRes();
          if(!have.has(id) && (!R.need||have.has(R.need)) && potOf()>=R.cost){ l.research.push(id); } }
      }
      for(let guard=0;guard<300;guard++){ const gold=goldOf(i), RS=curRes();
        let free=[]; for(let y=0;y<8;y++)for(let x=0;x<12;x++) if(!MAPS[i].cells.has(x+','+y)&&!l.towers.some(t=>t.x===x&&t.y===y)) free.push([x,y]);
        // Feld mit meisten Wegzellen in Reichweite 2
        free.sort((a,b)=>score(b)-score(a)); function score([x,y]){ let c=0; MAPS[i].cells.forEach(k=>{const[a,bb]=k.split(',').map(Number); if(Math.hypot(a-x,bb-y)<=2) c++;}); return c - MAPS[i].terrain[y][x]*1.5; }
        let best=-1; for(let k=7;k>=0;k--){ if(LOCKS[k]&&!RS.has(LOCKS[k])) continue; if(free.length && buildCost(l.el,k,i,free[0][0],free[0][1])<=gold){best=k;break;} }
        const up=l.towers.filter(t=>(t.lvl||1)<6).sort((a,b)=>b.idx-a.idx||(a.lvl||1)-(b.lvl||1))[0];
        if(best>=0 && (l.towers.length<8 || !up || towerBase(l.el,best).cost>=upgradeCost(up))){ const [x,y]=free[0]; const c=buildCost(l.el,best,i,x,y); l.towers.push({x,y,el:l.el,idx:best,lvl:1,invested:c}); l.spent+=c; }
        else if(up && upgradeCost(up)<=gold){ const c=upgradeCost(up); up.lvl=(up.lvl||1)+1; up.invested+=c; l.spent+=c; }
        else break; } }
    const d=g.day, before=g.passed; G=g; g=resolveSlot(g,L);
    if(g.day!==d||g.over) stats.dayPass.push(g.passed);
  }
  stats.over=g.over; stats.day=g.day; stats.passed=g.passed; stats.earned=g.earned.join('/'); stats.towers=L.map(l=>l.towers.length).join('/');
  return stats;
}

const EL=['Feuer','Eis','Schatten','Stein'];
for (const N of [2,3,4]) {
  const res=[]; for (const seed of (QUICK?[11]:[11,22,33])) for (const els of [[0,1,2,3],[3,2,1,0],[2,3,0,1]]) res.push(play(N,els.slice(0,N),seed*1000,true));
  const lost=res.filter(r=>r.over==='lost');
  console.log('Spieler '+N+': gewonnen '+(res.length-lost.length)+'/'+res.length+(lost.length?' · verloren an Tag '+lost.map(r=>r.day).join(','):''));
}

// 1) Wer wird reich? Alle Permutationen der Elemente, 3 Seeds, 3 und 4 Spieler
const share=[0,0,0,0], cnt=[0,0,0,0], top=[0,0,0,0];
const perms=a=>a.length<2?[a]:a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(p=>[x,...p]));
for (const N of [3,4]) for (const p of [[0,1,2,3],[1,2,3,0],[2,3,0,1],[3,0,1,2]]) for (const seed of [11]) {
  const els=p.slice(0,N); const st=play(N,els,seed*1000,true); const e=st.earned.split('/').map(Number), tot=e.reduce((a,b)=>a+b,0)||1;
  e.forEach((v,i)=>{ share[els[i]]+=v/tot; cnt[els[i]]++; }); top[els[e.indexOf(Math.max(...e))]]++;
}
console.log('Anteil am Gold (Schnitt):', EL.map((n,k)=>n+' '+Math.round(share[k]/cnt[k]*100)+'%').join(', '));
console.log('Reichster Spieler:', EL.map((n,k)=>n+' '+top[k]+'x').join(', '));
// Position: reich wegen Element oder wegen Platz in der Reihe?
// 2) Element allein: 2 Spieler, beide gleiches Element, 3 Seeds → erreichter Tag / Durchbrüche
for (let k=0;k<4;k++){ const r=[11,22].map(s=>play(2,[k,k],s*1000,false)); console.log('Nur '+EL[k]+': ', r.map(x=>x.over==='won'?'gewonnen ('+x.passed+')':'verloren Tag '+x.day).join(' | ')); }
// 3) Schaden je Element gegen jede Runde: ein Turm 4 Stufe 3 auf Spielfeld 0, Monster dieser Runde, Anteil getötet
const rows=[]; for (let r=1;r<=20;r++){ rows.push(String(r).padStart(2)+' '+MONSTERS[r-1].name.padEnd(18)+EL.map((n,k)=>{ const t=[{x:5,y:2,el:k,idx:3,lvl:3},{x:9,y:3,el:k,idx:2,lvl:3}]; const s=simulate({lane:0,players:2,towers:t,incoming:waveSpecs(r).slice(0,10),weather:1}); return String(s.kills).padStart(3); }).join('')); }
console.log('Kills von 10 (je 2 Türme gleicher Stärke), Spalten: Feuer Eis Schatten Stein'); console.log(rows.join('\\n'));

})();`);
