const STORAGE_KEY = "far-far-field-layout-v1";
const defaults = {
  blackHole: {scale: 90, x: 0, y: 0},
  fieldImage: {scale: 78, x: 0, y: 0},
  logoText: {scale: 100, x: 0, y: 0}
};
const copy = obj => JSON.parse(JSON.stringify(obj));
let state = copy(defaults);
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  for (const key of Object.keys(defaults)) {
    if (saved && saved[key]) for (const p of ["scale","x","y"]) {
      if (Number.isFinite(saved[key][p])) state[key][p] = saved[key][p];
    }
  }
} catch (e) {}
const target = document.getElementById("target");
const controls = ["scale","x","y"];
const status = document.getElementById("editorStatus");
function render() {
  for (const [id, values] of Object.entries(state)) {
    const el = document.getElementById(id);
    el.style.setProperty("--scale", values.scale / 100);
    el.style.setProperty("--x", values.x + "px");
    el.style.setProperty("--y", values.y + "px");
  }
}
function syncControls() {
  const values = state[target.value];
  for (const key of controls) {
    document.getElementById(key).value = values[key];
    document.getElementById(key + "Value").textContent = values[key] + (key === "scale" ? "%" : "px");
  }
}
for (const key of controls) {
  document.getElementById(key).addEventListener("input", event => {
    state[target.value][key] = Number(event.target.value);
    render();
    syncControls();
    status.textContent = "Preview updated — click SAVE to keep these settings.";
  });
}
target.addEventListener("change", syncControls);
document.getElementById("save").addEventListener("click", () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); status.textContent = "Saved in this browser."; }
  catch (e) { status.textContent = "Could not save in this browser."; }
});
document.getElementById("reset").addEventListener("click", () => {
  state = copy(defaults); render(); syncControls();
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  status.textContent = "Restored default layout.";
});
document.getElementById("editorToggle").addEventListener("click", () => {
  const panel = document.getElementById("editor");
  panel.hidden = !panel.hidden;
  document.getElementById("editorToggle").textContent = panel.hidden ? "SHOW EDITOR" : "HIDE EDITOR";
  document.getElementById("editorToggle").setAttribute("aria-expanded", String(!panel.hidden));
});
render(); syncControls();
