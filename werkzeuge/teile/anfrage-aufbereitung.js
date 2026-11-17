// Anfrage der Aufbereitungs-Seite: auswählen, was gemacht werden soll, Fahrzeug und Größe, daraus die WhatsApp-Nachricht.
// Gespeichert wird nichts, alles geht erst beim Abschicken in WhatsApp an Mert.
(function(){
  "use strict";
  var NUMMER = "4917662794745";   // Mert, WhatsApp
  var form = document.getElementById("auf-form");
  if (!form) return;
  function $(id){ return document.getElementById(id); }
  var felder = $("auf-felder"), text = $("auf-text"), senden = $("auf-senden"), fehlt = $("auf-fehlt"), tag = $("auf-tag");

  // Wunschtag: die nächsten 14 Tage
  var heute = new Date();
  for (var i = 1; i <= 14; i++) {
    var d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + i), o = document.createElement("option");
    o.textContent = o.value = d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
    tag.appendChild(o);
  }

  function liste(werte){ return werte.length < 2 ? werte.join("") : werte.slice(0, -1).join(", ") + " und " + werte[werte.length - 1]; }
  function wert(id){ return $(id).value.trim(); }

  function aktualisieren(){
    var was = [].map.call(form.querySelectorAll('input[name="auf-was"]:checked'), function(c){ return c.value; });
    felder.hidden = !was.length;
    if (!was.length) return;
    var beraten = was.indexOf("beraten") >= 0, teile = was.filter(function(w){ return w !== "beraten"; });
    var groesse = form.querySelector('input[name="auf-groesse"]:checked'), fz = wert("auf-fahrzeug"), z = [];

    z.push("Hallo Brenz KFZ, ich interessiere mich für eine Fahrzeugaufbereitung" + (teile.length ? ": " + liste(teile) + "." : "."));
    if (beraten) z.push("Ich hätte gern erst eine Beratung, was sinnvoll ist.");
    z.push("Fahrzeug: " + (fz || "…") + (groesse ? " (" + groesse.value + ")" : ""));
    z.push("Wunschtermin: " + (tag.value || "so bald wie möglich"));
    if (wert("auf-anm")) z.push("Anmerkung: " + wert("auf-anm"));

    var nachricht = z.join("\n");
    text.textContent = nachricht;
    fehlt.textContent = fz ? "" : "Es fehlt noch das Fahrzeug.";
    senden.setAttribute("aria-disabled", fz ? "false" : "true");
    senden.href = fz ? "https://wa.me/" + NUMMER + "?text=" + encodeURIComponent(nachricht) : "#anfrage";
  }

  form.addEventListener("input", aktualisieren);
  form.addEventListener("change", aktualisieren);
  form.addEventListener("submit", function(e){ e.preventDefault(); });
  senden.addEventListener("click", function(e){
    if (senden.getAttribute("aria-disabled") !== "true") return;
    e.preventDefault();
    $("auf-fahrzeug").focus();
  });
  aktualisieren();

  // Vorher und Nachher: Regler verschiebt die Trennlinie
  var vergleich = document.querySelector(".vergleich");
  if (vergleich) {
    var regler = vergleich.querySelector("input");
    regler.addEventListener("input", function(){ vergleich.style.setProperty("--pos", regler.value + "%"); });
  }
})();
