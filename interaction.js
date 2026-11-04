const artwork = document.getElementById("artwork");
const field = document.getElementById("fieldImage");
const composition = document.querySelector(".composition");
let activated = false;
function activate() {
  if (activated) return;
  activated = true;
  artwork.classList.add("revealed");
  window.setTimeout(() => artwork.classList.add("is-flying"), 140);
  window.setTimeout(() => {
    const rect = artwork.getBoundingClientRect();
    const leftMargin = Math.max(12, window.innerWidth * 0.055);
    artwork.style.setProperty("--left-shift", (leftMargin - rect.left) + "px");
    artwork.classList.add("is-left");
  }, 1050);
  window.setTimeout(() => artwork.classList.add("is-swapped"), 1980);
  window.setTimeout(() => composition.classList.add("show-wordmark"), 2000);
}
field.addEventListener("click", activate);
field.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    activate();
  }
});


const lineupButton = document.getElementById("lineupButton");
const wZone = document.getElementById("wZone");
const scheduleArt = document.getElementById("scheduleArt");
const wFiles = ["bb-w.png","lean-w","bass-w.png","vgyn.png","svn-w.png","bon-w.png","miki-w-.png","stel-w.png","smerz-w.png","delroy-w.png","babyfather-w.png","louke-man-w.png"];
const random = (min,max) => min + Math.random() * (max-min);
const sprites = [];
let lineupOpened = false;
let lastFrame = 0;
let nextSpawn = 0;
let zoneWidth = 0;
let zoneHeight = 0;
let remainingFiles = [];
const W_SIZE = 101.2; // 15% larger than the previous 88px
function spawnW() {
  if (!remainingFiles.length) return;
  const fileIndex = Math.floor(Math.random() * remainingFiles.length);
  const [file] = remainingFiles.splice(fileIndex, 1);
  const image = document.createElement("img");
  image.src = "./" + file;
  image.alt = "lineup artist";
  image.className = "w-floater w-active";
  image.style.setProperty("--w-size", W_SIZE + "px");
  wZone.appendChild(image);
  sprites.push({
    element:image, size:W_SIZE,
    x:random(8,Math.max(9,zoneWidth-W_SIZE-10)),
    y:-W_SIZE*1.6-random(0,35),
    vx:random(-0.11,0.11), vy:random(0.16,0.29),
    phase:random(0,Math.PI*2), frequency:random(0.00038,0.0007),
    angle:random(-6,6), spin:random(-0.0015,0.0015),
    anchored:Math.random()<0.42
  });
}
function runPhysics(now) {
  if (!lineupOpened) return;
  const dt=Math.min(34,Math.max(1,now-lastFrame||16));
  lastFrame=now;
  if(now>=nextSpawn && remainingFiles.length) {
    spawnW();
    nextSpawn=now+random(650,1900);
  }
  for(const s of sprites) {
    // Gentle, near-weightless drift: almost no downward acceleration.
    s.vx += Math.sin(now*s.frequency+s.phase)*0.00006*dt;
    s.vy += 0.00014*dt + Math.cos(now*s.frequency*.72+s.phase)*0.000025*dt;
    s.vx *= Math.pow(0.999,dt);
    s.vy *= Math.pow(0.999,dt);
    s.vx=Math.max(-0.16,Math.min(0.16,s.vx));
    s.vy=Math.max(-0.075,Math.min(0.48,s.vy));
    s.x+=s.vx*dt;
    s.y+=s.vy*dt;
    s.angle+=s.spin*dt;
    if(s.x<5){s.x=5;s.vx=Math.abs(s.vx)*0.6;}
    if(s.x+s.size>zoneWidth-5){s.x=zoneWidth-s.size-5;s.vx=-Math.abs(s.vx)*0.6;}
    if(s.y+s.size*1.58>zoneHeight-8){
      s.y=zoneHeight-s.size*1.58-8;
      s.vy=s.anchored?random(-0.025,0.005):-random(0.025,0.085);
      s.vx*=0.9;
    }
    if(s.y < -s.size*1.7-110) s.vy=Math.abs(s.vy);
  }
  // Soft oval-to-oval collisions, avoiding harsh gravity or violent bouncing.
  for(let i=0;i<sprites.length;i++)for(let k=i+1;k<sprites.length;k++){
    const a=sprites[i],b=sprites[k];
    const dx=(b.x+b.size*.5)-(a.x+a.size*.5);
    const dy=((b.y+b.size*.79)-(a.y+a.size*.79))*.65;
    const minDist=W_SIZE*.70;
    const dist=Math.hypot(dx,dy)||.001;
    if(dist>=minDist)continue;
    const nx=dx/dist,ny=dy/dist;
    const push=Math.min(2,(minDist-dist)*.055);
    a.x-=nx*push;b.x+=nx*push;
    a.y-=ny*push;b.y+=ny*push;
    const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
    if(relative<0){
      const impulse=-relative*.20;
      a.vx-=impulse*nx;b.vx+=impulse*nx;
      a.vy-=impulse*ny;b.vy+=impulse*ny;
    }
  }
  for(const s of sprites){
    s.x=Math.max(0,Math.min(zoneWidth-s.size,s.x));
    s.element.style.transform="translate3d("+s.x.toFixed(1)+"px,"+s.y.toFixed(1)+"px,0) rotate("+s.angle.toFixed(1)+"deg)";
  }
  requestAnimationFrame(runPhysics);
}
lineupButton.addEventListener("click", () => {
  if(lineupOpened || !artwork.classList.contains("is-swapped"))return;
  lineupOpened=true;
  const hole=artwork.getBoundingClientRect();
  const boundary=Math.min(window.innerWidth-100,Math.ceil(hole.right+14));
  zoneWidth=window.innerWidth-boundary;
  zoneHeight=window.innerHeight;
  wZone.style.setProperty("--w-zone-left",boundary+"px");
  scheduleArt.style.setProperty("--schedule-left",(boundary+zoneWidth*.08)+"px");
  scheduleArt.style.setProperty("--schedule-width",(zoneWidth*.84)+"px");
  composition.classList.add("lineup-open");
  // Exactly one of each W image, selected independently at random each time.
  remainingFiles=[...wFiles];
  for(let i=remainingFiles.length-1;i>0;i--){
    const k=Math.floor(Math.random()*(i+1));
    [remainingFiles[i],remainingFiles[k]]=[remainingFiles[k],remainingFiles[i]];
  }
  lastFrame=performance.now();
  nextSpawn=lastFrame+150;
  requestAnimationFrame(runPhysics);
});

const wordmarkReset = document.getElementById("wordmarkReset");
function closeLineup() {
  if (!lineupOpened) return;
  lineupOpened = false;
  composition.classList.remove("lineup-open");
  remainingFiles = [];
  sprites.forEach(sprite => sprite.element.remove());
  sprites.length = 0;
  wZone.replaceChildren();
}
wordmarkReset.addEventListener("click", closeLineup);
wordmarkReset.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    closeLineup();
  }
});
