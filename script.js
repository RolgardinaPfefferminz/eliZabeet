/* =============================================================
   ENGINE — muss normalerweise NICHT angefasst werden.
   Alle Inhalte kommen aus content/stations.js und content/config.js.
   ============================================================= */

const REAL_STATIONS = STATIONS.filter(s => !s.isStart);
const START_STATION = STATIONS.find(s => s.isStart);

// routeOrder: die Reihenfolge, in der Stationen TATSÄCHLICH besucht
// wurden (nicht die Reihenfolge in stations.js). Startpunkt zählt
// automatisch als erster Schritt.
let routeOrder = JSON.parse(localStorage.getItem("elizabeet_route") || "null");
if(!routeOrder || !routeOrder.length){
  routeOrder = START_STATION ? [START_STATION.id] : [];
}

function saveRoute(){
  localStorage.setItem("elizabeet_route", JSON.stringify(routeOrder));
}

function stationById(id){ return STATIONS.find(s => s.id === id); }

/* ---------- Karte ---------- */
function renderMap(){
  const canvas = document.getElementById("map-canvas");
  canvas.querySelectorAll(".station-pin").forEach(p => p.remove());

  if(CONFIG.mapBackground){
    canvas.classList.add("has-image");
    canvas.style.backgroundImage = `url("${CONFIG.mapBackground}")`;
  } else {
    canvas.classList.remove("has-image");
    canvas.style.backgroundImage = "";
    if(!canvas.querySelector(".map-pending")){
      const pending = document.createElement("div");
      pending.className = "map-pending";
      pending.innerHTML = `
        <div class="stamp">Map<br>pending</div>
        <div class="hint">Place the supplied hand-drawn garden map at <code>assets/map/garden-map.png</code> and set the path in <code>content/config.js</code>.</div>
      `;
      canvas.appendChild(pending);
    }
  }

  STATIONS.forEach((st, i) => {
    const pin = document.createElement("div");
    const visited = routeOrder.includes(st.id);
    pin.className = "station-pin" + (st.isStart ? " start" : "") + (visited ? " visited" : "") + (!visited && !st.isStart ? " pulsing" : "");
    pin.style.left = st.pos.x + "%";

     if(st.isStart){
  pin.innerHTML = "📍";
  pin.classList.add("preview-start");
  pin.style.left = "78%";
  pin.style.top = "35%";
}
  
    pin.style.top = st.pos.y + "%";
   
    pin.onclick = () => openPanel(st.id);
    canvas.appendChild(pin);
  });

  drawRouteLine(canvas);
  updateMapStatus();
}

function drawRouteLine(canvas){
  const svg = document.getElementById("map-svg");
  const line = document.getElementById("route-line");
  const rect = canvas.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

  const d = routeOrder
    .map(id => stationById(id))
    .filter(Boolean)
    .map((st, i) => {
      const x = (st.pos.x / 100) * rect.width;
      const y = (st.pos.y / 100) * rect.height;
      return (i === 0 ? "M" : "L") + x + "," + y;
    }).join(" ");
  line.setAttribute("d", d);
}

function updateMapStatus(){
  const total = REAL_STATIONS.length;
  const done = routeOrder.filter(id => id !== START_STATION?.id).length;
  document.getElementById("map-status").textContent =
    done === 0 ? "Tap a pin to begin" : `${done} / ${total} explored`;
}

/* ---------- Hero-Zähler ---------- */
function renderHero(){
  const total = REAL_STATIONS.length;
  const done = routeOrder.filter(id => id !== START_STATION?.id).length;
  document.getElementById("hero-count").textContent = String(done).padStart(2, "0");
  document.getElementById("hero-total").textContent = String(total).padStart(2, "0");
}

