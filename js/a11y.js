/* Site-wide accessibility options: text size, spacing, page colour, read aloud. */
(function(){
  var KEY='ywds-a11y',MIN=100,MAX=150,STEP=10;
  var root=document.documentElement,synth=window.speechSynthesis;
  var s={size:100,spacing:false,colour:'default'};
  try{var saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(var k in s){if(typeof saved[k]===typeof s[k])s[k]=saved[k];}}catch(e){}
  s.size=Math.min(MAX,Math.max(MIN,Math.round(s.size/STEP)*STEP))||100;
  if(['default','cream','dark'].indexOf(s.colour)<0)s.colour='default';

  function save(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
  function apply(){
    if(s.size>MIN){root.style.fontSize=s.size+'%';root.setAttribute('data-a11y-size',s.size);}
    else{root.style.fontSize='';root.removeAttribute('data-a11y-size');}
    root.toggleAttribute('data-a11y-spacing',s.spacing);
    if(s.colour==='default')root.removeAttribute('data-a11y-colour');else root.setAttribute('data-a11y-colour',s.colour);
  }
  apply();

  var D='html:root[data-a11y-colour="dark"]',C='html:root[data-a11y-colour="cream"]';
  var css=[
    /* text size: body is set in px on every page, so tie it back to the root */
    'html[data-a11y-size] body{font-size:1.03125rem}',
    /* keep the menu button on screen on phones when the text is enlarged */
    'html[data-a11y-size] .brand{flex-shrink:1;min-width:0}',
    'html:is([data-a11y-size],[data-a11y-spacing]) .band-label{flex-wrap:wrap}',
    'html:is([data-a11y-size],[data-a11y-spacing]) :is(h1,h2,h3,h4){overflow-wrap:break-word;hyphens:auto}',
    '@media (max-width:600px){html:is([data-a11y-size],[data-a11y-spacing]) ul[style*="columns"]{columns:1 !important}',
    /* long words in the main heading must still fit a phone screen */
    'html:is([data-a11y-size],[data-a11y-spacing]) h1{font-size:min(2.2rem,9.5vw)}}',
    'html[data-a11y-spacing] body{line-height:2;letter-spacing:.06em;word-spacing:.18em}',
    'html[data-a11y-spacing] :is(p,li,dd,dt,td,th,blockquote,label){line-height:2}',
    'html[data-a11y-spacing] :is(h1,h2,h3,h4){line-height:1.4;letter-spacing:.02em}',
    'html[data-a11y-spacing] p{margin-bottom:1.4em}',

    C+'{--cream:#F8EFCF;--cream-deep:#F0E4BC;--sky:#F1E9C8;--sage-tint:#ECE6C2;--card:#FDF7E1;--line:#D6C99E;',
    '--olive:#48624B;--olive-deep:#3A5140;--hero-grad:linear-gradient(180deg,#F3EBCB 0%,#F8EFCF 100%)}',

    D+'{color-scheme:dark;--cream:#101418;--cream-deep:#181D23;--sky:#162633;--sage:#8FB487;--sage-soft:#55705A;--sage-tint:#1D2A22;',
    '--olive:#A8D5A2;--olive-deep:#C5E6C0;--navy:#9CC7EA;--navy-deep:#C3DFF5;--ink:#F4F6F7;--ink-soft:#CFD8DE;',
    '--card:#1A2028;--line:#55626E;--hero-grad:linear-gradient(180deg,#162633 0%,#101418 100%);--shadow:none;--focus:#FFD54A}',
    /* places where the pages pair a variable background with hard-coded text */
    D+' footer.site{background:#05090D;border-top:1px solid var(--line)}',
    D+' .bookinfo{background:#0B1620}',
    D+' :is(.btn.green,.cta-mini,.calmock .d.sel){color:#101418 !important}',
    D+' :is(.bnum,.box-navy strong,.mockribbon-unused){color:var(--cream)}',
    D+' .brainarea p.dys.more{color:#22384A}',
    ':where(html[data-a11y-colour]) body{background:var(--cream);color:var(--ink)}',
    ':where(html[data-a11y-colour]) a{color:var(--navy)}',

    '#a11y{position:fixed;left:14px;bottom:14px;z-index:150;font-family:"Segoe UI",Verdana,sans-serif;font-size:.92rem;line-height:1.4;letter-spacing:0;word-spacing:0;color:var(--ink,#22384A)}',
    '#a11y button{font:inherit;letter-spacing:0;cursor:pointer}',
    '#a11y-btn{width:52px;height:52px;border-radius:50%;border:2px solid var(--cream,#F7F4EC);background:var(--navy,#274A68);color:var(--cream,#F7F4EC);display:grid;place-items:center;padding:0;box-shadow:0 2px 10px rgba(34,56,74,.3)}',
    '#a11y-btn:hover{background:var(--navy-deep,#1D3A53)}',
    '#a11y-btn svg{width:30px;height:30px}',
    '#a11y-panel{position:absolute;left:0;bottom:62px;width:290px;max-width:calc(100vw - 28px);max-height:calc(100vh - 100px);overflow:auto;background:var(--card,#fff);border:1px solid var(--line,#DCD6C6);border-radius:18px;padding:16px 16px 14px;box-shadow:0 10px 30px rgba(34,56,74,.22)}',
    '#a11y-panel[hidden]{display:none}',
    '#a11y-panel h2{font-size:1.05rem;margin:0 0 .6em;line-height:1.2;letter-spacing:0;color:var(--navy,#274A68)}',
    '#a11y-panel .g{margin:0 0 12px;padding:0;border:0;min-width:0}',
    '#a11y-panel .lb{display:block;padding:0;font-weight:700;font-size:.82rem;color:var(--ink-soft,#4A5D6B);margin-bottom:5px}',
    '#a11y-panel .r{display:flex;gap:6px;flex-wrap:wrap}',
    '#a11y-panel .r button{flex:1 1 auto;min-height:40px;padding:7px 12px;border-radius:999px;border:2px solid var(--navy,#274A68);background:transparent;color:var(--navy,#274A68);font-weight:700;font-size:.88rem}',
    '#a11y-panel .r button:hover{background:var(--sage-tint,#E7ECE0)}',
    '#a11y-panel .r button[aria-pressed="true"]{background:var(--navy,#274A68);color:var(--cream,#F7F4EC)}',
    '#a11y-panel .r button[aria-disabled="true"]{opacity:.45;cursor:default}',
    '#a11y-panel .st{margin:6px 0 0;font-size:.8rem;color:var(--ink-soft,#4A5D6B);min-height:1.2em;max-width:none}',
    '#a11y-panel .all{width:100%;min-height:40px;border-radius:999px;border:2px solid transparent;background:var(--olive,#5C7A5E);color:#fff;font-weight:700}',
    '#a11y-panel .all:hover{background:var(--olive-deep,#48624B)}',
    D+' #a11y-panel .all{color:#101418}',
    '#a11y :focus-visible{outline:3px solid var(--focus,#274A68);outline-offset:2px}',
    '@media (prefers-reduced-motion:no-preference){#a11y-btn{transition:background .15s}#a11y-panel:not([hidden]){animation:a11y-in .18s ease}}',
    '@keyframes a11y-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '@media print{#a11y{display:none}}'
  ].join('\n');
  var st=document.createElement('style');st.id='a11y-css';st.textContent=css;document.head.appendChild(st);

  function build(){
    var box=document.createElement('div');box.id='a11y';
    box.innerHTML=
      '<button type="button" id="a11y-btn" aria-label="Accessibility options" aria-expanded="false" aria-controls="a11y-panel" title="Accessibility options">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><circle cx="12" cy="4.6" r="2.1"/><path d="M4.2 7.6a1 1 0 0 0-.4 2l5.2 1.2v3.4l-2.1 5.5a1 1 0 0 0 1.9.7l2.2-5.4h2l2.2 5.4a1 1 0 0 0 1.9-.7L15 14.2v-3.4l5.2-1.2a1 1 0 0 0-.4-2L14.6 8.7H9.4z"/></svg></button>'+
      '<div id="a11y-panel" role="group" aria-labelledby="a11y-h" hidden>'+
      '<h2 id="a11y-h">Accessibility options</h2>'+
      '<fieldset class="g"><legend class="lb">Text size</legend><div class="r">'+
        '<button type="button" data-a="smaller" aria-label="Smaller text">A&minus;</button>'+
        '<button type="button" data-a="sizereset" aria-label="Reset text size">Reset</button>'+
        '<button type="button" data-a="larger" aria-label="Larger text">A+</button></div>'+
        '<p class="st" id="a11y-size" aria-live="polite"></p></fieldset>'+
      '<fieldset class="g"><legend class="lb">Spacing</legend><div class="r">'+
        '<button type="button" data-a="spacing" aria-pressed="false">More space between lines and letters</button></div></fieldset>'+
      '<fieldset class="g"><legend class="lb">Page colour</legend><div class="r">'+
        '<button type="button" data-c="default">Default</button>'+
        '<button type="button" data-c="cream">Cream</button>'+
        '<button type="button" data-c="dark">Dark</button></div></fieldset>'+
      '<fieldset class="g" id="a11y-read"><legend class="lb">Read aloud</legend><div class="r">'+
        '<button type="button" data-a="read">Read</button>'+
        '<button type="button" data-a="stop">Stop</button></div>'+
        '<p class="st">Reads the text you have selected, or the whole page.</p></fieldset>'+
      '<button type="button" class="all" data-a="reset">Reset all</button>'+
      '</div>';
    document.body.appendChild(box);

    var btn=box.querySelector('#a11y-btn'),panel=box.querySelector('#a11y-panel'),sizeOut=box.querySelector('#a11y-size');
    var q=function(a){return box.querySelector('[data-a="'+a+'"]');};
    if(!synth||!window.SpeechSynthesisUtterance)box.querySelector('#a11y-read').hidden=true;

    function sync(){
      sizeOut.textContent='Text size '+s.size+'%';
      q('smaller').setAttribute('aria-disabled',String(s.size<=MIN));
      q('larger').setAttribute('aria-disabled',String(s.size>=MAX));
      q('spacing').setAttribute('aria-pressed',String(s.spacing));
      box.querySelectorAll('[data-c]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.c===s.colour));});
    }
    function commit(){apply();save();sync();}
    function open(o){panel.hidden=!o;btn.setAttribute('aria-expanded',String(o));}

    var picked='';
    q('read').addEventListener('pointerdown',function(){picked=String(window.getSelection()||'').trim();});
    function voice(){
      var v=synth.getVoices();
      return v.filter(function(x){return /^en[-_]GB/i.test(x.lang);})[0]||v.filter(function(x){return /^en/i.test(x.lang);})[0]||null;
    }
    function pageText(){
      var m=document.querySelector('main');
      if(m)return m.innerText;
      return Array.prototype.map.call(document.querySelectorAll('body > :not(#a11y):not(script):not(style)'),function(e){return e.innerText||'';}).join('\n');
    }
    function read(){
      var t=picked||String(window.getSelection()||'').trim()||pageText();picked='';
      synth.cancel();
      var v=voice();
      /* short chunks: some browsers cut off long utterances */
      (t.replace(/\s+/g,' ').match(/[^.!?]+[.!?]*\s*/g)||[]).reduce(function(a,p){
        var l=a.length-1;
        if(l>=0&&(a[l]+p).length<220)a[l]+=p;else while(p){a.push(p.slice(0,220));p=p.slice(220);}
        return a;
      },[]).forEach(function(p){
        if(!p.trim())return;
        var u=new SpeechSynthesisUtterance(p);u.lang='en-GB';if(v)u.voice=v;
        synth.speak(u);
      });
    }

    btn.addEventListener('click',function(){open(panel.hidden);});
    box.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||b===btn)return;
      if(b.dataset.c){s.colour=b.dataset.c;commit();return;}
      switch(b.dataset.a){
        case 'smaller':s.size=Math.max(MIN,s.size-STEP);commit();break;
        case 'larger':s.size=Math.min(MAX,s.size+STEP);commit();break;
        case 'sizereset':s.size=100;commit();break;
        case 'spacing':s.spacing=!s.spacing;commit();break;
        case 'read':read();break;
        case 'stop':synth.cancel();break;
        case 'reset':s.size=100;s.spacing=false;s.colour='default';if(synth)synth.cancel();commit();break;
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&!panel.hidden){open(false);btn.focus();}
    });
    document.addEventListener('click',function(e){if(!panel.hidden&&!box.contains(e.target))open(false);});
    window.addEventListener('pagehide',function(){if(synth)synth.cancel();});
    if(synth&&synth.getVoices)synth.getVoices();
    sync();
  }
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build);
})();
