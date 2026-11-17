# brenzkfz.de

Website von Brenz KFZ: Kfz-Service, Softwareoptimierung, Fahrzeugaufbereitung. Gebaut von SAKA Solutions.

## Aufbau

- `index.html`: eine Datei mit CSS und JS, kein Framework, kein Build-Schritt
- `fonts/`: Barlow und Barlow Condensed als woff2, dazu Saira Condensed für die beiden Fassungen, alles lokal (kein Abruf bei Google)
- `img/`: Werkstatt-Videos für den Startbereich mit Standbildern. Hochformat fürs Handy, Querformat ab 900 px Breite. Es wird nur das passende Video geladen
- `favicon.svg`: Logo 3 (Emblem), einfarbig weiß auf Schwarz

Farben (Schema A, gemessen aus einer Dribbble-Vorlage): Grund `#111111`, Fläche `#181818`, Linie `#303030`, Text `#ffffff`, Text leise `#8b8b8b`, Akzent `#fdf325`, Schrift auf Akzent `#111111`. Logo und Regeln stehen im Plan-Repo unter `konzepte/brenz-kfz/marke/MARKE.md`.

## Zwei Fassungen für Mert

`blau.html` und `champagner.html`, beide aus `index.html` erzeugt und für Google gesperrt (Sinan, 16.11.2026):

- beide: Kopf dunkel, Rechner hell (nach der Vorlage „AutoPlanet“), Überschriften in Saira Condensed, rundes Emblem einfarbig
- Blau: Akzent #1f5ae0 (nach Augenmaß, nicht gemessen), Schrift auf Blau weiß, auf Dunkel aufgehellt
- Champagner: Akzent #e4cc7f, Text #e0dfde, Grund #121212 (Text und Grund gemessen aus Sinans Dribbble-Überblick, Autoseite „Luxury Cars“; Akzent ist das dort gemessene Gold #e5c65f, etwas sanfter gemischt)
- Rechner-Abschnitt mit Motorbild als Hintergrund unter einer hellen Fläche (`img/motor-hintergrund.webp`, schwarz-weiß, Typenschild unscharf). Herkunft des Fotos offen, nur für den Entwurf

Nach jeder Änderung an `index.html` neu erzeugen:

```bash
python3 werkzeuge/varianten.py
```

Nach Merts Wahl kommt seine Fassung in `index.html`, die beiden Dateien fallen dann weg.

## Neuer Entwurf: champagner-neu.html

Sinan fand die zwei Fassungen zu KI-generisch (Aufbau wie eine Startup-Landingpage, zwei Knöpfe, Großbuchstaben-Zeilen, keine Fakten). Neuer Entwurf zum Selber-Ansehen: https://sakasolutions.github.io/brenzkfz/champagner-neu.html (für Google gesperrt).

- Erzeugt mit `python3 werkzeuge/neu.py` aus `werkzeuge/neu-vorlage.html`; Emblem, Rechner-Formular und Rechner-Skripte kommen unverändert aus `img/logo-champagner.svg` und `index.html`.
- Ein Knopf je Bereich (WhatsApp), sonst unterstrichene Textlinks. Überschriften normal geschrieben, ohne Punkt. Keine Zeilen in Großbuchstaben, keine Pfeile.
- Eigenes Element: Kennzeichen-Kürzel als Einzugsgebiet (HDH Landkreis Heidenheim, AA Ostalbkreis, UL Ulm und Alb-Donau-Kreis). AA und UL sind der Vorschlag für die Softwareoptimierung, noch abstimmen.
- Leistungen als Verzeichnis, Rechner mit Datenliste daneben, Kontakt mit großer WhatsApp-Nummer und Einzugsgebiet.
- Nur Standbilder, kein Video. Fotos weiter Platzhalter; echte Fotos aus der Werkstatt sind der größte Hebel.
- Fehlt noch von Mert: Adresse, Öffnungszeiten, konkrete Leistungen.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000 im Browser öffnen.

## WhatsApp

Alle WhatsApp-Knöpfe gehen an Mert (+49 176 62794745) mit vorausgefüllter Nachricht. Menü und Startbereich: kurze Vorlage mit Fahrzeug und Anliegen. Rechner: Fahrzeug, Baujahr, Kraftstoff, Motor und Wunsch (Stage 1, Stage 2 auf Anfrage, Beratung), ohne Schätzwerte.

## Leistungsrechner

