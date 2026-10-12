// VAMPRE v0.1 sandbox - side-view pixel horror. 320x180 canvas scaled up.
const W=320,H=180,cv=document.getElementById('c'),g=cv.getContext('2d');
const WW=2800,FL=160,TH=[0,10,25,45,70,100];
const FORMS=['TEST SUBJECT','AWAKENED','STALKER','NIGHTBORN','APEX','PRIMORDIAL'];
const ceilAt=x=>x<800?95:20, rnd=(a,b)=>a+Math.random()*(b-a);
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px';cv.style.margin=Math.max(0,(innerHeight-H*s)/2)+'px auto'}
addEventListener('resize',fit);fit();
const K={},M={x:160,y:90,d:0};
addEventListener('keydown',e=>{if(!K[e.code])press(e.code);K[e.code]=1;if(e.code.startsWith('Arrow')||e.code=='Space')e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();M.x=(e.clientX-r.left)/r.width*W;M.y=(e.clientY-r.top)/r.height*H});
cv.addEventListener('mousedown',e=>{if(e.button==2)press('KeyE');else{M.d=1;if(state!='play')press('Enter')}});
addEventListener('mouseup',()=>M.d=0);cv.addEventListener('contextmenu',e=>e.preventDefault());
let P,E,B,FX,WL,PT,cam=0,shake=0,flash=0,time=0,msg='',msgT=0,god=0,xp=0,pts=0,up,chk=0,state='title',spT=0;
const lvl=()=>{let l=0;TH.forEach((t,i)=>{if(xp>=t)l=i});return l};
const dims=t=>({lg:4+t,to:6+t,h:4+t+6+t+5});
function init(){xp=0;pts=0;chk=0;up={tk:0,feed:0,dash:0};
 WL=[{x:800,y:95,h:65,w:6,hp:3,cd:0},{x:1500,y:20,h:140,w:6,hp:4,cd:0},{x:2200,y:20,h:140,w:6,hp:5,cd:0}];
 PT=[[220,125,80],[480,118,90],[900,120,100],[1050,85,90],[1250,110,100],[1600,100,120],[1760,60,100],[1950,95,110],[2300,110,100],[2450,70,100],[2580,110,60]].map(a=>({x:a[0],y:a[1],w:a[2]}));
 E=[];B=[];FX=[];
 for(let i=0;i<44;i++){const x=rnd(120,2700);if(WL.some(w=>Math.abs(w.x-x)<14))continue;mk(Math.random()<.1+x/2800*.35?'guard':'sci',x,FL)}
 PT.forEach(p=>mk('sci',p.x+p.w/2,p.y));
 [690,715,1400,1425,2100,2125].forEach(x=>mk('crate',x,FL));
 respawn();state='play';say('ESCAPE THE FACILITY. HOLD LMB NEAR HUMANS.',4)}
function respawn(){const h=dims(lvl()).h;P={x:chk||30,y:FL,vx:0,vy:0,f:1,hp:100,on:1,dash:0,dcd:0,inv:0,w:6,h,t:'p',dvx:0,dvy:0,an:0}}
function mk(t,x,y){E.push({t,x,y,vx:0,vy:0,w:t=='crate'?8:5,h:t=='crate'?8:10,cd:rnd(0,1.5),dir:1,held:0,thr:0,dead:0,on:0})}
function say(m,s){msg=m;msgT=s}
function press(c){
 if(state!='play'){if(c=='Enter'||c=='Space'){if(state=='title'||state=='win')init();else{xp=Math.max(0,xp);respawn();state='play'}}return}
 if(c=='Digit1'&&pts>0&&up.tk<5){up.tk++;pts--}
 if(c=='Digit2'&&pts>0&&up.feed<5){up.feed++;pts--}
 if(c=='Digit3'&&pts>0&&up.dash<5&&xp>=TH[2]){up.dash++;pts--}
 if(c=='KeyX')gain(10);if(c=='KeyG'){god^=1;say(god?'GOD MODE ON':'GOD MODE OFF',1.5)}
 if(c=='ShiftLeft'||c=='ShiftRight'||c=='KeyE')dash()}
