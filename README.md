# brenzkfz.de

Website von Brenz KFZ: Kfz-Service, Softwareoptimierung, Fahrzeugaufbereitung. Gebaut von SAKA Solutions.

## Aufbau

- `index.html`: eine Datei mit CSS und JS, kein Framework, kein Build-Schritt
- `fonts/`: Barlow und Barlow Condensed als woff2, lokal eingebunden (kein Abruf bei Google)
- `img/`: Werkstatt-Videos für den Startbereich mit Standbildern. Hochformat fürs Handy, Querformat ab 900 px Breite. Es wird nur das passende Video geladen
- `favicon.svg`: Logo 3 (Emblem)

Farben (Schema A, gemessen aus einer Dribbble-Vorlage): Grund `#111111`, Fläche `#181818`, Linie `#303030`, Text `#ffffff`, Text leise `#8b8b8b`, Akzent `#fdf325`, Schrift auf Akzent `#111111`. Logo und Regeln stehen im Plan-Repo unter `konzepte/brenz-kfz/marke/MARKE.md`.

## Dezente Fassung zum Vergleichen

`dezent.html` ist dieselbe Seite mit dezenteren Farben (Akzent #e5c65f, Text #e0dfde, Grund #121212, gemessen aus Sinans Dribbble-Überblick, Autoseite „Luxury Cars“). Sie wird aus `index.html` erzeugt und ist für Google gesperrt. Nach jeder Änderung an `index.html` neu erzeugen:

```bash
python3 werkzeuge/dezent.py
```

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

- Abschnitte Service, Softwareoptimierung, Aufbereitung, Leistungsrechner und Kontakt (die Links im Menü zeigen schon auf `#service`, `#software`, `#aufbereitung`, `#rechner`, `#kontakt`)
- Impressum und Datenschutz vor dem Livegang
- Videos sind Platzhalter von Pexels (Nr. 8987289 und 4488712), später eigene Aufnahmen aus der Werkstatt
- Kursivschnitt von Barlow Condensed als Datei ergänzen, bis dahin erzeugt der Browser die Schräglage
- Lizenztext der Schrift (SIL Open Font License 1.1) in `fonts/` legen
