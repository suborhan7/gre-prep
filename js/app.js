(function(){
const LESSONS=window.GRE_LESSONS||[], QUESTIONS=window.GRE_QUESTIONS||[], PASSAGES=window.GRE_PASSAGES||{}, VOCAB=window.GRE_VOCAB||[];
const QBY=Object.fromEntries(QUESTIONS.map(q=>[q.id,q]));
const LBY=Object.fromEntries(LESSONS.map(l=>[l.id,l]));
const ALLWORDS=VOCAB.flatMap((g,gi)=>g.map(w=>({w:w[0],pos:w[1],def:w[2],ex:w[3],g:gi})));
const WBY=Object.fromEntries(ALLWORDS.map(x=>[x.w,x]));
const QCOPTS=["Quantity A is greater","Quantity B is greater","The two quantities are equal","The relationship cannot be determined from the information given"];
const INTERVALS=[0,1,3,7,14,30];
const WEEKS=[
 {t:"Diagnose and set up",lessons:["s1","v1"],tasks:["Take ETS POWERPREP Test 1, timed, and note your scores","Check GRE requirements for your top 5–6 programs","Vocab: learn Groups 1 and 2"]},
 {t:"Number sense and Text Completion",lessons:["q9","q1","q2","v2","w1"],tasks:["Practice sets on each lesson's topic (skip ahead to Hard if Easy feels trivial)","Vocab: Groups 3 and 4","Write your first Issue essay, untimed"]},
 {t:"Algebra and Sentence Equivalence",lessons:["q3","q4","v3"],tasks:["Practice sets on exponents and algebra","Daily Hard Quant set (5 questions)","Vocab: Groups 5 and 6","Sunday: review Mistakes"]},
 {t:"Word problems and Reading",lessons:["q5","v4"],tasks:["Two mixed practice sets (Quant and Verbal)","Daily Hard Quant set (5 questions)","Vocab: Groups 7 and 8","One timed Issue essay"]},
 {t:"Geometry, inference and arguments",lessons:["q6","v5","v6"],tasks:["Practice sets on geometry and reading","Daily Hard Quant set (5 questions)","Vocab: Groups 9 and 10","Sunday: review Mistakes"]},
 {t:"Data analysis and checkpoint",lessons:["q7","q8"],tasks:["Vocab: Groups 11 and 12","Take ETS POWERPREP Test 2, timed","Compare with Week 1 and note your 3 weakest topics"]},
 {t:"Fix weak areas",lessons:[],tasks:["Retry every question in Mistakes","Drill your 3 weakest topics (see Today)","Vocab: advanced Groups 13–15","Two timed Issue essays","Timed Quant and Verbal sections in the Mock tab"]},
 {t:"Official practice",lessons:[],tasks:["Official Guide or Official Practice Questions: timed sets","Log every miss in Mistakes","Vocab: Groups 16–18","Two timed essays with scored feedback"]},
 {t:"Mock phase 1",lessons:["s2"],tasks:["Full-length mock (POWERPREP PLUS or another full test)","Review every question you missed or guessed","Vocab: Groups 19–21","Targeted drills from the review"]},
 {t:"Mock phase 2",lessons:[],tasks:["Second full mock and full review","Hard-only Quant practice sets","Vocab: Groups 22–24","Book your exam date if scores are near target"]},
 {t:"Mock phase 3",lessons:[],tasks:["Third full mock","Vocab: review all due words","Re-read every 'lesson for next time' in Mistakes"]},
 {t:"Taper and test",lessons:[],tasks:["Light mixed sets only, no new topics","Confirm test time, ID and route (or home setup)","Take the GRE"]}
];
const PROMPTS=[
 ["Universities should require every student to take courses outside their major field of study.",0],
 ["The best way to understand a society is to study the technology it relies on.",1],
 ["Governments should spend more on basic scientific research than on research with immediate practical uses.",2],
 ["Success in a career depends more on persistence than on talent.",0],
 ["People should be skeptical of any idea that most experts accept.",1],
 ["Cities should invest in public transportation before building new roads.",2],
 ["As artificial intelligence improves, formal education will matter less.",0],
 ["Leaders are more effective when they decide quickly than when they consult widely.",1],
 ["Studying history is more useful for understanding the present than following current events.",2],
 ["Competition among students does more harm than good.",0]
];
const INSTR=[
 "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning. In developing and supporting your position, consider ways in which the statement might or might not hold true.",
 "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, address the most compelling reasons or examples that could be used to challenge it.",
 "Write a response in which you discuss your views on the policy and explain your reasoning. In developing and supporting your position, consider the possible consequences of implementing it."
];

/* ---------- icons ---------- */
const SV=(d,extra)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra||""}>${d}</svg>`;
const ICON={
  lesson:SV('<path d="M4 4.5A1.5 1.5 0 015.5 3H20v15H5.5A1.5 1.5 0 004 19.5z"/><path d="M4 19.5A1.5 1.5 0 005.5 21H20v-3"/>'),
  words:SV('<rect x="3" y="7" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0121 5.5V17"/>'),
  practice:SV('<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>'),
  bolt:SV('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  essay:SV('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>'),
  clock:SV('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'),
  alert:SV('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>'),
  check:SV('<path d="M5 12.5l4.5 4.5L19 7.5"/>',' stroke-width="2.6"'),
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>'
};

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
function today(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function addDays(s,n){const d=new Date(s+"T00:00:00");d.setDate(d.getDate()+n);return iso(d);}
const TODAY=iso(today());
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fmt(sec){sec=Math.max(0,Math.round(sec));return Math.floor(sec/60)+":"+pad(sec%60);}

/* ---------- state + sync ---------- */
const BLANK=()=>({start:null,done:{},lessons:{},att:{},vocab:{},mocks:[],days:[],lang:"en",langT:0});
let S=BLANK();
let errors=[], essays=[];
const on=(m,k)=>((m||{})[k]||0)>0;
const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
let auth=LS.get("gre-auth",null);
let pushTimer=null,pushFirst=0,pushing=false,pending=false,lastSync=LS.get("gre-lastsync",0),syncText="";
function snapshot(){return {S,errors,essays};}
function persistLocal(){LS.set("gre-data",snapshot());}
function setSync(t){syncText=t;const a=$("#savestate"),b=$("#a-sync");if(a)a.textContent=t;if(b)b.textContent=t+(lastSync?" · last sync "+new Date(lastSync).toLocaleString():"");}
function save(){
  persistLocal();
  if(!auth){setSync("Saved on this device");return;}
  pending=true;const now=Date.now();if(!pushFirst)pushFirst=now;clearTimeout(pushTimer);
  pushTimer=setTimeout(()=>{pushTimer=null;push();},Math.max(0,Math.min(20000,120000-(now-pushFirst))));
  setSync("Saved on this device · syncing soon");
}
async function api(path,opt){
  opt=opt||{};const h={"content-type":"application/json"};if(auth)h.authorization="Bearer "+auth.token;
  const r=await fetch(path,Object.assign({},opt,{headers:Object.assign(h,opt.headers||{})}));
  if(r.status===401&&auth&&path!=="/api/auth"){signedOut("Your session ended. Log in again to keep syncing.");throw {message:"Please log in again."};}
  return r;
}
function applyRemote(d){
  if(!d)return;const m=GREMerge.mergeAll(snapshot(),d);
  S=Object.assign(BLANK(),m.S);errors=m.errors;essays=m.essays;if(!S.start)S.start=TODAY;persistLocal();
}
async function push(keepalive){
  if(!auth||pushing||!pending)return;pushing=true;pending=false;pushFirst=0;clearTimeout(pushTimer);pushTimer=null;
  setSync("Syncing…");
  try{
    const r=await api("/api/progress",{method:"PUT",body:JSON.stringify({data:snapshot()}),keepalive:!!keepalive});
    const j=await r.json();if(!r.ok)throw j;
    if(!pending)applyRemote(j.data);
    lastSync=Date.now();LS.set("gre-lastsync",lastSync);setSync("Synced");if(!pending)rerender();
  }catch(e){
    pending=true;setSync(navigator.onLine===false?"Offline · saved on this device":"Couldn't sync · will retry");
    if(auth){clearTimeout(pushTimer);pushTimer=setTimeout(()=>{pushTimer=null;push();},60000);}
  }
  pushing=false;
  if(pending&&!pushTimer&&auth)save();
}
async function pull(){
  if(!auth)return;setSync("Syncing…");
  try{
    const r=await api("/api/progress");const j=await r.json();if(!r.ok)throw j;
    const local=snapshot();
    const need=JSON.stringify(GREMerge.mergeAll(j.data,local))!==JSON.stringify(GREMerge.mergeAll(j.data,{}));
    applyRemote(j.data);lastSync=Date.now();LS.set("gre-lastsync",lastSync);
    if(need){pending=true;push();}else setSync("Synced");
    rerender();
  }catch(e){setSync(navigator.onLine===false?"Offline · using this device's copy":"Couldn't reach the server");}
}
function rerender(){
  renderStats();renderEssays();renderMistakes();const h=location.hash.slice(1)||"today";
  if(h==="today")renderToday();if(h==="plan")renderPlan();if(h==="vocab")renderGroups();if(h==="learn")renderLessonList();if(h==="account")renderAccount();
  $("#t-lang").value=S.lang||"en";
}
document.addEventListener("visibilitychange",()=>{if(document.hidden){if(pending)push(true);}else if(auth&&Date.now()-lastSync>60000)pull();});
addEventListener("online",()=>{if(pending)push();else pull();});
function active(){if(!S.days.includes(TODAY)){S.days.push(TODAY);S.days=S.days.slice(-120);}}
function streak(){const set=new Set(S.days);let d=today();if(!set.has(iso(d)))d.setDate(d.getDate()-1);let n=0;while(set.has(iso(d))){n++;d.setDate(d.getDate()-1);}return n;}
function curWeek(){const s=S.start?new Date(S.start+"T00:00:00"):today();return Math.min(12,Math.max(1,Math.floor((today()-s)/(7*864e5))+1));}
function wordsLearned(){return Object.values(S.vocab).filter(v=>v.b>=3).length;}
function dueWords(){return ALLWORDS.filter(x=>S.vocab[x.w]&&S.vocab[x.w].d<=TODAY);}
function topicStats(){
  const t={};for(const [id,a] of Object.entries(S.att)){const q=QBY[id];if(!q)continue;const k=q.topic;t[k]=t[k]||{n:0,c:0};t[k].n+=a.n;t[k].c+=a.c;}
  return t;
}
function accuracy(){let n=0,c=0;for(const a of Object.values(S.att)){n+=a.n;c+=a.c;}return n?Math.round(c/n*100):null;}
function weakest(){const t=topicStats();return Object.entries(t).filter(([,v])=>v.n>=3).map(([k,v])=>({k,acc:v.c/v.n,n:v.n})).sort((a,b)=>a.acc-b.acc);}

/* ---------- stats ---------- */
function renderStats(){
  $("#st-week").textContent="W"+curWeek();
  $("#st-streak").textContent=streak();
  const a=accuracy();$("#st-acc").textContent=a===null?"–":a+"%";
  $("#st-words").textContent=wordsLearned();
  $("#st-lessons").textContent=Object.keys(S.lessons).filter(k=>LBY[k]&&on(S.lessons,k)).length+"/"+LESSONS.length;
  let tot=0,dn=0;WEEKS.forEach((w,i)=>{w.tasks.forEach((_,j)=>{tot++;if(on(S.done,`w${i+1}t${j}`))dn++;});w.lessons.forEach(id=>{tot++;if(on(S.lessons,id))dn++;});});
  const frac=tot?dn/tot:0,C=263.9;$("#ring-prog").setAttribute("stroke-dashoffset",String(C*(1-frac)));
  $("#ring-label").textContent=Math.round(frac*100)+"% of plan done";
}

/* ---------- TODAY ---------- */
function nextGroup(){for(let g=0;g<VOCAB.length;g++){if(VOCAB[g].some(w=>!S.vocab[w[0]]))return g;}return null;}
function renderToday(){
  const w=curWeek(), wk=WEEKS[w-1], dow=today().getDay();
  $("#today-title").textContent="Week "+w+" of 12";
  $("#eyebrow").textContent=today().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  const items=[];
  const pendingLessons=wk.lessons.filter(id=>!on(S.lessons,id));
  if(pendingLessons.length){const l=LBY[pendingLessons[0]];items.push({ok:false,t:l.title,s:"Lesson · "+l.mins+" min · "+l.track,href:"#lesson-"+l.id,ic:"lesson",c:""});}
  else if(wk.lessons.length){items.push({ok:true,t:"This week's lessons",s:"All done",href:"#learn",ic:"lesson",c:""});}
  const due=dueWords().length;
  items.push({ok:due===0,t:due?"Review "+due+" word"+(due>1?"s":""):"No word reviews due",s:"Spaced review",href:"#vocab",ic:"words",c:"v",act:()=>setVMode("review")});
  const g=nextGroup();
  if(g!==null){const left=VOCAB[g].filter(x=>!S.vocab[x[0]]).length;items.push({ok:false,t:"New words · Group "+(g+1),s:left+" of 25 words left",href:"#vocab",ic:"words",c:"v",act:()=>{vGroup=g;setVMode("learn");}});}
  const doneToday=Object.values(S.att).filter(a=>a.last===TODAY).length;
  const topic=wk.lessons.find(id=>QUESTIONS.some(q=>q.topic===id))||null;
  const wkTopic=weakest()[0];
  const pTopic=w>=7&&wkTopic?wkTopic.k:topic;
  if(w>=3){const hardToday=Object.entries(S.att).filter(([id,a])=>a.last===TODAY&&QBY[id]&&QBY[id].diff===3&&QBY[id].sec==="quant").length;
    items.push({ok:hardToday>=5,t:"Hard Quant set",s:Math.min(hardToday,5)+" of 5 done · where 165+ is decided",href:"#practice",ic:"bolt",c:"a",act:()=>presetPractice(null,"new",{sec:"quant",diff:3})});}
  items.push({ok:doneToday>=10,t:"Practice: "+(pTopic&&LBY[pTopic]?LBY[pTopic].title:"mixed set"),s:Math.min(doneToday,10)+" of 10 questions today",href:"#practice",ic:"practice",c:"t",act:()=>presetPractice(pTopic)});
  if(dow===3||dow===6){const wrote=essays.some(e=>e.date===TODAY);items.push({ok:wrote,t:"Timed Issue essay",s:"30 minutes, then get it scored",href:"#essay",ic:"essay",c:"v"});}
  if(w>=7&&dow===6){const mocked=S.mocks.some(m=>m.d===TODAY);items.push({ok:mocked,t:"Timed section",s:"Quant or Verbal at real pace",href:"#mock",ic:"clock",c:"a"});}
  if(dow===0){items.push({ok:false,t:"Review your mistakes",s:"Retry missed questions",href:"#mistakes",ic:"alert",c:"r"});}
  $("#todo").innerHTML=items.map((it,i)=>`<a href="${it.href}" data-i="${i}" class="${it.ok?"ok":""}"><span class="ico ${it.c||""}">${it.ok?ICON.check:ICON[it.ic||"practice"]}</span><span class="li-text"><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span>${it.ok?'<span class="go">Done</span>':ICON.chev}</a>`).join("");
  $$("#todo a").forEach(a=>a.addEventListener("click",()=>{const it=items[+a.dataset.i];if(it.act)it.act();}));
  // weak areas
  const t=topicStats();const rows=Object.entries(t).map(([k,v])=>({k,acc:v.c/v.n,n:v.n})).sort((a,b)=>a.acc-b.acc).slice(0,6);
  $("#weak").innerHTML=rows.length?rows.map(r=>`<div class="${r.acc>=.8?"ok":""}"><span>${esc(LBY[r.k]?LBY[r.k].title:r.k)} <span class="note">· ${r.n} tried</span></span><span class="bar"><i style="width:${Math.round(r.acc*100)}%"></i></span><span class="mono">${Math.round(r.acc*100)}%</span></div>`).join(""):`<p class="note">Your accuracy by topic appears here once you've answered a few practice questions.</p>`;
  const wt=weakest()[0];$("#drill-weak").hidden=!wt;$("#drill-weak").onclick=()=>presetPractice(wt&&wt.k);
  // week
  const ids=wk.tasks.map((_,j)=>`w${w}t${j}`);
  $("#today-week").innerHTML=`<p style="font-weight:700;margin-bottom:4px">${esc(wk.t)}</p>`+
    wk.lessons.map(id=>`<div class="task${on(S.lessons,id)?" checked":""}"><input type="checkbox" disabled${on(S.lessons,id)?" checked":""} aria-label="lesson done"><label><a href="#lesson-${id}" style="color:inherit">Lesson: ${esc(LBY[id].title)}</a></label></div>`).join("")+
    wk.tasks.map((t,j)=>`<div class="task${on(S.done,ids[j])?" checked":""}"><input type="checkbox" id="tw-${ids[j]}" data-task="${ids[j]}"${on(S.done,ids[j])?" checked":""}><label for="tw-${ids[j]}">${esc(t)}</label></div>`).join("");
  renderStats();
}
$("#today-week").addEventListener("change",onTaskToggle);

