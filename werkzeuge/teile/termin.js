// Terminanfrage der Kfz-Service-Seite (Sinan, 17.11.2026: vorgefertigte Anfragen, damit Mert planen kann).
// Erst das Anliegen wählen, dann erscheinen nur die passenden Felder. Daraus entsteht die WhatsApp-Nachricht.
// Gespeichert wird nichts, alles geht erst beim Abschicken in WhatsApp an Mert.
(function(){
  "use strict";
  var NUMMER = "4917662794745";   // Mert, WhatsApp
  var form = document.getElementById("termin-form");
  if (!form) return;
  function $(id){ return document.getElementById(id); }
  var NAMEN = { reifen: "Reifenwechsel", oel: "Ölwechsel", inspektion: "Inspektion", anderes: "" };
  var felder = $("t-felder"), text = $("t-text"), senden = $("t-senden"), fehlt = $("t-fehlt"), tag = $("t-tag");

  // Wunschtag: die nächsten 14 Tage
  var heute = new Date();
  for (var i = 1; i <= 14; i++) {
    var d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + i), o = document.createElement("option");
    o.textContent = o.value = d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
    tag.appendChild(o);
  }

  function wahl(name){ var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ""; }
  function wert(id){ return $(id).value.trim(); }

  function aktualisieren(){
    var a = wahl("anliegen");
    felder.hidden = !a;
    [].forEach.call(form.querySelectorAll("[data-fuer]"), function(el){ el.hidden = el.getAttribute("data-fuer").split(" ").indexOf(a) < 0; });
    if (!a) return;

    var fz = wert("t-fahrzeug"), z = [];
    z.push("Hallo Brenz KFZ, ich möchte einen Termin anfragen" + (NAMEN[a] ? ": " + NAMEN[a] + "." : "."));
    z.push("Fahrzeug: " + (fz || "…"));
    if (a === "reifen") {
      var r = [wahl("t-reifen"), wahl("t-lager"), wert("t-groesse") ? "Größe " + wert("t-groesse") : ""].filter(Boolean);
      if (r.length) z.push("Reifen: " + r.join(", "));
    }
    var km = wert("t-km").replace(/\s*km\.?$/i, "");
    if ((a === "oel" || a === "inspektion") && km) z.push("Kilometerstand: ca. " + km + " km");
    if (a === "inspektion" && wahl("t-heft")) z.push("Serviceheft: " + wahl("t-heft"));
    if (a === "anderes") z.push("Worum es geht: " + (wert("t-was") || "…"));
    z.push("Wunschtermin: " + ([tag.value, wahl("t-zeit")].filter(Boolean).join(", ") || "so bald wie möglich"));
    if (wert("t-anm")) z.push("Anmerkung: " + wert("t-anm"));

    var nachricht = z.join("\n"), los = [];
    text.textContent = nachricht;
    if (!fz) los.push("das Fahrzeug");
    if (a === "anderes" && !wert("t-was")) los.push("was ansteht");
    fehlt.textContent = los.length ? "Es fehlt noch " + los.join(" und ") + "." : "";
    senden.setAttribute("aria-disabled", los.length ? "true" : "false");
    senden.href = los.length ? "#termin" : "https://wa.me/" + NUMMER + "?text=" + encodeURIComponent(nachricht);
  }

  form.addEventListener("input", aktualisieren);
  form.addEventListener("change", aktualisieren);
  form.addEventListener("submit", function(e){ e.preventDefault(); });
  // Ist noch etwas offen, springt der Knopf zum fehlenden Feld statt WhatsApp zu öffnen
  senden.addEventListener("click", function(e){
    if (senden.getAttribute("aria-disabled") !== "true") return;
    e.preventDefault();
    (wert("t-fahrzeug") ? $("t-was") : $("t-fahrzeug")).focus();
  });
  aktualisieren();
})();
