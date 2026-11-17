"""Baut die Entwürfe aus ihren Vorlagen in werkzeuge/:
  neu-vorlage.html       -> champagner-neu.html  (Sinan 16.11.2026)
  entwurf3-vorlage.html  -> entwurf-3.html       (Sinan 17.11.2026, nach Tier-1-Analyse)


    python3 werkzeuge/neu.py

Setzt in beide ein: Emblem in Champagner (img/logo-champagner.svg), Formular und Skripte des Leistungsrechners unverändert
aus index.html, WhatsApp-Links mit Vorlage. Nach Änderungen am Rechner in index.html neu ausführen.
"""
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


def bauen(vorlage, ziel):
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
    open(os.path.join(WURZEL, ziel), "w", encoding="utf-8").write(html)
    print(ziel, "erzeugt")


def main():
    for vorlage, ziel in ZIELE.items():
        bauen(vorlage, ziel)


if __name__ == "__main__":
    main()