/* ---------- PLAN ---------- */
function onTaskToggle(e){const id=e.target.dataset.task;if(!id)return;S.done[id]=e.target.checked?Date.now():-Date.now();save();renderPlan();renderToday();}
function renderPlan(){
  const cw=curWeek();$("#startdate").value=S.start||TODAY;
  $("#weeks").innerHTML=WEEKS.map((w,i)=>{const n=i+1, ids=w.tasks.map((_,j)=>`w${n}t${j}`);
    const total=ids.length+w.lessons.length, d=ids.filter(id=>on(S.done,id)).length+w.lessons.filter(id=>on(S.lessons,id)).length;
    const pill=d===total?'<span class="pill done">done</span>':(n===cw?'<span class="pill now">this week</span>':'');
    return `<div class="card week${n===cw?" current":""}"><div class="row spread"><h3>${esc(w.t)}</h3><span class="row"><span class="mono">Week ${n} · ${d}/${total}</span>${pill}</span></div><div class="bar"><i style="width:${d/total*100}%"></i></div>
      ${w.lessons.map(id=>`<div class="task${on(S.lessons,id)?" checked":""}"><input type="checkbox" disabled${on(S.lessons,id)?" checked":""} aria-label="lesson done"><label><a href="#lesson-${id}" style="color:inherit">Lesson: ${esc(LBY[id].title)}</a></label></div>`).join("")}
      ${w.tasks.map((t,j)=>`<div class="task${on(S.done,ids[j])?" checked":""}"><input type="checkbox" id="${ids[j]}" data-task="${ids[j]}"${on(S.done,ids[j])?" checked":""}><label for="${ids[j]}">${esc(t)}</label></div>`).join("")}</div>`;}).join("");
}
$("#weeks").addEventListener("change",onTaskToggle);
$("#startdate").addEventListener("change",e=>{if(e.target.value){S.start=e.target.value;save();renderPlan();renderToday();}});

