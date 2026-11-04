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
  march: `<div class="merch-gallery"><figure><img src="./march-1-front.png" alt="FAR FAR FIELD white T-shirt front, three black oval graphics" loading="lazy"><figcaption>front</figcaption></figure><figure><img src="./march-1-back.png" alt="FAR FAR FIELD white T-shirt back, festival logo, Menen Steppe and July 12–14 2028" loading="lazy"><figcaption>back</figcaption></figure></div>`,
  about: "<h2>about</h2><p>FAR FAR FIELD is an experimental festival concept exploring sound, distance, movement and imagined landscapes.</p>",
  location: `<div class="location-layout"><div class="location-map"><iframe title="Menen Steppe, Dornod, Mongolia — map" src="https://maps.google.com/maps?q=47.7151342%2C116.9835312&amp;z=9&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a href="https://www.google.com/maps/place/Menen+Steppe/@47.7151342,116.9835312,9z" target="_blank" rel="noopener noreferrer">view on google maps</a></div><div class="location-details"><h2>location</h2><p>menen steppe<br>dornod aimag, mongolia</p><p>47.7151342° N<br>116.9835312° E</p><p>july 12–14, 2028</p><p>FAR FAR FIELD is a fictional festival concept. This location is an artistic setting, not a confirmed event venue.</p></div></div>`,
  contact: "<h2>contact</h2><p>For inquiries about FAR FAR FIELD, please contact the project organizer through the official channels when available. This is a fictional festival concept; no public contact address has been announced.</p>",
  legal: "<h2>legal</h2><p class=\"legal-intro\">FAR FAR FIELD — PROJECT NOTICE, RIGHTS, PRIVACY & TERMS OF USE<br>Concept edition · 2028</p><section class=\"legal-section\"><h3>01 — nature of the project</h3><p>FAR FAR FIELD is a fictional, independent festival identity and website created for educational, artistic, experimental and portfolio presentation. It is not an announcement of an operating event, a registered festival organization, or a promise that any performance, installation, exhibition, gathering, service or activity will take place. Nothing on this website should be understood as an offer to sell admission, a solicitation for investment, or an invitation to enter a binding agreement.</p></section><section class=\"legal-section\"><h3>02 — dates, schedules and programming</h3><p>All references to 2028, event days, performance times, running orders, timetables, stages, artists, curators, programs and activities are conceptual and illustrative. Any schedule may be incomplete, imaginary, inaccurate or subject to change without notice. No featured performer, representative, manager, agent or rights holder has been confirmed as participating merely because a name, photograph or visual reference appears on this website.</p></section><section class=\"legal-section\"><h3>03 — artists, names and likenesses</h3><p>Artist names, stage names, photographs, portraits, performances, biographies, logos and other identifying material may be used solely as visual references within this design study. All relevant rights remain with their respective owners. The presence of an artist or third-party reference does not constitute an endorsement, sponsorship, partnership, booking, licensing arrangement, collaboration or other affiliation with FAR FAR FIELD. Rights holders may contact the project creator to raise a concern about an included reference.</p></section><section class=\"legal-section\"><h3>04 — copyright and intellectual property</h3><p>Unless otherwise stated, the original layout, interface composition, animation concepts, original copy and project-specific visual identity are presented as part of the FAR FAR FIELD design project. Third-party photographs, typefaces, music-related imagery, logos, names, artwork and other materials are not claimed as original property of the project. Their appearance does not transfer ownership or grant any license to visitors. No material should be copied, republished, redistributed, commercially exploited or adapted without the permission of the relevant rights holder where permission is required.</p></section><section class=\"legal-section\"><h3>05 — visual assets and artistic interpretation</h3><p>Images, effects, moving graphics, simulated portals, black-hole imagery, floating artist graphics, transitions and other visual elements are artistic representations. They are not factual depictions of a venue, installation, scientific phenomenon, performer appearance or live experience. Color, scale, position, movement and display may vary depending on device, browser, screen size, accessibility preferences and network conditions.</p></section><section class=\"legal-section\"><h3>06 — venue, geography and travel</h3><p>References to Mongolia and any geographical or environmental setting describe the imagined context of this concept. No physical venue, address, transport arrangement, campsite, accommodation provider, accessibility service, border-crossing arrangement or travel itinerary is guaranteed or confirmed. Visitors must not make travel, visa, accommodation, insurance or transportation decisions based on this website. Any future real-world event would require separate official communications.</p></section><section class=\"legal-section\"><h3>07 — tickets, payments and commercial activity</h3><p>This concept website does not issue tickets, accept reservations, process payments, sell merchandise or guarantee admission. No pricing, availability, refund, cancellation, resale or transfer policy is established by the content shown here. Any third party claiming to sell official FAR FAR FIELD admission on the basis of this concept should be independently verified. Do not send money or sensitive information in response to an unverified claim.</p></section><section class=\"legal-section\"><h3>08 — website availability and accuracy</h3><p>The website and its contents are provided on an as-is and as-available basis for creative demonstration. While reasonable efforts may be made to keep the presentation functional, no representation is made that it is uninterrupted, secure, complete, error-free, current or suitable for a particular purpose. Pages, assets, features, wording and interactions may be changed, suspended or removed without prior notice.</p></section><section class=\"legal-section\"><h3>09 — limitation of reliance</h3><p>To the extent permitted by applicable law, the project creator disclaims responsibility for losses arising from reliance on fictional schedules, artist listings, location references, ticket assumptions, travel details or other illustrative content. Nothing in this statement excludes or limits liability that cannot lawfully be excluded or limited. Visitors remain responsible for independently verifying information before taking real-world action.</p></section><section class=\"legal-section\"><h3>10 — privacy and personal information</h3><p>The website is not intended to require account registration or direct submission of personal information. Visitors should not send passwords, payment-card numbers, identity documents, medical information or other sensitive data through any unverified contact channel. Hosting providers, browsers and linked services may automatically process technical information, such as IP addresses, request logs, cookies or device details, under their own practices and policies. This statement does not replace a provider's privacy notice.</p></section><section class=\"legal-section\"><h3>11 — cookies, analytics and third-party services</h3><p>The site may depend on external hosting, web-font delivery and other technical services. Those services may receive connection information when their resources load. The project does not claim to control third-party data handling, retention, security or tracking. If additional analytics, embedded media, forms or interactive services are introduced later, their use and any associated disclosures should be reviewed and updated accordingly.</p></section><section class=\"legal-section\"><h3>12 — external links and references</h3><p>Links or references to artists, platforms, venues, services, publications or other websites are provided, where present, for context or design demonstration. The project does not control external content and does not guarantee its accuracy, safety, availability or policies. A link does not imply approval, endorsement, sponsorship or an ongoing relationship.</p></section><section class=\"legal-section\"><h3>13 — accessibility and technical compatibility</h3><p>The project aims to communicate an experimental visual experience, but animated elements, layered imagery, small text and browser-dependent effects may present accessibility or compatibility limitations. Some users may prefer reduced motion or alternative ways to access information. The design may be revised to improve legibility, keyboard navigation, responsive behavior and access to essential text.</p></section><section class=\"legal-section\"><h3>14 — conduct and permitted use</h3><p>Visitors may view the website for personal, educational and non-commercial reference. Users should not attempt to interfere with its operation, misrepresent the fictional project as an actual event, impersonate organizers or artists, or use the website to deceive others. Any reuse of third-party or original creative materials must respect applicable rights and permissions.</p></section><section class=\"legal-section\"><h3>15 — updates and corrections</h3><p>Information and legal notices may be revised as the project evolves. Changes can take effect when published on the website. Because this is a conceptual presentation, archived screenshots, cached pages and earlier versions may differ from the current experience. Any corrections concerning third-party rights, factual references or attribution may be considered by the project creator.</p></section><section class=\"legal-section\"><h3>16 — contact and rights inquiries</h3><p>For questions, attribution requests, permissions or concerns about the project, use an official contact channel if and when one is published. No public email address or postal address is currently supplied through this concept. Please do not assume that social media accounts or third-party listings represent the project without independent verification.</p></section><section class=\"legal-section\"><h3>17 — governing context and interpretation</h3><p>This notice is descriptive project copy, not a negotiated contract or a substitute for professional legal advice. Applicable legal rights and obligations depend on the relevant jurisdiction and facts. If the project becomes a real event, additional legally reviewed terms, consumer notices, privacy disclosures, accessibility information, ticket conditions and organizer identification may be necessary.</p></section><section class=\"legal-section\"><h3>18 — final notice</h3><p>© 2028 FAR FAR FIELD. Fictional festival concept. All rights reserved in original project materials, subject to the rights of third parties. Visuals and artist references are used for design demonstration only. No affiliation with any featured artist is implied. Event details, ticketing, travel and location information are illustrative and subject to change. This site is provided as-is, without warranty to the extent permitted by law. For any real-world event information, rely only on verified official organizer communications.</p></section>"
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
