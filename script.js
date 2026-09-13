/* =============================================================
   ENGINE — muss normalerweise NICHT angefasst werden.
   Inhalte kommen aus content/stations.js und content/config.js.
   ============================================================= */

const REAL_STATIONS = STATIONS.filter(s => !s.isStart);
const START_STATION = STATIONS.find(s => s.isStart);

let routeOrder = JSON.parse(localStorage.getItem("elizabeet_route") || "null");

if(!routeOrder || !routeOrder.length){
  routeOrder = START_STATION ? [START_STATION.id] : [];
}

function saveRoute(){
  localStorage.setItem("elizabeet_route", JSON.stringify(routeOrder));
}

function stationById(id){
  return STATIONS.find(s => s.id === id);
}


/* ---------- Karte ---------- */

function renderMap(){
  const canvas = document.getElementById("map-canvas");
  const stage = document.getElementById("map-stage");

  stage.querySelectorAll(".station-pin").forEach(p => p.remove());

  if(CONFIG.mapBackground){
    canvas.classList.add("has-image");
    stage.classList.add("has-image");
    stage.style.backgroundImage = `url("${CONFIG.mapBackground}")`;
  } else {
    canvas.classList.remove("has-image");
    canvas.style.backgroundImage = "";

    if(!canvas.querySelector(".map-pending")){
      const pending = document.createElement("div");
      pending.className = "map-pending";
      pending.innerHTML = `
        <div class="stamp">Map<br>pending</div>
        <div class="hint">
          Place the supplied hand-drawn garden map at
          <code>assets/map/garden-map.png</code>
          and set the path in <code>content/config.js</code>.
        </div>
      `;
      canvas.appendChild(pending);
    }
  }

  STATIONS.forEach(st => {
    const pin = document.createElement("div");
    const visited = routeOrder.includes(st.id);

    pin.className =
      "station-pin" +
      (st.isStart ? " start" : "") +
      (visited ? " visited" : "") +
      (!visited && !st.isStart ? " pulsing" : "");

    pin.style.left = st.pos.x + "%";

    if(st.isStart){
      pin.innerHTML = "📍";
      pin.classList.add("preview-start");
    }

    pin.style.top = st.pos.y + "%";

    pin.onclick = () => openPanel(st.id);

    stage.appendChild(pin);
  });

  drawRouteLine(stage);
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
    })
    .join(" ");

  line.setAttribute("d", d);
}


function updateMapStatus(){
  const total = REAL_STATIONS.length;
  const done = routeOrder.filter(
    id => id !== START_STATION?.id
  ).length;

  document.getElementById("map-status").textContent =
    done === 0
      ? "Tap a pin to begin"
      : `${done} / ${total} explored`;
}


/* ---------- Hero-Zähler ---------- */

function renderHero(){
  const total = REAL_STATIONS.length;

  const done = routeOrder.filter(
    id => id !== START_STATION?.id
  ).length;

  document.getElementById("hero-count").textContent =
    String(done).padStart(2, "0");

  document.getElementById("hero-total").textContent =
    String(total).padStart(2, "0");
}


/* ---------- Your Route ---------- */

function renderRoutePanel(){
  const tag = document.getElementById("route-tag");
  const body = document.getElementById("route-body");

  const visitedReal = routeOrder.filter(
    id => id !== START_STATION?.id
  );

  if(visitedReal.length === 0){
    tag.textContent = "Not yet started";

    body.innerHTML = `
      <div class="route-choose">
        <span class="plus">+</span>
        <span>Choose a station<br>from the map.</span>
      </div>
    `;
  } else {
    tag.textContent = "In progress";

    const steps = visitedReal
      .map(id => {
        const st = stationById(id);
        return `<span class="step">${st ? st.name : id}</span>`;
      })
      .join(" → ");

    body.innerHTML = `
      <div class="route-thread">${steps}</div>
    `;
  }
}


/* ---------- eliZa Field Notes ---------- */

function renderFieldNote(){
  const notes = CONFIG.fieldNotes || [];

  const note = notes.length
    ? notes[Math.floor(Math.random() * notes.length)]
    : "";

  document.getElementById("field-note-text").textContent = note;
}


/* =============================================================
   QUIZ
   ============================================================= */

