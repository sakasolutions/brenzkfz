"""Erzeugt Vergleichsfassungen aus index.html. Nicht von Hand bearbeiten, nach jeder Änderung an index.html neu ausführen:

    python3 werkzeuge/varianten.py

dezent.html    gleiche Seite, dezentere Farben. Gemessen aus Sinans Dribbble-Überblick (Autoseite „Arrive in Style:
               Luxury Cars“): Akzent #e5c65f (warmes, gedecktes Gold), Text #e0dfde (weiches Weiß), Grund #121212.
gemischt.html  Kopf dunkel wie index.html, der Rechner darunter hell (nach Sinans Vorlage „AutoPlanet“, Origin UI/UX
               Studio: dunkler Kopf, helle Abschnitte, eine Akzentfarbe, Rot nur als Signal). Die hellen Töne sind aus
               der vorhandenen Palette gemischt (Weiß, #8b8b8b, #111111), kein neuer Farbton. Gelb auf Hell nur als
               Fläche mit dunkler Schrift.
blau.html      Aufbau wie gemischt, Akzent Blau wie in der Vorlage „AutoPlanet“. Das Blau ist nach Augenmaß angesetzt,
               nicht gemessen (Vorlage lag nur als Bild im Chat vor). Auf Dunkel ein aufgehelltes Blau, Schrift auf Blau weiß.
Alle Fassungen sind für Google gesperrt (sonst doppelte Inhalte).
"""
import os

HIER = os.path.dirname(os.path.abspath(__file__))
QUELLE = os.path.join(HIER, "..", "index.html")

GEMEINSAM = [
    ('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">'),
    ("<head>", "<head>\n<!-- Automatisch erzeugt aus index.html mit werkzeuge/varianten.py. Nicht von Hand bearbeiten. -->"),
]

DEZENT = [
    ("--grund:#111111;", "--grund:#121212;"),
    ("--text:#ffffff;", "--text:#e0dfde;"),
    ("--akzent:#fdf325;", "--akzent:#e5c65f;"),
    ('fill="#ffffff"', 'fill="#e0dfde"'),
    ('fill="#fdf325"', 'fill="#e5c65f"'),
    ('<meta name="theme-color" content="#111111">', '<meta name="theme-color" content="#121212">'),
    ("/* Farben: Schema A Schwarz/Gelb, gemessen aus Sinans Dribbble-Vorlage (MARKE.md im Plan-Repo). Nichts dazuerfinden. */",
     "/* Farben: dezente Fassung, gemessen aus Sinans Dribbble-Überblick (Luxury Cars). Erzeugt von werkzeuge/varianten.py. */"),
    ("<title>", "<title>(dezent) "),
]

HELL = """
/* Fassung gemischt: Rechner hell. Töne aus der Palette gemischt (Weiß, #8b8b8b, #111111). */
.rechner{color-scheme:light;border-top:0;
  --grund:color-mix(in srgb,#ffffff 94%,#8b8b8b);
  --flaeche:#ffffff;
  --linie:color-mix(in srgb,#ffffff 80%,#8b8b8b);
  --text:#111111;
  --leise:color-mix(in srgb,#111111 45%,#8b8b8b);
  background:var(--grund);color:var(--text)}
.rechner .zettel{box-shadow:0 1px 2px rgb(0 0 0 / .04),0 10px 30px rgb(0 0 0 / .06)}
.rechner .zettel select,.rechner .zettel input[type="text"]{background:#ffffff}
/* Gelbe Schrift und Linien sind auf Hell nicht lesbar: Mehrleistung und Stage-Kurve dunkel, Gelb bleibt für Knöpfe */
.rechner .ergebnis .plus{color:var(--text)}
.rechner .zettel .dia .k-stage,.rechner .zettel .dia .leg-stage{stroke:var(--text)}
.rechner .zettel .dia .p-stage{fill:var(--text)}
.rechner .zettel .dia .band{fill:var(--text);opacity:.1}
/* Die Vollbild-Show bleibt dunkel */
.rechner .r-buehne{color-scheme:dark;--grund:#111111;--flaeche:#181818;--linie:#303030;--text:#ffffff;--leise:#8b8b8b}
"""

GEMISCHT = [
    ("</style>", HELL + "</style>"),
    ("<title>", "<title>(gemischt) "),
]

# blau.html: Aufbau wie gemischt, Akzent Blau wie in Sinans Vorlage „AutoPlanet“ (Origin UI/UX Studio).
# Achtung: Blau nach Augenmaß aus dem Screenshot im Chat angesetzt, NICHT gemessen (die Vorlage lag nicht als Datei vor).
BLAU_AKZENT = "#1f5ae0"


def mischen(a, b, anteil_a):
    """Farbe a mit b mischen wie color-mix(in srgb, a anteil, b), für das Logo-SVG (dort geht kein color-mix)."""
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join("%02x" % round(x * anteil_a + y * (1 - anteil_a)) for x, y in zip(ca, cb))


BLAU_HELL = mischen(BLAU_AKZENT, "#ffffff", 0.75)   # für Akzent auf Dunkel (Wort in der Überschrift, Logo-Ring, Show)

BLAU_CSS = HELL.replace("/* Gelbe Schrift und Linien sind auf Hell nicht lesbar: Mehrleistung und Stage-Kurve dunkel, Gelb bleibt für Knöpfe */\n"
                        ".rechner .ergebnis .plus{color:var(--text)}\n"
                        ".rechner .zettel .dia .k-stage,.rechner .zettel .dia .leg-stage{stroke:var(--text)}\n"
                        ".rechner .zettel .dia .p-stage{fill:var(--text)}\n"
                        ".rechner .zettel .dia .band{fill:var(--text);opacity:.1}\n", "") + """
/* Fassung blau: Blau auf Dunkel aufgehellt, damit es lesbar bleibt. Rot bleibt Signalen vorbehalten (noch nirgends eingesetzt). */
:root{--akzent-hell:""" + BLAU_HELL + """}
.titel .akzent{color:var(--akzent-hell)}
.r-buehne .dia .k-stage,.r-buehne .dia .leg-stage{stroke:var(--akzent-hell)}
.r-buehne .dia .p-stage,.r-buehne .dia .band{fill:var(--akzent-hell)}
.r-buehne .schritt{color:var(--akzent-hell)}
.r-buehne .dia .k-stage{filter:drop-shadow(0 0 5px color-mix(in srgb,var(--akzent-hell) 50%,transparent))}
"""

BLAU = [
    ("--akzent:#fdf325;", "--akzent:" + BLAU_AKZENT + ";"),
    ("--auf-akzent:#111111;", "--auf-akzent:#ffffff;"),     # Schrift auf Blau ist weiß
    ('fill="#fdf325"', 'fill="' + BLAU_HELL + '"'),          # Logo-Ring
    ("</style>", BLAU_CSS + "</style>"),
    ("<title>", "<title>(blau) "),
]


def bauen(ziel, ersetzen):
    html = open(QUELLE, encoding="utf-8").read()
    for alt, neu in ersetzen + GEMEINSAM:
        if alt not in html:
            raise SystemExit(ziel + ": nicht gefunden, Skript anpassen: " + alt[:60])
        html = html.replace(alt, neu, 1 if alt in ("</style>", "<head>", "<title>") else -1)
    open(os.path.join(HIER, "..", ziel), "w", encoding="utf-8").write(html)
    print(ziel, "erzeugt")


if __name__ == "__main__":
    bauen("dezent.html", DEZENT)
    bauen("gemischt.html", GEMISCHT)
    bauen("blau.html", BLAU)
