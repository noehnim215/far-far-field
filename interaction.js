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
const random=(min,max)=>min+Math.random()*(max-min);
let lineupOpened=false;
let remainingFiles=[];
let spawnTimers=[];
const W_SIZE=120;
function spawnW(file,index,available) {
  if(!lineupOpened)return;
  const image=document.createElement("img");
  image.src="./"+file;
  image.alt="lineup artist";
  image.className="w-floater";
  image.style.setProperty("--w-size",W_SIZE+"px");
  const x=random(6,Math.max(7,available-W_SIZE-15));
  const bottom=Math.max(20,window.innerHeight-W_SIZE*1.6-12);
  const endY=random(bottom*.35,bottom*.94);
  image.style.setProperty("--w-x",x+"px");
  image.style.setProperty("--w-mid",(endY*.5)+"px");
  image.style.setProperty("--w-end",endY+"px");
  image.style.setProperty("--w-duration",random(15,23)+"s");
  image.style.setProperty("--w-tilt",random(-7,7)+"deg");
  image.style.setProperty("--w-delay","0s");
  wZone.appendChild(image);
}
lineupButton.addEventListener("click",()=>{
  if(lineupOpened||!artwork.classList.contains("is-swapped"))return;
  lineupOpened=true;
  const hole=artwork.getBoundingClientRect();
  const boundary=Math.min(window.innerWidth-100,Math.ceil(hole.right+14));
  const available=window.innerWidth-boundary;
  wZone.style.setProperty("--w-zone-left",boundary+"px");
  scheduleArt.style.setProperty("--schedule-left",(boundary+available*.08)+"px");
  scheduleArt.style.setProperty("--schedule-width",(available*.84)+"px");
  composition.classList.add("lineup-open");
  remainingFiles=[...wFiles];
  for(let i=remainingFiles.length-1;i>0;i--){
    const k=Math.floor(Math.random()*(i+1));
    [remainingFiles[i],remainingFiles[k]]=[remainingFiles[k],remainingFiles[i]];
  }
  let delay=350;
  remainingFiles.forEach((file,index)=>{
    delay+=random(400,1650);
    spawnTimers.push(window.setTimeout(()=>spawnW(file,index,available),delay));
  });
});
const wordmarkReset = document.getElementById("wordmarkReset");
function closeLineup() {
  if (!lineupOpened) return;
  lineupOpened = false;
  composition.classList.remove("lineup-open");
  remainingFiles = [];
  spawnTimers.forEach(window.clearTimeout);
  spawnTimers=[];
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
