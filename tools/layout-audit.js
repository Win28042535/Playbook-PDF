/* Playbook layout audit — dev-only, never loaded by dna-quiz-flow.html.
   Run in the browser on the served book (dev server serves the repo root):
     await (await fetch('/tools/layout-audit.js')).text().then(eval);
     await pbAudit.run();          // checks on the current build
     await pbAudit.save('base');   // store a snapshot in localStorage
     await pbAudit.diff('base');   // compare the current build to a stored snapshot
   Sheets are compared by fingerprint = outerHTML minus id and folio text,
   because those two legitimately shift when another section's page count changes. */
(function(){
  function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36);}
  function norm(s){return s.replace(/\s+/g,' ').trim();}
  function hit(a,b){return !(a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom);}
  function textNodes(root){var out=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode()))if(norm(n.nodeValue))out.push(n);return out;}
  function textRects(root){var rs=[];textNodes(root).forEach(function(n){var r=document.createRange();r.selectNodeContents(n);[].forEach.call(r.getClientRects(),function(x){if(x.width&&x.height)rs.push(x);});});return rs;}
  function pages(){return [].slice.call(document.querySelectorAll('.pb-page'));}
  function isContent(pg){return !/^(cover|toc)$/.test(pg.dataset.sect||'');}
  function fingerprint(pg){
    var c=pg.cloneNode(true);c.removeAttribute('id');
    [].forEach.call(c.querySelectorAll('.pb-pn'),function(e){e.innerHTML='';});
    return hash(c.outerHTML);
  }
  async function settle(){
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    // loading="lazy" images never load while the tab is hidden — cap the wait instead of hanging
    await Promise.race([
      Promise.all([].map.call(document.images,function(i){return i.complete?0:new Promise(function(r){i.addEventListener('load',r);i.addEventListener('error',r);});})),
      new Promise(function(r){setTimeout(r,3000);})
    ]);
    await new Promise(function(r){setTimeout(r,300);});
  }
  function snapshot(){
    var bag={};
    var sheets=pages().map(function(pg){
      var b=pg.querySelector('.pb-body');
      if(isContent(pg))textNodes(pg).forEach(function(n){var t=norm(n.nodeValue);bag[t]=(bag[t]||0)+1;});
      return {sect:pg.dataset.sect||'',panel:pg.__pbPanel||'',pbx:pg.classList.contains('pbx'),full:hash(pg.outerHTML),fp:fingerprint(pg),
        over:!!(b&&b.scrollHeight>b.clientHeight+1)};
    });
    return {at:new Date().toISOString(),url:location.pathname+location.search,sheets:sheets,bag:bag};
  }
  function checks(){
    var all=pages(),out={sheets:all.length,overflow:[],zoomed:[],folio:null,toc:null,imagesBroken:[],pbx:null};
    all.forEach(function(pg){
      var b=pg.querySelector('.pb-body');
      if(b&&b.scrollHeight>b.clientHeight+1)out.overflow.push(pg.id||pg.dataset.sect);
      var z=pg.querySelectorAll('[style*="zoom"]').length;if(z)out.zoomed.push((pg.id||pg.dataset.sect)+':'+z);
    });
    // folio: "หน้า i / N", consecutive, N = numbered sheet count
    var num=all.filter(function(p){return p.querySelector('.pb-pn');}),bad=[];
    num.forEach(function(pg,i){var m=norm(pg.querySelector('.pb-pn').textContent).match(/(\d+)\s*\/\s*(\d+)/);if(!m||+m[1]!==i+1||+m[2]!==num.length)bad.push(pg.id);});
    out.folio={numbered:num.length,bad:bad};
    // TOC rows point at real sheets and print their real number
    var rows=[].slice.call(document.querySelectorAll('.toc-row')),tbad=[];
    rows.forEach(function(r){var id=(r.getAttribute('href')||'').slice(1),t=document.getElementById(id),n=norm((r.querySelector('.toc-n')||{}).textContent||'');
      if(!t||'pb-p'+n!==id)tbad.push(id+'≠'+n);});
    out.toc={rows:rows.length,bad:tbad};
    [].forEach.call(document.images,function(i){if(!i.naturalWidth)out.imagesBroken.push(i.getAttribute('src'));});
    // Ver.2 sheets: footer position and margins as % of the sheet (reference: label ~95%, hairline ~97%, side margins ~9-10%)
    var px=all.filter(function(p){return p.classList.contains('pbx');});
    if(px.length){
      var m={footLine:[],footLabel:[],marginL:[],marginR:[],textOutside:0};
      px.forEach(function(pg){
        var pr=pg.getBoundingClientRect(),W=pr.width,H=pr.height,s=W/794,cs=getComputedStyle(pg);
        var ft=pg.querySelector('.pbx-ft');
        if(ft){var fr=ft.getBoundingClientRect(),lb=ft.firstElementChild.getBoundingClientRect();
          m.footLine.push((fr.bottom-pr.top)/H*100);m.footLabel.push((lb.top-pr.top)/H*100);
          m.marginL.push((fr.left-pr.left)/W*100);m.marginR.push((pr.right-fr.right)/W*100);}
        var L=pr.left+parseFloat(cs.paddingLeft)*s-1,R=pr.right-parseFloat(cs.paddingRight)*s+1;
        textRects(pg).forEach(function(t){if(t.left<L||t.right>R)m.textOutside++;});
      });
      var rng=function(a){return a.length?[+Math.min.apply(0,a).toFixed(1),+Math.max.apply(0,a).toFixed(1)]:null;};
      out.pbx={sheets:px.length,footLinePct:rng(m.footLine),footLabelPct:rng(m.footLabel),marginLPct:rng(m.marginL),marginRPct:rng(m.marginR),textOutsideMargins:m.textOutside};
      // openers vs the reference "SECTION 1" page (kicker ~31.5%, underline ~42%,
      // body ~47%, column from 19.7% and ~59% wide)
      out.pbx.openers=px.filter(function(pg){return pg.querySelector('.pbx-open');}).map(function(pg){
        var pr=pg.getBoundingClientRect(),W=pr.width,H=pr.height,s=W/794;
        var y=function(el,edge){return el?+(((el.getBoundingClientRect()[edge])-pr.top)/H*100).toFixed(1):null;};
        var k=pg.querySelector('.pbx-kicker'),t=pg.querySelector('.pbx-open-t'),l=pg.querySelector('.pbx-lede');
        var tr=t.getBoundingClientRect();
        return {id:pg.id,
          kickerTopPct:y(k,'top'),titleTopPct:y(t,'top'),underlinePct:y(t,'bottom'),ledeTopPct:y(l,'top'),ledeBottomPct:y(l,'bottom'),
          colXPct:+((tr.left-pr.left)/W*100).toFixed(1),colWPct:l?+(l.getBoundingClientRect().width/W*100).toFixed(1):null,
          titleLines:Math.round(tr.height/(parseFloat(getComputedStyle(t).lineHeight)*s))};
      });
    }
    // lettering: the CAPS-over-script lockups and the script words inside titles (canvas ink, not DOM boxes)
    out.script=scriptChecks();
    // balance: sheets whose content ends before 62% of the page, how many carry the bottom contour field, and whether any field reaches content
    out.balance=(function(){
      var H=794*3508/2480,partial=0,fields=0,touching=[];
      [].forEach.call(document.querySelectorAll('.pb-page.pbx'),function(pg){
        if(pg.id==='pb-toc')return;var P=pg.getBoundingClientRect(),k=P.width/794,b=pg.querySelector('.pb-body'),end=0,w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT),n,rg=document.createRange(),j,rs;
        while((n=w.nextNode())){if(!n.nodeValue.trim())continue;rg.selectNodeContents(n);rs=rg.getClientRects();for(j=0;j<rs.length;j++)end=Math.max(end,(rs[j].bottom-P.top)/k);}
        [].forEach.call(b.querySelectorAll('img,.pbx-db,.pbx-vr,.pbx-card'),function(e){end=Math.max(end,(e.getBoundingClientRect().bottom-P.top)/k);});
        if(end/H<.62)partial++;
        var f=pg.querySelector('.pbx-bt');if(f){fields++;if(parseFloat(f.style.top)<end+24)touching.push(pg.id);}
      });
      return {partialUnder62:partial,bottomFields:fields,fieldsTouchingContent:touching};
    })();
    return out;
  }
  /* lockups: caps and script drawn on two canvases at their real positions -> pixels where both are inked (must be 0),
     the clearance between the caps' lowest ink and the script's highest ink, and how far each line's ink starts from the axis.
     titles: must contain no script word. */
  function scriptChecks(){
    function ink(ctx,w,h){var d=ctx.getImageData(0,0,w,h).data,m=new Uint8Array(w*h),i;for(i=0;i<w*h;i++)m[i]=d[i*4+3]>40?1:0;return m;}
    var res={lockups:[],titles:null};
    [].forEach.call(document.querySelectorAll('.pbx-lock'),function(L){
      var c=L.querySelector('.pbx-lock-c'),s=L.querySelector('.pbx-lock-s'),cs=getComputedStyle(c),ss=getComputedStyle(s),Lr=L.getBoundingClientRect(),W=420,H=110;
      var ca=document.createElement('canvas'),cb=document.createElement('canvas');ca.width=cb.width=W;ca.height=cb.height=H;
      var xa=ca.getContext('2d'),xb=cb.getContext('2d'),cr=c.getBoundingClientRect(),sr=s.getBoundingClientRect();
      xa.font='500 '+cs.fontSize+' Cinzel';if('letterSpacing' in xa)xa.letterSpacing=cs.letterSpacing;var mc=xa.measureText('M');
      xa.fillText(c.textContent,cr.left-Lr.left,(cr.top-Lr.top)+(parseFloat(cs.lineHeight)-(mc.fontBoundingBoxAscent+mc.fontBoundingBoxDescent))/2+mc.fontBoundingBoxAscent);
      xb.font='400 '+ss.fontSize+' "Pinyon Script"';var ms=xb.measureText('M');
      xb.fillText(s.textContent,sr.left-Lr.left,(sr.top-Lr.top)+(parseFloat(ss.lineHeight)-(ms.fontBoundingBoxAscent+ms.fontBoundingBoxDescent))/2+ms.fontBoundingBoxAscent);
      var A=ink(xa,W,H),B=ink(xb,W,H),both=0,cBot=0,sTop=H,sBot=0,cL=W,sL=W,x,y,i;
      for(y=0;y<H;y++)for(x=0;x<W;x++){i=y*W+x;if(A[i]&&B[i])both++;if(A[i]){cBot=Math.max(cBot,y);cL=Math.min(cL,x);}if(B[i]){sTop=Math.min(sTop,y);sBot=Math.max(sBot,y);sL=Math.min(sL,x);}}
      res.lockups.push({lock:c.textContent+' / '+s.textContent,overlapPx:both,clearancePx:sTop-cBot,capsInkLeft:cL,scriptInkLeft:sL,bottomRoomPx:Math.round(Lr.height)-sBot});
    });
    // titles carry no script any more: a script word inside a title is flagged here
    res.titles={scriptWordsInTitles:document.querySelectorAll('.pbx-art-t .pbx-en').length};
    return res;
  }
  function diffSnap(a,b){
    var r={sheets:[a.sheets.length,b.sheets.length],identicalFull:false,sects:{},textAdded:{},textRemoved:{}};
    r.identicalFull=a.sheets.length===b.sheets.length&&a.sheets.every(function(s,i){return s.full===b.sheets[i].full;});
    // per panel (falls back to sect for snapshots taken before panels were recorded), compare the
    // fingerprints of sheets that are NOT on the new templates in the current build
    var key=function(s){return s.panel||s.sect;};
    var group=function(snap,onlyOld){var g={};snap.sheets.forEach(function(s){if(!/^(cover|toc)$/.test(s.sect)&&!(onlyOld&&s.pbx))(g[key(s)]=g[key(s)]||[]).push(s.fp);});return g;};
    var ga=group(a,false),gb=group(b,true);
    Object.keys(ga).forEach(function(k){
      var newOnes=b.sheets.filter(function(s){return key(s)===k&&s.pbx;}).length;
      r.sects[k]=newOnes?('migrated sheets: '+newOnes+' (old fingerprints not compared)'):(JSON.stringify(ga[k])===JSON.stringify(gb[k]||[])?'unchanged':'CHANGED');
    });
    Object.keys(Object.assign({},a.bag,b.bag)).forEach(function(t){var d=(b.bag[t]||0)-(a.bag[t]||0);if(d>0)r.textAdded[t]=d;else if(d<0)r.textRemoved[t]=-d;});
    return r;
  }
  window.pbAudit={
    run:async function(){await settle();return checks();},
    save:async function(name){await settle();var s=snapshot();localStorage.setItem('pbAudit:'+name,JSON.stringify(s));return {saved:name,sheets:s.sheets.length,url:s.url};},
    diff:async function(name){await settle();var a=JSON.parse(localStorage.getItem('pbAudit:'+name)||'null');if(!a)return 'no snapshot "'+name+'"';return diffSnap(a,snapshot());},
    snapshot:snapshot,fingerprint:fingerprint
  };
})();
