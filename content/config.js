/* =============================================================
   EINSTELLUNGEN — für Dinge, die nicht zu einer einzelnen Station
   gehören, sondern die ganze Seite betreffen.
   ============================================================= */

const CONFIG = {
  // Pfad zu deiner handgezeichneten Gartenkarte, sobald sie fertig ist.
  // Liegt die Datei in assets/map/, z.B. so: "assets/map/garten.png"
  // Leer lassen ("") solange es noch keine gibt — dann bleibt der
  // schlichte Hintergrund, wie er jetzt ist.
  mapBackground: "assets/map/garden-map.png",

  // Eigene Grafik für die aufblühende Blüte am Ende der Tour
  // (ersetzt das 🌸-Emoji), z.B. "assets/vine/bluete.svg"
  finalBloomImage: "",

  // Allgemeine eliZa-Sätze, die NICHT zu einer einzelnen Station
  // gehören, sondern ganz oben als "Field Notes" erscheinen — einer
  // wird zufällig ausgewählt, wenn die Seite lädt. Ergänz gern mehr.
  fieldNotes: [
    "Take your time. The garden is not a checklist. Look closer when you feel curious.",
    "I only know what you show me. The rest belongs to the garden.",
    "There is no correct order here. Let the line get strange."
  ]
};