function dash(){if(xp<TH[2]||P.dcd>0||P.dash>0)return;const a=Math.atan2(M.y-(P.y-P.h/2),M.x+cam-P.x),s=260+up.dash*35;
 P.dvx=Math.cos(a)*s;P.dvy=Math.sin(a)*s;P.dash=.16+up.dash*.02;P.dcd=1.4-up.dash*.15;P.f=P.dvx>=0?1:-1;P.on=0;shake=.12}
function gain(v){const o=lvl();xp+=v;if(lvl()>o){pts+=lvl()-o;flash=1;shake=.45;const l=lvl();
 say('EVOLVED: '+FORMS[l]+(l==1?' - FLIGHT (HOLD W/SPACE)':'')+(l==2?' - VAMPIRIC DASH (SHIFT/RMB)':''),3.5);P.h=dims(l).h}}
function feed(e){e.dead=1;gain((e.t=='guard'?5:3)*(1+up.feed*.1));P.hp=Math.min(100,P.hp+8+up.feed*5);blood(e.x,e.y-5,18);shake=Math.max(shake,.1)}
function blood(x,y,n){for(let i=0;i<n;i++)FX.push({k:'b',x,y,vx:rnd(-70,70),vy:rnd(-90,10),l:rnd(.4,1),c:Math.random()<.5?'#a00':'#e11'})}
function sparks(x,y,n){for(let i=0;i<n;i++)FX.push({k:'s',x,y,vx:rnd(-90,90),vy:rnd(-90,30),l:rnd(.2,.6),c:'#fb5'})}
function hurt(n){if(god||P.inv>0||P.dash>0)return;P.hp-=n;P.inv=.4;shake=.25;blood(P.x,P.y-6,6);if(P.hp<=0){state='dead';shake=.6}}
function hitWall(w,dmg){if(w.cd>0)return;w.cd=.25;w.hp-=dmg;shake=.25;sparks(w.x,rnd(w.y+8,w.y+w.h),12);
 if(w.hp<=0){chk=w.x+25;say('BULKHEAD BREACHED',2);for(let i=0;i<30;i++)FX.push({k:'d',x:w.x+rnd(-3,3),y:rnd(w.y,w.y+w.h),vx:rnd(-80,80),vy:rnd(-80,20),l:rnd(.5,1.2),c:'#3a3a4a'})}}
function mv(e,dt,fast,dmg){const ox=e.x,oy=e.y;e.x+=e.vx*dt;
 for(const w of WL)if(w.hp>0&&Math.abs(e.x-w.x)<w.w/2+e.w/2&&e.y>w.y&&e.y-e.h<w.y+w.h){
  if(fast){hitWall(w,dmg);if(e.t=='crate')e.dead=1;if(e.t=='p')e.dash=0}
  if(w.hp>0){e.x=ox;e.vx=0}}
 e.x=Math.max(8,Math.min(WW-8,e.x));e.y+=e.vy*dt;e.on=0;
 if(e.vy>=0){if(e.y>=FL){e.y=FL;e.vy=0;e.on=1}else if(!e.held)for(const q of PT)if(oy<=q.y&&e.y>=q.y&&e.x+e.w/2>q.x&&e.x-e.w/2<q.x+q.w){e.y=q.y;e.vy=0;e.on=1;break}}
 const c=ceilAt(e.x)+e.h;if(e.y<c){e.y=c;if(e.vy<0)e.vy=0}}
