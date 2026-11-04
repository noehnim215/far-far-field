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
const W_SIZE = 120; // uniform size, approximately 19% larger
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
    vx:random(-0.19,0.19), vy:random(-0.035,0.07),
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
    s.vx += Math.sin(now*s.frequency+s.phase)*0.000095*dt;
    s.vy += 0.000008*dt + Math.cos(now*s.frequency*.72+s.phase)*0.00012*dt;
    s.vx *= Math.pow(0.999,dt);
    s.vy *= Math.pow(0.999,dt);
    s.vx=Math.max(-0.23,Math.min(0.23,s.vx));
    s.vy=Math.max(-0.13,Math.min(0.17,s.vy));
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
    if(s.y < -s.size*0.4) { s.y=-s.size*0.4; s.vy=Math.abs(s.vy)+0.012; }
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

const portalTrigger = document.getElementById("portalTrigger");
const infoScreen = document.getElementById("infoScreen");
const infoPanel = document.getElementById("infoPanel");
const infoHome = document.getElementById("infoHome");
const portalZoom = document.getElementById("portalZoom");
let portalOpening = false;
const infoCopy = {
  march: "<h2>march</h2><p>Explore FAR FAR FIELD — a fictional music and visual culture gathering set in Mongolia in 2028.</p>",
  about: "<h2>about</h2><p>FAR FAR FIELD is an experimental festival concept exploring sound, distance, movement and imagined landscapes.</p>",
  location: "<h2>location</h2><p>Mongolia · 2028</p><p>Exact venue, access details and travel information have not been announced. This is a fictional design project, not a ticketed event.</p>",
  contact: "<h2>contact</h2><p>For inquiries about FAR FAR FIELD, please contact the project organizer through the official channels when available. This is a fictional festival concept; no public contact address has been announced.</p>",
  legal: "<h2>legal</h2><p>© 2028 FAR FAR FIELD. All rights reserved.</p><p>This is a fictional, non-commercial design concept. Names, likenesses, artist images and other third-party materials remain the property of their respective rights holders. Their inclusion does not imply sponsorship, endorsement, participation or affiliation.</p><p>Any dates, schedules, venues and lineup information are illustrative and are not a representation of confirmed performances. No tickets or reservations are offered through this website.</p><p>The website is provided for portfolio and educational presentation purposes, without warranties as to completeness, accuracy or availability. Do not rely on it for travel, purchasing or event decisions.</p><p>No account registration or personal-data submission is required by this concept page. Third-party hosting services may process technical data under their own policies.</p>"
};
function positionPortalTrigger() {
  if (!artwork.classList.contains("is-left")) return;
  const rect=artwork.getBoundingClientRect();
  portalTrigger.style.left=rect.left+"px";
  portalTrigger.style.top=rect.top+"px";
  portalTrigger.style.width=rect.width+"px";
  portalTrigger.style.height=rect.height+"px";
}
window.addEventListener("resize",positionPortalTrigger);
window.setTimeout(positionPortalTrigger,2150);
portalTrigger.addEventListener("click",()=>{
  if(!artwork.classList.contains("is-swapped") || portalOpening) return;
  portalOpening=true;
  if(lineupOpened) closeLineup();
  const rect=artwork.getBoundingClientRect();
  portalZoom.style.setProperty("--portal-x",(rect.left+rect.width/2)+"px");
  portalZoom.style.setProperty("--portal-y",(rect.top+rect.height/2)+"px");
  portalZoom.style.setProperty("--portal-width",rect.width+"px");
  portalZoom.style.setProperty("--portal-height",rect.height+"px");
  portalZoom.classList.add("is-active");
  requestAnimationFrame(()=>requestAnimationFrame(()=>portalZoom.classList.add("is-zooming")));
  window.setTimeout(()=>{
    composition.classList.add("info-open");
    infoScreen.setAttribute("aria-hidden","false");
    infoPanel.innerHTML="";
    document.querySelectorAll("[data-info]").forEach(item=>item.classList.remove("is-active"));
  },720);
  window.setTimeout(()=>{
    portalZoom.classList.remove("is-active","is-zooming");
    portalOpening=false;
  },1400);
});
infoHome.addEventListener("click",()=>{
  // A full page reload also clears all animation timers and returns Field to its initial state.
  window.location.reload();
});
document.querySelectorAll("[data-info]").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll("[data-info]").forEach(item=>item.classList.remove("is-active"));
    button.classList.add("is-active");
    infoPanel.innerHTML=infoCopy[button.dataset.info]||"";
  });
});
