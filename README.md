# brenzkfz.de

Website von Brenz KFZ: Kfz-Service, Softwareoptimierung, Fahrzeugaufbereitung. Gebaut von SAKA Solutions.

## Aufbau

- `index.html`: eine Datei mit CSS und JS, kein Framework, kein Build-Schritt
- `fonts/`: Barlow und Barlow Condensed als woff2, lokal eingebunden (kein Abruf bei Google)
- `img/`: Werkstatt-Videos für den Startbereich mit Standbildern. Hochformat fürs Handy, Querformat ab 900 px Breite. Es wird nur das passende Video geladen
- `favicon.svg`: Logo 3 (Emblem)

Farben (Schema A, gemessen aus einer Dribbble-Vorlage): Grund `#111111`, Fläche `#181818`, Linie `#303030`, Text `#ffffff`, Text leise `#8b8b8b`, Akzent `#fdf325`, Schrift auf Akzent `#111111`. Logo und Regeln stehen im Plan-Repo unter `konzepte/brenz-kfz/marke/MARKE.md`.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000 im Browser öffnen.

## Offen

- Abschnitte Service, Softwareoptimierung, Aufbereitung, Leistungsrechner und Kontakt (die Links im Menü zeigen schon auf `#service`, `#software`, `#aufbereitung`, `#rechner`, `#kontakt`)
- WhatsApp-Nummer, bis dahin zeigen die WhatsApp-Knöpfe auf `#kontakt`
- Impressum und Datenschutz vor dem Livegang
- Videos sind Platzhalter von Pexels (Nr. 8987289 und 4488712), später eigene Aufnahmen aus der Werkstatt
- Kursivschnitt von Barlow Condensed als Datei ergänzen, bis dahin erzeugt der Browser die Schräglage
- Lizenztext der Schrift (SIL Open Font License 1.1) in `fonts/` legen
