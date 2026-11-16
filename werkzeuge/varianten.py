"""Erzeugt die Vergleichsfassungen aus index.html. Nicht von Hand bearbeiten, nach jeder Änderung an index.html neu ausführen:

    python3 werkzeuge/varianten.py

Jede Fassung hat unten eine Vergleichsleiste. Darüber schaltet man um zwischen
  Farbe:  gelb.html, dezent.html, gemischt.html, blau.html
  Schrift (?schrift=): kursiv (Barlow Condensed kursiv, wie index.html), aufrecht (dieselbe, nicht kursiv),
                       saira (Saira Condensed), manrope (Manrope für alles, ruhig und modern)
  Logo (?logo=):       emblem (rundes Emblem, einfarbig), wm1, wm2, wm3 (Wortmarken 01 bis 03 aus Sinans Entwürfen)
Die Auswahl steht in der Adresse, also lässt sich jede Kombination als Link verschicken.
index.html (die echte Startseite) bekommt keine Leiste.

Farben:
  gelb      wie index.html (Schema A); Logo überall einfarbig (Sinan 16.11.: nur Schwarz und Weiß)
  dezent    Akzent #e5c65f, Text #e0dfde, Grund #121212, gemessen aus Sinans Dribbble-Überblick (Luxury Cars)
  gemischt  Kopf dunkel, Rechner hell (Vorlage „AutoPlanet“); helle Töne aus der Palette gemischt, Gelb auf Hell nur als Knopf
  blau      wie gemischt, Akzent #1f5ae0 nach Augenmaß aus dem AutoPlanet-Screenshot (nicht gemessen), auf Dunkel aufgehellt
Alle Fassungen sind für Google gesperrt (sonst doppelte Inhalte).
"""
import os

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.join(HIER, "..")
QUELLE = os.path.join(WURZEL, "index.html")
WORTMARKEN = open(os.path.join(HIER, "wortmarken.svg"), encoding="utf-8").read()

# ---------------------------------------------------------------- Farben
HELL = """
/* Rechner hell. Töne aus der Palette gemischt (Weiß, #8b8b8b, #111111). */
.rechner{color-scheme:light;border-top:0;
  --grund:color-mix(in srgb,#ffffff 94%,#8b8b8b);
  --flaeche:#ffffff;
  --linie:color-mix(in srgb,#ffffff 80%,#8b8b8b);
  --text:#111111;
  --leise:color-mix(in srgb,#111111 45%,#8b8b8b);
  background:var(--grund);color:var(--text)}
.rechner .zettel{box-shadow:0 1px 2px rgb(0 0 0 / .04),0 10px 30px rgb(0 0 0 / .06)}
.rechner .zettel select,.rechner .zettel input[type="text"]{background:#ffffff}
.rechner .r-buehne{color-scheme:dark;--grund:#111111;--flaeche:#181818;--linie:#303030;--text:#ffffff;--leise:#8b8b8b}
"""
GELB_AUF_HELL = """
/* Gelbe Schrift und Linien sind auf Hell nicht lesbar: Mehrleistung und Stage-Kurve dunkel, Gelb bleibt für Knöpfe */
.rechner .ergebnis .plus{color:var(--text)}
.rechner .zettel .dia .k-stage,.rechner .zettel .dia .leg-stage{stroke:var(--text)}
.rechner .zettel .dia .p-stage{fill:var(--text)}
.rechner .zettel .dia .band{fill:var(--text);opacity:.1}
"""
BLAU_AKZENT = "#1f5ae0"


def mischen(a, b, anteil_a):
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join("%02x" % round(x * anteil_a + y * (1 - anteil_a)) for x, y in zip(ca, cb))


BLAU_HELL = mischen(BLAU_AKZENT, "#ffffff", 0.75)
BLAU_CSS = """
/* Blau auf Dunkel aufgehellt, damit es lesbar bleibt. Rot bleibt Signalen vorbehalten. */
:root{--akzent-hell:""" + BLAU_HELL + """}
.titel .akzent{color:var(--akzent-hell)}
.r-buehne .dia .k-stage,.r-buehne .dia .leg-stage{stroke:var(--akzent-hell)}
.r-buehne .dia .p-stage,.r-buehne .dia .band{fill:var(--akzent-hell)}
.r-buehne .schritt{color:var(--akzent-hell)}
.r-buehne .dia .k-stage{filter:drop-shadow(0 0 5px color-mix(in srgb,var(--akzent-hell) 50%,transparent))}
"""