/* ---------- LESSONS ---------- */
let trackFilter="all";
function renderLessonList(){
  $("#lesson-list").innerHTML=LESSONS.filter(l=>trackFilter==="all"||l.track===trackFilter).slice().sort((a,b)=>a.week-b.week).map(l=>`<a href="#lesson-${l.id}"><span class="wk">WK ${l.week}</span><span><b>${esc(l.title)}</b><small>${esc(l.sum)}</small></span>${on(S.lessons,l.id)?'<span class="pill done">done</span>':`<span class="pill">${esc(l.track)}</span>`}</a>`).join("");
}
$("#track-filter").addEventListener("click",e=>{const t=e.target.dataset.t;if(!t)return;trackFilter=t;$$("#track-filter button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===t));renderLessonList();});
function renderLesson(id){
  const l=LBY[id];if(!l){location.hash="learn";return;}
  const nq=QUESTIONS.filter(q=>q.topic===id).length;
  $("#lesson").innerHTML=`<div class="row"><span class="pill">${esc(l.track)}</span><span class="status">Week ${l.week} · ${l.mins} min</span></div>
   <h2>${esc(l.title)}</h2><p class="note">${esc(l.sum)}</p>
   <div class="lesson-body scroll-x">${l.body}</div>
   <h4>Rules to remember</h4><ul class="rules">${l.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>
   <h4>Traps</h4><ul class="rules">${l.traps.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>
   <h4>Worked examples</h4>
   ${l.examples.map((x,i)=>`<div class="ex"><p>${esc(x.q)}</p><button class="ghost" data-reveal="${i}" style="justify-self:start">Show solution</button><div class="ans" id="ans-${i}" hidden>${esc(x.a)}</div></div>`).join("")}
   <div class="stack" style="margin-top:8px">${nq?`<button class="primary block" id="l-practice">Practice ${nq} questions on this</button>`:(id==="w1"?`<a class="btn primary block" href="#essay">Write an essay</a>`:(id==="v1"?`<a class="btn primary block" href="#vocab">Open vocab</a>`:""))}
   <button class="block" id="l-done">${on(S.lessons,id)?"Marked complete ✓":"Mark lesson complete"}</button>
   <button class="ghost" id="l-ask">Ask the tutor about this</button></div>`;
  $$("#lesson [data-reveal]").forEach(b=>b.onclick=()=>{const a=$("#ans-"+b.dataset.reveal);a.hidden=!a.hidden;b.textContent=a.hidden?"Show solution":"Hide solution";});
  if($("#l-practice"))$("#l-practice").onclick=()=>{presetPractice(id);location.hash="practice";};
  $("#l-done").onclick=()=>{if(on(S.lessons,id))S.lessons[id]=-Date.now();else{S.lessons[id]=Date.now();active();}save();renderLesson(id);renderStats();};
  $("#l-ask").onclick=()=>{location.hash="tutor";$("#t-in").value="I just read the lesson '"+l.title+"'. Can you check my understanding with 3 short questions, one at a time?";$("#t-in").focus();};
  window.scrollTo(0,0);
}

/* ---------- QUESTION RENDERING (shared) ---------- */
const L="ABCDEFGH";
function qHTML(q,name){
  let h="";
  if(q.p)h+=`<div class="passage">${esc(PASSAGES[q.p])}</div>`;
  if(q.kind==="qc"){
    h+=(q.given?`<div class="given">${esc(q.given)}</div>`:"")+`<div class="qc"><div><small>Quantity A</small>${esc(q.a)}</div><div><small>Quantity B</small>${esc(q.b)}</div></div>`;
    h+=`<div class="opts">${QCOPTS.map((o,j)=>`<label class="opt" data-j="${j}"><input type="radio" name="${name}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div>`;
  }else if(q.kind==="num"){
    h+=`<div class="stem">${esc(q.stem)}</div><div class="row"><label class="note" for="${name}-in">Answer</label><input id="${name}-in" data-num inputmode="decimal" autocomplete="off" style="width:130px"><span class="note">Decimals or fractions like 12/5 are fine.</span></div>`;
  }else if(q.kind==="tc"){
    h+=`<div class="stem">${esc(q.stem)}</div><div class="blanks">${q.blanks.map((b,k)=>`<div><div class="note">Blank (${["i","ii","iii"][k]})</div><div class="opts">${b.map((o,j)=>`<label class="opt" data-b="${k}" data-j="${j}"><input type="radio" name="${name}-${k}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div></div>`).join("")}</div>`;
  }else{
    const type=q.kind==="multi"?"checkbox":"radio";
    h+=`<div class="stem">${esc(q.stem)}${q.pick?` <span class="note">Select exactly ${q.pick}.</span>`:(q.kind==="multi"&&!/Select/.test(q.stem)?` <span class="note">Select all that apply.</span>`:"")}</div><div class="opts">${q.opts.map((o,j)=>`<label class="opt" data-j="${j}"><input type="${type}" name="${name}" value="${j}"><span><b>${L[j]}</b>&nbsp; ${esc(o)}</span></label>`).join("")}</div>`;
  }
  return h;
}
function readAnswer(q,el,name){
  if(q.kind==="num"){const raw=(el.querySelector("[data-num]").value||"").replace(/[$,\s%]/g,"");if(!raw)return null;let v;if(raw.includes("/")){const [a,b]=raw.split("/").map(Number);v=a/b;}else v=Number(raw);return isFinite(v)?v:NaN;}
  if(q.kind==="tc"){const p=q.blanks.map((_,k)=>{const c=el.querySelector(`input[name="${name}-${k}"]:checked`);return c?+c.value:null;});return p.includes(null)?null:p;}
  if(q.kind==="qc"){const c=el.querySelector(`input[name="${name}"]:checked`);return c?+c.value:null;}
  const p=[...el.querySelectorAll(`input[name="${name}"]:checked`)].map(c=>+c.value);return p.length?p:null;
}
function restoreAnswer(q,el,name,v){
  if(v===null||v===undefined)return;
  if(q.kind==="num"){el.querySelector("[data-num]").value=String(v);return;}
  if(q.kind==="tc"){v.forEach((j,k)=>{const i=el.querySelector(`input[name="${name}-${k}"][value="${j}"]`);if(i)i.checked=true;});return;}
  (Array.isArray(v)?v:[v]).forEach(j=>{const i=el.querySelector(`input[name="${name}"][value="${j}"]`);if(i)i.checked=true;});
}
function isRight(q,v){
  if(v===null||v===undefined)return false;
  if(q.kind==="num")return Math.abs(v-q.ans)<1e-6;
  if(q.kind==="qc")return v===q.ans;
  if(q.kind==="tc")return v.every((j,k)=>j===q.ans[k]);
  return v.length===q.ans.length&&q.ans.every(a=>v.includes(a));
}
function correctText(q){
  if(q.kind==="num")return String(q.ans);
  if(q.kind==="qc")return QCOPTS[q.ans];
  if(q.kind==="tc")return q.ans.map((j,k)=>q.blanks[k][j]).join(" · ");
  return q.ans.map(j=>L[j]+" ("+q.opts[j]+")").join(", ");
}
function yourText(q,v){
  if(v===null||v===undefined)return "no answer";
  if(q.kind==="num")return String(v);
  if(q.kind==="qc")return QCOPTS[v];
  if(q.kind==="tc")return v.map((j,k)=>q.blanks[k][j]).join(" · ");
  return v.map(j=>L[j]+" ("+q.opts[j]+")").join(", ");
}
function markOptions(q,el,v){
  el.querySelectorAll(".opt").forEach(o=>o.classList.remove("right","wrong"));
  if(q.kind==="num")return;
  if(q.kind==="tc"){q.ans.forEach((a,k)=>{el.querySelector(`.opt[data-b="${k}"][data-j="${a}"]`).classList.add("right");if(v&&v[k]!==a&&v[k]!==null){const w=el.querySelector(`.opt[data-b="${k}"][data-j="${v[k]}"]`);if(w)w.classList.add("wrong");}});return;}
  const ans=q.kind==="qc"?[q.ans]:q.ans, pick=v===null?[]:(Array.isArray(v)?v:[v]);
  el.querySelectorAll(".opt").forEach(o=>{const j=+o.dataset.j;if(ans.includes(j))o.classList.add("right");else if(pick.includes(j))o.classList.add("wrong");});
}
function qText(q){
  let t="";if(q.p)t+="Passage: "+PASSAGES[q.p]+"\n\n";
  if(q.kind==="qc")t+="Quantitative Comparison. "+(q.given?"Given: "+q.given+". ":"")+"Quantity A: "+q.a+". Quantity B: "+q.b+". Choices: "+QCOPTS.join(" / ");
  else if(q.kind==="tc")t+=q.stem+"\n"+q.blanks.map((b,k)=>"Blank "+(k+1)+": "+b.join(", ")).join("\n");
  else t+=q.stem+(q.opts?"\nChoices: "+q.opts.map((o,j)=>L[j]+") "+o).join("  "):"");
  return t;
}
function record(q,ok){const a=S.att[q.id]||{n:0,c:0};a.n++;if(ok)a.c++;a.ok=ok;a.last=TODAY;a.t=Date.now();S.att[q.id]=a;active();save();renderStats();}

/* ---------- AI ---------- */
// With ANTHROPIC_API_KEY set in Vercel the tutor answers inside the app.
// Without it, each AI button opens the Claude app with the question ready (also copied).
const AI={enabled:false};
function langLine(){return S.lang==="bn"?"Reply in Bangla written in English letters (Banglish), keeping GRE terms in English.":"Reply in clear, simple English.";}
async function refreshAI(){
  if(!auth){AI.enabled=false;updateAIText();return;}
  try{const r=await fetch("/api/ai");const j=await r.json();AI.enabled=!!j.enabled;}catch(e){AI.enabled=false;}
  updateAIText();
}
function updateAIText(){
  const t=AI.enabled?"On: the tutor answers inside the app.":"Questions open in the Claude app with everything filled in (and copied, in case you need to paste). To answer inside this app, add an ANTHROPIC_API_KEY in Vercel and log in.";
  const el=$("#ai-text");if(el)el.textContent=t;
  const tn=$("#t-mode");if(tn)tn.textContent=AI.enabled?"":"Opens in the Claude app";
  const g=$("#e-grade");if(g)g.textContent=AI.enabled?"Score my essay":"Score in Claude";
}
function handoff(prompt){
  let copied=false;
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(prompt).catch(()=>{});copied=true;}}catch(e){}
  const url="https://claude.ai/new"+(prompt.length<6000?"?q="+encodeURIComponent(prompt):"");
  const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
  return copied;
}
function handoffNote(copied){return "Opened Claude in a new tab with this question."+(copied?" It's also copied: if the box there is empty, paste it.":"");}
async function aiStream(system,messages,onText,signal){
  const r=await api("/api/ai",{method:"POST",body:JSON.stringify({system,messages}),signal});
  if(!r.ok){let j={};try{j=await r.json();}catch(e){}throw {message:j.error==="ai_disabled"?"AI isn't switched on for this app.":(j.error||"The tutor couldn't answer.")};}
  const reader=r.body.getReader(),dec=new TextDecoder();let text="";
  for(;;){const {value,done}=await reader.read();if(done)break;text+=dec.decode(value,{stream:true});onText(text);}
  if(!text.trim())throw {message:"The tutor sent an empty reply. Try again."};
  return text;
}
async function aiJSON(prompt){
  const r=await api("/api/ai",{method:"POST",body:JSON.stringify({messages:[{role:"user",content:prompt}],json:true,max_tokens:1500})});
  let j={};try{j=await r.json();}catch(e){}
  if(!r.ok)throw {message:j.error||"Scoring failed. Try again."};
  return j.result||{};
}
const aiErr=e=>(e&&e.name==="AbortError")?"Stopped.":(e&&e.message)||"Something went wrong. Try again.";
async function explainDiff(q,v,out,btn){
  const prompt=`You are a patient, expert GRE tutor. Explain this question to a student a different way than the textbook explanation below, step by step, in under 170 words. If the student chose a wrong answer, say exactly why that choice is tempting and why it is wrong. End with one quick tip for similar questions. Plain text, no markdown headings. ${langLine()}\n\nQuestion:\n${qText(q)}\n\nCorrect answer: ${correctText(q)}\nStudent's answer: ${yourText(q,v)}\nTextbook explanation: ${q.exp}`;
  out.hidden=false;
  if(!AI.enabled){out.textContent=handoffNote(handoff(prompt));return;}
  btn.disabled=true;out.textContent="Thinking…";
  try{await aiStream(undefined,[{role:"user",content:prompt}],t=>{out.textContent=t;});}
  catch(e){out.textContent=aiErr(e);}
  btn.disabled=false;
}

/* ---------- PRACTICE ---------- */
let P=null;
function topicOptions(){
  const sec=$("#f-sec").value;const tops=LESSONS.filter(l=>QUESTIONS.some(q=>q.topic===l.id&&(sec==="all"||q.sec===sec)));
  const cur=$("#f-topic").value;
  $("#f-topic").innerHTML=`<option value="all">All topics</option>`+tops.map(l=>`<option value="${l.id}">${esc(l.title)}</option>`).join("");
  if(tops.some(l=>l.id===cur))$("#f-topic").value=cur;
}
function poolFor(){
  const sec=$("#f-sec").value,top=$("#f-topic").value,diff=+$("#f-diff").value,pool=$("#f-pool").value;
  return QUESTIONS.filter(q=>(sec==="all"||q.sec===sec)&&(top==="all"||q.topic===top)&&(!diff||q.diff===diff)&&(pool==="all"||(pool==="new"&&!S.att[q.id])||(pool==="missed"&&S.att[q.id]&&!S.att[q.id].ok)));
}
function updateCount(){const n=poolFor().length;$("#p-count").textContent=n+" matching";$("#p-start").disabled=!n;}
["#f-sec","#f-topic","#f-diff","#f-pool"].forEach(s=>$(s).addEventListener("change",()=>{if(s==="#f-sec")topicOptions();updateCount();}));
function presetPractice(topic,pool,o){
  o=o||{};const q=topic?QUESTIONS.find(x=>x.topic===topic):null;
  $("#f-sec").value=o.sec||(q?q.sec:"all");topicOptions();$("#f-topic").value=topic&&q?topic:"all";$("#f-diff").value=String(o.diff||0);
  if(o.diff)$("#f-len").value="5";
  $("#f-pool").value=pool||"new";
  if(!poolFor().length)$("#f-pool").value="all";
  updateCount();showPracticeSetup();
}
function showPracticeSetup(){$("#p-setup").hidden=false;$("#p-session").hidden=true;$("#p-summary").hidden=true;}
function startSet(list){
  if(!list.length)return;
  P={list,i:0,res:[],t0:Date.now(),qt:Date.now()};
  $("#p-setup").hidden=true;$("#p-summary").hidden=true;$("#p-session").hidden=false;renderPQ();
}
$("#p-start").onclick=()=>{let list=shuffle(poolFor());const n=+$("#f-len").value;list=list.slice(0,n);
  // keep passage questions together
  const key=q=>q.p||q.id,first={};list.forEach((q,i)=>{if(!(key(q) in first))first[key(q)]=i;});list.sort((a,b)=>first[key(a)]-first[key(b)]);startSet(list);};
let pTick=null;
function renderPQ(){
  const q=P.list[P.i], name="pq";P.qt=Date.now();P.checked=false;
  $("#p-pos").textContent="Question "+(P.i+1)+" of "+P.list.length;
  $("#p-bar").style.width=(P.i/P.list.length*100)+"%";
  const lt=LBY[q.topic];
  $("#p-card").innerHTML=`<div class="qhead"><span class="row"><span class="pill">${esc(q.sec==="quant"?"Quant":"Verbal")}</span><span class="note">${esc(lt?lt.title:"")}</span></span><span class="pill ${q.diff===3?"warn":q.diff===1?"done":""}">${["","Easy","Medium","Hard"][q.diff]}</span></div>${qHTML(q,name)}
    <div id="pq-fb"></div><div class="stack"><button class="primary block" id="pq-check">Check answer</button><button class="primary block" id="pq-next" hidden>${P.i+1<P.list.length?"Next question →":"See results"}</button></div>`;
  $("#pq-check").onclick=checkPQ;$("#pq-next").onclick=()=>{P.i++;if(P.i<P.list.length)renderPQ();else practiceSummary();};
  clearInterval(pTick);pTick=setInterval(()=>{$("#p-clock").textContent=fmt((Date.now()-P.qt)/1000);},1000);$("#p-clock").textContent="0:00";
  $("#p-card").scrollIntoView({block:"nearest"});
}
function checkPQ(){
  const q=P.list[P.i],el=$("#p-card"),v=readAnswer(q,el,"pq");
  const fb=$("#pq-fb");
  if(v===null){fb.innerHTML=`<div class="feedback no">Choose an answer first.</div>`;return;}
  if(q.kind==="num"&&isNaN(v)){fb.innerHTML=`<div class="feedback no">Enter a number, like 24, 2.4 or 12/5.</div>`;return;}
  if(q.pick&&v.length!==q.pick){fb.innerHTML=`<div class="feedback no">Select exactly ${q.pick} answers.</div>`;return;}
  if(P.checked)return;P.checked=true;
  const ok=isRight(q,v),secs=Math.round((Date.now()-P.qt)/1000);clearInterval(pTick);
  P.res.push({id:q.id,ok,secs});record(q,ok);markOptions(q,el,v);
  el.querySelectorAll("input").forEach(i=>i.disabled=true);
  fb.innerHTML=`<div class="feedback ${ok?"ok":"no"}"><div><b>${ok?"Correct":"Not quite"}</b> <span class="note">· ${fmt(secs)}</span></div>${ok?"":`<div>Answer: <b>${esc(correctText(q))}</b></div>`}<div>${esc(q.exp)}</div>
   <div class="row"><button class="ghost" id="pq-ai">Explain it another way</button>${ok?"":`<span class="note">Saved to Mistakes</span>`}</div><div class="ai" id="pq-ai-out" hidden></div></div>`;
  $("#pq-ai").onclick=()=>explainDiff(q,v,$("#pq-ai-out"),$("#pq-ai"));
  $("#pq-check").hidden=true;$("#pq-next").hidden=false;
}
function practiceSummary(){
  clearInterval(pTick);$("#p-session").hidden=true;const s=$("#p-summary");s.hidden=false;
  const c=P.res.filter(r=>r.ok).length,n=P.res.length,avg=n?Math.round(P.res.reduce((a,r)=>a+r.secs,0)/n):0;
  const missed=P.res.filter(r=>!r.ok);
  s.innerHTML=`<h2>${c} of ${n} correct</h2><p class="note">Average ${fmt(avg)} per question. Target pace: about 1:30 Verbal, 1:45 Quant.</p>
   ${missed.length?`<h4>Missed</h4><div class="stack">${missed.map(r=>{const q=QBY[r.id];return `<div class="note">• ${esc((q.stem||q.a+" vs "+q.b).slice(0,110))}${(q.stem||"").length>110?"…":""}</div>`;}).join("")}</div>`:""}
   <div class="stack"><button class="primary block" id="ps-again">New set</button>${missed.length?`<button class="block" id="ps-retry">Retry the ${missed.length} missed</button>`:""}</div>`;
  $("#ps-again").onclick=()=>{updateCount();showPracticeSetup();};
  if($("#ps-retry"))$("#ps-retry").onclick=()=>startSet(missed.map(r=>QBY[r.id]));
  renderToday();
}
$("#p-quit").onclick=()=>{if(P&&P.res.length)practiceSummary();else{clearInterval(pTick);showPracticeSetup();}};

/* ---------- VOCAB ---------- */
let vGroup=0, vMode="learn", V=null;
function wordState(w){return S.vocab[w]||null;}
function renderGroups(){
  $("#groups").innerHTML=VOCAB.map((g,i)=>{const known=g.filter(w=>(wordState(w[0])||{}).b>=3).length,seen=g.filter(w=>wordState(w[0])).length;
    return `<button data-g="${i}" aria-pressed="${i===vGroup}"><span style="font-family:var(--f-display);font-weight:500">Group ${i+1}${i>=12?' <span class="pill">adv</span>':''}</span><small>${known}/25 known</small><span class="bar"><i style="width:${known/25*100}%"></i></span></button>`;}).join("");
  const due=dueWords().length;$("#v-due").textContent=due+" due today";
  $("#v-gtitle").textContent="Group "+(vGroup+1);
  $("#wordgrid").innerHTML=VOCAB[vGroup].map(w=>{const s=wordState(w[0]);return `<button data-w="${esc(w[0])}" class="${s?"b"+s.b:""}">${esc(w[0])}</button>`;}).join("");
}
$("#groups").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b)return;vGroup=+b.dataset.g;renderGroups();setVMode(vMode);});
$("#wordgrid").addEventListener("click",e=>{const w=e.target.dataset.w;if(!w)return;V={queue:[WBY[w]],i:0,flip:true,single:true};renderCard();$("#v-stage").scrollIntoView({behavior:"smooth",block:"center"});});
$("#v-mode").addEventListener("click",e=>{const m=e.target.dataset.m;if(m)setVMode(m);});
function setVMode(m){
  vMode=m;$$("#v-mode button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m));renderGroups();
  if(m==="learn"){const words=VOCAB[vGroup].map(w=>WBY[w[0]]);const fresh=words.filter(x=>!wordState(x.w));V={queue:shuffle(fresh.length?fresh:words),i:0,flip:false,done:0};renderCard();}
  else if(m==="review"){V={queue:shuffle(dueWords()),i:0,flip:false,done:0};renderCard();}
  else startQuiz();
}
function grade(x,known){
  const s=wordState(x.w)||{b:0,d:TODAY};
  if(known){s.b=Math.min(5,(s.b||0)+1);s.d=addDays(TODAY,INTERVALS[s.b]);}
  else{s.b=1;s.d=addDays(TODAY,1);}
  s.t=Date.now();S.vocab[x.w]=s;active();save();
}
function renderCard(){
  const st=$("#v-stage");
  if(!V||V.i>=V.queue.length){
    st.innerHTML=`<div class="card" style="text-align:center"><h3>${vMode==="review"?(V&&V.done?"Reviews done for today":"Nothing due right now"):"Group "+(vGroup+1)+" pass complete"}</h3><p class="note">${vMode==="review"?"Words come back automatically when they're due.":"Missed words will come back tomorrow. Try the quiz to test this group."}</p><div class="row" style="justify-content:center"><button class="primary" id="v-quizgo">Quiz Group ${vGroup+1}</button></div></div>`;
    $("#v-quizgo").onclick=()=>setVMode("quiz");renderGroups();renderStats();return;
  }
  const x=V.queue[V.i],s=wordState(x.w);
  st.innerHTML=`<div class="card flash" id="flash" role="button" tabindex="0" aria-label="Flashcard, press to flip">
    <div class="status">${V.single?"":(V.i+1)+" of "+V.queue.length+" · "}Group ${x.g+1} · ${s?(s.b>=3?"known":"learning"):"new"}</div>
    <div class="word">${esc(x.w)}</div><div class="note">${esc(x.pos)}</div>
    <div id="f-back"${V.flip?"":" hidden"}><div class="def">${esc(x.def)}</div><div class="exs">${esc(x.ex)}</div></div>
    <div class="note" id="f-hint"${V.flip?" hidden":""}>Say the meaning, then tap to check</div></div>
    ${V.single?`<button class="block" id="v-close">Close</button>`:`<div class="bigbtns"><button class="no" id="v-again">Didn't know</button><button class="yes" id="v-know">Knew it</button></div>`}`;
  const flip=()=>{V.flip=!V.flip;$("#f-back").hidden=!V.flip;$("#f-hint").hidden=V.flip;};
  $("#flash").onclick=flip;$("#flash").onkeydown=e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();flip();}};
  if(V.single){$("#v-close").onclick=()=>setVMode(vMode);return;}
  $("#v-know").onclick=()=>{grade(x,true);V.i++;V.done++;V.flip=false;renderCard();renderGroups();};
  $("#v-again").onclick=()=>{grade(x,false);if(V.queue.length-V.i>3)V.queue.splice(V.i+4,0,x);else V.queue.push(x);V.i++;V.flip=false;renderCard();renderGroups();};
}
function startQuiz(){
  const g=VOCAB[vGroup].map(w=>WBY[w[0]]);const qs=shuffle(g).slice(0,10).map(x=>{const opts=shuffle([x,...shuffle(g.filter(y=>y.w!==x.w)).slice(0,3)]);return {x,opts};});
  let i=0,score=0;const st=$("#v-stage");
  const show=()=>{
    if(i>=qs.length){st.innerHTML=`<div class="card" style="text-align:center"><h3>${score} / ${qs.length}</h3><p class="note">${score>=9?"Strong. Move on to the next group.":"Missed words were moved back into review."}</p><div class="row" style="justify-content:center"><button class="primary" id="vq-again">Quiz again</button></div></div>`;$("#vq-again").onclick=startQuiz;renderGroups();return;}
    const {x,opts}=qs[i];
    st.innerHTML=`<div class="card"><div class="row spread"><span class="mono">${i+1} / ${qs.length}</span><span class="mono">Score ${score}</span></div><div style="font-family:var(--f-display);font-weight:700;font-size:30px">${esc(x.w)}</div><div class="opts">${opts.map((o,j)=>`<button class="opt" data-j="${j}" style="text-align:left">${esc(o.def)}</button>`).join("")}</div><div id="vq-fb"></div></div>`;
    $$("#v-stage .opt").forEach(b=>b.onclick=()=>{
      const pick=opts[+b.dataset.j],ok=pick.w===x.w;
      $$("#v-stage .opt").forEach(o=>{o.disabled=true;if(opts[+o.dataset.j].w===x.w)o.classList.add("right");});
      if(!ok)b.classList.add("wrong");else score++;
      grade(x,ok);
      $("#vq-fb").innerHTML=`<div class="feedback ${ok?"ok":"no"}"><div class="note">${esc(x.ex)}</div><button class="primary" id="vq-next" style="justify-self:start">Next</button></div>`;
      $("#vq-next").onclick=()=>{i++;show();};$("#vq-next").focus();
    });
  };
  show();
}

