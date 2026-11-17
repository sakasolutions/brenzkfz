"""Baut die Entwürfe aus ihren Vorlagen in werkzeuge/:
  neu-vorlage.html       -> champagner-neu.html  (Sinan 16.11.2026)
  entwurf3-vorlage.html  -> entwurf-3.html       (Sinan 17.11.2026, nach Tier-1-Analyse, Grautöne leicht warm)
  entwurf4-vorlage.html  -> entwurf-4-nachtblau.html, entwurf-4-kupfer.html, entwurf-4-signalgelb.html
                         (Sinan 17.11.2026, helles Konzept, drei Paletten zur Auswahl; die erste grüne war zu nah an saka-it)
Aus entwurf-3.html abgeleitet (Sinan 17.11.2026, zum Abgleich, Farben außer Rot frei):
  entwurf-3-hell-a.html  hell, warmes Papier, Knöpfe in Tinte, Akzent Messing (aus dem Champagner abgedunkelt)
  entwurf-3-hell-b.html  hell, kühles Weiß, Akzent Petrol
  entwurf-3-mix.html     Kfz-Service als helle Karte, Softwareoptimierung mit Rechner und Aufbereitung dunkel (Idee für die Unterseiten)


    python3 werkzeuge/neu.py

Setzt in beide ein: Emblem in Champagner (img/logo-champagner.svg), Formular und Skripte des Leistungsrechners unverändert
aus index.html, WhatsApp-Links mit Vorlage. Nach Änderungen am Rechner in index.html neu ausführen.
"""
import math
import os
import re
from urllib.parse import quote

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.join(HIER, "..")
NUMMER = "4917662794745"   # Mert, WhatsApp

VORLAGEN = {
    "{{WA_ALLGEMEIN}}": "Hallo Brenz KFZ, ich habe eine Anfrage.\nFahrzeug (Marke, Modell, Baujahr): \n"
                        "Worum geht es (Service, Chiptuning, Aufbereitung): ",
    "{{WA_SERVICE}}": "Hallo Brenz KFZ, ich möchte einen Termin anfragen.\nFahrzeug (Marke, Modell, Baujahr): \nWas steht an: ",
    "{{WA_AUFBEREITUNG}}": "Hallo Brenz KFZ, ich interessiere mich für eine Fahrzeugaufbereitung.\n"
                           "Fahrzeug (Marke, Modell, Baujahr): \nWas soll gemacht werden: ",
}


def lesen(*teile):
    return open(os.path.join(WURZEL, *teile), encoding="utf-8").read()


def ausschnitt(text, anfang, ende, name):
    i = text.find(anfang)
    j = text.find(ende, i)
    if i < 0 or j < 0:
        raise SystemExit("index.html: " + name + " nicht gefunden, Skript anpassen")
    return text[i:j]


ZIELE = {"neu-vorlage.html": "champagner-neu.html", "entwurf3-vorlage.html": "entwurf-3.html"}


def bauen(vorlage, ziel, schreiben=True):
    html = lesen("werkzeuge", vorlage)
    quelle = lesen("index.html")

    svg = lesen("img", "logo-champagner.svg")
    svg = re.sub(r"<title>.*?</title>", "", svg).replace(' xmlns="http://www.w3.org/2000/svg"', "").strip()
    svg = svg.replace("<svg ", '<svg aria-hidden="true" ', 1)

    # Formular bis Ende des Abschnitts (schließt das Raster und enthält die Vollbild-Bühne)
    rechner = ausschnitt(quelle, '<form class="zettel" id="form"', "</section>", "Rechner-Formular")
    skripte = ausschnitt(quelle, "<script>\n// Leistungsrechner", "</body>", "Rechner-Skripte")

    ersetzen = {"<!--LOGO-->": svg, "<!--RECHNER-FORM-->": "      " + rechner.rstrip() + "\n",
                "<!--RECHNER-SKRIPTE-->": skripte.rstrip()}
    for platz, text in VORLAGEN.items():
        if platz in html:   # nicht jede Vorlage nutzt jede WhatsApp-Vorlage
            ersetzen[platz] = "https://wa.me/" + NUMMER + "?text=" + quote(text, safe="")
    for platz, neu in ersetzen.items():
        if platz not in html:
            raise SystemExit("Vorlage: " + platz + " fehlt")
        html = html.replace(platz, neu)
    html = re.sub(r"<!-- Vorlage für .*? -->", "<!-- Automatisch erzeugt aus werkzeuge/" + vorlage
                  + " mit werkzeuge/neu.py. Nicht von Hand bearbeiten. -->", html, count=1)
    if schreiben:
        open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(html)
        print(ziel, "erzeugt")
    return html


