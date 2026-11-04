const artwork = document.getElementById("artwork");
const field = document.getElementById("fieldImage");
let activated = false;
field.addEventListener("click", () => {
  if (activated) return;
  activated = true;
  const rect = field.getBoundingClientRect();
  const scale = 0.38;
  const margin = 18;
  const targetCenterX = margin + rect.width * scale / 2;
  const targetCenterY = margin + rect.height * scale / 2;
  artwork.style.setProperty("--fly-x", (targetCenterX - (rect.left + rect.width / 2)) + "px");
  artwork.style.setProperty("--fly-y", (targetCenterY - (rect.top + rect.height / 2)) + "px");
  // First reveal the black hole quickly, then send only the Field image up-left.
  artwork.classList.add("revealed");
  window.setTimeout(() => artwork.classList.add("is-flying"), 220);
});
