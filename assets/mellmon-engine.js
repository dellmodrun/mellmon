/**
 * Mellmon capability engine: six bounded chambers around one execution rotor.
 * Selecting a chamber releases it and energises only its verified radial path.
 */
const {
  Cam, circ, facing, fit, mk, open, place, pointer, prism, proj, reflect,
  register, rings, ringAt, rrect, seg, solid, put, tween, tset, tval,
  tdone, disposer,
} = HL;

const CHAMBERS = [
  {name:"manifest",a:225},{name:"registry",a:270},{name:"policy",a:315},
  {name:"receipt",a:45},{name:"settlement",a:90},{name:"guard",a:135},
].map((m,i)=>({...m,i,x:Math.cos(m.a*Math.PI/180)*67,y:Math.sin(m.a*Math.PI/180)*52}));
const REST=[1,4,2,5,0,3];

function mount({stage,svg,read},value){
  const bag=disposer(); let lift=value,active=-1;
  const C=Cam(45,.5,1.64); fit(C,[[-112,-91,-8],[112,91,-8],[-112,91,70],[112,-91,70]],200,160);
  const P=proj(C),front=facing(C),root=mk("g",{},svg);
  const circleAt=(x,y,r,n=28)=>circ(r,n).map(q=>({...q,u:q.u+x,v:q.v+y}));
  const dot=(parent,p,r=1,cls="dot m")=>{const e=mk("circle",{r,class:cls},parent);place(e,P(...p));return e;};
  const cyl=(parent,x,y,r,z0,z1,cls="")=>{const outer=circleAt(x,y,r),inner=circleAt(x,y,Math.max(.5,r-1.5));const s=solid(parent);put(s,prism(P,front,outer,inner,z0,z1));if(cls)s.g.classList.add(cls);return s;};
  const slab=(parent,x0,y0,x1,y1,r,z0,z1)=>{const [a,b]=rings(x0,y0,x1,y1,r,1.2);const s=solid(parent);put(s,prism(P,front,a,b,z0,z1));return s;};

  // A circular service plinth, six feet, two deck levels and perimeter fasteners.
  const base=circleAt(0,0,103,48),baseIn=circleAt(0,0,100.8,48);reflect(svg,root,P,front,base,-6,18);
  [0,60,120,180,240,300].map(a=>[Math.cos(a*Math.PI/180)*86,Math.sin(a*Math.PI/180)*70]).sort((a,b)=>a[0]+a[1]-b[0]-b[1]).forEach(([x,y])=>{
    cyl(root,x,y,7,-7,-1);cyl(root,x,y,9,-1,2,"foot-collar");
  });
  const chassis=solid(root);put(chassis,prism(P,front,base,baseIn,-2,6));
  const deck=solid(root);put(deck,prism(P,front,circleAt(0,0,96,48),circleAt(0,0,93.8,48),6,10));deck.cr.classList.add("lo");
  const service=solid(root);put(service,prism(P,front,circleAt(0,0,88,48),circleAt(0,0,86.5,48),10,12));service.sil.classList.add("lo");
  Array.from({length:12},(_,i)=>i*30).forEach((a,i)=>{
    const x=Math.cos(a*Math.PI/180)*91,y=Math.sin(a*Math.PI/180)*91;
    dot(root,[x,y,10.3],1.35,i===1?"dot":"dot off"); dot(root,[x,y,10.5],.45,"dot m");
  });

  // Radial twin buses, socket wells and restraint forks sit under the moving chambers.
  const buses=[],forks=[];
  CHAMBERS.forEach(c=>{
    const ux=c.x/Math.hypot(c.x,c.y),uy=c.y/Math.hypot(c.x,c.y),px=-uy*2.2,py=ux*2.2;
    const g=mk("g",{},root);
    const main=mk("path",{d:seg(P(27*ux+px,27*uy+py,14),P(c.x*.78+px,c.y*.78+py,14)),class:"nf lo"},g);
    mk("path",{d:seg(P(27*ux-px,27*uy-py,13),P(c.x*.78-px,c.y*.78-py,13)),class:"nf lo"},g);
    buses[c.i]=main; dot(root,[c.x*.57,c.y*.57,14.2],1.6,"dot off");
    const well=solid(root);put(well,prism(P,front,circleAt(c.x,c.y,18),circleAt(c.x,c.y,15.8),11.5,14));well.sil.classList.add("lo");
    [-1,1].forEach(side=>{const fx=c.x+side*uy*17,fy=c.y-side*ux*17;
      const fork=mk("path",{d:seg(P(fx-ux*6,fy-uy*6,14),P(fx+ux*6,fy+uy*6,14)),class:"nf lo"},root);forks.push({fork,i:c.i});
      dot(root,[fx,fy,14.2],.9,"dot off");
    });
  });

  // Far chambers are painted before the rotor; near chambers after it.
  const far=CHAMBERS.filter(c=>c.x+c.y<0).sort((a,b)=>a.x+a.y-b.x-b.y);
  const near=CHAMBERS.filter(c=>c.x+c.y>=0).sort((a,b)=>a.x+a.y-b.x-b.y);
  const chambers=[];
  function makeChamber(c){
    const g=mk("g",{},root),body=solid(g),collar=solid(g),cap=solid(g),shadow=mk("path",{class:"nf lo"},g);
    const pins=Array.from({length:5},()=>mk("circle",{r:1.1,class:"dot m"},g));
    const seam=mk("path",{class:"nf lo"},g),bridge=mk("path",{class:"nf lo"},g),mark=dot(g,[c.x,c.y,34],1.5,"dot off");
    const q={...c,g,body,collar,cap,pins,seam,bridge,mark,h:tween(REST[c.i])};chambers[c.i]=q;return q;
  }
  function draw(q,h){
    const z=14+h,top=z+23;
    put(q.body,prism(P,front,circleAt(q.x,q.y,13.5),circleAt(q.x,q.y,12),z,top-5));
    put(q.collar,prism(P,front,circleAt(q.x,q.y,15.5),circleAt(q.x,q.y,14),top-7,top-3));
    put(q.cap,prism(P,front,circleAt(q.x,q.y,12),circleAt(q.x,q.y,10.7),top-3,top));
    q.seam.setAttribute("d",open(ringAt(P,circleAt(q.x,q.y,9.2),top+.12)));
    q.bridge.setAttribute("d",seg(P(q.x-5,q.y,top+.18),P(q.x+5,q.y,top+.18)));
    q.pins.forEach((e,i)=>{const a=(i*72+q.i*11)*Math.PI/180;place(e,P(q.x+Math.cos(a)*7,q.y+Math.sin(a)*7,top+.24));});
    place(q.mark,P(q.x,q.y,top+.3));
  }
  far.forEach(c=>makeChamber(c));

  // The stepped execution rotor has a ceramic crown, cooling posts and a physical lock bridge.
  cyl(root,0,0,38,12,18,"rotor-socket");
  const rotor=cyl(root,0,0,31,18,30,"rotor-body");rotor.cr.classList.add("hi");
  cyl(root,0,0,26,30,47,"rotor-core");cyl(root,0,0,30,47,52,"rotor-crown");
  [0,60,120,180,240,300].forEach((a,i)=>{
    const x=Math.cos(a*Math.PI/180)*20,y=Math.sin(a*Math.PI/180)*20;
    const post=cyl(root,x,y,3.2,52,59+i%2*2);if(i===1)post.sil.classList.add("hi");
    dot(root,[x,y,59+i%2*2+.2],1,i===1?"dot":"dot m");
    mk("path",{d:seg(P(6*Math.cos(a*Math.PI/180),6*Math.sin(a*Math.PI/180),53),P(x,y,53)),class:"nf lo"},root);
  });
  cyl(root,0,0,8,52,62,"rotor-hub");const coreMark=dot(root,[0,0,62.3],2,"dot");
  slab(root,-13,75,13,91,4,11,15);[-7,0,7].forEach(x=>{slab(root,x-2,82,x+2,94,1,15,18);dot(root,[x,90,18.2],.8,"dot m");});
  near.forEach(c=>makeChamber(c));
  chambers.forEach(q=>draw(q,REST[q.i]));

  const centres=CHAMBERS.map(c=>P(c.x,c.y,38));
  const hit=([x,y])=>{let best=-1,dist=39;centres.forEach((p,i)=>{const d=Math.hypot(x-p[0],y-p[1]);if(d<dist){best=i;dist=d;}});return best;};
  const loop=register(stage,(_dt,now)=>{let moving=false;chambers.forEach(q=>{draw(q,tval(q.h,now));if(!tdone(q.h,now))moving=true;});return moving;});bag.add(loop.unregister);
  function select(index){
    if(index===active)return;const now=performance.now(),from=index>=0?index:(active>=0?active:0);active=index;
    chambers.forEach((q,i)=>{const on=i===index;tset(q.h,on?lift:REST[i],now,Math.abs(i-from)*28);q.body.sil.classList.toggle("hi",on);q.cap.sil.classList.toggle("hi",on);q.mark.classList.toggle("m",!on);});
    buses.forEach((b,i)=>b.classList.toggle("hi",i===index));forks.forEach(f=>f.fork.classList.toggle("hi",f.i===index));coreMark.classList.toggle("m",index>=0);
    read.textContent=index<0?"rest":CHAMBERS[index].name+" / chamber released";stage.dispatchEvent(new CustomEvent("mellmon-stage",{detail:index}));loop.wake();
  }
  bag.add(pointer(stage,{move:p=>select(hit(p)),leave:()=>select(-1)}));bag.add(()=>svg.replaceChildren());read.textContent="rest";
  return {set:v=>{lift=v;if(active>=0){tset(chambers[active].h,lift,performance.now(),0);loop.wake();}},select,destroy:bag.dispose};
}

hairline({name:"capability-engine",means:"Six bounded capability chambers orbit one execution rotor; only the verified path releases.",rules:[1,2,4,5,8,9,10],range:[27,39,51],tour:[[125,125],[268,126],[276,225],[129,229],null],mount});