def oklch(L, C, h):
    """OKLCH nach sRGB als Hex (Björn Ottosson, OKLab)."""
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l = (L + .3963377774 * a + .2158037573 * b) ** 3
    m = (L - .1055613458 * a - .0638541728 * b) ** 3
    s = (L - .0894841775 * a - 1.2914855480 * b) ** 3
    rgb = (4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
           -.0041960863 * l - .7034186147 * m + 1.7076147010 * s)
    f = lambda x: 12.92 * x if x <= .0031308 else 1.055 * x ** (1 / 2.4) - .055
    return "#" + "".join("%02x" % round(max(0, min(1, f(x))) * 255) for x in rgb)


# Dunkle Töne wie in entwurf3-vorlage.html (leicht warm, Farbton 90° wie Film und Fotos)
DUNKEL = dict(grund="#12110f", flaeche="#181715", linie="#34332f", text="#e0dfde", leise="#8a8780", tinte="#11100f")
CHAMPAGNER = "#e4cc7f"

# Hell A: warmes Papier im selben Farbton wie Film und dunkle Fassung
PAPIER = dict(grund=oklch(.968, .007, 90), flaeche=oklch(.993, .003, 90), linie=oklch(.86, .009, 90), text=oklch(.215, .006, 90),
              leise=oklch(.50, .011, 90), rgrund=oklch(.94, .009, 90), blase=oklch(.905, .01, 90), leer=oklch(.47, .011, 90))
MESSING = oklch(.56, .085, 85)    # Champagner abgedunkelt, für Linien, Pfeile und Fokus auf Hell (4,3:1)
# Hell B: kühles Weiß, Petrol (Brenz als Fluss, nur als Gedanke, nicht auf der Seite)
KUEHL = dict(grund=oklch(.975, .003, 250), flaeche="#ffffff", linie=oklch(.87, .006, 250), text=oklch(.205, .016, 250),
             leise=oklch(.50, .013, 250), rgrund=oklch(.945, .005, 250), blase=oklch(.91, .008, 250), leer=oklch(.47, .013, 250))
PETROL, PETROL_HELL = oklch(.47, .075, 205), oklch(.80, .07, 200)


def tokens(p, akzent=None, auf=None):
    s = "--grund:%(grund)s;--flaeche:%(flaeche)s;--linie:%(linie)s;--text:%(text)s;--leise:%(leise)s;" % p
    s += ("--akzent:" + akzent + ";") if akzent else ""
    s += ("--auf-akzent:" + auf + ";") if auf else ""
    return s + "--fliess:color-mix(in srgb,var(--text) 74%,var(--grund));--haar:color-mix(in srgb,var(--text) 13%,transparent);"


def hell_css(name, p, akzent, akzent_dunkel, knopf, knopf_hover):
    """p: helle Töne. akzent: auf Hell (Linien, Pfeile, Fokus, Emblem-Ring). akzent_dunkel: in Film, Fuß und Rechner-Vollbild.
    knopf: (Hintergrund, Schrift) der Knöpfe auf Hell, knopf_hover: Farbe, mit der beim Überfahren gemischt wird."""
    d = DUNKEL
    return f"""
/* {name}: Seite hell. Film, Kopf über dem Film, Rechner-Vollbild und Fuß bleiben dunkel. Erzeugt von werkzeuge/neu.py */
:root{{color-scheme:light;{tokens(p, akzent, knopf[1])}}}
.held,.fuss,.kapitel{{color-scheme:dark;{tokens(d, akzent_dunkel, d["tinte"])}color:var(--text)}}
.fuss{{background:var(--grund);border-top:0}}
.r-buehne{{--akzent:{akzent_dunkel}}}
.rechner{{{tokens(dict(p, grund=p["rgrund"]))}}}
.kopf:not(.fest):not(.offen){{--text:#f2f1ef;--akzent:{akzent_dunkel}}}
.kopf.fest .marke svg path:first-of-type,.kopf.offen .marke svg path:first-of-type{{fill:var(--text)}}
.marke svg path:last-of-type,.fuss-wappen svg path:last-of-type{{fill:var(--akzent)}}
.knopf,.berechnen,#berechnen[hidden]~.anfrage .r-senden{{background:{knopf[0]};color:{knopf[1]}}}
.knopf:hover,.berechnen:hover,#berechnen[hidden]~.anfrage .r-senden:hover{{background:color-mix(in srgb,{knopf[0]} 85%,{knopf_hover})}}
.held .knopf{{background:var(--akzent);color:var(--auf-akzent)}}
.held .knopf:hover{{background:color-mix(in srgb,var(--akzent) 86%,#ffffff)}}
.blase{{background:{p["blase"]};color:var(--text)}}
.blase .leer{{color:{p["leer"]}}}
"""


