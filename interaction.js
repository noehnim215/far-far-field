const artwork = document.getElementById("artwork");
const field = document.getElementById("fieldImage");
let activated = false;
field.addEventListener("click", () => {
  if (activated) return;
  activated = true;
  artwork.classList.add("revealed");
  window.setTimeout(() => artwork.classList.add("is-flying"), 140);
  // Field finishes shrinking before the black hole slides to the left.
  window.setTimeout(() => {
    const rect = artwork.getBoundingClientRect();
    const leftMargin = Math.max(18, window.innerWidth * 0.06);
    const shift = leftMargin - rect.left;
    artwork.style.setProperty("--left-shift", shift + "px");
    artwork.classList.add("is-left");
  }, 1100);
});
