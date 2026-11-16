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
