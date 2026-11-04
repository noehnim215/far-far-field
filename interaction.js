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
  wFiles.forEach((file, index) => {
    const item = document.createElement("img");
    item.src = "./" + file;
    item.alt = "lineup artist";
    item.className = "w-floater";
    const width = Math.max(42, Math.min(115, available * (0.16 + (index % 3) * 0.025)));
    item.style.setProperty("--w-size", width + "px");
    item.style.setProperty("--w-x", (((index * 0.61803398875) % 1) * Math.max(0, available - width - 8)) + "px");
    item.style.setProperty("--w-delay", (index * 1.2) + "s");
    item.style.setProperty("--w-duration", (15 + (index % 4) * 2.3) + "s");
    wZone.appendChild(item);
  });
});