function upd(dt){time+=dt;shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt*2);msgT-=dt;WL.forEach(w=>w.cd-=dt);
 if(state!='play')return;const t=lvl(),p=P,ax=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0),jump=K.KeyW||K.ArrowUp||K.Space;
 p.inv-=dt;p.dcd-=dt;p.an+=dt*Math.abs(p.vx)*.12;
 if(p.dash>0){p.dash-=dt;p.vx=p.dvx;p.vy=p.dvy;
  for(let i=0;i<2;i++)FX.push({k:'g',x:p.x-p.vx*dt*i/2,y:p.y,f:p.f,l:.28,h:p.h});
  FX.push({k:'t',x:p.x,y:p.y-p.h/2+rnd(-4,4),l:.25,vx:0,vy:0})}
 else{p.vx+=(ax*(70+t*7)-p.vx)*Math.min(1,dt*10);if(ax)p.f=ax;
  if(jump){if(p.on){p.vy=-170;p.on=0}else if(xp>=TH[1])p.vy=Math.max(p.vy-700*dt,-85)}p.vy+=420*dt}
 if(M.d)p.f=M.x+cam>p.x?1:-1;
 mv(p,dt,p.dash>0,2);
 const range=70+up.tk*22,cr=24+up.tk*5,mx=M.x+cam,my=M.y;
 for(const e of E){if(e.dead)continue;
  const dx=p.x-e.x,dy=(p.y-p.h/2)-(e.y-e.h/2),d=Math.hypot(dx,dy)||1;
  const near=Math.hypot(mx-e.x,my-(e.y-e.h/2))<cr&&d<range;
  if(M.d&&(near||(e.held&&d<range+40)))e.held=1;
  else if(e.held){e.held=0;if(e.t=='crate'){const a=Math.atan2(my-(e.y-4),mx-e.x);e.vx=Math.cos(a)*300;e.vy=Math.sin(a)*300;e.thr=1}}
  if(e.held){if(e.t=='crate'){e.vx=(p.x+p.f*14-e.x)*12;e.vy=(p.y-p.h*.6-e.y)*12}
   else{const sp=80+up.tk*30;e.vx=dx/d*sp;e.vy=dy/d*sp}}
  else{e.cd-=dt;e.thr-=dt;e.vy+=420*dt;let tv=0;
   if(e.t=='sci'&&d<110){e.dir=-Math.sign(dx)||1;tv=e.dir*48}
   if(e.t=='guard'){e.dir=Math.sign(dx)||1;if(d<55)tv=-e.dir*40;else if(d>115)tv=e.dir*30;
    if(d<135&&e.cd<=0&&Math.abs(dy)<60){e.cd=rnd(1,1.8);const a=Math.atan2(dy,dx);B.push({x:e.x,y:e.y-6,vx:Math.cos(a)*120,vy:Math.sin(a)*120,l:2})}}
   if(e.t!='crate')e.vx+=(tv-e.vx)*Math.min(1,dt*(e.on?8:1));
   if(e.t=='sci'&&tv&&e.on&&Math.random()<dt*.8)e.vy=-110}
  const sp=Math.hypot(e.vx,e.vy);mv(e,dt,e.t=='crate'&&e.thr>0&&sp>140,1);
  if(!e.dead&&e.t!='crate'&&Math.abs(e.x-p.x)<7&&Math.abs((e.y-e.h/2)-(p.y-p.h/2))<p.h/2+4)feed(e)}
 E=E.filter(e=>!e.dead);
 for(const b of B){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;
  if(Math.abs(b.x-p.x)<4&&b.y>p.y-p.h&&b.y<p.y){hurt(8);b.l=0}
  if(WL.some(w=>w.hp>0&&Math.abs(b.x-w.x)<3&&b.y>w.y&&b.y<w.y+w.h)||b.y>FL){b.l=0;sparks(b.x,b.y,3)}}
 B=B.filter(b=>b.l>0);
 for(const f of FX){f.l-=dt;if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.k!='t')f.vy+=220*dt;if(f.k=='b'&&f.y>FL){f.y=FL;f.vy=0;f.vx*=.5}}}
 FX=FX.filter(f=>f.l>0);
 spT-=dt;if(spT<=0){spT=1.1;const lo=Math.max(0,...WL.filter(w=>w.hp>0&&w.x<p.x).map(w=>w.x)),hi=Math.min(WW,...WL.filter(w=>w.hp>0&&w.x>p.x).map(w=>w.x));
  if(E.filter(e=>e.t!='crate'&&Math.abs(e.x-p.x)<380).length<6){const x=p.x+(Math.random()<.5?-1:1)*rnd(190,260);if(x>lo+14&&x<hi-14)mk(Math.random()<.12+p.x/2800*.35?'guard':'sci',x,FL)}
  if(hi<WW&&!E.some(e=>e.t=='crate'&&Math.abs(e.x-hi)<250))mk('crate',hi-50,FL)}
 cam=Math.max(0,Math.min(WW-W,p.x-W/2));
 if(p.x>WW-40){state='win'}}