def mix_css():
    return f"""
/* Mix (Sinans Idee 17.11.): Kfz-Service hell, Softwareoptimierung mit Rechner und Aufbereitung dunkel.
   Zusammenhalt: derselbe warme Farbton (90°) in Hell und Dunkel, eine Schrift, ein Bildton, dasselbe Raster und dieselben Ecken.
   Kfz-Service als helle Karte (Bild oben, Text auf Papier), daneben die dunklen Bildtafeln. Auf echten Unterseiten wäre jede
   Seite ganz in ihrer Welt. */
#service{{color-scheme:light;{tokens(PAPIER, MESSING)}aspect-ratio:auto;justify-content:flex-start;background:var(--grund);color:var(--text)}}
#service::before{{display:none}}
#service::after{{bottom:auto;aspect-ratio:4/3}}
#service .kapitel-bild{{position:relative;inset:auto;z-index:0;flex:none;aspect-ratio:4/3;overflow:hidden}}
#service .kapitel-bild img{{position:absolute;inset:0}}
#service .gebiet{{color:var(--leise)}}
#service .kapitel-text p.text{{color:var(--fliess)}}
#service .link{{color:var(--text)}}
@media (min-width:600px){{
  #service .kapitel-bild{{aspect-ratio:16/9}}
  #service::after{{aspect-ratio:16/9}}
}}
@media (min-width:900px){{
  #service .kapitel-bild{{flex:1 1 0;aspect-ratio:auto;min-height:220px}}
  #service::after{{display:none}}
}}
.rechner{{color-scheme:dark;{tokens(DUNKEL)}border-top:1px solid var(--haar)}}
.rechner .zettel select,.rechner .zettel input[type="text"],.rechner .zettel .stufen input:not(:checked)+span{{background:var(--grund)}}
.rechner .zettel .dia .k-stage,.rechner .zettel .dia .leg-stage{{stroke:var(--akzent)}}
.rechner .zettel .dia .p-stage{{fill:var(--akzent)}}
.rechner .zettel .dia .band{{fill:var(--akzent);opacity:.2}}
"""


ABGELEITET = {
    "entwurf-3-hell-a.html": ("Entwurf 3 hell A", hell_css("Hell A, warmes Papier", PAPIER, MESSING, CHAMPAGNER,
                                                         (PAPIER["text"], PAPIER["flaeche"]), "#ffffff")),
    "entwurf-3-hell-b.html": ("Entwurf 3 hell B", hell_css("Hell B, kühles Weiß mit Petrol", KUEHL, PETROL, PETROL_HELL,
                                                         (PETROL, "#ffffff"), "#000000")),
    "entwurf-3-mix.html": ("Entwurf 3 Mix", mix_css()),
}


def ableiten(html, ziel, name, css):
    for alt, neu in (("</style>", css + "</style>"), ("<title>(Entwurf 3)", "<title>(" + name + ")"),
                     ("mit werkzeuge/neu.py.", "mit werkzeuge/neu.py, Fassung " + name + ".")):
        if alt not in html:
            raise SystemExit(ziel + ": nicht gefunden: " + alt)
        html = html.replace(alt, neu, 1)
    open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(html)
    print(ziel, "erzeugt")


