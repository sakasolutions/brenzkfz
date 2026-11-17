document.documentElement.classList.add("js");
(function(){
  "use strict";
  var kopf = document.getElementById("kopf"), burger = document.getElementById("burger"), handymenue = document.getElementById("handymenue");
  var held = document.getElementById("start");
  var ruhig = matchMedia("(prefers-reduced-motion: reduce)");

  // Handy-Menü
  function menue(auf) {
    burger.setAttribute("aria-expanded", String(auf));
    burger.setAttribute("aria-label", auf ? "Menü schließen" : "Menü öffnen");
    handymenue.hidden = !auf;
    kopf.classList.toggle("offen", auf);
    document.documentElement.classList.toggle("gesperrt", auf);
    document.querySelectorAll("main,.fuss").forEach(function(x){ x.inert = auf; });
  }
  burger.addEventListener("click", function(){ menue(burger.getAttribute("aria-expanded") !== "true"); });
  handymenue.addEventListener("click", function(e){ if (e.target.closest("a")) menue(false); });
  addEventListener("keydown", function(e){ if (e.key === "Escape" && !handymenue.hidden) { menue(false); burger.focus(); } });
  matchMedia("(min-width: 900px)").addEventListener("change", function(e){ if (e.matches) menue(false); });

  // Kopf fest, sobald der Film vorbei ist
  new IntersectionObserver(function(e){ kopf.classList.toggle("fest", !e[0].isIntersecting); },
    { rootMargin: "-90px 0px 0px 0px" }).observe(held);

  // Film: nur das passende Video laden, bei weniger Bewegung nicht automatisch starten, Pause-Knopf wie bei Porsche
  var breit = matchMedia("(min-width: 900px)"), knopf = document.getElementById("film-pause"), angehalten = ruhig.matches, sichtbar = true;
  function video(){ return held.querySelector(breit.matches ? "video.quer" : "video.hoch"); }
  function anzeigen(){
    var v = video(), laeuft = !angehalten && sichtbar;
    held.querySelectorAll("video").forEach(function(x){ if (x !== v) x.pause(); });
    if (laeuft) { if (v.preload !== "auto") { v.preload = "auto"; v.load(); } var p = v.play(); if (p) p.catch(function(){}); }
    else v.pause();
    knopf.hidden = false;
    knopf.setAttribute("aria-label", angehalten ? "Film abspielen" : "Film anhalten");
    knopf.firstElementChild.firstElementChild.setAttribute("href", angehalten ? "#i-play" : "#i-pause");
  }
  knopf.addEventListener("click", function(){ angehalten = !angehalten; anzeigen(); });
  breit.addEventListener("change", anzeigen);
  new IntersectionObserver(function(e){ sichtbar = e[0].isIntersecting; anzeigen(); }).observe(held);

  // Kapitel ziehen beim Hineinscrollen langsam auf
  var io = new IntersectionObserver(function(e){
    e.forEach(function(x){ if (x.isIntersecting) { x.target.classList.add("da"); io.unobserve(x.target); } });
  }, { rootMargin: "0px 0px -15% 0px" });
  document.querySelectorAll(".kapitel").forEach(function(k){ io.observe(k); });

  // Nachricht vorbereiten: Vorschau wie sie ankommt, Link nach WhatsApp
  var NUMMER = "4917662794745";
  var THEMEN = {
    service: { satz: "ich möchte einen Termin anfragen.", frage: "Was steht an" },
    software: { satz: "ich interessiere mich für Chiptuning.", frage: "Wunsch (zum Beispiel Stage 1 oder Stage 2)" },
    aufbereitung: { satz: "ich interessiere mich für eine Fahrzeugaufbereitung.", frage: "Was soll gemacht werden" }
  };
  var form = document.getElementById("schreiben"), fz = document.getElementById("s-fahrzeug"), an = document.getElementById("s-anliegen");
  var blase = document.getElementById("s-blase"), senden = document.getElementById("s-senden"), frage = document.getElementById("s-frage");
  function thema(){ return form.querySelector("input[name=thema]:checked").value; }
  function zeile(beschriftung, wert){
    var z = document.createDocumentFragment();
    z.appendChild(document.createTextNode("\n" + beschriftung + ": "));
    if (wert) z.appendChild(document.createTextNode(wert));
    else { var s = document.createElement("span"); s.className = "leer"; s.textContent = "…"; z.appendChild(s); }
    return z;
  }
  function aktualisieren(){
    var t = THEMEN[thema()], f = fz.value.trim(), a = an.value.trim();
    frage.textContent = t.frage + "?";
    blase.textContent = "Hallo Brenz KFZ, " + t.satz;
    blase.appendChild(zeile("Fahrzeug (Marke, Modell, Baujahr)", f));
    blase.appendChild(zeile(t.frage, a));
    var text = "Hallo Brenz KFZ, " + t.satz + "\nFahrzeug (Marke, Modell, Baujahr): " + f + "\n" + t.frage + ": " + a;
    senden.href = "https://wa.me/" + NUMMER + "?text=" + encodeURIComponent(text);
  }
  form.addEventListener("input", aktualisieren);
  form.addEventListener("change", aktualisieren);
  form.addEventListener("submit", function(e){ e.preventDefault(); });
  document.querySelectorAll("[data-thema]").forEach(function(l){
    l.addEventListener("click", function(){
      var r = form.querySelector("input[value=" + l.dataset.thema + "]");
      if (r) { r.checked = true; aktualisieren(); }
    });
  });
  aktualisieren();
})();
