// Three engraved drawings in the house style of assets/eng-*.svg (read off eng-heart.svg):
// viewBox 240x228, ink #111318 at .78 group opacity, round caps; ground = hatched ellipse (cx122 cy206 rx70 ry9, 0.45/.55);
// body = light hatch 0.4/.35 inside the outline clip; shade = dense hatch 0.45/.85 in a crescent clip on the right/bottom;
// outline 1.6/.9; highlight stroke 1.6/.55; key details 1.8/.9 over a 6px paper-coloured underlay.
const fs=require('fs'),path=require('path');const OUT=process.argv[2];
const f=n=>Math.round(n*10)/10;
function hatch(id,deg,step,sw,op,box){ // parallel lines at deg covering box [x0,y0,x1,y1]
  const a=deg*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a),nx=-dy,ny=dx;
  const cx=(box[0]+box[2])/2,cy=(box[1]+box[3])/2,R=Math.hypot(box[2]-box[0],box[3]-box[1])/2+4;
  let s='<g clip-path="url(#'+id+')">';
  for(let t=-R;t<=R;t+=step){const px=cx+nx*t,py=cy+ny*t;s+='<path d="M'+f(px-dx*R)+' '+f(py-dy*R)+'L'+f(px+dx*R)+' '+f(py+dy*R)+'" stroke-width="'+sw+'" stroke-opacity="'+op+'"/>';}
  return s+'</g>';
}
function svg(clips,body){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 228"><defs>'+
    Object.keys(clips).map(k=>'<clipPath id="'+k+'"><path d="'+clips[k]+'" clip-rule="evenodd"/></clipPath>').join('')+'</defs>'+
    '<g fill="none" stroke="#111318" stroke-opacity=".78" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>';
}
const GROUND='M52 206a70 9 0 1 0 140 0a70 9 0 1 0 -140 0Z';
const ground=()=>hatch('c0',62,3.2,0.45,0.55,[52,197,192,215]);
const line=(d,w,o)=>'<path d="'+d+'" stroke-width="'+w+'" stroke-opacity="'+o+'"/>';
const under=(d,w)=>'<path d="'+d+'" stroke="#fafafc" stroke-width="'+w+'" stroke-opacity="1"/>';
const circ=(cx,cy,r)=>'M'+(cx-r)+' '+cy+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0Z';

// 1. ประกัน — a shield with a check mark
{const S='M120 26C146 38 172 44 196 42C198 118 170 168 120 198C70 168 42 118 44 42C68 44 94 38 120 26Z';
 const SH='M120 26C146 38 172 44 196 42C198 118 170 168 120 198C152 166 180 120 180 56C158 54 138 46 120 38Z'; // right bevel
 const IN='M120 40C142 50 164 55 184 54C184 116 162 158 120 184C78 158 56 116 56 54C76 55 98 50 120 40Z';
 const CK='M90 112L112 134L154 86';
 const body=hatch('c0',62,3.2,0.45,0.55,[52,197,192,215])+hatch('c1',50,2.6,0.4,0.35,[40,22,200,200])+hatch('c2',-40,1.8,0.45,0.85,[118,22,200,200])+
   line(S,1.6,0.9)+line(IN,1,0.6)+line('M60 62Q62 104 82 140',1.6,0.55)+under(CK,7)+line(CK,2.2,0.9);
 fs.writeFileSync(path.join(OUT,'eng-shield.svg'),svg({c0:GROUND,c1:S,c2:SH},body));}