W = (1, 0, 0)
# Entwurf 4, hell: drei Paletten (oklch L, C, h oder Hex). Alle Paare geprüft: Text mindestens 7:1, leise, zeichen, Fußschrift
# und Vorschau mindestens 4,5:1, detail und emblem mindestens 3:1. Weit weg von saka-it (Grüntürkis #357A66 auf Off-White).
PALETTEN = {
    "nachtblau": ("Nachtblau", "Sand, Nachtblau, Messing: klassisch und seriös, Blau und Gold passen zum Emblem", dict(
        papier=(.958, .016, 82), stein=(.928, .02, 80), flaeche=(.992, .005, 82), linie=(.86, .02, 80), text=(.24, .045, 262),
        leise=(.49, .035, 258), akzent=(.34, .085, 262), akzent_tief=(.28, .075, 262), auf_akzent=(.992, .005, 82),
        zeichen=(.34, .085, 262), detail=(.58, .10, 78), bild=(.22, .03, 262), fuss_grund=(.23, .055, 262),
        fuss_text=(.94, .012, 82), fuss_leise=(.75, .03, 250), fuss_zeichen=CHAMPAGNER, emblem=CHAMPAGNER,
        blase=(.925, .03, 245), blase_leer=(.46, .035, 255), band=".16")),
    "kupfer": ("Kupfer", "Betongrau, Graphit, Kupfer: technisch und warm, Kupfer wie Leitungen und Bronze im Motorraum", dict(
        papier=(.955, .005, 240), stein=(.925, .006, 240), flaeche=W, linie=(.86, .008, 240), text=(.235, .012, 255),
        leise=(.49, .015, 250), akzent=(.52, .125, 50), akzent_tief=(.45, .11, 48), auf_akzent=W,
        zeichen=(.50, .12, 50), detail=(.55, .12, 52), bild=(.22, .01, 255), fuss_grund=(.23, .012, 255),
        fuss_text=(.94, .004, 240), fuss_leise=(.72, .012, 250), fuss_zeichen=(.78, .09, 60), emblem=CHAMPAGNER,
        blase=(.94, .022, 60), blase_leer=(.47, .025, 50), band=".16")),
    "signalgelb": ("Signalgelb", "Weiß, Anthrazit, Signalgelb: Werkstatt und Werkzeug, Gelb wie in Merts erster Fassung", dict(
        papier=W, stein=(.955, .005, 95), flaeche=W, linie=(.88, .005, 95), text=(.22, .006, 260),
        leise=(.48, .008, 260), akzent=(.87, .165, 95), akzent_tief=(.82, .16, 90), auf_akzent=(.22, .006, 260),
        zeichen=(.22, .006, 260), detail=(.62, .12, 88), bild=(.2, .005, 260), fuss_grund=(.22, .006, 260),
        fuss_text=(.95, .003, 95), fuss_leise=(.72, .006, 260), fuss_zeichen=(.87, .165, 95), emblem=(.87, .165, 95),
        blase=(.965, .05, 100), blase_leer=(.45, .03, 90), band=".45")),
}


def palette_einsetzen(html, schluessel):
    name, idee, werte = PALETTEN[schluessel]
    farbe = lambda v: v if isinstance(v, str) else oklch(*v)
    zeilen = []
    for k, v in werte.items():
        wert = v if k == "band" else farbe(v)
        zeilen.append("--" + k.replace("_", "-") + ":" + wert + ";")
    block = "  /* PALETTE " + name + ": " + idee + " */\n  " + " ".join(zeilen) + "\n  /* /PALETTE */"
    a, e = html.index("  /* PALETTE */"), html.index("/* /PALETTE */") + len("/* /PALETTE */")
    html = html[:a] + block + html[e:]
    for alt, neu in (("{{PAPIER}}", farbe(werte["papier"])), ("<title>(Entwurf 4, hell)", "<title>(Entwurf 4 " + name + ")"),
                     ("mit werkzeuge/neu.py.", "mit werkzeuge/neu.py, Palette " + name + ".")):
        if alt not in html:
            raise SystemExit("Entwurf 4: nicht gefunden: " + alt)
        html = html.replace(alt, neu, 1)
    return html


def main():
    for vorlage, ziel in ZIELE.items():
        html = bauen(vorlage, ziel)
        if ziel == "entwurf-3.html":
            for z, (name, css) in ABGELEITET.items():
                ableiten(html, z, name, css)
    html = bauen("entwurf4-vorlage.html", None, schreiben=False)
    for schluessel in PALETTEN:
        ziel = "entwurf-4-" + schluessel + ".html"
        open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(palette_einsetzen(html, schluessel))
        print(ziel, "erzeugt")


if __name__ == "__main__":
    main()