/* ---------- MOCK ---------- */
let M=null,mTick=null;
function buildMock(sec){
  const pool=QUESTIONS.filter(q=>q.sec===sec);
  if(sec==="quant"){
    const qc=shuffle(pool.filter(q=>q.kind==="qc")).slice(0,4);
    const rest=shuffle(pool.filter(q=>q.kind!=="qc")).slice(0,8);
    return [...qc,...rest];
  }
  const tc=shuffle(pool.filter(q=>q.topic==="v2")).slice(0,4), se=shuffle(pool.filter(q=>q.topic==="v3")).slice(0,3);
  const pid=shuffle(Object.keys(PASSAGES))[0], rc=pool.filter(q=>q.p===pid).slice(0,3);
  const arg=shuffle(pool.filter(q=>q.topic==="v6")).slice(0,2);
  const list=[...tc,...rc,...se,...arg];
  return list.slice(0,12);
}
$$("[data-mock]").forEach(b=>b.onclick=()=>{
  const sec=b.dataset.mock;M={sec,list:buildMock(sec),i:0,ans:{},mark:{},end:Date.now()+(sec==="quant"?21:18)*60000,mins:sec==="quant"?21:18};
  $("#m-setup").hidden=true;$("#m-result").hidden=true;$("#m-run").hidden=false;renderMQ();
  clearInterval(mTick);mTick=setInterval(mClock,500);mClock();
});
function mClock(){if(!M)return;const left=(M.end-Date.now())/1000;$("#m-timer").textContent=fmt(left);$("#m-timer").classList.toggle("low",left<120);if(left<=0)submitMock();}
function saveMA(){if(!M)return;const q=M.list[M.i];const v=readAnswer(q,$("#m-card"),"mq");M.ans[q.id]=v===null||(q.kind==="num"&&isNaN(v))?null:v;}
function renderMQ(){
  const q=M.list[M.i];
  $("#m-grid").innerHTML=M.list.map((x,i)=>`<button data-i="${i}" class="${M.ans[x.id]!=null?"answered":""}${M.mark[x.id]?" marked":""}${i===M.i?" cur":""}">${i+1}</button>`).join("");
  $("#m-card").innerHTML=`<div class="qhead"><span class="status">Question ${M.i+1} of ${M.list.length}</span>${M.mark[q.id]?'<span class="pill now">marked</span>':""}</div>${qHTML(q,"mq")}`;
  restoreAnswer(q,$("#m-card"),"mq",M.ans[q.id]);
  $("#m-mark").textContent=M.mark[q.id]?"Unmark":"Mark";
  $("#m-prev").disabled=M.i===0;$("#m-next").disabled=M.i===M.list.length-1;
}
$("#m-card").addEventListener("change",()=>{if(!M)return;saveMA();const q=M.list[M.i],b=$$("#m-grid button")[M.i];if(b)b.classList.toggle("answered",M.ans[q.id]!=null);});
$("#m-grid").addEventListener("click",e=>{const i=e.target.dataset.i;if(i===undefined)return;saveMA();M.i=+i;renderMQ();});
$("#m-prev").onclick=()=>{saveMA();M.i--;renderMQ();};
$("#m-next").onclick=()=>{saveMA();M.i++;renderMQ();};
$("#m-mark").onclick=()=>{const q=M.list[M.i];M.mark[q.id]=!M.mark[q.id];saveMA();renderMQ();};
$("#m-submit").onclick=()=>{saveMA();const un=M.list.filter(q=>M.ans[q.id]==null).length;
  if(un&&!$("#m-submit").dataset.confirm){$("#m-submit").dataset.confirm="1";$("#m-submit").textContent=un+" unanswered. Submit anyway?";return;}submitMock();};