FASSUNGEN = {
    "gelb.html": ("Gelb", [], ""),
    "dezent.html": ("Dezent", [
        ("--grund:#111111;", "--grund:#121212;"),
        ("--text:#ffffff;", "--text:#e0dfde;"),
        ("--akzent:#fdf325;", "--akzent:#e5c65f;"),
        ('fill="#ffffff"', 'fill="#e0dfde"'),
        ('<meta name="theme-color" content="#111111">', '<meta name="theme-color" content="#121212">'),
    ], ""),
    "gemischt.html": ("Gemischt", [], HELL + GELB_AUF_HELL),
    "blau.html": ("Blau", [
        ("--akzent:#fdf325;", "--akzent:" + BLAU_AKZENT + ";"),
        ("--auf-akzent:#111111;", "--auf-akzent:#ffffff;"),
    ], HELL + BLAU_CSS),
}

# ---------------------------------------------------------------- Schriften, Logos, Leiste
VERGLEICH_CSS = """
/* ===== Vergleich: Schriften ===== */
@font-face{font-family:"Saira Condensed";font-style:normal;font-weight:900;font-display:swap;src:url("fonts/SairaCondensed-900.woff2") format("woff2")}
@font-face{font-family:"Manrope";font-style:normal;font-weight:200 800;font-display:swap;src:url("fonts/Manrope-variabel.woff2") format("woff2")}
[data-schrift="aufrecht"] .titel,[data-schrift="aufrecht"] .r-titel,[data-schrift="aufrecht"] .ergebnis .gesamt,
[data-schrift="aufrecht"] .r-buehne .fahrzeug,[data-schrift="aufrecht"] .r-buehne .wert{font-style:normal}
[data-schrift="saira"]{--f-titel:"Saira Condensed","Arial Narrow",system-ui,sans-serif}
[data-schrift="saira"] .titel,[data-schrift="saira"] .r-titel,[data-schrift="saira"] .ergebnis .gesamt,
[data-schrift="saira"] .r-buehne .fahrzeug,[data-schrift="saira"] .r-buehne .wert{font-style:normal;font-weight:900;letter-spacing:.01em}
[data-schrift="manrope"]{--f-titel:"Manrope",system-ui,sans-serif;--f-text:"Manrope",system-ui,sans-serif}
[data-schrift="manrope"] .titel,[data-schrift="manrope"] .r-titel{font-style:normal;font-weight:800;text-transform:none;letter-spacing:-.03em;line-height:1.02}
[data-schrift="manrope"] .titel{font-size:clamp(2.3rem,10vw,4rem)}
[data-schrift="manrope"] .r-titel{font-size:clamp(2rem,8vw,3rem)}
[data-schrift="manrope"] .ergebnis .gesamt,[data-schrift="manrope"] .r-buehne .fahrzeug,[data-schrift="manrope"] .r-buehne .wert{font-style:normal;font-weight:800;letter-spacing:-.02em}
[data-schrift="manrope"] .r-buehne .fahrzeug{text-transform:none}
@media (min-width:900px){[data-schrift="manrope"] .titel{font-size:clamp(3rem,4.8vw,4.5rem)}}
/* ===== Vergleich: Logos ===== */
.marke{color:var(--text)}
[data-logo^="wm"] .marke{width:auto;height:22px;border-radius:0}
[data-logo="wm2"] .marke{height:26px}
[data-logo^="wm"] .marke svg{width:auto;height:100%}
@media (min-width:900px){[data-logo^="wm"] .marke{height:28px}[data-logo="wm2"] .marke{height:34px}}
/* ===== Vergleichsleiste (nur in den Vergleichsfassungen) ===== */
.vergleich{position:fixed;z-index:60;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom,0px));
  width:min(680px,calc(100% - 24px));color:#ffffff;font:500 13px/1.3 "Barlow",system-ui,sans-serif;
  background:rgb(17 17 17 / .95);border:1px solid #3a3a3a;border-radius:12px;box-shadow:0 12px 40px rgb(0 0 0 / .45);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.vg-kopf{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px 10px 14px}
.vg-kopf b{font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:11px;color:#bdbdbd}
.vg-kopf button{border:0;background:#2a2a2a;color:#ffffff;border-radius:999px;padding:6px 12px;font:inherit;font-weight:600;font-size:12px;line-height:1;cursor:pointer}
.vg-panel{display:grid;gap:8px;padding:0 12px 12px}
.vg-gruppe{display:grid;grid-template-columns:62px 1fr;align-items:center;gap:8px}
.vg-gruppe>span{color:#9a9a9a;font-size:12px}
.vg-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.vg-chips::-webkit-scrollbar{display:none}
.vg-chips a{flex:none;padding:7px 11px;border:1px solid #3a3a3a;border-radius:999px;color:#e6e6e6;text-decoration:none;white-space:nowrap}
.vg-chips a:hover{border-color:#8b8b8b}
.vg-chips a[aria-current]{background:#ffffff;color:#111111;border-color:#ffffff}
.vergleich.zu .vg-panel{display:none}
"""

