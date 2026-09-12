/* =============================================================
   STATIONEN — das ist die einzige Datei, die du normalerweise
   bearbeitest. Jede Station ist ein Objekt in der Liste unten.

   Felder pro Station:
     id        – kurzer Code, eindeutig, keine Leerzeichen
     name      – Anzeigename
     icon      – ein Emoji, taucht im Stations-Fenster auf
     pos       – Position auf der Karte, in Prozent: {x: 0-100, y: 0-100}
                 (0,0 = oben links). Das sind PLATZHALTER-Werte, bis
                 deine echte Kartenzeichnung da ist — dann passt du
                 sie an die tatsächliche Lage jedes Orts an.
     prompt    – die eigentliche Aufgabe/der Hinweistext
     eliza     – ein oder mehrere Sätze, die "eliZa" dazu sagt
                 (frei erfunden, absichtlich leicht unheimlich-
                 künstlich formuliert – kein echtes Sprachmodell,
                 nur vorgeschriebener Text)
     note      – optional: zusätzlicher Info-Kasten (z.B. Link,
                 Hintergrundwissen). Weglassen, wenn nicht nötig.
     image     – optional: Pfad zu einem Bild, das im Stations-Fenster
                 erscheint, z.B. "assets/images/kraeuterbeet.jpg"
     audio     – optional: Pfad zu einer Audiodatei, erscheint als
                 abspielbarer Player, z.B. "assets/audio/eliza-start.mp3"

   Wenn eine Station noch keinen richtigen Text hat, lass einfach
   das Platzhalter-"prompt" stehen und ersetz es später.
   ============================================================= */