function submitMock(){
  if(!M)return;saveMA();clearInterval(mTick);
  const used=Math.min(M.mins*60,Math.round((Date.now()-(M.end-M.mins*60000))/1000));
  let c=0;const rows=M.list.map((q,i)=>{const v=M.ans[q.id],ok=isRight(q,v);if(ok)c++;record(q,ok);return {q,v,ok,i};});
  S.mocks.push({d:TODAY,sec:M.sec,n:M.list.length,c,secs:used,t:Date.now()});S.mocks=S.mocks.slice(-40);save();
  $("#m-submit").dataset.confirm="";$("#m-submit").textContent="Submit section";
  $("#m-run").hidden=true;const r=$("#m-result");r.hidden=false;
  r.innerHTML=`<div class="card"><h2>${c} / ${M.list.length} correct · ${M.sec==="quant"?"Quant":"Verbal"}</h2><p class="note">Time used ${fmt(used)} of ${M.mins}:00. On the real test, a strong first section (about 9+ of 12) is what unlocks the harder second section.</p>
    <div class="qgrid">${rows.map(x=>`<button data-r="${x.i}" class="${x.ok?"r":"w"}">${x.i+1}</button>`).join("")}</div>
    <button class="primary block" id="mr-new">Back to sections</button></div><div id="mr-detail" class="view"></div>`;
  const detail=i=>{const {q,v,ok}=rows[i];$("#mr-detail").innerHTML=`<div class="card q" id="mr-card"><div class="qhead"><span class="mono">Question ${i+1}</span><span class="pill ${ok?"done":"warn"}">${ok?"correct":"missed"}</span></div>${qHTML(q,"mr")}<div class="feedback ${ok?"ok":"no"}"><div>Your answer: ${esc(yourText(q,v))}</div><div>Correct: <b>${esc(correctText(q))}</b></div><div>${esc(q.exp)}</div><div class="row"><button class="ghost" id="mr-ai">Explain it another way</button></div><div class="ai" id="mr-ai-out" hidden></div></div></div>`;
    restoreAnswer(q,$("#mr-card"),"mr",v);markOptions(q,$("#mr-card"),v);$$("#mr-card input").forEach(x=>x.disabled=true);$("#mr-ai").onclick=()=>explainDiff(q,v,$("#mr-ai-out"),$("#mr-ai"));$("#mr-card").scrollIntoView({behavior:"smooth",block:"start"});};
  $$("[data-r]").forEach(b=>b.onclick=()=>detail(+b.dataset.r));
  $("#mr-new").onclick=()=>{$("#m-result").hidden=true;$("#m-setup").hidden=false;renderMockHistory();};
  M=null;renderMockHistory();renderToday();
}
function renderMockHistory(){
  const h=S.mocks.slice().reverse().slice(0,8);
  $("#m-history").hidden=!h.length;
  $("#m-history").innerHTML=h.length?`<h4>Recent sections</h4><div class="scroll-x"><table><thead><tr><th>Date</th><th>Section</th><th>Score</th><th>Time</th></tr></thead><tbody>${h.map(m=>`<tr><td class="mono">${m.d}</td><td>${m.sec==="quant"?"Quant":"Verbal"}</td><td class="mono">${m.c}/${m.n}</td><td class="mono">${fmt(m.secs)}</td></tr>`).join("")}</tbody></table></div>`:"";
}

