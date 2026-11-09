(() => {
  'use strict';
  const $=id=>document.getElementById(id), key='yinian-muyu-session-v1';
  const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  let state={day:day(),count:0,auto:true,volume:40},sound=false,ctx,animationTimer;
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.day===day()&&Number.isSafeInteger(saved.count)&&saved.count>=0)state={...state,...saved,auto:saved.auto!==false,volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(100,saved.volume)):40};}catch{}
  function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{}}
  function draw(){ $('strike-count').textContent=state.count.toLocaleString('zh-TW');$('auto-strike').setAttribute('aria-pressed',String(state.auto));$('auto-label').textContent=state.auto?'自動敲擊中':'自動敲擊已暫停';$('volume').value=state.volume; }
  function tone(){if(!sound||!ctx||ctx.state!=='running')return;const t=ctx.currentTime;[440,782,1170].forEach((frequency,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,t);osc.frequency.exponentialRampToValueAtTime(frequency*.82,t+.17);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime((state.volume/100)*[.6,.23,.09][i]+.0001,t+.003);gain.gain.exponentialRampToValueAtTime(.0001,t+[.23,.12,.07][i]);osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.26);});}
  function strike(){if(state.day!==day()){state.day=day();state.count=0;}state.count++;save();draw();const stage=$('wood-stage');stage.classList.remove('striking');void stage.offsetWidth;stage.classList.add('striking');clearTimeout(animationTimer);animationTimer=setTimeout(()=>stage.classList.remove('striking'),800);tone();}
  $('strike-wood').addEventListener('click',strike);
  $('auto-strike').addEventListener('click',()=>{state.auto=!state.auto;save();draw();});
  $('sound-toggle').addEventListener('click',async()=>{try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();sound=!sound;$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-label').textContent=sound?'音效已開啟':'開啟音效';if(sound)tone();}catch{$('sound-label').textContent='此瀏覽器不支援音效';}});
  $('volume').addEventListener('input',e=>{state.volume=Number(e.target.value);save();});
  document.addEventListener('keydown',e=>{if(e.code!=='Space'||e.repeat||e.target.closest('input,button,textarea,select,[contenteditable]')||$('settings-dialog').open)return;e.preventDefault();strike();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.day!==day()){state.day=day();state.count=0;save();draw();}});
  draw();setInterval(()=>{if(state.auto&&!document.hidden)strike();},1000);
})();