// 2. ของสะสม/ทางเลือก — a wristwatch on a display stand
{const CASE=circ(120,92,44),BEZ=circ(120,92,36),DIAL=circ(120,92,30);
 const STRAP_T='M100 54L104 18H136L140 54Z',STRAP_B='M100 130L104 160H136L140 130Z';
 const STAND='M70 168H170L182 200H58Z',TOP='M70 168H170L166 162H74Z';
 const CRES='M164 92a44 44 0 0 1 -44 44a44 44 0 0 0 30 -14a40 40 0 0 0 0 -60a44 44 0 0 1 14 30Z';
 const STAND_SIDE='M150 168H170L182 200H158Z';
 let ticks='';for(let i=0;i<12;i++){const a=i*Math.PI/6,r1=i%3?26:23,r2=29;ticks+=line('M'+f(120+Math.sin(a)*r1)+' '+f(92-Math.cos(a)*r1)+'L'+f(120+Math.sin(a)*r2)+' '+f(92-Math.cos(a)*r2),i%3?1:1.6,0.9);}
 const body=ground()+
   hatch('c1',50,2.6,0.4,0.35,[60,150,190,205])+hatch('c3',-40,1.8,0.45,0.85,[148,160,190,205])+line(STAND,1.6,0.9)+line(TOP,1,0.7)+
   hatch('c4',90,2.2,0.4,0.45,[96,14,144,164])+line(STRAP_T,1.6,0.9)+line(STRAP_B,1.6,0.9)+
   line('M104 28H136M104 40H137M103 142H137M104 152H136',0.8,0.5)+
   hatch('c5',50,2.6,0.4,0.35,[70,44,170,140])+hatch('c2',-40,1.8,0.45,0.85,[118,44,170,140])+
   under(BEZ,4)+line(CASE,1.6,0.9)+line(BEZ,1.2,0.8)+'<path d="'+DIAL+'" fill="#fafafc" stroke-width="1" stroke-opacity="0.7"/>'+ticks+
   line('M164 86h8v12h-8',1.4,0.9)+line('M120 92L120 70',1.8,0.9)+line('M120 92L136 100',1.8,0.9)+'<circle cx="120" cy="92" r="2" fill="#111318" stroke="none"/>'+
   line('M86 70Q92 60 102 56',1.6,0.55);
 fs.writeFileSync(path.join(OUT,'eng-watch.svg'),svg({c0:GROUND,c1:STAND,c3:STAND_SIDE,c4:STRAP_T+STRAP_B,c5:CASE,c2:CRES},body));}

// 3. สุขภาพ (journey side 5) — a stethoscope
{const TUBE='M150 138C150 110 120 104 120 80M120 80C100 74 86 58 88 30M120 80C140 74 154 58 152 30';
 const CHEST=circ(150,162,26),DIA=circ(150,162,18),CRES='M176 162a26 26 0 0 1 -26 26a26 26 0 0 0 18 -8a24 24 0 0 0 0 -36a26 26 0 0 1 8 18Z';
 const body=ground()+
   '<path d="'+TUBE+'" stroke-width="9" stroke-opacity="0.9"/>'+under(TUBE,5.4)+hatch('ct',-40,2,0.4,0.6,[80,24,160,142])+
   line('M117 76h6v8h-6z',1.4,0.9)+
   '<circle cx="88" cy="26" r="6" fill="#111318" fill-opacity=".85" stroke="none"/><circle cx="152" cy="26" r="6" fill="#111318" fill-opacity=".85" stroke="none"/>'+
   hatch('c1',50,2.6,0.4,0.35,[120,132,180,192])+hatch('c2',-40,1.8,0.45,0.85,[140,132,180,192])+
   line(CHEST,1.6,0.9)+'<path d="'+DIA+'" fill="#fafafc" stroke-width="1.2" stroke-opacity="0.8"/>'+hatch('c3',50,1.9,0.4,0.5,[132,144,168,180])+line(DIA,1.2,0.8)+
   line('M150 136v-6',2,0.9)+line('M132 150Q136 142 144 140',1.6,0.55);
 // tube interior shading: the hatch is clipped to the tube's own band (a widened stroke can't be a clip, so use a polygon hull around the curve)
 fs.writeFileSync(path.join(OUT,'eng-stetho.svg'),svg({c0:GROUND,c1:CHEST,c2:CRES,c3:DIA,ct:'M146 140C146 112 116 106 116 84C98 78 82 62 84 30L92 30C90 56 104 70 120 76C136 70 150 56 148 30L156 30C158 62 142 78 124 84C124 106 154 112 154 140Z'},body));}
console.log('ok');