Steht vorerst direkt unter dem Startbereich (`#rechner`), damit Mert ihn sehen kann. Später kommt er auf die Seite Softwareoptimierung. Fahrzeugdaten, Faktoren und Show sind unverändert aus dem Entwurf übernommen, Logik und Grenzen der Schätzung stehen im Plan-Repo (`konzepte/brenz-kfz/RECHNER.md`). Die Serienleistungen sind eine Auswahlhilfe und noch nicht von Mert geprüft.

## Offen

- Abschnitte Service, Softwareoptimierung und Kontakt (die Links im Menü zeigen schon auf `#service`, `#software`, `#kontakt`); Leistungsrechner (`#rechner`) und Fahrzeugaufbereitung (`#aufbereitung`) stehen
- Impressum und Datenschutz vor dem Livegang
- Videos sind Platzhalter von Pexels (Nr. 8987289 und 4488712), später eigene Aufnahmen aus der Werkstatt
- Motorbild im Rechner: Herkunft und Rechte offen (zeigt einen Motor des Tuners Litchfield), vor dem Livegang ersetzen
- Bild Fahrzeugaufbereitung (`img/aufbereitung.webp`): Herkunft und Rechte offen, vor dem Livegang ersetzen
- Leistungen der Fahrzeugaufbereitung konkret von Mert (bisher bewusst allgemein formuliert)
- Kursivschnitt von Barlow Condensed als Datei ergänzen, bis dahin erzeugt der Browser die Schräglage
- Lizenztexte der Schriften (alle SIL Open Font License 1.1) in `fonts/` legen

## Entwurf 3: entwurf-3.html

Sinan fand auch champagner-neu.html zu generisch, vor allem die Schrift. Neuer Ansatz nach einer Messung echter Tier-1-Seiten im Browser (17.11.2026, Startbereich bei 1024 px Breite):

| Seite | Schrift | Überschrift | Knöpfe im Startbereich |
|---|---|---|---|
| Porsche | Porsche Next (eigene) | Stärke 400, normal geschrieben, „Macan GTS.“ | einer, dazu Pause-Knopf fürs Video |
| Polestar | Polestar Unica (eigene) | 30 px, Stärke 400, Laufweite −1,2 px, zweite Zeile grau | einer mit Rahmen und Pfeil |
| Apple | SF Pro (eigene) | 48 px, Stärke 600 | einer |
| Rivian | Adventure (eigene) | 56 px, Stärke 600, Laufweite −2,5 px | zwei |
| Singer | Söhne Schmal (lizenziert) | 62 px, Stärke 300, Großbuchstaben | keiner, nur Textlinks |

Was alle gemeinsam haben: eine Schriftfamilie für alles, nie fette schmale Schrift (schmal nur ganz leicht wie bei Singer), Film oder Foto trägt die Seite, wenig Text pro Abschnitt.

- Schrift: Schibsted Grotesk (SIL Open Font License), eine Familie für alles, Stärke 400 und 500, große Größen mit engerer Laufweite. Datei `fonts/SchibstedGrotesk-var.woff2`, lokal.
- Film bleibt (Platzhalter von Pexels), mit Pause-Knopf. Film und alle Fotos im selben Farbton (fast schwarz-weiß, leicht warm), dazu stilles Filmkorn.
- Leistungen als drei Kapitel mit Standbild im Wechsel. Die Standbilder `img/kapitel-*.webp` sind aus den Platzhalter-Filmen und den Entwurfsfotos geschnitten; breit und schmal zeigen verschiedene Bilder, damit nichts doppelt erscheint.
- Kontakt: Nachricht vorbereiten (Thema, Fahrzeug, Anliegen) mit Vorschau, wie sie bei Mert ankommt, dann „In WhatsApp öffnen“.
- Erzeugt mit `python3 werkzeuge/neu.py` aus `werkzeuge/entwurf3-vorlage.html` (baut auch champagner-neu.html).

Aufgeräumt nach Audit (17.11.2026): Unter dem Film eine Übersicht der vier Bereiche statt eines Einleitungssatzes (wie die Modellreihe bei Porsche), der Film läuft ohne Kante in die Seite, die Überschrift bricht sauber in zwei Teile, der Fuß hat Emblem, Menü und Kontakt. Schärfere Standbilder für den Film (`img/film-*.webp`, Bild 1 der Videos, passend zur Breite vorgeladen). Barrierefreiheit: Menü sperrt den Rest der Seite, Vorschau wird nicht bei jedem Tastendruck vorgelesen, Tippflächen mindestens 40 px, weniger Bewegung wird respektiert. Geprüft auf 390 px: kein seitliches Scrollen, Kontraste mindestens 4,5:1.