/* ---------- ESSAY ---------- */
let eTick=null,eEnd=null,eStart=null;
function renderPrompts(){$("#e-prompt-sel").innerHTML=PROMPTS.map((p,i)=>`<option value="${i}">${i+1}. ${esc(p[0].slice(0,60))}${p[0].length>60?"…":""}</option>`).join("")+`<option value="custom">Paste your own prompt (e.g. from the ETS pool)</option>`;showPrompt();}
function showPrompt(){
  const v=$("#e-prompt-sel").value;
  if(v==="custom"){$("#e-claim").innerHTML=`<textarea id="e-custom" rows="3" placeholder="Paste the claim and its instructions here"></textarea>`;$("#e-instr").textContent="";return;}
  const p=PROMPTS[+v];$("#e-claim").textContent=p[0];$("#e-instr").textContent=INSTR[p[1]];
}
function promptText(){const v=$("#e-prompt-sel").value;if(v==="custom"){const c=$("#e-custom");return {claim:c?c.value.trim():"",instr:""};}const p=PROMPTS[+v];return {claim:p[0],instr:INSTR[p[1]]};}
$("#e-prompt-sel").addEventListener("change",showPrompt);
function wc(){const t=$("#e-text").value.trim();return t?t.split(/\s+/).length:0;}
$("#e-text").addEventListener("input",()=>{$("#e-words").textContent=wc()+" words";LS.set("gre-hub-draft",$("#e-text").value);});
$("#e-start").onclick=()=>{
  if(eTick){clearInterval(eTick);eTick=null;$("#e-start").textContent="Start 30-min timer";$("#e-timer").textContent="30:00";$("#e-timer").classList.remove("low");return;}
  eStart=Date.now();eEnd=eStart+30*60000;$("#e-start").textContent="Stop timer";$("#e-text").focus();
  eTick=setInterval(()=>{const left=(eEnd-Date.now())/1000;$("#e-timer").textContent=fmt(left);$("#e-timer").classList.toggle("low",left<180);if(left<=0){clearInterval(eTick);eTick=null;$("#e-timer").textContent="Time's up";$("#e-start").textContent="Start 30-min timer";}},500);
};
function minsUsed(){return eStart?Math.min(30,Math.round((Date.now()-eStart)/60000)):null;}
let essayTs=null;
function saveEssay(feedback){
  const p=promptText(),text=$("#e-text").value.trim();if(!text)return null;
  if(!essayTs)essayTs=Date.now();
  const prev=essays.find(e=>e.ts===essayTs)||{};
  const doc={claim:p.claim,instr:p.instr,text:text.slice(0,20000),words:wc(),mins:minsUsed(),date:TODAY,ts:essayTs,u:Date.now()};
  if(feedback)doc.feedback=feedback;else if(prev.feedback&&prev.text===doc.text)doc.feedback=prev.feedback;
  essays=essays.filter(e=>e.ts!==essayTs);essays.push(doc);essays=essays.slice(-40);
  renderEssays();active();save();return doc;
}
$("#e-save").onclick=()=>{const d=saveEssay();$("#e-feedback").innerHTML=d?`<p class="note">Saved.</p>`:`<p class="note">Write something first.</p>`;};
$("#e-new").onclick=()=>{essayTs=null;$("#e-text").value="";LS.del("gre-hub-draft");$("#e-words").textContent="0 words";$("#e-feedback").innerHTML="";$("#e-text").focus();};
$("#e-grade").onclick=async()=>{
  const p=promptText(),text=$("#e-text").value.trim(),out=$("#e-feedback");
  if(wc()<80){out.innerHTML=`<div class="feedback no">Write at least a few paragraphs (80+ words) before scoring.</div>`;return;}
  if(!p.claim){out.innerHTML=`<div class="feedback no">Add the prompt you're answering.</div>`;return;}
  const rubric=`You are an experienced GRE Analytical Writing rater and writing tutor. Score this Issue essay on the official 0–6 scale (half points allowed) using the GRE Issue scoring guide: a clear, insightful position; development with persuasive reasons and specific examples; logical organization; control of language; and whether it addresses the specific task instruction. Be honest and calibrated; do not inflate. ${langLine()}`;
  const essayBlock=`Claim: ${p.claim}\nTask instruction: ${p.instr||"(given in the claim above)"}\nEssay (${wc()} words${minsUsed()?", written in "+minsUsed()+" minutes":""}):\n${text.slice(0,15000)}`;
  if(!AI.enabled){
    saveEssay();
    const copied=handoff(rubric+"\nGive: the score, a two-sentence summary, up to 3 strengths, up to 4 specific improvements, and one weak sentence from the essay rewritten better.\n\n"+essayBlock);
    out.innerHTML=`<div class="feedback ok">${esc(handoffNote(copied))} Your essay is saved here.</div>`;return;
  }
  $("#e-grade").disabled=true;out.innerHTML=`<div class="ai">Reading your essay… this can take up to a minute.</div>`;
  const prompt=rubric+`\nReply with only JSON in this shape: {"score": 4.5, "summary": "two sentences", "strengths": ["..."], "improvements": ["specific, actionable"], "better_sentence": {"original": "a weak sentence quoted from the essay", "improved": "your rewrite"}}. Up to 3 strengths and 4 improvements.\n\n`+essayBlock;
  try{
    const r=await aiJSON(prompt);
    const fb={score:Number(r.score),summary:String(r.summary||""),strengths:(r.strengths||[]).map(String).slice(0,3),improvements:(r.improvements||[]).map(String).slice(0,4),better:r.better_sentence&&r.better_sentence.original?{o:String(r.better_sentence.original),i:String(r.better_sentence.improved||"")}:null};
    out.innerHTML=feedbackHTML(fb);saveEssay(fb);
  }catch(e){out.innerHTML=`<div class="feedback no">${esc(aiErr(e))}</div>`;}
  $("#e-grade").disabled=false;
};
function feedbackHTML(fb){
  return `<div class="feedback ${fb.score>=4.5?"ok":"no"}"><div class="row"><span class="timer">${isFinite(fb.score)?fb.score.toFixed(1):"–"}</span><span class="note">estimated score out of 6</span></div><div>${esc(fb.summary)}</div>
   ${fb.strengths.length?`<div><b>Strengths</b><ul class="rules">${fb.strengths.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`:""}
   ${fb.improvements.length?`<div><b>To raise your score</b><ul class="rules">${fb.improvements.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`:""}
   ${fb.better?`<div><b>Sentence upgrade</b><div class="note">Before: ${esc(fb.better.o)}</div><div>After: ${esc(fb.better.i)}</div></div>`:""}
   <div class="note">AI estimate for practice only. Official essay scores come from ETS.</div></div>`;
}
function renderEssays(){
  const list=essays.slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  $("#e-list").innerHTML=list.length?list.map((e,i)=>`<details class="err"><summary><span class="mono">${esc(e.date)} · ${e.words} words${e.feedback&&isFinite(e.feedback.score)?" · score "+Number(e.feedback.score).toFixed(1):""}</span><br>${esc(e.claim)}</summary><p style="white-space:pre-wrap;font-size:15px;margin-top:8px">${esc(e.text)}</p>${e.feedback?feedbackHTML(e.feedback):""}</details>`).join(""):`<p class="note">Your saved essays and their scores will appear here.</p>`;
}

/* ---------- TUTOR ---------- */
let turns=[],tCtl=null;
function progressSummary(){
  const w=weakest().slice(0,4).map(x=>(LBY[x.k]?LBY[x.k].title:x.k)+" "+Math.round(x.acc*100)+"%").join(", ");
  const acc=accuracy();
  return `Week ${curWeek()} of a 12-week plan. Lessons done: ${Object.keys(S.lessons).filter(k=>on(S.lessons,k)).length}/${LESSONS.length}. Practice accuracy: ${acc===null?"no data yet":acc+"%"} over ${Object.values(S.att).reduce((a,x)=>a+x.n,0)} answers. Weakest topics: ${w||"not enough data"}. Vocab words learned: ${wordsLearned()}/${ALLWORDS.length}. Recent timed sections: ${S.mocks.slice(-3).map(m=>m.sec+" "+m.c+"/"+m.n).join(", ")||"none"}. Target: Quant 166+, Verbal 155+ (about 321+) for a CS master's. The student is a computer science graduate from Bangladesh, strong in math logic, so Quant teaching can move fast and focus on traps and hard questions; Verbal needs steady vocabulary and reading work.`;
}
function rules(){return `You are a warm but rigorous GRE tutor inside a study app. Student context: ${progressSummary()}
Teach actively: explain briefly, then check understanding with a question. When you give practice questions, write original ones and wait for the student's answer before revealing the solution. Correct mistakes honestly and specifically. Keep replies under 200 words unless asked for more. Plain text, short lists allowed, no markdown headings. ${langLine()} If the student writes in Bangla or Banglish, you may answer in Banglish.`;}
function renderChat(){
  $("#t-chat").innerHTML=turns.map(t=>`<div class="msg ${t.role==="user"?"me":"bot"}">${esc(t.content)}</div>`).join("")||`<p class="note">Pick a starter above or type your own question.</p>`;
  $("#t-chat").scrollTop=$("#t-chat").scrollHeight;
}
async function sendTutor(text){
  text=text.trim();if(!text)return;
  if(!AI.enabled){
    const copied=handoff(rules()+"\n\nStudent's question: "+text);
    turns.push({role:"user",content:text,local:true});turns.push({role:"assistant",content:handoffNote(copied),local:true});$("#t-in").value="";renderChat();return;
  }
  turns.push({role:"user",content:text});$("#t-in").value="";renderChat();
  const bubble=document.createElement("div");bubble.className="msg bot";bubble.textContent="Thinking…";$("#t-chat").appendChild(bubble);$("#t-chat").scrollTop=$("#t-chat").scrollHeight;
  tCtl=new AbortController();$("#t-send").disabled=true;$("#t-stop").hidden=false;$("#t-status").textContent="";
  const recent=turns.slice(-16).filter(t=>!t.local);
  try{
    const reply=await aiStream(rules(),recent,t=>{bubble.textContent=t;$("#t-chat").scrollTop=$("#t-chat").scrollHeight;},tCtl.signal);
    turns.push({role:"assistant",content:reply});
  }catch(e){
    const partial=bubble.textContent&&bubble.textContent!=="Thinking…"?bubble.textContent:"";
    if(partial)turns.push({role:"assistant",content:partial});else turns.pop();
    if(!(e&&e.name==="AbortError"))$("#t-status").textContent=aiErr(e);
  }
  $("#t-send").disabled=false;$("#t-stop").hidden=true;tCtl=null;renderChat();
}
$("#t-form").addEventListener("submit",e=>{e.preventDefault();sendTutor($("#t-in").value);});
$("#t-in").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendTutor($("#t-in").value);}});
$("#t-stop").onclick=()=>{if(tCtl)tCtl.abort();};
$("#t-clear").onclick=()=>{if(tCtl)tCtl.abort();turns=[];renderChat();};
$("#t-chips").addEventListener("click",e=>{if(e.target.tagName==="BUTTON")sendTutor(e.target.textContent);});
$("#t-lang").addEventListener("change",e=>{S.lang=e.target.value;S.langT=Date.now();save();});

