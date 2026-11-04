const STORAGE_KEY = "far-far-field-layout-v2";
const defaults = { blackHole: {scale: 100, x: 0, y: 0}, fieldImage: {scale: 100, x: 0, y: 0} };
const clone = obj => JSON.parse(JSON.stringify(obj));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
let state = clone(defaults);
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  for (const id of Object.keys(defaults)) {
    if (saved && saved[id]) for (const key of ["scale", "x", "y"]) {
      if (Number.isFinite(saved[id][key])) state[id][key] = saved[id][key];
    }
  }
} catch (error) {}
const target = document.getElementById("target");
const controls = ["scale", "x", "y"];
const status = document.getElementById("editorStatus");
function render() {
  for (const [id, values] of Object.entries(state)) {
    const el = document.getElementById(id);
    el.style.setProperty("--scale", values.scale / 100);
    el.style.setProperty("--x", values.x);
    el.style.setProperty("--y", values.y);
  }
}
function sync() {
  const values = state[target.value];
  for (const key of controls) {
    document.getElementById(key).value = values[key];
    document.getElementById(key + "Value").textContent = values[key] + "%";
  }
}
for (const key of controls) {
  document.getElementById(key).addEventListener("input", event => {
    state[target.value][key] = Number(event.target.value);
    render(); sync();
    status.textContent = "Preview updated. Click SAVE to keep changes.";
  });
}
target.addEventListener("change", sync);
for (const id of Object.keys(defaults)) {
  const el = document.getElementById(id);
  el.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    target.value = id; sync();
    const startX = event.clientX, startY = event.clientY;
    const initialX = state[id].x, initialY = state[id].y;
    const rect = document.getElementById("artwork").getBoundingClientRect();
    el.setPointerCapture(event.pointerId);
    function move(e) {
      state[id].x = clamp(Math.round(initialX + (e.clientX - startX) / rect.width * 100), -100, 100);
      state[id].y = clamp(Math.round(initialY + (e.clientY - startY) / rect.height * 100), -100, 100);
      render(); sync();
      status.textContent = "Image moved. Click SAVE to keep changes.";
    }
    function stop() { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", stop); el.removeEventListener("pointercancel", stop); }
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
  });
}
document.getElementById("save").addEventListener("click", () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); status.textContent = "Saved in this browser. Click COPY LAYOUT CODE and send it in ChatGPT to publish to GitHub."; }
  catch (e) { status.textContent = "Browser storage is unavailable."; }
});
document.getElementById("reset").addEventListener("click", () => {
  state = clone(defaults); render(); sync();
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  status.textContent = "Restored original centered layout.";
});
document.getElementById("editorToggle").addEventListener("click", () => {
  const panel = document.getElementById("editor");
  panel.hidden = !panel.hidden;
  const button = document.getElementById("editorToggle");
  button.textContent = panel.hidden ? "SHOW CONTROLS" : "HIDE CONTROLS";
  button.setAttribute("aria-expanded", String(!panel.hidden));
});
render(); sync();

document.getElementById("copyLayout").addEventListener("click", async () => {
  const payload = JSON.stringify({blackHole: state.blackHole, fieldImage: state.fieldImage}, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    status.textContent = "Layout code copied! Paste it into our ChatGPT conversation and I can commit it to GitHub.";
  } catch (error) {
    const field = document.createElement("textarea");
    field.value = payload;
    field.readOnly = true;
    field.style.cssText = "width:100%;height:130px;margin-top:10px;";
    const old = document.getElementById("layoutExport");
    if (old) old.remove();
    field.id = "layoutExport";
    document.getElementById("editor").appendChild(field);
    field.select();
    status.textContent = "Copy the selected layout code and send it in ChatGPT.";
  }
});