// ---------- drawing ----------
let C=0;const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x-C),Math.round(y),w,h)};
const SK=['#b8c4cc','#a9b4c4','#8a8fa8','#5d5878','#3b2f4f','#2a1a33'];
function vamp(p,t,tint){const f=p.f,{lg,to}=dims(t),mv=Math.abs(p.vx)>8&&p.on,bob=mv?Math.round(Math.sin(p.an*2)):0,fl=!p.on&&xp>=TH[1];
 const sk=tint||SK[t],cl=tint||(t<2?'#d8d8d0':t<3?'#8c8a80':'#150f18'),ey=t<1?'#a22':'#f22',by=-lg-to-bob;
 const r=(x,y,w,h,c)=>R(p.x+(f>0?x:-x-w)+C,p.y+y,w,h,c);
 if(t>=4&&!tint){const fp=fl?Math.sin(time*18)*3:0;for(let i=0;i<5+t;i++)r(-3-i,by+2+i*.6+fp*(i/5),1,4+i,'#2a0f1c');r(-3,by+1,1,6,'#511')}
 if(t>=3&&!tint)for(let i=0;i<3+t-3;i++)r(-4,by+1+i*3,2,1,'#6a1020');
 const s=mv?Math.round(Math.sin(p.an*2)*1.5):0;
 r(-2+s,-lg-bob,2,lg+bob,sk);r(1-s,-lg-bob,2,lg+bob,t>1?'#241830':sk);
 r(-3,by,6,to,cl);if(t>=2&&!tint)r(-1,by+2,1,to-3,'#a01428');
 r(-2,by-5,5,5,sk);if(t>=5&&!tint){r(-2,by-8,1,3,'#cdbfd0');r(2,by-8,1,3,'#cdbfd0')}
 r(2,by-3,2,1,tint||ey);if(t>=2&&!tint){g.fillStyle='rgba(255,0,0,.28)';R(p.x+(f>0?0:-5),p.y+by-5,5,4,'rgba(255,0,0,.28)')}
 if(!tint)r(2,by-1,1,1,'#fff');
 const al=4+Math.round(t*1.4);
 if(M.d&&state=='play'){r(3,by+1,al,2,sk);if(t>0&&!tint)r(3+al,by,2,1,'#fff'),r(3+al,by+2,2,1,'#fff')}
 else{r(3,by+1,2,al,sk);if(t>0&&!tint)r(3,by+1+al,1,Math.min(5,1+t),'#fff'),r(4,by+1+al,1,Math.min(4,t),'#fff')}}
function human(e){const j=e.held?Math.round(rnd(-1,1)):0,x=e.x+j;
 if(e.t=='crate'){R(x-4,e.y-8,8,8,'#4a3a2a');R(x-4,e.y-8,8,1,'#6a5440');R(x-4,e.y-4,8,1,'#2a2018');R(x-1,e.y-8,1,8,'#2a2018');return}
 const g1=e.t=='guard';R(x-2,e.y-10,5,3,g1?'#2b3a55':'#e6c8a0');R(x-2,e.y-7,5,5,g1?'#1d2a44':'#dcdce6');
 R(x-2,e.y-2,2,2,'#222');R(x+1,e.y-2,2,2,'#222');if(g1)R(x+(e.dir>0?2:-5),e.y-5,4,1,'#999');else R(x-1,e.y-9,3,1,'#555');
 if(e.held)R(x-3,e.y-11,7,12,'rgba(255,40,60,.25)')}