Grautöne leicht warm (Sinan, 17.11.2026): Film und Fotos haben nach dem Bildton `--ton` in den Mitteltönen einen warmen Farbton (oklch um 90°), die dunklen Töne sind fast neutral. Deshalb wird der Grund nur ein Hauch wärmer (`#12110f` statt `#121212`), Linien und graue Schrift bekommen den Filmton voll. Text und Champagner bleiben wie gemessen.

Leistungen als Bildtafeln (Sinan, 17.11.2026: „Bilder nur reingeklatscht“, Überlauf bei „Softwareoptimierung“ auf dem Desktop): Text steht im Bild unten links wie beim Film, gleicher Bildton und gleiches Korn, die ganze Tafel ist klickbar. Desktop: Service hochkant neben Software breit, Aufbereitung über die volle Breite; darunter untereinander. Standbilder für Service immer aus dem Film, der oben gerade nicht läuft (Querfilm ist eine einzige Einstellung). Weiche Trennungen in langen Wörtern, Übersicht erst ab 1200 px vierspaltig. Geprüft in acht Breiten von 600 bis 1920 px (kein Überlauf, alle Titel einzeilig) und live auf 390, 1000 und 1440 px.

Zum Abgleich (Sinan, 17.11.2026, Farben außer Rot frei), alle aus derselben Vorlage mit `werkzeuge/neu.py`:

| Seite | Idee |
|---|---|
| `entwurf-3-hell-a.html` | hell, warmes Papier im Farbton des Films, Knöpfe in Tinte, Akzent Messing (Champagner abgedunkelt). Film und Fuß bleiben dunkel. |
| `entwurf-3-hell-b.html` | hell, kühles Weiß, Akzent Petrol, Emblem in Petrol. Bewusst das Gegenteil zum warmen Film. |
| `entwurf-3-mix.html` | Sinans Idee für die Unterseiten: Kfz-Service hell, Softwareoptimierung mit Rechner und Aufbereitung dunkel. Auf der Startseite als helle Karte (Bild oben, Text auf Papier) neben den dunklen Bildtafeln. |

## Entwurf 4, hell: drei Paletten

Sinan, 17.11.2026: „ein Konzept in hell“. Eigene Vorlage `werkzeuge/entwurf4-vorlage.html`, gebaut mit `werkzeuge/neu.py`. Schrift, Texte, Rechner und WhatsApp-Vorschau wie Entwurf 3, aber hell gedacht:

- **Start:** Überschrift auf Papier, rechts daneben die Unterzeile aus `TEXTE.md` und der Knopf, darunter der Film in einem gerahmten Feld, das über den unteren Rand hinausläuft. Im Kopf ein kleiner Knopf „Anfrage“.
- **Leistungen:** Bildkarten mit einem Etikett aus Papier (Titel, Gebiet, Text, Link). Auf dem Handy unter dem Bild, ab Tablet unten links im Bild. Ganze Karte klickbar.
- **Farben:** Die erste Fassung (Tannengrün auf Papier) war zu nah an saka-it (`#357A66` auf `#f7f7f5`) und ist entfernt. Jetzt drei Paletten zur Auswahl, jede Farbe kommt aus einer Variable, `neu.py` setzt die Palette ein (`PALETTEN`):

| Seite | Palette | Idee |
|---|---|---|
| `entwurf-4-nachtblau.html` | Sand `#f7f0e5`, Nachtblau `#1e3663`, Messing `#9b722c`, Fuß Nachtblau `#0e1c36` | klassisch und seriös, Blau und Gold passen zum Emblem |
| `entwurf-4-kupfer.html` | Betongrau `#edf1f3`, Graphit `#1a1e24`, Kupfer `#a04f18`, Fuß Graphit | technisch und warm |
| `entwurf-4-signalgelb.html` | Weiß, Anthrazit `#191b1d`, Signalgelb `#f6d236` (nur als Fläche, auf Weiß zu schwach für Schrift und Pfeile), Fuß Anthrazit | Werkstatt und Werkzeug, Gelb wie in Merts erster Fassung |

Alle Paare geprüft: Text mindestens 7:1, graue Schrift, Pfeile, Fußschrift und Vorschau mindestens 4,5:1. Layout geprüft in neun Breiten von 600 bis 1920 px (kein Überlauf, alle Titel einzeilig).

Nebenbei behoben (Entwurf 3 und 4): Die Telefonnummer im Kontakt stand auf dem Desktop nicht unten, weil `.kontakt-text p` den Abstand überschrieb.