function addQuizStyles(){
  if(document.getElementById("elizabeet-quiz-styles")) return;

  const style = document.createElement("style");
  style.id = "elizabeet-quiz-styles";

  style.textContent = `
    #panel-quiz{
      margin:20px 0;
      padding:18px;
      border:1px solid currentColor;
      border-radius:12px;
    }

    #panel-quiz h3{
      margin:0 0 16px;
    }

    .quiz-question{
      margin:0 0 20px;
    }

    .quiz-question-title{
      margin:0 0 12px;
      font-weight:600;
    }

    .quiz-option{
      display:block;
      margin:8px 0;
      cursor:pointer;
    }

    .quiz-option input{
      margin-right:8px;
    }

    .quiz-submit{
      width:100%;
      margin-top:8px;
      padding:12px;
      border:1px solid currentColor;
      border-radius:8px;
      background:transparent;
      color:inherit;
      cursor:pointer;
      font:inherit;
    }

    .quiz-submit:hover{
      opacity:.7;
    }

    .quiz-feedback{
      margin-top:16px;
      padding:12px;
      border-top:1px solid currentColor;
    }

    .quiz-result{
      margin-top:18px;
      padding-top:16px;
      border-top:1px solid currentColor;
      font-weight:600;
    }

    .quiz-text-input{
      width:100%;
      min-height:90px;
      box-sizing:border-box;
      padding:10px;
      border:1px solid currentColor;
      border-radius:8px;
      background:transparent;
      color:inherit;
      font:inherit;
      resize:vertical;
    }
  `;

  document.head.appendChild(style);
}


/* ---------- Quiz anzeigen ---------- */

function renderQuiz(st){
  addQuizStyles();

  let quizBox = document.getElementById("panel-quiz");

  if(!quizBox){
    quizBox = document.createElement("div");
    quizBox.id = "panel-quiz";

    const noteBox = document.getElementById("panel-note");

    noteBox.parentNode.insertBefore(
      quizBox,
      noteBox.nextSibling
    );
  }

  quizBox.innerHTML = "";

 quizBox.innerHTML = "<p>QUIZ TEST</p>";  
  if(!st.quiz || !Array.isArray(st.quiz.questions)){
    quizBox.style.display = "none";
    return;
  }

  quizBox.style.display = "block";

  const quizTitle = document.createElement("h3");
  quizTitle.textContent = st.quiz.title || "Quiz";
  quizBox.appendChild(quizTitle);

  const form = document.createElement("div");
  form.id = "quiz-form";

  st.quiz.questions.forEach((q, index) => {
    const questionBox = document.createElement("div");
    questionBox.className = "quiz-question";

    const questionTitle = document.createElement("p");
    questionTitle.className = "quiz-question-title";
    questionTitle.textContent =
      `${index + 1}. ${q.question}`;

    questionBox.appendChild(questionTitle);

    if(q.type === "text"){
      const input = document.createElement("textarea");
      input.className = "quiz-text-input";
      input.id = `quiz-q-${index}`;
      input.placeholder = "Your answer…";

      questionBox.appendChild(input);
    }

    else if(q.type === "multi"){
      q.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "quiz-option";

        label.innerHTML = `
          <input
            type="checkbox"
            name="quiz-${index}"
            value="${optionIndex}"
          >
          ${option}
        `;

        questionBox.appendChild(label);
      });
    }

    else {
      q.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "quiz-option";

        label.innerHTML = `
          <input
            type="radio"
            name="quiz-${index}"
            value="${optionIndex}"
          >
          ${option}
        `;

        questionBox.appendChild(label);
      });
    }

    form.appendChild(questionBox);
  });

  const submitButton = document.createElement("button");
  submitButton.className = "quiz-submit";
  submitButton.textContent = "Check my answers";

  submitButton.onclick = () => checkQuiz(st);

  form.appendChild(submitButton);
  quizBox.appendChild(form);
}


/* ---------- Quiz auswerten ---------- */