/* ---------- "Your Route"-Panel ---------- */
function renderRoutePanel(){
  const tag = document.getElementById("route-tag");
  const body = document.getElementById("route-body");
  const visitedReal = routeOrder.filter(id => id !== START_STATION?.id);

  if(visitedReal.length === 0){
    tag.textContent = "Not yet started";
    body.innerHTML = `
      <div class="route-choose">
        <span class="plus">+</span>
        <span>Choose a station<br>from the map.</span>
      </div>`;
  } else {
    tag.textContent = "In progress";
    const steps = visitedReal.map(id => {
      const st = stationById(id);
      return `<span class="step">${st ? st.name : id}</span>`;
    }).join(" → ");
    body.innerHTML = `<div class="route-thread">${steps}</div>`;
  }
}

/* ---------- eliZa Field Notes ---------- */
function renderFieldNote(){
  const notes = CONFIG.fieldNotes || [];
  const note = notes.length ? notes[Math.floor(Math.random() * notes.length)] : "";
  document.getElementById("field-note-text").textContent = note;
}

/* ---------- Stations-Panel (Bottom Sheet) ---------- */
function openPanel(id){
  const st = stationById(id);
  if(!st) return;

  document.getElementById("panel-icon").textContent = st.icon;
  document.getElementById("panel-title").textContent = st.name;
  document.getElementById("panel-prompt").textContent = st.prompt;

  const img = document.getElementById("panel-image");
  if(st.image){ img.src = st.image; img.style.display = "block"; }
  else { img.style.display = "none"; }

  const audio = document.getElementById("panel-audio");
  if(st.audio){ audio.src = st.audio; audio.style.display = "block"; }
  else { audio.style.display = "none"; }

  const elizaBox = document.getElementById("panel-eliza");
  const line = Array.isArray(st.eliza) ? st.eliza[Math.floor(Math.random()*st.eliza.length)] : st.eliza;
  elizaBox.textContent = line ? "🫜 eliZa: " + line : "";
  elizaBox.style.display = line ? "block" : "none";

  const noteBox = document.getElementById("panel-note");
  if(st.note){
    noteBox.innerHTML = `<strong>${st.note.label}</strong><br>${st.note.content}`;
    noteBox.style.display = "block";
  } else {
    noteBox.style.display = "none";
  }

  const visited = routeOrder.includes(id);
  const btn = document.getElementById("mark-visited-btn");
  btn.textContent = visited ? "Mark as not visited" : "Mark as discovered";
  btn.onclick = () => {
    if(routeOrder.includes(id)){
      routeOrder = routeOrder.filter(x => x !== id);
    } else {
      routeOrder.push(id);
    }
    saveRoute();
    renderAll();
    openPanel(id);
  };

  document.getElementById("overlay").classList.add("open");
}

function closePanel(){
  document.getElementById("overlay").classList.remove("open");
}

document.getElementById("close-panel-btn").addEventListener("click", closePanel);
document.getElementById("overlay").addEventListener("click", (e) => {
  if(e.target.id === "overlay") closePanel();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  routeOrder = START_STATION ? [START_STATION.id] : [];
  saveRoute();
  renderAll();
});

/* ---------- alles zusammen neu zeichnen ---------- */
function renderAll(){
  renderMap();
  renderHero();
  renderRoutePanel();
}

saveRoute();
renderAll();
renderFieldNote();
window.addEventListener("resize", () => drawRouteLine(document.getElementById("map-canvas")));
const mapOverlay = document.getElementById("map-overlay");
const mapLarge = document.getElementById("map-large");
document.getElementById("map-close-btn").addEventListener("click", () => {
  mapOverlay.classList.remove("is-open");
});
document.getElementById("map-expand-btn").addEventListener("click", () => {
  mapLarge.style.backgroundImage = `url("${CONFIG.mapBackground}")`;

  mapLarge.querySelectorAll(".large-station-hit").forEach(hit => hit.remove());

  STATIONS.forEach((st) => {
    const hit = document.createElement("button");
    hit.className = "large-station-hit" + (st.isStart ? " large-start" : "");
    hit.type = "button";
    hit.style.left = st.pos.x + "%";
    hit.style.top = st.pos.y + "%";
    hit.addEventListener("click", () => openPanel(st.id));
    mapLarge.appendChild(hit);
  });

  mapOverlay.classList.add("is-open");
});

