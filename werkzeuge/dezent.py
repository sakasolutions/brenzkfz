"""Erzeugt dezent.html aus index.html: gleiche Seite, dezentere Farben zum Vergleichen.

Aufruf aus dem Projektordner:  python3 werkzeuge/dezent.py
Nach jeder Änderung an index.html neu ausführen. dezent.html nicht von Hand bearbeiten.

Farben der dezenten Fassung, gemessen aus Sinans Dribbble-Überblick (Autoseite „Arrive in Style: Luxury Cars“):
  Akzent #e5c65f (warmes, gedecktes Gold), Text #e0dfde (weiches Weiß), Grund #121212.
  Fläche #181818, Linie #303030, Text leise #8b8b8b und Schrift auf Akzent #111111 bleiben wie in Schema A.
"""
import os

HIER = os.path.dirname(os.path.abspath(__file__))
QUELLE = os.path.join(HIER, "..", "index.html")
ZIEL = os.path.join(HIER, "..", "dezent.html")

ERSETZEN = [
    # Farbwerte
    ("--grund:#111111;", "--grund:#121212;"),
    ("--text:#ffffff;", "--text:#e0dfde;"),
    ("--akzent:#fdf325;", "--akzent:#e5c65f;"),
    ('fill="#ffffff"', 'fill="#e0dfde"'),        # Logo im Menü
    ('fill="#fdf325"', 'fill="#e5c65f"'),
    ('<meta name="theme-color" content="#111111">', '<meta name="theme-color" content="#121212">'),
    ("/* Farben: Schema A Schwarz/Gelb, gemessen aus Sinans Dribbble-Vorlage (MARKE.md im Plan-Repo). Nichts dazuerfinden. */",
     "/* Farben: dezente Fassung, gemessen aus Sinans Dribbble-Überblick (Luxury Cars). Erzeugt von werkzeuge/dezent.py. */"),
    # Vergleichsseite: nicht von Google aufnehmen lassen (sonst doppelte Inhalte)
    ('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">'),
    ("<title>", "<title>(dezent) "),
    ("<head>", "<head>\n<!-- Automatisch erzeugt aus index.html mit werkzeuge/dezent.py. Nicht von Hand bearbeiten. -->"),
]


def main():
    html = open(QUELLE, encoding="utf-8").read()
    for alt, neu in ERSETZEN:
        anzahl = html.count(alt)
        if anzahl == 0:
            raise SystemExit("Nicht gefunden, Skript anpassen: " + alt)
        html = html.replace(alt, neu)
    open(ZIEL, "w", encoding="utf-8").write(html)
    print("dezent.html erzeugt")


if __name__ == "__main__":
    main()