function checkQuiz(st){
  const questions = st.quiz.questions;

  let score = 0;
  let answered = 0;

  questions.forEach((q, index) => {

    if(q.type === "text"){
      const input = document.getElementById(`quiz-q-${index}`);

      if(input && input.value.trim()){
        answered++;
      }

      return;
    }


    if(q.type === "multi"){
      const selected = [
        ...document.querySelectorAll(
          `input[name="quiz-${index}"]:checked`
        )
      ]
      .map(input => Number(input.value))
      .sort((a,b) => a-b);

      if(selected.length){
        answered++;
      }

      const correct = (
        Array.isArray(q.answers)
          ? q.answers
          : []
      )
      .slice()
      .sort((a,b) => a-b);

      if(
        selected.length === correct.length &&
        selected.every((value, i) => value === correct[i])
      ){
        score++;
      }

      return;
    }


    const selected = document.querySelector(
      `input[name="quiz-${index}"]:checked`
    );

    if(selected){
      answered++;
    }

    if(
      selected &&
      Number(selected.value) === Number(q.answer)
    ){
      score++;
    }
  });


  const quizBox = document.getElementById("panel-quiz");

  let result = quizBox.querySelector(".quiz-result");

  if(!result){
    result = document.createElement("div");
    result.className = "quiz-result";
    quizBox.appendChild(result);
  }

  const knowledgeQuestions = questions.filter(
    q => q.type !== "text"
  ).length;

  const textQuestions = questions.filter(
    q => q.type === "text"
  ).length;

  result.innerHTML =
    `You got ${score} / ${knowledgeQuestions} knowledge questions right.` +
    (textQuestions
      ? `<br><br>Your own answer counts as part of the journey.`
      : "");

  const submitButton = quizBox.querySelector(".quiz-submit");

  if(submitButton){
    submitButton.textContent = "Quiz checked";
    submitButton.disabled = true;
  }
}


/* ---------- Stations-Panel ---------- */

function openPanel(id){
  const st = stationById(id);

  if(!st) return;

  document.getElementById("panel-icon").textContent = st.icon;
  document.getElementById("panel-title").textContent = st.name;
  document.getElementById("panel-prompt").textContent = st.prompt;


  const img = document.getElementById("panel-image");

  if(st.image){
    img.src = st.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }


  const audio = document.getElementById("panel-audio");

  if(st.audio){
    audio.src = st.audio;
    audio.style.display = "block";
  } else {
    audio.style.display = "none";
  }


  const elizaBox = document.getElementById("panel-eliza");

  const line = Array.isArray(st.eliza)
    ? st.eliza[Math.floor(Math.random() * st.eliza.length)]
    : st.eliza;

  elizaBox.textContent =
    line ? "🫜 eliZa: " + line : "";

  elizaBox.style.display =
    line ? "block" : "none";


  const noteBox = document.getElementById("panel-note");

  if(st.note){
    noteBox.innerHTML =
      `<strong>${st.note.label}</strong><br>${st.note.content}` +
      (
        st.note.link
          ? `<br><a href="${st.note.link}" target="_blank" rel="noopener">Circular Blue →</a>`
          : ""
      );

    noteBox.style.display = "block";

  } else {
    noteBox.style.display = "none";
  }


  /* Quiz */

  renderQuiz(st);


  /* Discovered-Button */

  const visited = routeOrder.includes(id);
  const btn = document.getElementById("mark-visited-btn");

  btn.textContent =
    visited
      ? "Mark as not visited"
      : "Mark as discovered";

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


  document
    .getElementById("overlay")
    .classList.add("open");
}


/* ---------- Panel schließen ---------- */

function closePanel(){
  document
    .getElementById("overlay")
    .classList.remove("open");
}


document
  .getElementById("close-panel-btn")
  .addEventListener("click", closePanel);


document
  .getElementById("overlay")
  .addEventListener("click", (e) => {
    if(e.target.id === "overlay"){
      closePanel();
    }
  });


/* ---------- Reset ---------- */

document
  .getElementById("reset-btn")
  .addEventListener("click", () => {

    routeOrder =
      START_STATION
        ? [START_STATION.id]
        : [];

    saveRoute();
    renderAll();
  });


/* ---------- Alles zusammen neu zeichnen ---------- */

function renderAll(){
  renderMap();
  renderHero();
  renderRoutePanel();
}

saveRoute();
renderAll();
renderFieldNote();


/* ---------- Karte auf Startpunkt ausrichten ---------- */

const mapCanvas = document.getElementById("map-canvas");
const start = START_STATION;

if(start){
  requestAnimationFrame(() => {

    mapCanvas.scrollLeft =
      (start.pos.x / 100) * mapCanvas.scrollWidth -
      mapCanvas.clientWidth / 2;

  });
}