function draw(){g.setTransform(1,0,0,1,0,0);g.fillStyle='#07060b';g.fillRect(0,0,W,H);
 if(state=='title'){g.fillStyle='#c11';g.font='bold 28px monospace';g.textAlign='center';g.fillText('VAMPRE',160,70);g.fillStyle='#aaa';g.font='8px monospace';
  ['SANDBOX BUILD v0.2 (touch: left=move/up=jump, tap world=telekinesis)','','A/D MOVE  W/SPACE JUMP + FLY (after evolving)','HOLD LMB: TELEKINESIS - drag humans in to FEED','SHIFT / RMB: VAMPIRIC DASH (unlocks at 25% XP)','1/2/3 SPEND UPGRADE POINTS (TK / FEED / DASH)','CRATES: GRAB, THEN RELEASE TO THROW AT BULKHEADS','X = +10 XP   G = GOD MODE (sandbox)','','CLICK / TAP OR PRESS ENTER'].forEach((s,i)=>g.fillText(s,160,88+i*10));return}
 const t=lvl();C=Math.round(cam);g.save();if(shake>0)g.translate(Math.round(rnd(-1,1)*shake*8),Math.round(rnd(-1,1)*shake*8));
 for(let i=-1;i<10;i++){const x=i*40-(C*.5%40);g.fillStyle='#0e0e17';g.fillRect(Math.round(x),0,1,H)}
 for(let i=-1;i<4;i++){g.fillStyle='#0b0b12';g.fillRect(Math.round(i*160-(C*.6%160)),0,10,H)}
 g.fillStyle='#12121b';g.fillRect(0,30,W,3);g.fillRect(0,38,W,2);
 R(0,0,800,95,'#15151d');R(0,95,800,2,'#2c2c3a');R(800,0,WW,20,'#15151d');R(800,20,WW,2,'#2c2c3a');
 for(let lx=40;lx<WW;lx+=120){if(lx-C<-40||lx-C>W+40)continue;const y=ceilAt(lx)+2,a=.5+.5*Math.sin(time*3+lx);R(lx,y,6,3,a>.5?'#f33':'#a11');
  for(let k=1;k<4;k++){g.fillStyle='rgba(255,0,0,'+(.03+.05*a)+')';g.fillRect(Math.round(lx-C-3-k*7),y+3,12+k*14,k*16)}}
 R(0,FL,WW,20,'#16161e');R(0,FL,WW,2,'#34343f');for(let i=0;i<WW;i+=24)R(i,FL+7,12,1,'#222230');
 PT.forEach(q=>{R(q.x,q.y,q.w,3,'#3a3a4a');R(q.x,q.y+3,q.w,1,'#1c1c26');for(let i=0;i<q.w;i+=10)R(q.x+i,q.y+4,1,4,'#22222c')});
 WL.forEach(w=>{if(w.hp<=0)return;R(w.x-3,w.y,6,w.h,'#2b2b3a');R(w.x-3,w.y,1,w.h,'#44445a');for(let y=w.y+4;y<w.y+w.h;y+=10)R(w.x-2,y,4,3,(y/10|0)%2?'#a62':'#111');if(w.hp<=2)for(let y=w.y+6;y<w.y+w.h;y+=17)R(w.x-1,y,1,6,'#000')});
 R(WW-30,FL-30,26,30,'#111');R(WW-28,FL-28,22,28,'#300');R(WW-22,FL-36,14,5,'#d22');
 B.forEach(b=>R(b.x-1,b.y,3,1,'#ff4'));
 E.forEach(e=>{if(e.held&&state=='play'){const x0=P.x+P.f*5,y0=P.y-P.h*.7,x1=e.x,y1=e.y-e.h/2;for(let i=0;i<=10;i++){const k=i/10;R(x0+(x1-x0)*k+rnd(-1.5,1.5),y0+(y1-y0)*k+rnd(-1.5,1.5),1,1,i%2?'#f33':'#b4f')}}human(e)});
 FX.forEach(f=>{if(f.k=='g'){g.globalAlpha=f.l*2.2;vamp({x:f.x,y:f.y,f:f.f,vx:0,on:1,an:0,h:f.h},t,'#e11');g.globalAlpha=1}
  else if(f.k=='t'){R(f.x-18*f.l*4,f.y,Math.round(f.l*70),1,'rgba(255,40,40,.8)')}else R(f.x,f.y,f.k=='d'?2:1,f.k=='d'?2:1,f.c)});
 if(state=='play'||state=='win'){if(P.inv>0&&Math.floor(time*30)%2)g.globalAlpha=.4;vamp(P,t);g.globalAlpha=1}
 g.restore();
 if(flash>0){g.fillStyle='rgba(255,20,40,'+flash*.45+')';g.fillRect(0,0,W,H)}
 g.fillStyle='rgba(0,0,0,.3)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1);
 g.textAlign='left';g.font='8px monospace';g.fillStyle='#200';g.fillRect(4,4,62,6);g.fillStyle='#d11';g.fillRect(4,4,Math.max(0,P.hp)*.62,6);
 const nx=t<5?TH[t+1]:100,pr=Math.min(1,(xp-TH[t])/(nx-TH[t]));g.fillStyle='#210a2a';g.fillRect(4,12,62,4);g.fillStyle='#a3f';g.fillRect(4,12,pr*62,4);
 g.fillStyle='#ccc';g.fillText('LV'+t+' '+FORMS[t],4,26);
 g.fillStyle=xp>=TH[1]?'#6f6':'#555';g.fillText('FLY',4,35);g.fillStyle=xp>=TH[2]?(P.dcd>0?'#a33':'#6f6'):'#555';g.fillText('DASH',24,35);
 if(pts>0){g.fillStyle='#fd4';g.fillText('[1]TK'+up.tk+' [2]FEED'+up.feed+(xp>=TH[2]?' [3]DASH'+up.dash:'')+'  PTS:'+pts,4,45)}
 drawTouch();g.textAlign='center';if(msgT>0){g.fillStyle='#f55';g.fillText(msg,160,150-(msgT>3?0:0))}
 if(state=='dead'){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,W,H);g.fillStyle='#d11';g.font='bold 16px monospace';g.fillText('CONTAINED',160,85);g.font='8px monospace';g.fillStyle='#aaa';g.fillText('ENTER / CLICK TO RESPAWN (XP KEPT)',160,102)}
 if(state=='win'){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,W,H);g.fillStyle='#d11';g.font='bold 14px monospace';g.fillText('YOU ESCAPED',160,85);g.font='8px monospace';g.fillStyle='#aaa';g.fillText('FORM: '+FORMS[t]+'  -  ENTER TO RESTART',160,102)}}