/* ---------- MISTAKES ---------- */
function renderMistakes(){
  const missed=Object.entries(S.att).filter(([id,a])=>!a.ok&&QBY[id]).map(([id,a])=>({q:QBY[id],a})).sort((x,y)=>(y.a.last||"").localeCompare(x.a.last||""));
  $("#mk-retry").disabled=!missed.length;
  $("#mk-auto").innerHTML=missed.length?`<p class="note"><b>${missed.length}</b> question${missed.length>1?"s":""} to retry</p>`+missed.slice(0,40).map(({q,a})=>`<div class="err"><div class="mono">${esc(a.last)} · ${esc(LBY[q.topic]?LBY[q.topic].title:"")} · tried ${a.n}×</div><div>${esc(q.stem||("Compare: "+q.a+" vs "+q.b))}</div></div>`).join(""):`<p class="note">No missed questions right now. Questions you miss in Practice or Mock show up here until you get them right.</p>`;
  const list=errors.slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  if(!list.length){$("#errlist").innerHTML="";return;}
  const tally={};list.forEach(x=>tally[x.why]=(tally[x.why]||0)+1);
  $("#errlist").innerHTML=`<p class="note"><b>${list.length}</b> logged · ${Object.entries(tally).sort((a,b)=>b[1]-a[1]).map(([k,v])=>esc(k)+": "+v).join(" · ")}</p>`+list.map(x=>`<div class="err"><div class="mono">${esc(x.date)} · ${esc(x.type)} · ${esc(x.why)}</div><div><b>${esc(x.src)}</b>${x.topic?" — "+esc(x.topic):""}</div>${x.lesson?`<div>${esc(x.lesson)}</div>`:""}</div>`).join("");
}
$("#mk-retry").onclick=()=>{const list=Object.entries(S.att).filter(([id,a])=>!a.ok&&QBY[id]).map(([id])=>QBY[id]);location.hash="practice";startSet(shuffle(list).slice(0,20));};
$("#errform").addEventListener("submit",async e=>{
  e.preventDefault();const entry={src:$("#x-src").value.trim(),type:$("#x-type").value,why:$("#x-why").value,topic:$("#x-topic").value.trim(),lesson:$("#x-lesson").value.trim(),date:TODAY,ts:Date.now()};
  if(!entry.src)return;
  errors.push(entry);renderMistakes();active();save();$("#x-status").textContent="Added";
  ["#x-src","#x-topic","#x-lesson"].forEach(s=>$(s).value="");$("#x-add").disabled=false;
});

