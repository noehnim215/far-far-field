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
let lineupOpened = false;
const wFiles = ["bb-w.png","lean-w","bass-w.png","vgyn.png","svn-w.png","bon-w.png","miki-w-.png","stel-w.png","smerz-w.png","delroy-w.png","babyfather-w.png","louke-man-w.png"];
lineupButton.addEventListener("click", () => {
  if (lineupOpened || !artwork.classList.contains("is-swapped")) return;
  lineupOpened = true;
  const rect = artwork.getBoundingClientRect();
  const boundary = Math.min(window.innerWidth - 70, Math.ceil(rect.right + 12));
  wZone.style.setProperty("--w-zone-left", boundary + "px");
  composition.classList.add("lineup-open");
  const available = window.innerWidth - boundary;
  // Reuse the twelve supplied W artworks across many independent floaters.
  const total = 48;
  for (let index = 0; index < total; index++) {
    const file = wFiles[index % wFiles.length];
    const item = document.createElement("img");
    item.src = "./" + file;
    item.alt = "lineup artist";
    item.className = "w-floater";
    const width = Math.max(38, Math.min(105, available * (0.12 + (index % 4) * 0.02)));
    const horizontalSpace = Math.max(0, available - width - 20);
    const position = 10 + (((index * 0.61803398875) % 1) * horizontalSpace);
    const pile = index % 3 !== 0;
    if (pile) item.classList.add("w-pile");
    const height = width * 1.6;
    const column = Math.floor((position / Math.max(1, available)) * 6);
    const pileLevel = Math.floor(index / 12);
    const endY = pile
      ? Math.max(80, window.innerHeight - height - 8 - pileLevel * (height * 0.30) - (column % 3) * 12)
      : window.innerHeight + height + 30;
    item.style.setProperty("--w-size", width + "px");
    item.style.setProperty("--w-x", position + "px");
    item.style.setProperty("--w-mid", Math.round(endY * 0.46) + "px");
    item.style.setProperty("--w-end", Math.round(endY) + "px");
    item.style.setProperty("--w-tilt", ((index % 7) - 3) * 3 + "deg");
    item.style.setProperty("--w-delay", (index * 0.48) + "s");
    item.style.setProperty("--w-duration", (13 + (index % 6) * 1.7) + "s");
    wZone.appendChild(item);
  }
});