VERGLEICH_HTML = """
<svg width="0" height="0" style="position:absolute" aria-hidden="true">""" + WORTMARKEN + """</svg>
<div class="vergleich" id="vergleich" role="region" aria-label="Vergleich für Mert">
  <div class="vg-kopf"><b>Vergleich</b><button type="button" id="vg-knopf" aria-expanded="true" aria-controls="vg-panel">Einklappen</button></div>
  <div class="vg-panel" id="vg-panel">
    <div class="vg-gruppe"><span>Farbe</span><div class="vg-chips">{FARBEN}</div></div>
    <div class="vg-gruppe"><span>Schrift</span><div class="vg-chips"><a data-schrift="kursiv">Kursiv</a><a data-schrift="aufrecht">Aufrecht</a><a data-schrift="saira">Saira</a><a data-schrift="manrope">Manrope</a></div></div>
    <div class="vg-gruppe"><span>Logo</span><div class="vg-chips"><a data-logo="emblem">Emblem</a><a data-logo="wm1" aria-label="Wortmarke 01">01</a><a data-logo="wm2" aria-label="Wortmarke 02">02</a><a data-logo="wm3" aria-label="Wortmarke 03">03</a></div></div>
  </div>
</div>
<script>
// Vergleich: Schrift und Logo aus der Adresse lesen, Links der Leiste setzen
(function(){
  "use strict";
  var p=new URLSearchParams(location.search), h=document.documentElement;
  var schrift=p.get("schrift"), logo=p.get("logo");
  if(["kursiv","aufrecht","saira","manrope"].indexOf(schrift)<0)schrift="kursiv";
  var MASSE={wm1:[1025,155],wm2:[884,200],wm3:[1019,196]};
  if(logo!=="emblem"&&!MASSE[logo])logo="emblem";
  h.dataset.schrift=schrift;h.dataset.logo=logo;
  if(MASSE[logo]){
    var w=MASSE[logo][0],hh=MASSE[logo][1];
    [].forEach.call(document.querySelectorAll(".marke"),function(m){
      m.innerHTML='<svg viewBox="0 0 '+w+' '+hh+'" style="aspect-ratio:'+w+'/'+hh+'" aria-hidden="true"><use href="#'+logo+'" width="'+w+'" height="'+hh+'"/></svg>';
    });
  }
  var datei=location.pathname.split("/").pop()||"gelb.html";
  function link(d,s,l){return d+"?schrift="+s+"&logo="+l}
  function setzen(sel,fn,aktiv){[].forEach.call(document.querySelectorAll(".vergleich "+sel),function(a){var v=fn(a);a.href=v[0];if(v[1]===aktiv)a.setAttribute("aria-current","true")})}
  setzen("[data-datei]",function(a){return [link(a.dataset.datei,schrift,logo),a.dataset.datei]},datei);
  setzen("[data-schrift]",function(a){return [link(datei,a.dataset.schrift,logo),a.dataset.schrift]},schrift);
  setzen("[data-logo]",function(a){return [link(datei,schrift,a.dataset.logo),a.dataset.logo]},logo);
  var leiste=document.getElementById("vergleich"), knopf=document.getElementById("vg-knopf");
  function zu(z){leiste.classList.toggle("zu",z);knopf.textContent=z?"Aufklappen":"Einklappen";knopf.setAttribute("aria-expanded",String(!z));try{localStorage.setItem("brenz-vergleich-zu",z?"1":"0")}catch(e){}}
  var start=false;try{start=localStorage.getItem("brenz-vergleich-zu")==="1"}catch(e){}
  zu(start);
  knopf.addEventListener("click",function(){zu(!leiste.classList.contains("zu"))});
})();
</script>
"""

GEMEINSAM = [
    ('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">'),
    ("<head>", "<head>\n<!-- Automatisch erzeugt aus index.html mit werkzeuge/varianten.py. Nicht von Hand bearbeiten. -->"),
]


def bauen(ziel, name, ersetzen, css):
    html = open(QUELLE, encoding="utf-8").read()
    farben = "".join('<a data-datei="%s">%s</a>' % (d, n) for d, (n, _, _) in FASSUNGEN.items())
    schritte = ersetzen + GEMEINSAM + [
        ("</style>", css + VERGLEICH_CSS + "</style>"),
        ("<title>", "<title>(" + name + ") "),
        ("</body>", VERGLEICH_HTML.replace("{FARBEN}", farben) + "</body>"),
    ]
    for alt, neu in schritte:
        if alt not in html:
            raise SystemExit(ziel + ": nicht gefunden, Skript anpassen: " + alt[:60])
        einmal = alt in ("</style>", "<head>", "<title>", "</body>")
        html = html.replace(alt, neu, 1 if einmal else -1)
    open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(html)
    print(ziel, "erzeugt")


if __name__ == "__main__":
    for datei, (name, ersetzen, css) in FASSUNGEN.items():
        bauen(datei, name, ersetzen, css)