/* ---------- ROUTING ---------- */
const VIEWS=["today","learn","lesson","practice","vocab","more","mock","essay","tutor","mistakes","plan","account"];
const TITLES={today:"Today",learn:"Lessons",lesson:"Lesson",practice:"Practice",vocab:"Words",more:"More",mock:"Timed section",essay:"Essay",tutor:"AI tutor",mistakes:"Mistakes",plan:"12-week plan",account:"Account"};
const PARENT={lesson:"learn",mock:"more",essay:"more",tutor:"more",mistakes:"more",plan:"more",account:"more"};
let lastView=null;
addEventListener("scroll",()=>{$("#appbar").classList.toggle("scrolled",scrollY>4);},{passive:true});
function route(){
  let h=location.hash.slice(1);let v=h.startsWith("lesson-")?"lesson":(VIEWS.includes(h)?h:"today");
  VIEWS.forEach(x=>{$("#v-"+x).hidden=x!==v;});
  const tab=PARENT[v]||v;
  $("#bar-title").textContent=TITLES[v]||"GRE Prep";
  const back=$("#back-btn");back.hidden=!PARENT[v];back.setAttribute("href","#"+(PARENT[v]||"today"));
  if(v!==lastView){window.scrollTo(0,0);lastView=v;}
  $$("#tabs a").forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+tab?"page":"false"));
  if(v==="today")renderToday();
  if(v==="learn")renderLessonList();
  if(v==="lesson")renderLesson(h.slice(7));
  if(v==="plan")renderPlan();
  if(v==="account")renderAccount();
  if(v==="mistakes")renderMistakes();
  if(v==="mock"&&!M){$("#m-setup").hidden=false;$("#m-run").hidden=true;renderMockHistory();}
  if(v==="vocab"){renderGroups();if(!V)setVMode(vMode);}
  if(v==="practice"&&!P)updateCount();
  const cur=$$("#tabs a").find(a=>a.getAttribute("aria-current")==="page");if(cur&&cur.scrollIntoView)cur.scrollIntoView({block:"nearest",inline:"nearest"});
}
addEventListener("hashchange",route);

function renderAll(){renderStats();route();renderEssays();renderMistakes();$("#t-lang").value=S.lang||"en";}

/* ---------- ACCOUNT ---------- */
let acctMode="login",signupOpen=null,inviteOnly=false;
async function loadAuthInfo(){
  try{const r=await fetch("/api/auth");const j=await r.json();signupOpen=!!j.signupOpen;inviteOnly=!!j.inviteOnly;}catch(e){signupOpen=null;}
  if(!auth&&signupOpen&&acctMode==="login")setAcctMode("signup");
  renderAccount();
}
function setAcctMode(m){acctMode=m;$$("#acct-mode button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m));
  $("#a-submit").textContent=m==="signup"?"Create account":"Log in";$("#a-pass").autocomplete=m==="signup"?"new-password":"current-password";
  $("#a-code-wrap").hidden=!(m==="signup"&&inviteOnly);renderAccount();}
function renderAccount(){
  $("#acct-out").hidden=!!auth;$("#acct-in").hidden=!auth;
  const av=$("#avatar");av.textContent=auth?auth.username[0].toUpperCase():"?";av.classList.toggle("off",!auth);
  $("#acct-chip").setAttribute("aria-label",auth?"Account: "+auth.username:"Sign in to sync");
  $("#more-acct").textContent=auth?"Signed in as "+auth.username:"Sign in to sync your devices";
  if(auth){$("#a-name").textContent=auth.username;setSync(syncText||"Synced");}
  else{const n=$("#a-hint");n.textContent=acctMode==="signup"?(signupOpen?"This app has no account yet: the first one created becomes the owner.":(inviteOnly?"Sign-up needs the invite code.":"This app already has its owner account. Log in with it.")):"";}
  updateAIText();renderInstall();
}
$("#acct-mode").addEventListener("click",e=>{const m=e.target.dataset.m;if(m)setAcctMode(m);});
$("#acct-form").addEventListener("submit",async e=>{
  e.preventDefault();const btn=$("#a-submit"),st=$("#a-status");btn.disabled=true;st.textContent=acctMode==="signup"?"Creating account…":"Logging in…";
  try{
    const r=await fetch("/api/auth",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:acctMode,username:$("#a-user").value,password:$("#a-pass").value,code:$("#a-code").value})});
    const j=await r.json();if(!r.ok)throw j;
    auth={token:j.token,username:j.username};LS.set("gre-auth",auth);$("#a-pass").value="";st.textContent="";
    renderAccount();await pull();refreshAI();
  }catch(err){st.textContent=(err&&err.error)||"Couldn't reach the server. Check your connection.";}
  btn.disabled=false;
});
function signedOut(msg){auth=null;LS.del("gre-auth");AI.enabled=false;clearTimeout(pushTimer);pushTimer=null;pending=false;setSync(msg||"Saved on this device");renderAccount();}
$("#a-logout").onclick=async()=>{
  if(pending)await push();
  try{await api("/api/auth",{method:"POST",body:JSON.stringify({action:"logout"})});}catch(e){}
  signedOut("Logged out · progress stays on this device");
};
$("#a-syncnow").onclick=async()=>{if(pending)await push();await pull();};

/* ---------- INSTALL (PWA) ---------- */
let installEvt=null;
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;renderInstall();});
addEventListener("appinstalled",()=>{installEvt=null;renderInstall();});
function renderInstall(){
  const t=$("#inst-text");if(!t)return;
  const can=!!installEvt&&!isStandalone();
  $("#install-btn").hidden=!can;$("#inst-btn2").hidden=!can;
  t.textContent=isStandalone()?"Installed. You're using the app version."
    :can?"Install it like a normal app: it gets its own icon and opens full screen, and lessons, vocab and practice work offline."
    :isIOS()?"On iPhone or iPad: open this page in Safari, tap the Share button, then 'Add to Home Screen'."
    :"In Chrome or Edge: use the install icon in the address bar, or the browser menu → 'Install app' / 'Add to Home screen'.";
}
async function doInstall(){if(!installEvt)return;installEvt.prompt();try{await installEvt.userChoice;}catch(e){}installEvt=null;renderInstall();}
$("#install-btn").onclick=doInstall;$("#inst-btn2").onclick=doInstall;
if("serviceWorker" in navigator&&location.protocol==="https:"){addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{});});}

/* ---------- BOOT ---------- */
(function(){
  const d=LS.get("gre-data",null);
  if(d){S=Object.assign(BLANK(),d.S||{});errors=Array.isArray(d.errors)?d.errors:[];essays=Array.isArray(d.essays)?d.essays:[];}
  const draft=LS.get("gre-hub-draft",null);if(typeof draft==="string")$("#e-text").value=draft;
})();
if(!S.start)S.start=TODAY;
$("#p-total").textContent=QUESTIONS.length;
topicOptions();renderPrompts();$("#e-words").textContent=wc()+" words";renderChat();renderAll();
setSync(auth?"Loading…":"Saved on this device · sign in to sync");
loadAuthInfo();
if(auth){pull().then(refreshAI);}else updateAIText();
})();