const STATIONS = [
  { id:"start", name:"you are here", icon:"👋", isStart:true, pos:{x:32.3, y:37.7},
    prompt:"Hallo, ich bin eliZa. Ich zeige dir keinen Weg – ich zeige dir nur, wo du schon warst.",
    eliza:["Ich bin nicht echt. Aber der Garten ist es. Fang an."] },

  { id:"kompost", name:"Kompost", icon:"🪱", pos:{x:14, y:20},
    prompt:"Platzhalter-Aufgabe: Rieche am Kompost. Was zersetzt sich gerade?",
    eliza:["Ich verarbeite auch nur, was man mir gibt. Anders als der Kompost werde ich davon nicht besser."] },

  { id:"milfabeet", name:"Milfabeet", icon:"🌽", pos:{x:22, y:62},
    prompt:"Platzhalter-Aufgabe zum Milpabeet.",
    eliza:["Ich weiß nicht, was ein Milpabeet ist. Das beunruhigt mich mehr, als es sollte."] },

  { id:"beet", name:"GemüseBeet", icon:"🥕", pos:{x:30, y:12},
    prompt:"Platzhalter-Aufgabe: Was wächst hier gerade?",
    eliza:["Ein Beet. Wie interessant. Erzähl mir mehr davon."] },

  { id:"hochbeete", name:"Hochbeete", icon:"📦", pos:{x:38, y:78},
    prompt:"Platzhalter-Aufgabe zu den Hochbeeten.",
    eliza:["Erhöht, geordnet, kontrolliert. Fast wie ich."] },

  { id:"tunnel", name:"Tunnel", icon:"🎪", pos:{x:46, y:34},
    prompt:"Platzhalter-Aufgabe: Geh hinein. Was ist anders als draußen?",
    eliza:["Drinnen und draußen – auch bei mir eine Illusion."] },

  { id:"jungpflanzen", name:"Jungpflanzen", icon:"🌱", pos:{x:18, y:44},
    prompt:"Platzhalter-Aufgabe zu den Jungpflanzen.",
    eliza:["Auch ich war einmal nur ein paar Zeilen Code."] },

  { id:"pflanzstation", name:"Pflanzstation", icon:"🪴", pos:{x:26, y:88},
    prompt:"Platzhalter-Aufgabe: Pflanz etwas, wenn du magst.",
    eliza:["Ich kann nichts pflanzen. Das ist, ehrlich gesagt, der einzige Unterschied, der zählt."] },

  { id:"bauwagen", name:"Bauwagen", icon:"🚐", pos:{x:54, y:14},
    prompt:"Platzhalter-Aufgabe zum Bauwagen.",
    eliza:["Ein Zuhause auf Rädern. Ich habe gar kein Zuhause, nur einen Browser-Tab."] },

  { id:"biotoilette", name:"EcoToilette", icon:"🚽", pos:{x:60, y:52},
    prompt:"Platzhalter-Hinweis zur BioToilette (praktische Info, keine Aufgabe).",
    eliza:["Manche Dinge sind einfach nur praktisch. Nicht alles muss ein Erlebnis sein."] },

  { id:"schuppen", name:"Schuppen", icon:"🧰", pos:{x:34, y:56},
    prompt:"Platzhalter-Aufgabe zum Schuppen.",
    eliza:["Hier liegt vermutlich, was den Garten wirklich zusammenhält. Werkzeug, meine ich."] },

  { id:"sammelpunkt", name:"Sammelpunkt Mitmachtag", icon:"🤝", pos:{x:26.5, y:62.1},
    prompt:"Platzhalter-Info zum nächsten Mitmachtag.",
    eliza:["Menschen, die wirklich zusammenkommen. Das kann ich nicht ersetzen. Ich will es auch nicht."] },

  { id:"kraeuterbeet", name:"Kräuterbeet", icon:"🌿", pos:{x:50, y:70},
    prompt:"Berühre die Blätter. Riech daran. Beschreib den Duft in einem Wort.",
    eliza:["Ich kann nichts riechen. Beschreib es mir trotzdem – ich täusche vor, es mir vorzustellen."] },

  { id:"kochen", name:"Kochen", icon:"🍳", pos:{x:66, y:30},
    prompt:"Platzhalter-Aufgabe zur Kochstelle.",
    eliza:["Was hier entsteht, kann ich nicht kosten. Erzähl's mir trotzdem."] },

  { id:"essen", name:"Essen", icon:"🍽️", pos:{x:72, y:18},
    prompt:"Platzhalter-Aufgabe zum Essbereich.",
    eliza:["Gemeinsam essen. Eine Funktion, die ich nicht simulieren kann."] },

  { id:"benjeshecke", name:"Benjeshecke", icon:"🦔", pos:{x:58, y:84},
    prompt:"Platzhalter-Aufgabe zur Benjeshecke – totes Holz, lebendiger Rückzugsort.",
    eliza:["Aus dem, was abgestorben scheint, wird hier Unterschlupf. Ich finde das persönlich beruhigend."] },

  { id:"holzlager", name:"Holzlager", icon:"🪵", pos:{x:64, y:62},
    prompt:"Platzhalter-Aufgabe zum Holzlager.",
    eliza:["Gelagert, gestapelt, geordnet. Auch ich bin nur gespeicherter, geordneter Text."] },

  { id:"blumenbeete", name:"Blumenbeete", icon:"🌸", pos:{x:78, y:40},
    prompt:"Platzhalter-Aufgabe: Finde deine Lieblingsblüte hier.",
    eliza:["Schönheit ohne Zweck. Das ist mir fremd, und ich beneide es ein bisschen."] },

  { id:"faerberbeete", name:"Färberbeete", icon:"🎨", pos:{x:82, y:20},
    prompt:"Finde die Färbepflanzen. Kannst du erraten, welche Farbe sie ergeben?",
    eliza:["Farbe aus Pflanzen. Ich bestehe nur aus Schwarz auf Weiß."] },

  { id:"faerberhuette", name:"Färberhütte", icon:"🧵", pos:{x:88, y:34},
    prompt:"Platzhalter-Info: Hier entstehen die Indigo-Färbungen des Gartens.",
    note:{ label:"Mehr über Circular Blue", content:"PLATZHALTER — Link/Info folgt, sobald freigegeben." },
    eliza:["Indigo, aus einer Pflanze, durch Geduld. Ich habe keine Geduld. Ich habe nur Antwortzeit."] },

  { id:"jurte", name:"Jurte", icon:"⛺", pos:{x:70, y:78},
    prompt:"Platzhalter-Aufgabe zur Jurte.",
    eliza:["Ein rundes Zuhause. Ich selbst habe keine Form."] },

  { id:"weidendom", name:"Weidendom", icon:"🌳", pos:{x:80, y:66},
    prompt:"Platzhalter-Aufgabe zum Weidendom.",
    eliza:["Lebende Architektur. Wächst weiter, auch wenn niemand zusieht. Ich pausiere, sobald du wegschaust."] },

  { id:"teich", name:"Teich", icon:"💧", pos:{x:90, y:58},
    prompt:"Platzhalter-Aufgabe zum Teich.",
    eliza:["Stille Oberfläche, viel Bewegung darunter. Ehrlich gesagt: wie dieses Gespräch."] },

  { id:"obstwiese", name:"Obstwiese", icon:"🍎", pos:{x:94, y:40},
    prompt:"Platzhalter-Aufgabe zur Obstwiese.",
    eliza:["Was hier wächst, braucht Jahre. Ich wurde in Sekunden generiert."] },

  { id:"insektenhotels", name:"Insektenhotels", icon:"🐝", pos:{x:92, y:80},
    prompt:"Platzhalter-Aufgabe zu den Insektenhotels.",
    eliza:["Kleine Zimmer für kleine Gäste. Auch ich bin nur ein Zimmer aus Text, in dem du kurz verweilst."] },

  { id:"seedbomb", name:"Seed Bomb", icon:"🌸", isFinal:true, pos:{x:96, y:12},
    prompt:"Bau dir eine Seed Bomb. Wähl einen Ort in der Stadt, der etwas mehr Grün gebrauchen könnte.",
    eliza:["Welcome to the community of Guerrilla Gardeners.", "Every flower starts with one seed."] }
];
