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
let spawnBurst = 0;
let zoneWidth = 0;
let zoneHeight = 0;
const maxSprites = 27;
function spawnW() {
  if (sprites.length >= maxSprites) return;
  const size = random(58, Math.min(115, Math.max(66,zoneWidth * 0.22)));
  const image = document.createElement("img");
  image.src = "./" + wFiles[Math.floor(Math.random() * wFiles.length)];
  image.alt = "lineup artist";
  image.className = "w-floater w-active";
  image.style.setProperty("--w-size", size + "px");
  wZone.appendChild(image);
  sprites.push({
    element:image, size,
    x:random(4,Math.max(5,zoneWidth-size-8)), y:-size-random(5,130),
    vx:random(-0.38,0.38), vy:random(0.06,0.3),
    phase:random(0,Math.PI*2), sway:random(0.0004,0.0012),
    angle:random(-10,10), spin:random(-0.008,0.008),
    bounce:random(0.30,0.65), born:performance.now(),
    pile:Math.random()<0.65
  });
}
function runPhysics(now) {
  if (!lineupOpened) return;
  const dt = Math.min(34,Math.max(8,now-lastFrame||16));
  lastFrame=now;
  if (now>=nextSpawn) {
    if (spawnBurst>0) {
      for(let i=0;i<Math.floor(random(2,5));i++) spawnW();
      spawnBurst--;
      nextSpawn=now+random(220,650);
    } else {
      spawnW();
      nextSpawn=now+random(950,2700);
      if(Math.random()<0.18) spawnBurst=Math.floor(random(2,5));
    }
  }
  for (const s of sprites) {
    s.vx += Math.sin(now*s.sway+s.phase)*0.00065*dt;
    s.vx *= Math.pow(0.996,dt);
    s.vy += (s.pile?0.00085:0.00055)*dt;
    s.vy += Math.sin(now*0.0011+s.phase)*0.00032*dt;
    s.vy=Math.min(s.vy, s.pile?0.95:0.72);
    s.x+=s.vx*dt;
    s.y+=s.vy*dt;
    s.angle+=s.spin*dt;
    if(s.x<2){s.x=2;s.vx=Math.abs(s.vx)*0.7;}
    if(s.x+s.size>zoneWidth-2){s.x=zoneWidth-s.size-2;s.vx=-Math.abs(s.vx)*0.7;}
    if(s.y+s.size*1.58>zoneHeight-3) {
      if(s.pile){s.y=zoneHeight-s.size*1.58-3;s.vy=-Math.abs(s.vy)*s.bounce;s.vx*=0.97;if(Math.abs(s.vy)<0.07)s.vy=0;}
    }
  }
  // Approximate oval collision bodies: exchange impulses and separate overlaps.
  for(let i=0;i<sprites.length;i++)for(let k=i+1;k<sprites.length;k++){
    const a=sprites[i],b=sprites[k];
    const ax=a.x+a.size*.5, ay=a.y+a.size*.79;
    const bx=b.x+b.size*.5, by=b.y+b.size*.79;
    const dx=bx-ax,dy=(by-ay)*0.75;
    const minDist=(a.size+b.size)*0.34;
    const dist=Math.hypot(dx,dy)||0.001;
    if(dist>=minDist)continue;
    const nx=dx/dist,ny=dy/dist;
    const overlap=(minDist-dist)*0.5;
    a.x-=nx*overlap;b.x+=nx*overlap;
    a.y-=ny*overlap*.7;b.y+=ny*overlap*.7;
    const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
    if(relative<0){
      const impulse=-(1.28)*relative/2;
      a.vx-=impulse*nx;b.vx+=impulse*nx;
      a.vy-=impulse*ny;b.vy+=impulse*ny;
      a.spin-=impulse*.001;b.spin+=impulse*.001;
    }
  }
  for(let i=sprites.length-1;i>=0;i--){
    const s=sprites[i];
    if(s.y>zoneHeight+120 || (sprites.length>=maxSprites && now-s.born>42000 && Math.random()<0.003)){
      s.element.remove();sprites.splice(i,1);continue;
    }
    s.element.style.transform="translate3d("+s.x.toFixed(1)+"px,"+s.y.toFixed(1)+"px,0) rotate("+s.angle.toFixed(1)+"deg)";
  }
  requestAnimationFrame(runPhysics);
}
lineupButton.addEventListener("click", () => {
  if (lineupOpened || !artwork.classList.contains("is-swapped")) return;
  lineupOpened=true;
  const hole=artwork.getBoundingClientRect();
  const boundary=Math.min(window.innerWidth-80,Math.ceil(hole.right+14));
  zoneWidth=window.innerWidth-boundary;
  zoneHeight=window.innerHeight;
  wZone.style.setProperty("--w-zone-left",boundary+"px");
  scheduleArt.style.setProperty("--schedule-left",(boundary+zoneWidth*.08)+"px");
  scheduleArt.style.setProperty("--schedule-width",(zoneWidth*.84)+"px");
  composition.classList.add("lineup-open");
  lastFrame=performance.now();
  nextSpawn=lastFrame+150;
  spawnBurst=2;
  requestAnimationFrame(runPhysics);
});
