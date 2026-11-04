const artwork = document.getElementById("artwork");
const field = document.getElementById("fieldImage");
let activated = false;
field.addEventListener("click", () => {
  if (activated) return;
  activated = true;
  // Make the underlying black hole visible before Field starts disappearing.
  artwork.classList.add("revealed");
  window.setTimeout(() => {
    artwork.classList.add("is-flying");
  }, 140);
});