// ---------- touch controls (Android) ----------
let touchMode=0;const T={};
function gp(t){const r=cv.getBoundingClientRect();return[(t.clientX-r.left)/r.width*W,(t.clientY-r.top)/r.height*H]}
function tstart(e){e.preventDefault();touchMode=1;for(const t of e.changedTouches){const[x,y]=gp(t),id=t.identifier;
 if(state!='play'){press('Enter');continue}
 if(x<110&&y>60)T[id]={k:'s',ox:x,oy:y};
 else if(Math.hypot(x-285,y-145)<20){T[id]={k:'j'};K.Space=1}
 else if(Math.hypot(x-245,y-155)<17){T[id]={k:'d'};press('KeyE')}
 else if(pts>0&&y>38&&y<54&&x<130){T[id]={k:'u'};press('Digit'+(1+Math.floor((x-4)/42)))}
 else{T[id]={k:'t'};M.d=1;M.x=x;M.y=y}}}
function tmove(e){e.preventDefault();for(const t of e.changedTouches){const s=T[t.identifier];if(!s)continue;const[x,y]=gp(t);
 if(s.k=='s'){K.KeyA=x-s.ox<-8;K.KeyD=x-s.ox>8;K.KeyW=y-s.oy<-12}
 if(s.k=='t'){M.x=x;M.y=y}}}
function tend(e){e.preventDefault();for(const t of e.changedTouches){const s=T[t.identifier];if(!s)continue;
 if(s.k=='s')K.KeyA=K.KeyD=K.KeyW=0;if(s.k=='j')K.Space=0;if(s.k=='t')M.d=0;delete T[t.identifier]}}
cv.addEventListener('touchstart',tstart,{passive:false});cv.addEventListener('touchmove',tmove,{passive:false});
cv.addEventListener('touchend',tend,{passive:false});cv.addEventListener('touchcancel',tend,{passive:false});
function drawTouch(){if(!touchMode)return;g.textAlign='center';g.font='7px monospace';
 const b=(x,y,r,l,on)=>{g.fillStyle=on?'rgba(255,40,60,.45)':'rgba(255,255,255,.14)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='#ddd';g.fillText(l,x,y+2)};
 b(285,145,18,'FLY',K.Space);b(245,155,15,'DASH',P.dash>0);b(45,135,22,'MOVE',K.KeyA||K.KeyD);
 if(pts>0)['TK','FEED','DASH'].forEach((l,i)=>{if(i<2||xp>=TH[2]){g.fillStyle='rgba(255,220,60,.3)';g.fillRect(4+i*42,39,40,14);g.fillStyle='#fd4';g.fillText(l+(i?i>1?up.dash:up.feed:up.tk),24+i*42,48)}})}
let last=performance.now();(function loop(n){const dt=Math.min(.033,(n-last)/1000);last=n;try{upd(dt);draw()}catch(e){console.error(e)}requestAnimationFrame(loop)})(last);
