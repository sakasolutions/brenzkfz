"""Erzeugt die zwei Fassungen für Mert aus index.html. Nicht von Hand bearbeiten, nach jeder Änderung an index.html neu ausführen:

    python3 werkzeuge/varianten.py

Beide Fassungen (Sinan, 16.11.2026): Aufbau gemischt (Kopf dunkel, Rechner hell, nach der Vorlage „AutoPlanet“),
Überschriften in Saira Condensed, Logo: Emblem nach Sinans Vorlage in der Farbe der Fassung (img/logo-*.svg).
  blau.html        Akzent #1f5ae0 (nach Augenmaß aus dem AutoPlanet-Screenshot, nicht gemessen), Schrift auf Blau weiß,
                   auf Dunkel aufgehellt
  champagner.html  Akzent #e5c65f, Text #e0dfde, Grund #121212 (gemessen aus Sinans Dribbble-Überblick, Luxury Cars);
                   Gold auf Hell nur als Knopf, Kurve und Mehrleistung dort dunkel
Die hellen Töne des Rechners sind aus der Palette gemischt (Weiß, #8b8b8b, #111111). Beide Seiten sind für Google gesperrt.
"""
import os

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.join(HIER, "..")
QUELLE = os.path.join(WURZEL, "index.html")

HELL = """
/* Rechner hell. Töne aus der Palette gemischt (Weiß, #8b8b8b, #111111). */
.rechner{color-scheme:light;border-top:0;
  --grund:color-mix(in srgb,#ffffff 94%,#8b8b8b);
  --flaeche:#ffffff;
  --linie:color-mix(in srgb,#ffffff 80%,#8b8b8b);
  --text:#111111;
  --leise:color-mix(in srgb,#111111 45%,#8b8b8b);
  color:var(--text);
  /* Motorbild (schwarz-weiß, Typenschild unscharf) unter einer fast deckenden hellen Fläche: Abschnitt bleibt hell.
     Herkunft des Fotos offen, nur für den Entwurf; für die echte Seite ein Foto mit klaren Rechten nehmen. */
  background:linear-gradient(color-mix(in srgb,var(--grund) 89%,transparent),color-mix(in srgb,var(--grund) 89%,transparent)),
    url("img/motor-hintergrund.webp") center/cover no-repeat,var(--grund)}
.rechner .zettel{box-shadow:0 1px 2px rgb(0 0 0 / .04),0 10px 30px rgb(0 0 0 / .06)}
.rechner .zettel select,.rechner .zettel input[type="text"]{background:#ffffff}
.rechner .r-buehne{color-scheme:dark;--grund:#111111;--flaeche:#181818;--linie:#303030;--text:#ffffff;--leise:#8b8b8b}
"""

SAIRA = """
/* Überschriften in Saira Condensed */
@font-face{font-family:"Saira Condensed";font-style:normal;font-weight:900;font-display:swap;src:url("fonts/SairaCondensed-900.woff2") format("woff2")}
:root{--f-titel:"Saira Condensed","Arial Narrow",system-ui,sans-serif}
.titel,.r-titel,.ergebnis .gesamt,.r-buehne .fahrzeug,.r-buehne .wert{font-style:normal;font-weight:900;letter-spacing:.01em}
"""

DUNKEL_AUF_HELL = """
/* Akzent als Schrift oder Linie ist auf Hell zu schwach: Mehrleistung und Stage-Kurve dunkel, Akzent bleibt für Knöpfe */
.rechner .ergebnis .plus{color:var(--text)}
.rechner .zettel .dia .k-stage,.rechner .zettel .dia .leg-stage{stroke:var(--text)}
.rechner .zettel .dia .p-stage{fill:var(--text)}
.rechner .zettel .dia .band{fill:var(--text);opacity:.1}
"""

BLAU = "#1f5ae0"


def mischen(a, b, anteil_a):
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join("%02x" % round(x * anteil_a + y * (1 - anteil_a)) for x, y in zip(ca, cb))


BLAU_AUF_DUNKEL = """
/* Blau auf Dunkel aufgehellt, damit es lesbar bleibt. Rot bleibt Signalen vorbehalten. */
:root{--akzent-hell:""" + mischen(BLAU, "#ffffff", 0.75) + """}
.titel .akzent{color:var(--akzent-hell)}
.r-buehne .dia .k-stage,.r-buehne .dia .leg-stage{stroke:var(--akzent-hell)}
.r-buehne .dia .p-stage,.r-buehne .dia .band{fill:var(--akzent-hell)}
.r-buehne .schritt{color:var(--akzent-hell)}
.r-buehne .dia .k-stage{filter:drop-shadow(0 0 5px color-mix(in srgb,var(--akzent-hell) 50%,transparent))}
"""

FASSUNGEN = {
    "blau.html": ("Blau", [
        ("--akzent:#fdf325;", "--akzent:" + BLAU + ";"),
        ("--auf-akzent:#111111;", "--auf-akzent:#ffffff;"),
    ], HELL + BLAU_AUF_DUNKEL + SAIRA),
    "champagner.html": ("Champagner", [
        ("--grund:#111111;", "--grund:#121212;"),
        ("--text:#ffffff;", "--text:#e0dfde;"),
        ("--akzent:#fdf325;", "--akzent:#e5c65f;"),
        ('<meta name="theme-color" content="#111111">', '<meta name="theme-color" content="#121212">'),
    ], HELL + DUNKEL_AUF_HELL + SAIRA),
}

GEMEINSAM = [
    ('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">'),
    ("<head>", "<head>\n<!-- Automatisch erzeugt aus index.html mit werkzeuge/varianten.py. Nicht von Hand bearbeiten. -->"),
]


LOGO = {"blau.html": "logo-blau.svg", "champagner.html": "logo-champagner.svg"}   # Emblem nach Sinans Vorlage, quelle/emblem_saira.py im Plan-Repo


def logo_einsetzen(html, ziel):
    """Ersetzt das Emblem im Menü durch das Logo der Fassung (inline, damit keine zusätzliche Anfrage nötig ist)."""
    import re
    svg = open(os.path.join(WURZEL, "img", LOGO[ziel]), encoding="utf-8").read()
    svg = re.sub(r"<title>.*?</title>", "", svg).replace(' xmlns="http://www.w3.org/2000/svg"', "").strip()
    svg = svg.replace("<svg ", '<svg aria-hidden="true" ', 1)
    neu, n = re.subn(r'(<a class="marke"[^>]*>)<svg viewBox="-100 -100 200 200".*?</svg>(</a>)',
                     lambda m: m.group(1) + svg + m.group(2), html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(ziel + ": Logo im Menü nicht gefunden")
    return neu


def bauen(ziel, name, ersetzen, css):
    html = open(QUELLE, encoding="utf-8").read()
    html = logo_einsetzen(html, ziel)
    for alt, neu in ersetzen + GEMEINSAM + [("</style>", css + "</style>"), ("<title>", "<title>(" + name + ") ")]:
        if alt not in html:
            raise SystemExit(ziel + ": nicht gefunden, Skript anpassen: " + alt[:60])
        html = html.replace(alt, neu, 1 if alt in ("</style>", "<head>", "<title>") else -1)
    open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(html)
    print(ziel, "erzeugt")


if __name__ == "__main__":
    for datei, (name, ersetzen, css) in FASSUNGEN.items():
        bauen(datei, name, ersetzen, css)
