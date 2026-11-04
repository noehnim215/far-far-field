const artwork = document.getElementById("artwork");
const field = document.getElementById("fieldImage");
field.addEventListener("click", () => {
  if (artwork.classList.contains("is-flying")) return;
  const rect = artwork.getBoundingClientRect();
  const scale = 0.38;
  const margin = 18;
  const targetCenterX = margin + rect.width * scale / 2;
  const targetCenterY = margin + rect.height * scale / 2;
  artwork.style.setProperty("--fly-x", (targetCenterX - (rect.left + rect.width / 2)) + "px");
  artwork.style.setProperty("--fly-y", (targetCenterY - (rect.top + rect.height / 2)) + "px");
  artwork.classList.add("is-flying");
});
