eliZa🫜 — your uncanny tour guide
=================================

Was das hier ist
-----------------
Eine schlichte Webseite, kein App-Zwang, kein Server nötig. Sie läuft,
indem man einfach index.html im Browser öffnet oder die ganze Sache
irgendwo mit HTTPS hostet (z.B. GitHub Pages, wie ihr's schon macht).

Ordnerstruktur
--------------
eliZabeet/
├── index.html          ← die Seite selbst. Fast nie anfassen.
├── style.css            ← Aussehen (Farben, Schrift, Abstände)
├── script.js             ← die Technik dahinter. Nur anfassen, wenn
│                            sich das VERHALTEN ändern soll, nicht der
│                            Inhalt.
├── content/
│   ├── stations.js       ← DEINE STATIONEN. Das bearbeitest du am
│   │                        häufigsten: Texte, eliZa-Sätze, Reihenfolge.
│   └── config.js         ← ein paar globale Schalter, z.B. der Pfad
│                            zu deiner eigenen Kartengrafik
├── assets/
│   ├── map/               ← hier landet deine handgezeichnete Karte
│   │                        (das ganze Bild, einmalig)
│   ├── vine/               ← eigene Grafiken für die Ranke selbst
│   │                        (z.B. eine gezeichnete Blüte fürs Ende)
│   ├── images/             ← Fotos/Cyanotypien für einzelne Stationen
│   └── audio/               ← Tonaufnahmen für einzelne Stationen
└── README.txt              ← diese Datei

Eine Station bearbeiten
------------------------
Öffne content/stations.js in einem Texteditor (auch GitHub selbst
kann das, über den Stift/Edit-Button bei der Datei). Jede Station ist
ein Abschnitt zwischen geschweiften Klammern { }. Ändere einfach den
Text zwischen den Anführungszeichen, z.B.:

    prompt: "Berühre die Blätter. Riech daran."

Ein Bild zu einer Station hinzufügen
-------------------------------------
1. Bild in assets/images/ hochladen, z.B. faerberhuette.jpg
2. In content/stations.js bei der passenden Station ergänzen:
       image: "assets/images/faerberhuette.jpg"

Eine Audiodatei hinzufügen
---------------------------
Genauso, nur mit "audio" statt "image":
       audio: "assets/audio/kraeuterbeet.mp3"

Die eigene Kartengrafik einbauen, sobald sie fertig ist
---------------------------------------------------------
1. Bild in assets/map/ hochladen, z.B. garten.png
2. In content/config.js die Zeile ändern zu:
       mapBackground: "assets/map/garten.png"
Vorher bleibt einfach der schlichte Hintergrund, wie er jetzt ist —
nichts geht kaputt, wenn diese Zeile leer bleibt.

Eine Station auf der Karte verschieben
-----------------------------------------
Jede Station hat ein "pos"-Feld, z.B. pos:{x:50, y:30} — das sind
Prozentwerte (0 = ganz links/oben, 100 = ganz rechts/unten), keine
echten Pixel oder GPS-Koordinaten. Einfach die Zahlen anpassen, bis
der Punkt auf der Karte dort sitzt, wo der echte Ort ist. Die
Reihenfolge in der Datei selbst spielt für die Karte keine Rolle
mehr — nur "pos" bestimmt, wo ein Punkt erscheint. Die Linie
zwischen den Punkten zeichnet sich automatisch nach, in der
Reihenfolge, in der jemand die Stationen tatsächlich antippt.

Was ist eliZa?
---------------
Keine echte KI, kein Chatbot im eigentlichen Sinn — nur vorgeschriebene
Sätze, die zufällig oder passend zur Station erscheinen. Bewusst so
gebaut: benannt nach Joseph Weizenbaums ELIZA (1966), dem allerersten
Chatbot-Programm, das Menschen zum Reden brachte, obwohl es sie nie
wirklich "verstand". eliZa hier spielt genau damit — sie ist absichtlich
kein Ersatz für den Garten, sondern ein kleiner, ehrlich unheimlicher
Kommentar dazu, wie leicht wir Maschinen Verständnis unterstellen.

Veröffentlichen / Hosten
--------------------------
Wie bisher: alles in ein GitHub-Repo hochladen, unter Settings → Pages
"Deploy from a branch" / "main" / "/ (root)" einstellen, fertig ist
eine öffentliche URL zum Verlinken per QR-Code.
