/**
 * Mellmon capability vault: six mechanical authority pins around one lock.
 * The pin under the pointer releases from the door while the others settle.
 */
const {
  Cam, facing, fillet, fit, hull, mk, open, place, pointer, poly, prism, proj,
  reflect, register, rings, rrect, seg, solid, put, tween, tset, tval, tdone,
  disposer,
} = HL;

const NAMES = ["manifest", "registry", "policy", "receipt", "settlement", "guard"];
const ANGLES = [-145, -88, -28, 32, 92, 148];
const REST = [4, 1, 3, 2, 5, 2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, active = -1;
  const C = Cam(45, .5, 1.30);
  fit(C, [[-82,-54,-7],[82,65,-7],[-82,65,126],[82,-54,126]], 200, 170);
  const P = proj(C), front = facing(C), root = mk("g", {}, svg);
  const slab = (parent,x0,y0,x1,y1,r,z0,z1) => {
    const [a,b] = rings(x0,y0,x1,y1,r,Math.min(1.5,(x1-x0)/5,(y1-y0)/5));
    const s = solid(parent); put(s,prism(P,front,a,b,z0,z1)); return s;
  };
  const dot = (parent,p,r=1,cls="dot m") => {
    const e=mk("circle",{r,class:cls},parent); place(e,P(...p)); return e;
  };
  const faceRing = (cx,y,cz,r,n=32) => Array.from({length:n},(_,i)=>{
    const a=Math.PI*2*i/n; return P(cx+Math.cos(a)*r,y,cz+Math.sin(a)*r);
  });
  const doorShape = (y,inset=0) => fillet([
    [-67+inset,13+inset], [67-inset,13+inset], [67-inset,119-inset],
    [-67+inset,119-inset]
  ], [8,8,8,8], 5).map(([x,z])=>P(x,y,z));

  // Feet and a deep freestanding safe body establish the object at thumbnail size.
  const [base,baseIn]=rings(-77,-50,77,54,10,2); reflect(svg,root,P,front,base,-5,18);
  [[-62,-38],[62,-38],[-62,42],[62,42]].sort((a,b)=>a[0]+a[1]-b[0]-b[1]).forEach(([x,y])=>{
    slab(root,x-8,y-7,x+8,y+7,4,-7,0);
  });
  slab(root,-76,-49,76,53,10,0,10);
  slab(root,-72,-45,72,49,8,10,119);
  slab(root,-78,-51,78,55,10,119,126);

  // Recess and jamb lines sit behind the opaque vault door.
  mk("path",{d:poly(doorShape(52,3)),class:"lo"},root);
  const door = mk("g",{},root);
  mk("path",{d:poly(hull(doorShape(52).concat(doorShape(59)))),class:"sil"},door);
  mk("path",{d:poly(doorShape(59)),class:""},door);
  mk("path",{d:open(doorShape(59,3)),class:"nf lo"},door);

  // Three barrel hinges and a row of edge bolts make the door read as a safe.
  [-48,0,48].forEach(z=>{
    const outer=faceRing(-73,60,66+z,6,20), inner=faceRing(-73,61,66+z,3.8,20);
    mk("path",{d:poly(outer),class:"sil"},root); mk("path",{d:poly(inner),class:"nf lo"},root);
    dot(root,[-73,62,66+z],1.1,"dot off");
  });
  [-45,-22,22,45].forEach(z=>dot(root,[60,60,66+z],2.2,"dot off"));

  // Central lock drum, wheel and three real spokes.
  const dialBack=faceRing(0,59,67,35), dial=faceRing(0,62,67,30), hub=faceRing(0,64,67,7,24);
  mk("path",{d:poly(dialBack),class:"sil"},root);
  mk("path",{d:poly(dial),class:"nf lo"},root);
  [0,120,240].forEach(deg=>{
    const a=deg*Math.PI/180;
    mk("path",{d:seg(P(Math.cos(a)*8,64,67+Math.sin(a)*8),P(Math.cos(a)*24,64,67+Math.sin(a)*24)),class:"nf"},root);
    dot(root,[Math.cos(a)*25,64,67+Math.sin(a)*25],2.4,"dot m");
  });
  mk("path",{d:poly(hub),class:""},root);
  const coreMark=dot(root,[0,65,67],2.2,"dot");

  // Six authority pins form one lock. Their uneven rest depth gives the still pose a cadence.
  const pins = ANGLES.map((deg,i)=>{
    const a=deg*Math.PI/180, x=Math.cos(a)*44, z=67+Math.sin(a)*44;
    const g=mk("g",{},root), body=mk("path",{class:"lo"},g), face=mk("path",{class:"sil"},g);
    const crease=mk("path",{class:"nf lo"},g), mark=dot(g,[x,64,z],1,"dot off");
    return {i,x,z,g,body,face,crease,mark,d:tween(REST[i])};
  });

  function drawPin(pin,ext){
    const back=faceRing(pin.x,62,pin.z,5.6,20), frontFace=faceRing(pin.x,62+ext,pin.z,5.6,20);
    const inner=faceRing(pin.x,62+ext+.1,pin.z,3.7,20);
    pin.body.setAttribute("d",poly(hull(back.concat(frontFace))));
    pin.face.setAttribute("d",poly(frontFace)); pin.crease.setAttribute("d",poly(inner));
    place(pin.mark,P(pin.x,62+ext+.25,pin.z));
  }
  pins.forEach((p)=>drawPin(p,REST[p.i]));
  const centres=pins.map(p=>P(p.x,63,p.z));
  function hit([x,y]){
    let best=-1,dist=22;
    centres.forEach((p,i)=>{const d=Math.hypot(x-p[0],y-p[1]);if(d<dist){dist=d;best=i;}});
    return best;
  }

  const loop=register(stage,(_dt,now)=>{
    let moving=false;
    pins.forEach(p=>{drawPin(p,tval(p.d,now));if(!tdone(p.d,now))moving=true;});
    return moving;
  }); bag.add(loop.unregister);

  function select(index){
    if(index===active)return;
    const now=performance.now(), from=index>=0?index:(active>=0?active:0); active=index;
    pins.forEach((p,i)=>{
      tset(p.d,i===index?reach:REST[i],now,Math.abs(i-from)*32);
      p.face.classList.toggle("hi",i===index); p.mark.classList.toggle("m",i!==index);
    });
    coreMark.classList.toggle("m",index>=0);
    read.textContent=index<0?"rest":NAMES[index]+" / authority pin";
    stage.dispatchEvent(new CustomEvent("mellmon-stage",{detail:index})); loop.wake();
  }
  bag.add(pointer(stage,{move:p=>select(hit(p)),leave:()=>select(-1)}));
  bag.add(()=>svg.replaceChildren()); read.textContent="rest";
  return {
    set:v=>{reach=v;if(active>=0){tset(pins[active].d,reach,performance.now(),0);loop.wake();}},
    select, destroy:bag.dispose,
  };
}

hairline({
  name:"capability-vault",
  means:"A mechanical vault releases one bounded authority pin while the other permissions remain locked.",
  rules:[1,2,4,5,8,9,10], range:[20,32,44],
  tour:[[147,149],[249,118],[270,210],[144,217],null], mount,
});
