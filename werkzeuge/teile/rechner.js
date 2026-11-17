// Chiptuning-Rechner der neuen Seite (Sinan, 17.11.2026: klarer und verständlicher).
// Daten, Motortyp, Faktoren und Kurven unverändert aus dem bisherigen Rechner (index.html, Plan-Repo RECHNER.md).
// Neu: Baureihe im ersten Schritt, Kraftstoff nur bei eingetragenem Motor, Ergebnis ohne Extra-Klick mit Animation in der Karte,
// Preis im Ergebnis, Anfrage über Auswahlkarten mit offener Nachrichtenvorschau.
(function(){
  "use strict";
  // WhatsApp-Nummer von Mert (+49 176 62794745), international ohne + und ohne Leerzeichen
  var NUMMER = "4917662794745";
  // Gängige Fahrzeuge in Deutschland, Verbrenner und Hybride. Reine Elektroautos fehlen bewusst: dort gibt es kein Softwaretuning im üblichen Sinn
  var FAHRZEUGE = {
    "Abarth": ["500 / 595 / 695", "124 Spider"],
    "Alfa Romeo": ["Giulietta", "Giulia", "Stelvio", "MiTo", "Tonale", "159"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT"],
    "BMW": ["1er", "2er", "3er", "4er", "5er", "6er", "7er", "8er", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "M2", "M3", "M4", "M5"],
    "Citroën": ["C1", "C3", "C3 Aircross", "C4", "C5 Aircross", "C5", "Berlingo", "Jumpy", "Jumper", "SpaceTourer"],
    "Cupra": ["Formentor", "Leon", "Ateca"],
    "Dacia": ["Sandero", "Logan", "Duster", "Jogger", "Lodgy", "Dokker"],
    "Fiat": ["500", "500X", "Panda", "Punto", "Tipo", "Bravo", "Doblò", "Fiorino", "Ducato", "Talento"],
    "Ford": ["Fiesta", "Focus", "Mondeo", "Puma", "Kuga", "EcoSport", "C-Max", "S-Max", "Galaxy", "Tourneo Connect", "Transit Connect", "Transit Custom", "Transit", "Ranger", "Mustang"],
    "Honda": ["Jazz", "Civic", "HR-V", "CR-V"],
    "Hyundai": ["i10", "i20", "i30", "ix35", "Tucson", "Kona", "Santa Fe"],
    "Iveco": ["Daily"],
    "Jaguar": ["XE", "XF", "E-Pace", "F-Pace", "F-Type"],
    "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler"],
    "Kia": ["Picanto", "Rio", "Ceed", "ProCeed", "XCeed", "Stonic", "Sportage", "Sorento", "Niro"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
    "MAN": ["TGE"],
    "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5"],
    "Mercedes-Benz": ["A-Klasse", "B-Klasse", "C-Klasse", "CLA", "CLS", "E-Klasse", "S-Klasse", "GLA", "GLB", "GLC", "GLE / M-Klasse", "GLS", "G-Klasse", "V-Klasse", "Vito", "Viano", "Sprinter", "Citan", "AMG GT"],
    "Mini": ["Mini 3-Türer / 5-Türer", "Cabrio", "Clubman", "Countryman", "Paceman"],
    "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
    "Nissan": ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Navara"],
    "Opel": ["Adam", "Corsa", "Astra", "Insignia", "Meriva", "Zafira", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano"],
    "Peugeot": ["108", "208", "2008", "308", "3008", "508", "5008", "Partner", "Rifter", "Expert", "Boxer"],
    "Porsche": ["911", "Boxster", "Cayman", "Macan", "Cayenne", "Panamera"],
    "Renault": ["Twingo", "Clio", "Captur", "Megane", "Scenic", "Kadjar", "Arkana", "Austral", "Talisman", "Kangoo", "Trafic", "Master"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra"],
    "Skoda": ["Citigo", "Fabia", "Scala", "Rapid", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Yeti"],
    "Smart": ["fortwo", "forfour"],
    "Subaru": ["Impreza", "XV", "Forester", "Outback", "BRZ"],
    "Suzuki": ["Ignis", "Swift", "Vitara", "S-Cross", "Jimny"],
    "Toyota": ["Aygo", "Yaris", "Corolla", "Auris", "C-HR", "RAV4", "Supra", "GR86", "Hilux", "Land Cruiser", "Proace"],
    "Volkswagen": ["up!", "Polo", "Golf", "Scirocco", "Jetta", "T-Cross", "Taigo", "T-Roc", "Tiguan", "Touran", "Sharan", "Passat", "Arteon", "Touareg", "Caddy", "Transporter / Multivan", "Crafter", "Amarok"],
    "Volvo": ["V40", "V60", "V90", "S60", "S90", "XC40", "XC60", "XC90"]
  };

  // Auswahlhilfe für die häufigsten Modelle: Baureihe, Zeitraum, Motoren mit Serienleistung. Ohne Gewähr, Mert prüft vor jedem Angebot
  var MOTOREN = {
    "Audi|A1": [["8X", "2010–2018", ["1.0 TFSI 95 PS", "1.2 TFSI 86 PS", "1.4 TFSI 122 PS", "1.4 TFSI 150 PS", "1.4 TFSI 185 PS", "1.8 TFSI 192 PS", "S1 2.0 TFSI 231 PS", "1.4 TDI 90 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.6 TDI 116 PS", "2.0 TDI 143 PS"]], ["GB", "ab 2018", ["25 TFSI 95 PS", "30 TFSI 110 PS", "30 TFSI 116 PS", "35 TFSI 150 PS", "40 TFSI 200 PS", "40 TFSI 207 PS"]]],
    "Audi|A3": [["8P", "2003–2013", ["1.2 TFSI 105 PS", "1.4 TFSI 125 PS", "1.8 TFSI 160 PS", "2.0 TFSI 200 PS", "S3 2.0 TFSI 265 PS", "RS3 2.5 TFSI 340 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.9 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["8V", "2012–2020", ["1.0 TFSI 115 PS", "1.2 TFSI 110 PS", "1.4 TFSI 122 PS", "1.4 TFSI 125 PS", "1.4 TFSI 150 PS", "1.5 TFSI 150 PS", "1.8 TFSI 180 PS", "2.0 TFSI 190 PS", "S3 2.0 TFSI 300 PS", "S3 2.0 TFSI 310 PS", "RS3 2.5 TFSI 367 PS", "RS3 2.5 TFSI 400 PS", "1.6 TDI 110 PS", "1.6 TDI 116 PS", "2.0 TDI 150 PS", "2.0 TDI 184 PS"]], ["8Y", "ab 2020", ["30 TFSI 110 PS", "35 TFSI 150 PS", "40 TFSI 190 PS", "S3 2.0 TFSI 310 PS", "S3 2.0 TFSI 333 PS", "RS3 2.5 TFSI 400 PS", "30 TDI 116 PS", "35 TDI 150 PS"]]],
    "Audi|A4": [["B7", "2004–2008", ["1.8 T 163 PS", "2.0 TFSI 200 PS", "2.0 TFSI 220 PS", "3.2 FSI 255 PS", "1.9 TDI 115 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS", "2.5 TDI 163 PS", "2.7 TDI 180 PS", "3.0 TDI 204 PS", "3.0 TDI 233 PS", "S4 4.2 V8 344 PS", "RS4 4.2 V8 420 PS"]], ["B8 (8K)", "2007–2015", ["1.8 TFSI 120 PS", "1.8 TFSI 170 PS", "2.0 TFSI 211 PS", "2.0 TFSI 225 PS", "3.2 FSI 265 PS", "S4 3.0 TFSI 333 PS", "RS4 4.2 FSI 450 PS", "2.0 TDI 136 PS", "2.0 TDI 143 PS", "2.0 TDI 150 PS", "2.0 TDI 163 PS", "2.0 TDI 177 PS", "2.7 TDI 190 PS", "3.0 TDI 240 PS", "3.0 TDI 245 PS"]], ["B9 (8W)", "ab 2015", ["1.4 TFSI 150 PS", "2.0 TFSI 190 PS", "2.0 TFSI 204 PS", "2.0 TFSI 252 PS", "2.0 TFSI 265 PS", "S4 3.0 TFSI 354 PS", "RS4 2.9 TFSI 450 PS", "2.0 TDI 122 PS", "2.0 TDI 150 PS", "2.0 TDI 163 PS", "2.0 TDI 190 PS", "2.0 TDI 204 PS", "3.0 TDI 218 PS", "3.0 TDI 272 PS", "3.0 TDI 286 PS", "S4 TDI 347 PS", "S4 TDI 341 PS"]]],
    "Audi|A5": [["8T", "2007–2016", ["1.8 TFSI 170 PS", "1.8 TFSI 177 PS", "2.0 TFSI 211 PS", "2.0 TFSI 225 PS", "2.0 TFSI 230 PS", "3.2 FSI 265 PS", "S5 4.2 V8 354 PS", "S5 3.0 TFSI 333 PS", "RS5 4.2 FSI 450 PS", "2.0 TDI 143 PS", "2.0 TDI 150 PS", "2.0 TDI 177 PS", "2.0 TDI 190 PS", "2.7 TDI 190 PS", "3.0 TDI 240 PS", "3.0 TDI 245 PS"]], ["F5", "ab 2016", ["2.0 TFSI 190 PS", "2.0 TFSI 204 PS", "2.0 TFSI 252 PS", "2.0 TFSI 265 PS", "S5 3.0 TFSI 354 PS", "S5 TDI 347 PS", "S5 TDI 341 PS", "RS5 2.9 TFSI 450 PS", "2.0 TDI 150 PS", "2.0 TDI 163 PS", "2.0 TDI 190 PS", "2.0 TDI 204 PS", "3.0 TDI 218 PS", "3.0 TDI 286 PS"]]],
    "Audi|A6": [["C6 (4F)", "2004–2011", ["2.0 TFSI 170 PS", "2.8 FSI 220 PS", "3.0 TFSI 290 PS", "3.0 TFSI 300 PS", "S6 5.2 V10 435 PS", "RS6 5.0 V10 580 PS", "2.0 TDI 136 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS", "2.7 TDI 180 PS", "2.7 TDI 190 PS", "3.0 TDI 225 PS", "3.0 TDI 233 PS", "3.0 TDI 240 PS"]], ["C7 (4G)", "2011–2018", ["2.0 TFSI 180 PS", "2.0 TFSI 252 PS", "3.0 TFSI 300 PS", "3.0 TFSI 310 PS", "3.0 TFSI 333 PS", "S6 4.0 TFSI 420 PS", "S6 4.0 TFSI 450 PS", "RS6 4.0 TFSI 560 PS", "RS6 4.0 TFSI 605 PS", "2.0 TDI 150 PS", "2.0 TDI 177 PS", "2.0 TDI 190 PS", "3.0 TDI 204 PS", "3.0 TDI 218 PS", "3.0 TDI 245 PS", "3.0 TDI 272 PS", "3.0 BiTDI 313 PS", "3.0 BiTDI 320 PS", "3.0 BiTDI 326 PS"]], ["C8 (4A)", "ab 2018", ["40 TFSI 204 PS", "45 TFSI 245 PS", "45 TFSI 265 PS", "55 TFSI 340 PS", "S6 TDI 349 PS", "S6 TDI 344 PS", "RS6 4.0 TFSI 600 PS", "RS6 4.0 TFSI 630 PS", "35 TDI 163 PS", "40 TDI 204 PS", "45 TDI 231 PS", "50 TDI 286 PS"]]],
    "Audi|A7": [["4G", "2010–2018", ["3.0 TFSI 300 PS", "3.0 TFSI 310 PS", "3.0 TFSI 333 PS", "S7 4.0 TFSI 420 PS", "S7 4.0 TFSI 450 PS", "RS7 4.0 TFSI 560 PS", "RS7 4.0 TFSI 605 PS", "3.0 TDI 204 PS", "3.0 TDI 218 PS", "3.0 TDI 245 PS", "3.0 TDI 272 PS", "3.0 BiTDI 313 PS", "3.0 BiTDI 320 PS", "3.0 BiTDI 326 PS"]], ["4K", "ab 2018", ["45 TFSI 245 PS", "45 TFSI 265 PS", "55 TFSI 340 PS", "S7 TDI 349 PS", "S7 TDI 344 PS", "RS7 4.0 TFSI 600 PS", "RS7 4.0 TFSI 630 PS", "40 TDI 204 PS", "45 TDI 231 PS", "50 TDI 286 PS"]]],
    "Audi|A8": [["D4", "2010–2017", ["3.0 TFSI 290 PS", "3.0 TFSI 310 PS", "4.0 TFSI 435 PS", "S8 4.0 TFSI 520 PS", "S8 4.0 TFSI 605 PS", "3.0 TDI 250 PS", "3.0 TDI 258 PS", "3.0 TDI 262 PS", "4.2 TDI 350 PS", "4.2 TDI 385 PS"]], ["D5", "ab 2017", ["55 TFSI 340 PS", "60 TFSI 460 PS", "S8 4.0 TFSI 571 PS", "50 TDI 286 PS"]]],
    "Audi|Q2": [["GA", "ab 2016", ["1.0 TFSI 116 PS", "1.4 TFSI 150 PS", "1.5 TFSI 150 PS", "2.0 TFSI 190 PS", "SQ2 2.0 TFSI 300 PS", "1.6 TDI 116 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS"]]],
    "Audi|Q3": [["8U", "2011–2018", ["1.4 TFSI 125 PS", "1.4 TFSI 150 PS", "2.0 TFSI 170 PS", "2.0 TFSI 180 PS", "2.0 TFSI 211 PS", "2.0 TFSI 220 PS", "RS Q3 2.5 TFSI 310 PS", "RS Q3 2.5 TFSI 340 PS", "RS Q3 2.5 TFSI 367 PS", "2.0 TDI 120 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS", "2.0 TDI 177 PS", "2.0 TDI 184 PS"]], ["F3", "ab 2018", ["35 TFSI 150 PS", "40 TFSI 190 PS", "45 TFSI 230 PS", "45 TFSI 245 PS", "RS Q3 2.5 TFSI 400 PS", "35 TDI 150 PS", "40 TDI 190 PS"]]],
    "Audi|Q5": [["8R", "2008–2017", ["2.0 TFSI 180 PS", "2.0 TFSI 211 PS", "2.0 TFSI 225 PS", "2.0 TFSI 230 PS", "3.2 FSI 270 PS", "3.0 TFSI 272 PS", "SQ5 3.0 TFSI 354 PS", "2.0 TDI 143 PS", "2.0 TDI 150 PS", "2.0 TDI 170 PS", "2.0 TDI 177 PS", "2.0 TDI 190 PS", "3.0 TDI 240 PS", "3.0 TDI 245 PS", "3.0 TDI 258 PS", "SQ5 3.0 TDI 313 PS", "SQ5 3.0 TDI 326 PS", "SQ5 3.0 TDI 340 PS"]], ["FY", "ab 2017", ["40 TFSI 204 PS", "45 TFSI 249 PS", "45 TFSI 265 PS", "SQ5 3.0 TFSI 354 PS", "35 TDI 163 PS", "40 TDI 190 PS", "40 TDI 204 PS", "50 TDI 286 PS", "SQ5 TDI 347 PS", "SQ5 TDI 341 PS"]]],
    "Audi|Q7": [["4L", "2006–2015", ["3.6 FSI 280 PS", "4.2 FSI 350 PS", "3.0 TDI 233 PS", "3.0 TDI 240 PS", "3.0 TDI 245 PS", "4.2 TDI 326 PS", "4.2 TDI 340 PS", "6.0 V12 TDI 500 PS"]], ["4M", "ab 2015", ["45 TFSI 252 PS", "55 TFSI 340 PS", "SQ7 4.0 TFSI 507 PS", "3.0 TDI 218 PS", "3.0 TDI 272 PS", "45 TDI 231 PS", "50 TDI 286 PS", "SQ7 4.0 TDI 435 PS"]]],
    "Audi|Q8": [["4M", "ab 2018", ["55 TFSI 340 PS", "SQ8 4.0 TFSI 507 PS", "RS Q8 4.0 TFSI 600 PS", "50 TDI 286 PS", "SQ8 4.0 TDI 435 PS"]]],
    "Audi|TT": [["8J", "2006–2014", ["1.8 TFSI 160 PS", "2.0 TFSI 200 PS", "2.0 TFSI 211 PS", "TTS 2.0 TFSI 272 PS", "TT RS 2.5 TFSI 340 PS", "TT RS 2.5 TFSI 360 PS", "2.0 TDI 170 PS"]], ["8S", "2014–2023", ["1.8 TFSI 180 PS", "2.0 TFSI 197 PS", "2.0 TFSI 230 PS", "2.0 TFSI 245 PS", "TTS 2.0 TFSI 310 PS", "TTS 2.0 TFSI 320 PS", "TT RS 2.5 TFSI 400 PS", "2.0 TDI 184 PS"]]],
    "BMW|1er": [["E81 / E82 / E87 / E88", "2004–2013", ["116i 115 PS", "116i 122 PS", "118i 136 PS", "118i 143 PS", "120i 156 PS", "120i 170 PS", "125i 218 PS", "130i 265 PS", "135i 306 PS", "1M 340 PS", "116d 116 PS", "118d 122 PS", "118d 143 PS", "120d 163 PS", "120d 177 PS", "123d 204 PS"]], ["F20 / F21", "2011–2019", ["114i 102 PS", "116i 109 PS", "116i 136 PS", "118i 136 PS", "118i 170 PS", "120i 177 PS", "120i 184 PS", "125i 218 PS", "125i 224 PS", "M135i 320 PS", "M135i 326 PS", "M140i 340 PS", "114d 95 PS", "116d 116 PS", "118d 143 PS", "118d 150 PS", "120d 184 PS", "120d 190 PS", "125d 218 PS", "125d 224 PS"]], ["F40", "ab 2019", ["116i 109 PS", "118i 136 PS", "118i 140 PS", "120i 178 PS", "128ti 265 PS", "M135i 306 PS", "116d 116 PS", "118d 150 PS", "120d 190 PS"]]],
    "BMW|2er": [["F22 / F23 Coupé und Cabrio", "2014–2021", ["218i 136 PS", "220i 184 PS", "228i 245 PS", "230i 252 PS", "M235i 326 PS", "M240i 340 PS", "218d 143 PS", "218d 150 PS", "220d 184 PS", "220d 190 PS", "225d 218 PS", "225d 224 PS"]], ["F45 / F46 Active / Gran Tourer", "2014–2022", ["216i 109 PS", "218i 136 PS", "218i 140 PS", "220i 192 PS", "225i 231 PS", "216d 116 PS", "218d 150 PS", "220d 190 PS"]], ["F44 Gran Coupé", "ab 2019", ["218i 136 PS", "218i 140 PS", "220i 178 PS", "M235i 306 PS", "218d 150 PS", "220d 190 PS"]], ["G42 Coupé", "ab 2021", ["220i 184 PS", "230i 245 PS", "M240i 374 PS", "220d 190 PS"]]],
    "BMW|3er": [["E46", "1998–2006", ["316i 105 PS", "316i 115 PS", "318i 118 PS", "318i 143 PS", "320i 150 PS", "320i 170 PS", "325i 192 PS", "330i 231 PS", "318d 115 PS", "318d 116 PS", "320d 136 PS", "320d 150 PS", "330d 184 PS", "330d 204 PS"]], ["E90 / E91 / E92 / E93", "2005–2013", ["318i 143 PS", "320i 170 PS", "325i 218 PS", "330i 272 PS", "335i 306 PS", "316d 116 PS", "318d 143 PS", "320d 163 PS", "320d 177 PS", "320d 184 PS", "325d 204 PS", "330d 231 PS", "330d 245 PS", "335d 286 PS"]], ["F30 / F31 / F34", "2012–2019", ["316i 136 PS", "318i 136 PS", "320i 184 PS", "328i 245 PS", "330i 252 PS", "335i 306 PS", "340i 326 PS", "330e 252 PS", "316d 116 PS", "318d 143 PS", "318d 150 PS", "320d 184 PS", "320d 190 PS", "325d 218 PS", "325d 224 PS", "330d 258 PS", "335d 313 PS"]], ["G20 / G21", "ab 2019", ["318i 156 PS", "320i 184 PS", "330i 245 PS", "330i 258 PS", "M340i 374 PS", "320e 204 PS", "330e 292 PS", "318d 150 PS", "320d 190 PS", "330d 265 PS", "330d 286 PS", "M340d 340 PS"]]],
    "BMW|4er": [["F32 / F33 / F36", "2013–2020", ["418i 136 PS", "420i 184 PS", "428i 245 PS", "430i 252 PS", "435i 306 PS", "440i 326 PS", "418d 143 PS", "418d 150 PS", "420d 184 PS", "420d 190 PS", "425d 218 PS", "425d 224 PS", "430d 258 PS", "435d 313 PS"]], ["G22 / G23 / G26", "ab 2020", ["420i 184 PS", "430i 245 PS", "430i 258 PS", "M440i 374 PS", "420d 190 PS", "430d 286 PS", "M440d 340 PS"]]],
    "BMW|5er": [["E60 / E61", "2003–2010", ["520i 170 PS", "523i 190 PS", "523i 204 PS", "525i 218 PS", "530i 258 PS", "530i 272 PS", "540i 306 PS", "550i 367 PS", "520d 163 PS", "520d 177 PS", "525d 177 PS", "525d 197 PS", "530d 218 PS", "530d 231 PS", "530d 235 PS", "535d 272 PS", "535d 286 PS"]], ["F10 / F11", "2010–2017", ["520i 184 PS", "528i 245 PS", "535i 306 PS", "550i 407 PS", "550i 449 PS", "518d 143 PS", "518d 150 PS", "520d 184 PS", "520d 190 PS", "525d 218 PS", "530d 245 PS", "530d 258 PS", "535d 299 PS", "535d 313 PS", "M550d 381 PS"]], ["G30 / G31", "2017–2023", ["520i 184 PS", "530i 252 PS", "540i 340 PS", "M550i 462 PS", "M550i 530 PS", "530e 252 PS", "530e 292 PS", "520d 190 PS", "525d 231 PS", "530d 265 PS", "530d 286 PS", "540d 320 PS", "540d 340 PS", "M550d 400 PS"]]],
    "BMW|6er": [["F06 / F12 / F13", "2011–2018", ["640i 320 PS", "650i 407 PS", "650i 450 PS", "640d 313 PS"]], ["G32 Gran Turismo", "2017–2023", ["630i 258 PS", "640i 340 PS", "620d 190 PS", "630d 265 PS", "630d 286 PS", "640d 320 PS", "640d 340 PS"]]],
    "BMW|7er": [["F01 / F02", "2008–2015", ["730i 258 PS", "740i 320 PS", "740i 326 PS", "750i 407 PS", "750i 450 PS", "730d 245 PS", "730d 258 PS", "740d 306 PS", "740d 313 PS", "750d 381 PS"]], ["G11 / G12", "2015–2022", ["730i 258 PS", "740i 326 PS", "740i 333 PS", "750i 450 PS", "750i 530 PS", "740e 326 PS", "740e 394 PS", "730d 265 PS", "730d 286 PS", "740d 320 PS", "740d 340 PS", "750d 400 PS"]]],
    "BMW|X1": [["E84", "2009–2015", ["18i 150 PS", "20i 184 PS", "25i 218 PS", "28i 245 PS", "16d 116 PS", "18d 143 PS", "20d 177 PS", "20d 184 PS", "23d 204 PS", "25d 218 PS"]], ["F48", "2015–2022", ["18i 136 PS", "18i 140 PS", "20i 192 PS", "20i 178 PS", "25i 231 PS", "25e 220 PS", "16d 116 PS", "18d 150 PS", "20d 190 PS", "25d 231 PS"]], ["U11", "ab 2022", ["18i 136 PS", "20i 204 PS", "18d 150 PS", "20d 163 PS", "23d 211 PS"]]],
    "BMW|X2": [["F39", "2018–2023", ["18i 136 PS", "18i 140 PS", "20i 192 PS", "20i 178 PS", "M35i 306 PS", "16d 116 PS", "18d 150 PS", "20d 190 PS", "25d 231 PS"]]],
    "BMW|X3": [["E83", "2004–2010", ["2.0i 150 PS", "2.5si 218 PS", "3.0si 272 PS", "2.0d 150 PS", "2.0d 177 PS", "3.0d 218 PS", "3.0sd 286 PS"]], ["F25", "2010–2017", ["20i 184 PS", "28i 245 PS", "35i 306 PS", "18d 143 PS", "18d 150 PS", "20d 184 PS", "20d 190 PS", "30d 258 PS", "35d 313 PS"]], ["G01", "2017–2024", ["20i 184 PS", "30i 252 PS", "M40i 360 PS", "30e 292 PS", "18d 150 PS", "20d 190 PS", "30d 265 PS", "30d 286 PS", "M40d 326 PS", "M40d 340 PS"]]],
    "BMW|X4": [["F26", "2014–2018", ["20i 184 PS", "28i 245 PS", "35i 306 PS", "20d 190 PS", "30d 258 PS", "35d 313 PS"]], ["G02", "2018–2025", ["20i 184 PS", "30i 252 PS", "M40i 360 PS", "20d 190 PS", "30d 265 PS", "30d 286 PS", "M40d 326 PS", "M40d 340 PS"]]],
    "BMW|X5": [["E70", "2007–2013", ["3.0si 272 PS", "35i 306 PS", "4.8i 355 PS", "50i 407 PS", "3.0d 235 PS", "30d 245 PS", "35d 286 PS", "40d 306 PS", "M50d 381 PS"]], ["F15", "2013–2018", ["35i 306 PS", "50i 450 PS", "40e 313 PS", "25d 218 PS", "25d 231 PS", "30d 258 PS", "40d 313 PS", "M50d 381 PS"]], ["G05", "ab 2018", ["40i 340 PS", "40i 381 PS", "M50i 530 PS", "45e 394 PS", "50e 489 PS", "25d 231 PS", "30d 265 PS", "30d 286 PS", "30d 298 PS", "40d 340 PS", "40d 352 PS", "M50d 400 PS"]]],
    "BMW|X6": [["E71", "2008–2014", ["35i 306 PS", "50i 407 PS", "30d 235 PS", "30d 245 PS", "35d 286 PS", "40d 306 PS", "M50d 381 PS"]], ["F16", "2014–2019", ["35i 306 PS", "50i 450 PS", "30d 258 PS", "40d 313 PS", "M50d 381 PS"]], ["G06", "ab 2019", ["40i 340 PS", "40i 381 PS", "M50i 530 PS", "30d 265 PS", "30d 286 PS", "30d 298 PS", "40d 340 PS", "40d 352 PS", "M50d 400 PS"]]],
    "BMW|X7": [["G07", "ab 2019", ["40i 340 PS", "40i 381 PS", "M50i 530 PS", "30d 265 PS", "30d 298 PS", "40d 340 PS", "40d 352 PS", "M50d 400 PS"]]],
    "BMW|Z4": [["E89", "2009–2016", ["18i 156 PS", "20i 184 PS", "23i 204 PS", "28i 245 PS", "30i 258 PS", "35i 306 PS", "35is 340 PS"]], ["G29", "ab 2018", ["20i 197 PS", "30i 258 PS", "M40i 340 PS"]]],
    "BMW|M2": [["F87", "2016–2021", ["M2 370 PS", "M2 Competition 410 PS", "M2 CS 450 PS"]], ["G87", "ab 2023", ["M2 460 PS", "M2 480 PS"]]],
    "BMW|M3": [["E46", "2000–2006", ["M3 343 PS"]], ["E90 / E92 / E93", "2007–2013", ["M3 4.0 V8 420 PS"]], ["F80", "2014–2018", ["M3 431 PS", "M3 Competition 450 PS", "M3 CS 460 PS"]], ["G80 / G81", "ab 2021", ["M3 480 PS", "M3 Competition 510 PS"]]],
    "BMW|M4": [["F82 / F83", "2014–2020", ["M4 431 PS", "M4 Competition 450 PS", "M4 CS 460 PS"]], ["G82 / G83", "ab 2021", ["M4 480 PS", "M4 Competition 510 PS", "M4 Competition 530 PS"]]],
    "BMW|M5": [["E60 / E61", "2005–2010", ["M5 5.0 V10 507 PS"]], ["F10", "2011–2016", ["M5 560 PS", "M5 Competition 575 PS", "M5 Competition 600 PS"]], ["F90", "2017–2023", ["M5 600 PS", "M5 Competition 625 PS", "M5 CS 635 PS"]]],
    "Mercedes-Benz|A-Klasse": [["W176", "2012–2018", ["A 160 102 PS", "A 180 122 PS", "A 200 156 PS", "A 220 184 PS", "A 250 211 PS", "A 250 218 PS", "A 45 AMG 360 PS", "A 45 AMG 381 PS", "A 160 d 90 PS", "A 180 d 109 PS", "A 200 d 136 PS", "A 220 d 177 PS"]], ["W177", "ab 2018", ["A 180 136 PS", "A 200 163 PS", "A 220 190 PS", "A 250 224 PS", "A 250 e 218 PS", "A 35 AMG 306 PS", "A 45 S AMG 421 PS", "A 180 d 116 PS", "A 200 d 150 PS", "A 220 d 190 PS"]]],
    "Mercedes-Benz|B-Klasse": [["W246", "2011–2018", ["B 180 122 PS", "B 200 156 PS", "B 220 184 PS", "B 250 211 PS", "B 180 d 109 PS", "B 200 d 136 PS", "B 220 d 177 PS"]], ["W247", "ab 2018", ["B 180 136 PS", "B 200 163 PS", "B 250 224 PS", "B 180 d 116 PS", "B 200 d 150 PS", "B 220 d 190 PS"]]],
    "Mercedes-Benz|CLA": [["C117 / X117", "2013–2019", ["CLA 180 122 PS", "CLA 200 156 PS", "CLA 220 184 PS", "CLA 250 211 PS", "CLA 250 218 PS", "CLA 45 AMG 360 PS", "CLA 45 AMG 381 PS", "CLA 180 d 109 PS", "CLA 200 d 136 PS", "CLA 220 d 177 PS"]], ["C118 / X118", "ab 2019", ["CLA 180 136 PS", "CLA 200 163 PS", "CLA 220 190 PS", "CLA 250 224 PS", "CLA 35 AMG 306 PS", "CLA 45 S AMG 421 PS", "CLA 180 d 116 PS", "CLA 200 d 150 PS", "CLA 220 d 190 PS"]]],
    "Mercedes-Benz|C-Klasse": [["W203 / S203", "2000–2007", ["C 180 Kompressor 143 PS", "C 200 Kompressor 163 PS", "C 230 204 PS", "C 280 231 PS", "C 350 272 PS", "C 200 CDI 122 PS", "C 220 CDI 150 PS", "C 320 CDI 224 PS"]], ["W204 / S204", "2007–2014", ["C 180 156 PS", "C 200 184 PS", "C 250 204 PS", "C 350 306 PS", "C 63 AMG 457 PS", "C 63 AMG 487 PS", "C 200 CDI 136 PS", "C 220 CDI 170 PS", "C 250 CDI 204 PS", "C 350 CDI 265 PS"]], ["W205 / S205", "2014–2021", ["C 180 156 PS", "C 200 184 PS", "C 300 245 PS", "C 300 258 PS", "C 43 AMG 367 PS", "C 43 AMG 390 PS", "C 63 AMG 476 PS", "C 63 AMG 510 PS", "C 200 d 160 PS", "C 220 d 170 PS", "C 220 d 194 PS", "C 250 d 204 PS", "C 300 d 245 PS"]], ["W206 / S206", "ab 2021", ["C 200 204 PS", "C 300 258 PS", "C 43 AMG 408 PS", "C 220 d 200 PS", "C 300 d 265 PS"]]],
    "Mercedes-Benz|CLS": [["C218 / X218", "2011–2018", ["CLS 350 306 PS", "CLS 400 333 PS", "CLS 500 408 PS", "CLS 63 AMG 525 PS", "CLS 63 AMG 557 PS", "CLS 250 d 204 PS", "CLS 350 d 258 PS"]], ["C257", "ab 2018", ["CLS 300 258 PS", "CLS 350 299 PS", "CLS 450 367 PS", "CLS 53 AMG 435 PS", "CLS 220 d 194 PS", "CLS 300 d 265 PS", "CLS 400 d 340 PS"]]],
    "Mercedes-Benz|E-Klasse": [["W211 / S211", "2002–2009", ["E 200 Kompressor 163 PS", "E 200 Kompressor 184 PS", "E 280 231 PS", "E 350 272 PS", "E 500 306 PS", "E 500 388 PS", "E 200 CDI 122 PS", "E 200 CDI 136 PS", "E 220 CDI 150 PS", "E 220 CDI 170 PS", "E 270 CDI 177 PS", "E 280 CDI 190 PS", "E 320 CDI 204 PS", "E 320 CDI 224 PS"]], ["W212 / S212", "2009–2016", ["E 200 184 PS", "E 250 204 PS", "E 250 211 PS", "E 350 306 PS", "E 63 AMG 525 PS", "E 63 AMG 557 PS", "E 63 AMG 585 PS", "E 200 CDI 136 PS", "E 220 CDI 170 PS", "E 250 CDI 204 PS", "E 350 CDI 231 PS", "E 350 CDI 252 PS", "E 350 CDI 265 PS"]], ["W213 / S213", "2016–2023", ["E 200 184 PS", "E 200 197 PS", "E 300 245 PS", "E 300 258 PS", "E 53 AMG 435 PS", "E 63 S AMG 612 PS", "E 220 d 194 PS", "E 300 d 245 PS", "E 300 d 265 PS", "E 350 d 258 PS", "E 350 d 286 PS", "E 400 d 340 PS", "E 400 d 330 PS"]], ["W214", "ab 2023", ["E 200 204 PS", "E 300 e 313 PS", "E 220 d 197 PS"]]],
    "Mercedes-Benz|S-Klasse": [["W221", "2005–2013", ["S 350 272 PS", "S 350 306 PS", "S 500 388 PS", "S 500 435 PS", "S 320 CDI 235 PS", "S 350 CDI 235 PS", "S 350 CDI 258 PS"]], ["W222", "2013–2020", ["S 400 333 PS", "S 500 455 PS", "S 560 469 PS", "S 350 d 258 PS", "S 350 d 286 PS", "S 400 d 340 PS"]], ["W223", "ab 2020", ["S 450 367 PS", "S 500 435 PS", "S 350 d 286 PS", "S 400 d 330 PS"]]],
    "Mercedes-Benz|GLA": [["X156", "2014–2019", ["GLA 180 122 PS", "GLA 200 156 PS", "GLA 220 184 PS", "GLA 250 211 PS", "GLA 45 AMG 360 PS", "GLA 45 AMG 381 PS", "GLA 180 d 109 PS", "GLA 200 d 136 PS", "GLA 220 d 170 PS", "GLA 220 d 177 PS"]], ["H247", "ab 2020", ["GLA 200 163 PS", "GLA 250 224 PS", "GLA 35 AMG 306 PS", "GLA 45 S AMG 421 PS", "GLA 180 d 116 PS", "GLA 200 d 150 PS", "GLA 220 d 190 PS"]]],
    "Mercedes-Benz|GLB": [["X247", "ab 2019", ["GLB 200 163 PS", "GLB 250 224 PS", "GLB 35 AMG 306 PS", "GLB 180 d 116 PS", "GLB 200 d 150 PS", "GLB 220 d 190 PS"]]],
    "Mercedes-Benz|GLC": [["X253 / C253", "2015–2022", ["GLC 200 184 PS", "GLC 200 197 PS", "GLC 250 211 PS", "GLC 300 245 PS", "GLC 300 258 PS", "GLC 43 AMG 367 PS", "GLC 43 AMG 390 PS", "GLC 63 AMG 476 PS", "GLC 63 AMG 510 PS", "GLC 200 d 163 PS", "GLC 220 d 170 PS", "GLC 220 d 194 PS", "GLC 250 d 204 PS", "GLC 300 d 245 PS", "GLC 350 d 258 PS"]], ["X254", "ab 2022", ["GLC 200 204 PS", "GLC 300 258 PS", "GLC 220 d 197 PS", "GLC 300 d 269 PS"]]],
    "Mercedes-Benz|GLE / M-Klasse": [["W166 (ML / GLE)", "2011–2019", ["ML 250 BlueTEC 204 PS", "ML 350 BlueTEC 258 PS", "GLE 350 d 258 PS", "ML 350 306 PS", "GLE 400 333 PS", "GLE 43 AMG 367 PS", "GLE 43 AMG 390 PS", "GLE 63 AMG 525 PS", "GLE 63 AMG 557 PS"]], ["V167", "ab 2019", ["GLE 450 367 PS", "GLE 450 381 PS", "GLE 53 AMG 435 PS", "GLE 300 d 245 PS", "GLE 300 d 269 PS", "GLE 350 d 272 PS", "GLE 400 d 330 PS"]]],
    "Mercedes-Benz|GLS": [["X166", "2015–2019", ["GLS 350 d 258 PS", "GLS 400 333 PS", "GLS 500 455 PS", "GLS 63 AMG 585 PS"]], ["X167", "ab 2019", ["GLS 450 367 PS", "GLS 450 381 PS", "GLS 580 489 PS", "GLS 350 d 286 PS", "GLS 400 d 330 PS"]]],
    "Mercedes-Benz|G-Klasse": [["W463", "2012–2018", ["G 350 d 245 PS", "G 500 421 PS", "G 63 AMG 544 PS", "G 63 AMG 571 PS"]], ["W463A", "ab 2018", ["G 350 d 286 PS", "G 400 d 330 PS", "G 500 422 PS", "G 63 AMG 585 PS"]]],
    "Mercedes-Benz|Viano": [["W639", "2003–2014", ["2.0 CDI 109 PS", "2.0 CDI 136 PS", "2.2 CDI 150 PS", "2.2 CDI 163 PS", "3.0 CDI 204 PS", "3.0 CDI 224 PS", "3.5 258 PS"]]],
    "Mercedes-Benz|V-Klasse": [["W447", "ab 2014", ["V 200 d 136 PS", "V 220 d 163 PS", "V 250 d 190 PS", "V 300 d 239 PS"]]],
    "Mercedes-Benz|Vito": [["W639", "2003–2014", ["109 CDI 88 PS", "109 CDI 95 PS", "111 CDI 109 PS", "111 CDI 116 PS", "113 CDI 136 PS", "115 CDI 150 PS", "116 CDI 163 PS", "120 CDI 204 PS", "122 CDI 224 PS"]], ["W447", "ab 2014", ["109 CDI 88 PS", "111 CDI 114 PS", "114 CDI 136 PS", "116 CDI 163 PS", "119 CDI 190 PS", "124 CDI 237 PS"]]],
    "Mercedes-Benz|Sprinter": [["906 (NCV3)", "2006–2018", ["210 / 310 / 510 CDI 95 PS", "213 / 313 / 513 CDI 129 PS", "216 / 316 / 516 CDI 163 PS", "219 / 319 / 519 CDI 190 PS"]], ["907 / 910", "ab 2018", ["211 / 311 CDI 114 PS", "214 / 314 CDI 143 PS", "216 / 316 CDI 163 PS", "219 / 319 CDI 190 PS"]]],
    "Volkswagen|up!": [["AA", "2011–2023", ["1.0 60 PS", "1.0 65 PS", "1.0 75 PS", "1.0 TSI 90 PS", "GTI 1.0 TSI 115 PS"]]],
    "Volkswagen|Polo": [["6R / 6C", "2009–2017", ["1.2 TSI 90 PS", "1.2 TSI 105 PS", "1.0 TSI 95 PS", "1.0 TSI 110 PS", "GTI 1.4 TSI 180 PS", "GTI 1.8 TSI 192 PS", "1.2 TDI 75 PS", "1.4 TDI 75 PS", "1.4 TDI 90 PS", "1.4 TDI 105 PS", "1.6 TDI 75 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS"]], ["AW", "ab 2017", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "GTI 2.0 TSI 200 PS", "GTI 2.0 TSI 207 PS", "1.6 TDI 80 PS", "1.6 TDI 95 PS"]]],
    "Volkswagen|Golf": [["Golf 5", "2003–2008", ["1.4 TSI 122 PS", "1.4 TSI 140 PS", "1.4 TSI 170 PS", "1.6 FSI 115 PS", "2.0 FSI 150 PS", "GTI 2.0 TFSI 200 PS", "GTI 2.0 TFSI 230 PS", "R32 3.2 V6 250 PS", "1.9 TDI 90 PS", "1.9 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["Golf 6", "2008–2012", ["1.2 TSI 105 PS", "1.4 TSI 122 PS", "1.4 TSI 160 PS", "GTI 2.0 TSI 210 PS", "GTI 2.0 TSI 235 PS", "R 2.0 TSI 270 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "2.0 TDI 110 PS", "2.0 TDI 140 PS", "GTD 2.0 TDI 170 PS"]], ["Golf 7", "2012–2019", ["1.0 TSI 110 PS", "1.2 TSI 85 PS", "1.2 TSI 105 PS", "1.2 TSI 110 PS", "1.4 TSI 122 PS", "1.4 TSI 125 PS", "1.4 TSI 140 PS", "1.4 TSI 150 PS", "1.5 TSI 130 PS", "1.5 TSI 150 PS", "GTE 204 PS", "GTI 2.0 TSI 220 PS", "GTI 2.0 TSI 230 PS", "GTI 2.0 TSI 245 PS", "GTI TCR 290 PS", "R 2.0 TSI 300 PS", "R 2.0 TSI 310 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.6 TDI 110 PS", "1.6 TDI 115 PS", "2.0 TDI 150 PS", "GTD 2.0 TDI 184 PS"]], ["Golf 8", "ab 2020", ["1.0 TSI 110 PS", "1.5 TSI 130 PS", "1.5 TSI 150 PS", "1.5 eTSI 130 PS", "1.5 eTSI 150 PS", "eHybrid 204 PS", "GTE 245 PS", "GTI 2.0 TSI 245 PS", "GTI 2.0 TSI 265 PS", "GTI Clubsport 300 PS", "R 2.0 TSI 320 PS", "R 2.0 TSI 333 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "GTD 2.0 TDI 200 PS"]]],
    "Volkswagen|Scirocco": [["13", "2008–2017", ["1.4 TSI 122 PS", "1.4 TSI 125 PS", "1.4 TSI 160 PS", "2.0 TSI 200 PS", "2.0 TSI 211 PS", "2.0 TSI 220 PS", "R 2.0 TSI 265 PS", "R 2.0 TSI 280 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS", "2.0 TDI 170 PS", "2.0 TDI 184 PS"]]],
    "Volkswagen|T-Cross": [["C1", "ab 2019", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "1.6 TDI 95 PS"]]],
    "Volkswagen|T-Roc": [["A1", "ab 2017", ["1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "R 2.0 TSI 300 PS", "1.6 TDI 115 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS"]]],
    "Volkswagen|Tiguan": [["5N", "2007–2016", ["1.4 TSI 122 PS", "1.4 TSI 150 PS", "1.4 TSI 160 PS", "2.0 TSI 170 PS", "2.0 TSI 180 PS", "2.0 TSI 200 PS", "2.0 TSI 210 PS", "2.0 TDI 110 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS", "2.0 TDI 170 PS", "2.0 TDI 177 PS", "2.0 TDI 184 PS"]], ["AD1", "2016–2024", ["1.4 TSI 125 PS", "1.4 TSI 150 PS", "1.5 TSI 130 PS", "1.5 TSI 150 PS", "2.0 TSI 180 PS", "2.0 TSI 190 PS", "2.0 TSI 220 PS", "2.0 TSI 230 PS", "R 2.0 TSI 320 PS", "eHybrid 245 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS", "2.0 TDI 200 PS", "2.0 TDI 240 PS"]], ["CT1", "ab 2024", ["1.5 eTSI 130 PS", "1.5 eTSI 150 PS", "2.0 TSI 204 PS", "2.0 TSI 265 PS", "2.0 TDI 150 PS", "2.0 TDI 193 PS"]]],
    "Volkswagen|Touran": [["1T", "2003–2015", ["1.4 TSI 140 PS", "1.4 TSI 150 PS", "1.4 TSI 170 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.9 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["5T", "ab 2015", ["1.0 TSI 115 PS", "1.2 TSI 110 PS", "1.4 TSI 150 PS", "1.5 TSI 150 PS", "1.6 TDI 110 PS", "1.6 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS"]]],
    "Volkswagen|Sharan": [["7N", "2010–2022", ["1.4 TSI 150 PS", "2.0 TSI 200 PS", "2.0 TSI 220 PS", "2.0 TDI 115 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS", "2.0 TDI 170 PS", "2.0 TDI 177 PS", "2.0 TDI 184 PS"]]],
    "Volkswagen|Passat": [["B6", "2005–2010", ["1.4 TSI 122 PS", "1.4 TSI 150 PS", "1.8 TSI 160 PS", "2.0 TFSI 200 PS", "3.2 V6 250 PS", "R36 3.6 V6 300 PS", "1.9 TDI 105 PS", "2.0 TDI 110 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["B7", "2010–2014", ["1.4 TSI 122 PS", "1.8 TSI 160 PS", "2.0 TSI 211 PS", "1.6 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["B8", "2014–2023", ["1.4 TSI 125 PS", "1.4 TSI 150 PS", "1.5 TSI 150 PS", "1.8 TSI 180 PS", "2.0 TSI 220 PS", "2.0 TSI 272 PS", "2.0 TSI 280 PS", "GTE 218 PS", "1.6 TDI 120 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS", "2.0 TDI 200 PS", "2.0 BiTDI 240 PS"]]],
    "Volkswagen|Arteon": [["3H", "ab 2017", ["1.5 TSI 150 PS", "2.0 TSI 190 PS", "2.0 TSI 280 PS", "R 2.0 TSI 320 PS", "eHybrid 218 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS", "2.0 TDI 200 PS", "2.0 TDI 240 PS"]]],
    "Volkswagen|Touareg": [["7L", "2002–2010", ["3.2 V6 220 PS", "3.2 V6 241 PS", "3.6 V6 280 PS", "4.2 V8 310 PS", "4.2 V8 350 PS", "2.5 TDI 174 PS", "3.0 TDI 225 PS", "3.0 TDI 240 PS", "5.0 V10 TDI 313 PS", "5.0 V10 TDI 351 PS"]], ["7P", "2010–2018", ["3.6 V6 249 PS", "3.6 V6 280 PS", "Hybrid 333 PS", "3.0 TDI 204 PS", "3.0 TDI 240 PS", "3.0 TDI 245 PS", "3.0 TDI 262 PS", "4.2 V8 TDI 340 PS"]], ["CR", "ab 2018", ["3.0 TSI 340 PS", "R eHybrid 462 PS", "3.0 TDI 231 PS", "3.0 TDI 286 PS", "4.0 V8 TDI 421 PS"]]],
    "Volkswagen|Caddy": [["2K", "2003–2020", ["1.2 TSI 84 PS", "1.2 TSI 105 PS", "1.4 TSI 125 PS", "1.6 TDI 75 PS", "1.6 TDI 102 PS", "1.9 TDI 105 PS", "2.0 TDI 75 PS", "2.0 TDI 102 PS", "2.0 TDI 110 PS", "2.0 TDI 122 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS"]], ["SB", "ab 2020", ["1.5 TSI 114 PS", "2.0 TDI 75 PS", "2.0 TDI 102 PS", "2.0 TDI 122 PS"]]],
    "Volkswagen|Transporter / Multivan": [["T5", "2003–2015", ["2.0 TDI 84 PS", "2.0 TDI 102 PS", "2.0 TDI 140 PS", "2.0 BiTDI 180 PS", "2.5 TDI 130 PS", "2.5 TDI 174 PS"]], ["T6", "2015–2019", ["2.0 TDI 84 PS", "2.0 TDI 102 PS", "2.0 TDI 114 PS", "2.0 TDI 150 PS", "2.0 BiTDI 204 PS"]], ["T6.1", "ab 2019", ["2.0 TDI 90 PS", "2.0 TDI 110 PS", "2.0 TDI 150 PS", "2.0 TDI 199 PS"]]],
    "Volkswagen|Crafter": [["2E", "2006–2016", ["2.0 TDI 109 PS", "2.0 TDI 136 PS", "2.0 TDI 143 PS", "2.0 TDI 163 PS", "2.5 TDI 88 PS", "2.5 TDI 109 PS", "2.5 TDI 136 PS", "2.5 TDI 163 PS"]], ["SY", "ab 2016", ["2.0 TDI 102 PS", "2.0 TDI 122 PS", "2.0 TDI 140 PS", "2.0 TDI 177 PS"]]],
    "Volkswagen|Amarok": [["2H", "2010–2020", ["2.0 TDI 122 PS", "2.0 TDI 140 PS", "2.0 BiTDI 163 PS", "2.0 BiTDI 180 PS", "3.0 V6 TDI 163 PS", "3.0 V6 TDI 204 PS", "3.0 V6 TDI 224 PS", "3.0 V6 TDI 258 PS"]]],
    "Skoda|Fabia": [["5J", "2007–2014", ["1.2 TSI 86 PS", "1.2 TSI 105 PS", "RS 1.4 TSI 180 PS", "1.2 TDI 75 PS", "1.6 TDI 75 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS"]], ["NJ", "2014–2021", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.2 TSI 90 PS", "1.2 TSI 110 PS", "1.4 TDI 75 PS", "1.4 TDI 90 PS", "1.4 TDI 105 PS"]], ["PJ", "ab 2021", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.5 TSI 150 PS"]]],
    "Skoda|Scala": [["NW", "ab 2019", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "1.6 TDI 115 PS"]]],
    "Skoda|Octavia": [["1Z (Octavia 2)", "2004–2013", ["1.4 TSI 122 PS", "1.8 TSI 160 PS", "RS 2.0 TFSI 200 PS", "1.6 TDI 105 PS", "1.9 TDI 105 PS", "2.0 TDI 140 PS", "RS 2.0 TDI 170 PS"]], ["5E (Octavia 3)", "2013–2020", ["1.0 TSI 115 PS", "1.2 TSI 105 PS", "1.2 TSI 110 PS", "1.4 TSI 140 PS", "1.4 TSI 150 PS", "1.5 TSI 150 PS", "1.8 TSI 180 PS", "RS 2.0 TSI 220 PS", "RS 2.0 TSI 230 PS", "RS 2.0 TSI 245 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.6 TDI 110 PS", "1.6 TDI 115 PS", "2.0 TDI 150 PS", "RS 2.0 TDI 184 PS"]], ["NX (Octavia 4)", "ab 2020", ["1.0 TSI 110 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "RS 2.0 TSI 245 PS", "RS 2.0 TSI 265 PS", "RS iV 245 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 200 PS", "RS 2.0 TDI 200 PS"]]],
    "Skoda|Superb": [["3T", "2008–2015", ["1.4 TSI 125 PS", "1.8 TSI 160 PS", "2.0 TSI 200 PS", "3.6 V6 260 PS", "1.6 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["3V", "2015–2023", ["1.4 TSI 150 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "2.0 TSI 220 PS", "2.0 TSI 272 PS", "2.0 TSI 280 PS", "iV 218 PS", "1.6 TDI 120 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS", "2.0 TDI 200 PS"]], ["3Y", "ab 2024", ["1.5 eTSI 150 PS", "2.0 TSI 204 PS", "2.0 TSI 265 PS", "2.0 TDI 150 PS", "2.0 TDI 193 PS"]]],
    "Skoda|Kamiq": [["NW4", "ab 2019", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "1.6 TDI 115 PS"]]],
    "Skoda|Karoq": [["NU7", "ab 2017", ["1.0 TSI 115 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "1.6 TDI 115 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS"]]],
    "Skoda|Kodiaq": [["NS7", "2016–2024", ["1.4 TSI 125 PS", "1.4 TSI 150 PS", "1.5 TSI 150 PS", "2.0 TSI 180 PS", "2.0 TSI 190 PS", "RS 2.0 TSI 245 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS", "2.0 TDI 200 PS", "RS 2.0 BiTDI 240 PS"]]],
    "Skoda|Yeti": [["5L", "2009–2017", ["1.2 TSI 105 PS", "1.2 TSI 110 PS", "1.4 TSI 122 PS", "1.4 TSI 125 PS", "1.8 TSI 152 PS", "1.8 TSI 160 PS", "2.0 TDI 110 PS", "2.0 TDI 140 PS", "2.0 TDI 150 PS", "2.0 TDI 170 PS"]]],
    "Seat|Ibiza": [["6J", "2008–2017", ["1.2 TSI 90 PS", "1.2 TSI 105 PS", "FR 1.4 TSI 150 PS", "Cupra 1.4 TSI 180 PS", "Cupra 1.8 TSI 192 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "2.0 TDI 143 PS"]], ["KJ", "ab 2017", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "1.6 TDI 80 PS", "1.6 TDI 95 PS"]]],
    "Seat|Leon": [["1P", "2005–2012", ["1.4 TSI 125 PS", "1.8 TSI 160 PS", "FR 2.0 TFSI 200 PS", "FR 2.0 TFSI 211 PS", "Cupra 2.0 TFSI 240 PS", "Cupra R 2.0 TFSI 265 PS", "1.6 TDI 90 PS", "1.6 TDI 105 PS", "1.9 TDI 105 PS", "2.0 TDI 140 PS", "2.0 TDI 170 PS"]], ["5F", "2012–2020", ["1.0 TSI 115 PS", "1.2 TSI 110 PS", "1.4 TSI 122 PS", "1.4 TSI 125 PS", "1.4 TSI 150 PS", "1.5 TSI 130 PS", "1.5 TSI 150 PS", "1.8 TSI 180 PS", "Cupra 2.0 TSI 265 PS", "Cupra 2.0 TSI 280 PS", "Cupra 2.0 TSI 290 PS", "Cupra 2.0 TSI 300 PS", "1.6 TDI 110 PS", "1.6 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 184 PS"]], ["KL", "ab 2020", ["1.0 eTSI 110 PS", "1.5 TSI 130 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "e-Hybrid 204 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS"]]],
    "Seat|Arona": [["KJ7", "ab 2017", ["1.0 TSI 95 PS", "1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.5 TSI 150 PS", "1.6 TDI 95 PS", "1.6 TDI 115 PS"]]],
    "Seat|Ateca": [["KH7", "ab 2016", ["1.0 TSI 110 PS", "1.0 TSI 115 PS", "1.4 TSI 150 PS", "1.5 TSI 150 PS", "2.0 TSI 190 PS", "1.6 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 190 PS"]]],
    "Seat|Tarraco": [["KN2", "ab 2018", ["1.5 TSI 150 PS", "2.0 TSI 190 PS", "2.0 TSI 245 PS", "e-Hybrid 245 PS", "2.0 TDI 150 PS", "2.0 TDI 200 PS"]]],
    "Seat|Alhambra": [["7N", "2010–2022", ["1.4 TSI 150 PS", "2.0 TSI 200 PS", "2.0 TSI 220 PS", "2.0 TDI 115 PS", "2.0 TDI 150 PS", "2.0 TDI 177 PS", "2.0 TDI 184 PS"]]],
    "Cupra|Formentor": [["KM", "ab 2020", ["1.5 TSI 150 PS", "2.0 TSI 190 PS", "2.0 TSI 245 PS", "2.0 TSI 310 PS", "2.0 TSI 333 PS", "VZ5 2.5 TFSI 390 PS", "e-Hybrid 204 PS", "e-Hybrid 245 PS", "e-Hybrid 272 PS", "2.0 TDI 150 PS"]]],
    "Cupra|Leon": [["KL", "ab 2020", ["1.5 TSI 150 PS", "2.0 TSI 245 PS", "2.0 TSI 300 PS", "2.0 TSI 310 PS", "2.0 TSI 333 PS", "e-Hybrid 204 PS", "e-Hybrid 245 PS", "e-Hybrid 272 PS"]]],
    "Cupra|Ateca": [["KH7", "ab 2018", ["2.0 TSI 300 PS"]]],
    "Ford|Fiesta": [["Mk7", "2008–2017", ["1.25 82 PS", "1.4 96 PS", "1.0 EcoBoost 100 PS", "1.0 EcoBoost 125 PS", "1.0 EcoBoost 140 PS", "1.6 Ti-VCT 120 PS", "1.6 Ti-VCT 134 PS", "ST 1.6 EcoBoost 182 PS", "ST 1.6 EcoBoost 200 PS", "1.4 TDCi 68 PS", "1.4 TDCi 70 PS", "1.5 TDCi 75 PS", "1.5 TDCi 95 PS", "1.6 TDCi 90 PS", "1.6 TDCi 95 PS"]], ["Mk8", "2017–2023", ["1.1 75 PS", "1.1 85 PS", "1.0 EcoBoost 95 PS", "1.0 EcoBoost 100 PS", "1.0 EcoBoost 125 PS", "1.0 EcoBoost 140 PS", "1.0 EcoBoost 155 PS", "ST 1.5 EcoBoost 200 PS", "1.5 TDCi 85 PS", "1.5 TDCi 120 PS"]]],
    "Ford|Focus": [["Mk2", "2004–2011", ["1.6 100 PS", "1.6 115 PS", "1.8 125 PS", "2.0 145 PS", "ST 2.5 225 PS", "RS 2.5 305 PS", "1.6 TDCi 90 PS", "1.6 TDCi 109 PS", "1.8 TDCi 115 PS", "2.0 TDCi 136 PS"]], ["Mk3", "2011–2018", ["1.0 EcoBoost 100 PS", "1.0 EcoBoost 125 PS", "1.5 EcoBoost 150 PS", "1.5 EcoBoost 182 PS", "1.6 EcoBoost 150 PS", "1.6 EcoBoost 182 PS", "ST 2.0 EcoBoost 250 PS", "RS 2.3 EcoBoost 350 PS", "1.5 TDCi 95 PS", "1.5 TDCi 120 PS", "1.6 TDCi 95 PS", "1.6 TDCi 115 PS", "2.0 TDCi 150 PS", "2.0 TDCi 163 PS", "ST 2.0 TDCi 185 PS"]], ["Mk4", "ab 2018", ["1.0 EcoBoost 100 PS", "1.0 EcoBoost 125 PS", "1.0 EcoBoost 155 PS", "1.5 EcoBoost 150 PS", "1.5 EcoBoost 182 PS", "ST 2.3 EcoBoost 280 PS", "1.5 EcoBlue 95 PS", "1.5 EcoBlue 120 PS", "2.0 EcoBlue 150 PS", "ST 2.0 EcoBlue 190 PS"]]],
    "Ford|Mondeo": [["Mk4", "2007–2014", ["1.6 EcoBoost 160 PS", "2.0 EcoBoost 203 PS", "2.0 EcoBoost 240 PS", "2.5 220 PS", "1.6 TDCi 115 PS", "1.8 TDCi 100 PS", "1.8 TDCi 125 PS", "2.0 TDCi 115 PS", "2.0 TDCi 140 PS", "2.0 TDCi 163 PS", "2.2 TDCi 175 PS", "2.2 TDCi 200 PS"]], ["Mk5", "2014–2022", ["1.0 EcoBoost 125 PS", "1.5 EcoBoost 160 PS", "2.0 EcoBoost 203 PS", "2.0 EcoBoost 240 PS", "Hybrid 187 PS", "1.5 TDCi 120 PS", "2.0 TDCi 150 PS", "2.0 TDCi 180 PS", "2.0 TDCi 210 PS", "2.0 EcoBlue 150 PS", "2.0 EcoBlue 190 PS"]]],
    "Ford|Puma": [["J2K", "ab 2019", ["1.0 EcoBoost 125 PS", "1.0 EcoBoost 155 PS", "ST 1.5 EcoBoost 200 PS", "1.5 EcoBlue 120 PS"]]],
    "Ford|Kuga": [["Mk1", "2008–2012", ["2.5 200 PS", "2.0 TDCi 136 PS", "2.0 TDCi 140 PS", "2.0 TDCi 163 PS"]], ["Mk2", "2012–2019", ["1.5 EcoBoost 120 PS", "1.5 EcoBoost 150 PS", "1.5 EcoBoost 182 PS", "1.6 EcoBoost 150 PS", "1.6 EcoBoost 182 PS", "2.0 EcoBoost 242 PS", "1.5 TDCi 120 PS", "2.0 TDCi 120 PS", "2.0 TDCi 150 PS", "2.0 TDCi 163 PS", "2.0 TDCi 180 PS"]], ["Mk3", "ab 2019", ["1.5 EcoBoost 120 PS", "1.5 EcoBoost 150 PS", "PHEV 225 PS", "1.5 EcoBlue 120 PS", "2.0 EcoBlue 150 PS", "2.0 EcoBlue 190 PS"]]],
    "Ford|S-Max": [["Mk1", "2006–2015", ["2.0 EcoBoost 203 PS", "2.0 EcoBoost 240 PS", "2.0 TDCi 140 PS", "2.0 TDCi 163 PS", "2.2 TDCi 175 PS", "2.2 TDCi 200 PS"]], ["Mk2", "2015–2023", ["1.5 EcoBoost 160 PS", "2.0 EcoBoost 240 PS", "2.0 TDCi 150 PS", "2.0 TDCi 180 PS", "2.0 TDCi 210 PS", "2.0 EcoBlue 150 PS", "2.0 EcoBlue 190 PS"]]],
    "Ford|Galaxy": [["Mk2", "2006–2015", ["2.0 EcoBoost 203 PS", "2.0 TDCi 140 PS", "2.0 TDCi 163 PS", "2.2 TDCi 175 PS", "2.2 TDCi 200 PS"]], ["Mk3", "2015–2023", ["1.5 EcoBoost 160 PS", "2.0 EcoBoost 240 PS", "2.0 TDCi 150 PS", "2.0 TDCi 180 PS", "2.0 TDCi 210 PS", "2.0 EcoBlue 150 PS", "2.0 EcoBlue 190 PS"]]],
    "Ford|Transit Custom": [["V362", "2012–2023", ["2.2 TDCi 100 PS", "2.2 TDCi 125 PS", "2.2 TDCi 155 PS", "2.0 TDCi 105 PS", "2.0 TDCi 130 PS", "2.0 TDCi 170 PS", "2.0 EcoBlue 105 PS", "2.0 EcoBlue 130 PS", "2.0 EcoBlue 170 PS", "2.0 EcoBlue 185 PS"]]],
    "Ford|Transit": [["V363", "ab 2014", ["2.2 TDCi 100 PS", "2.2 TDCi 125 PS", "2.2 TDCi 155 PS", "2.0 EcoBlue 105 PS", "2.0 EcoBlue 130 PS", "2.0 EcoBlue 170 PS", "2.0 EcoBlue 185 PS"]]],
    "Ford|Ranger": [["PX", "2011–2022", ["2.2 TDCi 125 PS", "2.2 TDCi 150 PS", "2.2 TDCi 160 PS", "3.2 TDCi 200 PS", "2.0 EcoBlue 170 PS", "2.0 EcoBlue 213 PS", "Raptor 2.0 EcoBlue 213 PS"]], ["P703", "ab 2022", ["2.0 EcoBlue 170 PS", "2.0 EcoBlue 205 PS", "3.0 V6 Diesel 240 PS", "Raptor 3.0 V6 292 PS"]]],
    "Ford|Mustang": [["S550", "2015–2023", ["2.3 EcoBoost 290 PS", "2.3 EcoBoost 317 PS", "5.0 V8 421 PS", "5.0 V8 450 PS", "5.0 V8 460 PS"]], ["S650", "ab 2024", ["5.0 V8 446 PS"]]],
    "Opel|Corsa": [["D", "2006–2014", ["1.2 80 PS", "1.2 85 PS", "1.4 90 PS", "1.4 100 PS", "OPC 1.6 Turbo 192 PS", "OPC 1.6 Turbo 210 PS", "1.3 CDTI 75 PS", "1.3 CDTI 90 PS", "1.3 CDTI 95 PS", "1.7 CDTI 125 PS", "1.7 CDTI 130 PS"]], ["E", "2014–2019", ["1.0 Turbo 90 PS", "1.0 Turbo 115 PS", "1.4 Turbo 100 PS", "1.4 Turbo 150 PS", "OPC 1.6 Turbo 207 PS", "1.3 CDTI 75 PS", "1.3 CDTI 95 PS"]], ["F", "ab 2019", ["1.2 75 PS", "1.2 Turbo 100 PS", "1.2 Turbo 130 PS", "1.5 Diesel 102 PS"]]],
    "Opel|Astra": [["H", "2004–2010", ["1.6 Turbo 180 PS", "2.0 Turbo 170 PS", "2.0 Turbo 200 PS", "OPC 2.0 Turbo 240 PS", "1.7 CDTI 100 PS", "1.7 CDTI 110 PS", "1.7 CDTI 125 PS", "1.9 CDTI 120 PS", "1.9 CDTI 150 PS"]], ["J", "2009–2015", ["1.4 Turbo 120 PS", "1.4 Turbo 140 PS", "1.6 Turbo 170 PS", "1.6 Turbo 180 PS", "OPC 2.0 Turbo 280 PS", "1.7 CDTI 110 PS", "1.7 CDTI 125 PS", "1.7 CDTI 130 PS", "2.0 CDTI 160 PS", "2.0 CDTI 165 PS", "2.0 BiTurbo CDTI 195 PS"]], ["K", "2015–2021", ["1.0 Turbo 105 PS", "1.2 Turbo 110 PS", "1.2 Turbo 130 PS", "1.2 Turbo 145 PS", "1.4 Turbo 125 PS", "1.4 Turbo 150 PS", "1.6 Turbo 200 PS", "1.6 CDTI 110 PS", "1.6 CDTI 136 PS", "1.6 CDTI 160 PS", "1.5 Diesel 105 PS", "1.5 Diesel 122 PS"]], ["L", "ab 2021", ["1.2 Turbo 110 PS", "1.2 Turbo 130 PS", "Hybrid 180 PS", "Hybrid 225 PS", "1.5 Diesel 130 PS"]]],
    "Opel|Insignia": [["A", "2008–2017", ["1.4 Turbo 140 PS", "1.6 Turbo 170 PS", "1.6 Turbo 180 PS", "2.0 Turbo 220 PS", "2.0 Turbo 250 PS", "OPC 2.8 V6 325 PS", "2.0 CDTI 110 PS", "2.0 CDTI 130 PS", "2.0 CDTI 140 PS", "2.0 CDTI 160 PS", "2.0 CDTI 163 PS", "2.0 CDTI 170 PS", "2.0 BiTurbo CDTI 195 PS"]], ["B", "2017–2022", ["1.5 Turbo 140 PS", "1.5 Turbo 165 PS", "2.0 Turbo 200 PS", "2.0 Turbo 260 PS", "1.6 CDTI 110 PS", "1.6 CDTI 136 PS", "2.0 CDTI 170 PS", "2.0 CDTI 174 PS", "2.0 BiTurbo CDTI 210 PS"]]],
    "Opel|Zafira": [["B", "2005–2014", ["1.6 105 PS", "1.6 115 PS", "1.8 140 PS", "OPC 2.0 Turbo 240 PS", "1.7 CDTI 110 PS", "1.7 CDTI 125 PS", "1.9 CDTI 120 PS", "1.9 CDTI 150 PS"]], ["C (Tourer)", "2011–2019", ["1.4 Turbo 120 PS", "1.4 Turbo 140 PS", "1.6 Turbo 170 PS", "1.6 Turbo 200 PS", "1.6 CDTI 120 PS", "1.6 CDTI 134 PS", "2.0 CDTI 110 PS", "2.0 CDTI 130 PS", "2.0 CDTI 165 PS", "2.0 CDTI 170 PS"]]],
    "Opel|Mokka": [["J13", "2012–2019", ["1.4 Turbo 140 PS", "1.4 Turbo 152 PS", "1.6 CDTI 110 PS", "1.6 CDTI 136 PS", "1.7 CDTI 130 PS"]], ["B", "ab 2021", ["1.2 Turbo 100 PS", "1.2 Turbo 130 PS", "1.2 Turbo 136 PS", "1.5 Diesel 110 PS"]]],
    "Opel|Grandland": [["A18", "2017–2024", ["1.2 Turbo 130 PS", "1.6 Turbo 180 PS", "Hybrid 224 PS", "Hybrid 300 PS", "1.5 Diesel 130 PS", "2.0 Diesel 177 PS"]]],
    "Opel|Vivaro": [["B", "2014–2019", ["1.6 CDTI 90 PS", "1.6 CDTI 95 PS", "1.6 CDTI 115 PS", "1.6 CDTI 120 PS", "1.6 CDTI 125 PS", "1.6 CDTI 140 PS", "1.6 CDTI 145 PS"]], ["C", "ab 2019", ["1.5 Diesel 102 PS", "1.5 Diesel 120 PS", "2.0 Diesel 122 PS", "2.0 Diesel 150 PS", "2.0 Diesel 177 PS"]]],
    "Opel|Movano": [["B", "2010–2021", ["2.3 CDTI 101 PS", "2.3 CDTI 125 PS", "2.3 CDTI 131 PS", "2.3 CDTI 136 PS", "2.3 CDTI 146 PS", "2.3 CDTI 150 PS", "2.3 CDTI 163 PS", "2.3 CDTI 170 PS", "2.3 CDTI 180 PS"]]],
    "Porsche|911": [["997", "2004–2012", ["Carrera 325 PS", "Carrera 345 PS", "Carrera S 355 PS", "Carrera S 385 PS", "Turbo 480 PS", "Turbo 500 PS", "Turbo S 530 PS", "GT3 415 PS", "GT3 435 PS"]], ["991", "2011–2019", ["Carrera 350 PS", "Carrera 370 PS", "Carrera S 400 PS", "Carrera S 420 PS", "GTS 430 PS", "GTS 450 PS", "Turbo 520 PS", "Turbo 540 PS", "Turbo S 560 PS", "Turbo S 580 PS", "GT3 475 PS", "GT3 500 PS"]], ["992", "ab 2019", ["Carrera 385 PS", "Carrera 394 PS", "Carrera S 450 PS", "Carrera S 480 PS", "GTS 480 PS", "GTS 541 PS", "Turbo 580 PS", "Turbo S 650 PS"]]],
    "Porsche|Boxster": [["981", "2012–2016", ["Boxster 265 PS", "Boxster S 315 PS", "Boxster GTS 330 PS"]], ["718 (982)", "ab 2016", ["Boxster 300 PS", "Boxster S 350 PS", "Boxster GTS 4.0 400 PS"]]],
    "Porsche|Cayman": [["981", "2012–2016", ["Cayman 275 PS", "Cayman S 325 PS", "Cayman GTS 340 PS"]], ["718 (982)", "ab 2016", ["Cayman 300 PS", "Cayman S 350 PS", "Cayman GTS 4.0 400 PS"]]],
    "Porsche|Macan": [["95B", "2014–2024", ["Macan 2.0 245 PS", "Macan 2.0 252 PS", "Macan 2.0 265 PS", "Macan S 340 PS", "Macan S 354 PS", "Macan S 380 PS", "Macan GTS 360 PS", "Macan GTS 380 PS", "Macan GTS 440 PS", "Macan Turbo 400 PS", "Macan Turbo 440 PS", "Macan S Diesel 250 PS", "Macan S Diesel 258 PS"]]],
    "Porsche|Cayenne": [["92A", "2010–2017", ["3.6 V6 300 PS", "S 400 PS", "S 420 PS", "GTS 420 PS", "GTS 440 PS", "Turbo 500 PS", "Turbo 520 PS", "Turbo S 550 PS", "Turbo S 570 PS", "S E-Hybrid 416 PS", "Diesel 245 PS", "Diesel 262 PS", "S Diesel 382 PS", "S Diesel 385 PS"]], ["9YA / 9YB", "ab 2017", ["Cayenne 340 PS", "Cayenne 353 PS", "S 440 PS", "S 474 PS", "GTS 460 PS", "GTS 500 PS", "Turbo 550 PS", "E-Hybrid 462 PS", "E-Hybrid 470 PS", "Turbo S E-Hybrid 680 PS"]]],
    "Porsche|Panamera": [["970", "2009–2016", ["3.6 V6 300 PS", "3.6 V6 310 PS", "4S 400 PS", "4S 420 PS", "GTS 430 PS", "GTS 440 PS", "Turbo 500 PS", "Turbo 520 PS", "Turbo S 550 PS", "Turbo S 570 PS", "S E-Hybrid 416 PS", "Diesel 250 PS", "Diesel 300 PS"]], ["971", "ab 2016", ["Panamera 330 PS", "4S 440 PS", "GTS 460 PS", "GTS 480 PS", "Turbo 550 PS", "Turbo S 630 PS", "4 E-Hybrid 462 PS", "4S Diesel 422 PS"]]],
    "Mini|Mini 3-Türer / 5-Türer": [["R56", "2006–2013", ["One 75 PS", "One 95 PS", "One 98 PS", "Cooper 120 PS", "Cooper 122 PS", "Cooper S 175 PS", "Cooper S 184 PS", "John Cooper Works 211 PS", "Cooper D 109 PS", "Cooper D 112 PS", "Cooper SD 143 PS"]], ["F55 / F56", "2014–2024", ["One 75 PS", "One 102 PS", "Cooper 136 PS", "Cooper S 178 PS", "Cooper S 192 PS", "John Cooper Works 231 PS", "Cooper D 116 PS", "Cooper SD 170 PS"]]],
    "Mini|Countryman": [["R60", "2010–2016", ["Cooper 122 PS", "Cooper S 184 PS", "Cooper S 190 PS", "John Cooper Works 218 PS", "Cooper D 112 PS", "Cooper SD 143 PS"]], ["F60", "2017–2023", ["Cooper 136 PS", "Cooper S 178 PS", "Cooper S 192 PS", "John Cooper Works 306 PS", "Cooper SE 224 PS", "Cooper D 150 PS", "Cooper SD 190 PS"]]],
    "Land Rover|Range Rover Evoque": [["L538", "2011–2018", ["Si4 240 PS", "2.0 Si4 240 PS", "2.0 Si4 290 PS", "2.2 TD4 150 PS", "2.2 SD4 190 PS", "2.0 TD4 150 PS", "2.0 TD4 180 PS", "2.0 SD4 240 PS"]], ["L551", "ab 2019", ["P200 200 PS", "P250 249 PS", "P300 300 PS", "P300e 309 PS", "D150 150 PS", "D165 163 PS", "D180 180 PS", "D200 204 PS", "D240 240 PS"]]],
    "Land Rover|Discovery Sport": [["L550", "ab 2014", ["Si4 240 PS", "Si4 290 PS", "P200 200 PS", "P250 249 PS", "P300e 309 PS", "TD4 150 PS", "TD4 180 PS", "SD4 190 PS", "SD4 240 PS", "D165 163 PS", "D180 180 PS", "D200 204 PS", "D240 240 PS"]]],
    "Land Rover|Range Rover Velar": [["L560", "ab 2017", ["P250 250 PS", "P300 300 PS", "P380 380 PS", "P400e 404 PS", "D180 180 PS", "D200 204 PS", "D240 240 PS", "D300 300 PS"]]],
    "Land Rover|Range Rover Sport": [["L320", "2005–2013", ["TDV6 2.7 190 PS", "TDV6 3.0 245 PS", "TDV6 3.0 256 PS", "TDV8 3.6 272 PS", "4.2 V8 Supercharged 390 PS", "5.0 V8 Supercharged 510 PS"]], ["L494", "2013–2022", ["TDV6 258 PS", "SDV6 292 PS", "SDV6 306 PS", "SDV8 339 PS", "D250 249 PS", "D300 300 PS", "P400e 404 PS", "V8 Supercharged 510 PS", "V8 Supercharged 525 PS", "SVR 550 PS", "SVR 575 PS"]], ["L461", "ab 2022", ["D250 249 PS", "D300 300 PS", "D350 350 PS", "P400 400 PS", "P440e 440 PS", "P510e 510 PS", "P530 V8 530 PS"]]],
    "Land Rover|Range Rover": [["L322", "2002–2012", ["TDV8 3.6 272 PS", "TDV8 4.4 313 PS", "5.0 V8 Supercharged 510 PS"]], ["L405", "2012–2022", ["TDV6 258 PS", "SDV6 292 PS", "SDV8 339 PS", "D300 300 PS", "D350 350 PS", "P400e 404 PS", "V8 Supercharged 510 PS", "V8 Supercharged 525 PS", "V8 Supercharged 565 PS"]], ["L460", "ab 2022", ["D300 300 PS", "D350 350 PS", "P400 400 PS", "P530 V8 530 PS"]]],
    "Land Rover|Discovery": [["Discovery 4", "2009–2016", ["TDV6 3.0 211 PS", "TDV6 3.0 245 PS", "TDV6 3.0 256 PS", "SDV6 3.0 256 PS"]], ["Discovery 5", "ab 2017", ["Sd4 240 PS", "Td6 258 PS", "D250 249 PS", "D300 300 PS", "Si6 340 PS", "Si6 360 PS"]]],
    "Land Rover|Defender": [["L663", "ab 2020", ["D200 200 PS", "D240 240 PS", "D250 249 PS", "D300 300 PS", "P300 300 PS", "P400 400 PS", "P400e 404 PS", "V8 525 PS"]]],
    "Jaguar|XE": [["X760", "ab 2015", ["20t 200 PS", "20t 250 PS", "30t 300 PS", "25t 250 PS", "S 3.0 V6 340 PS", "S 3.0 V6 380 PS", "20d 163 PS", "20d 180 PS", "20d 240 PS"]]],
    "Jaguar|XF": [["X260", "ab 2015", ["20t 200 PS", "20t 250 PS", "30t 300 PS", "S 3.0 V6 340 PS", "S 3.0 V6 380 PS", "20d 163 PS", "20d 180 PS", "20d 240 PS", "30d 300 PS"]]],
    "Jaguar|F-Pace": [["X761", "ab 2016", ["25t 250 PS", "30t 300 PS", "S 3.0 V6 380 PS", "SVR 5.0 V8 550 PS", "20d 163 PS", "20d 180 PS", "20d 204 PS", "20d 240 PS", "30d 300 PS"]]],
    "Jaguar|E-Pace": [["X540", "ab 2017", ["P200 200 PS", "P250 249 PS", "P300 300 PS", "D150 150 PS", "D165 163 PS", "D180 180 PS", "D240 240 PS"]]],
    "Jaguar|F-Type": [["X152", "ab 2013", ["P300 300 PS", "3.0 V6 340 PS", "3.0 V6 380 PS", "3.0 V6 400 PS", "5.0 V8 550 PS", "5.0 V8 575 PS"]]],
    "Volvo|V40": [["V40 II", "2012–2019", ["T2 122 PS", "T3 152 PS", "T4 180 PS", "T4 190 PS", "T5 245 PS", "T5 254 PS", "D2 115 PS", "D2 120 PS", "D3 150 PS", "D4 177 PS", "D4 190 PS"]]],
    "Volvo|V60": [["V60 I", "2010–2018", ["T3 150 PS", "T3 152 PS", "T4 180 PS", "T4 190 PS", "T5 240 PS", "T5 245 PS", "T6 304 PS", "T6 306 PS", "D2 115 PS", "D2 120 PS", "D3 136 PS", "D3 150 PS", "D4 163 PS", "D4 181 PS", "D4 190 PS", "D5 215 PS", "D5 220 PS", "D5 230 PS", "D6 Twin Engine 283 PS"]], ["V60 II", "ab 2018", ["B3 163 PS", "B4 197 PS", "B5 250 PS", "T6 Recharge 340 PS", "T6 Recharge 350 PS", "T8 Recharge 390 PS", "T8 Recharge 455 PS", "D3 150 PS", "D4 190 PS", "B4 Diesel 197 PS"]]],
    "Volvo|S60": [["S60 II", "2010–2018", ["T3 150 PS", "T4 180 PS", "T4 190 PS", "T5 240 PS", "T5 245 PS", "T6 304 PS", "T6 306 PS", "D2 115 PS", "D2 120 PS", "D3 136 PS", "D3 150 PS", "D4 163 PS", "D4 181 PS", "D4 190 PS", "D5 215 PS", "D5 220 PS"]], ["S60 III", "ab 2018", ["B4 197 PS", "B5 250 PS", "T8 Recharge 390 PS", "T8 Recharge 455 PS"]]],
    "Volvo|V90": [["V90 II", "ab 2016", ["T4 190 PS", "T5 250 PS", "T6 320 PS", "B4 197 PS", "B5 250 PS", "T8 Recharge 390 PS", "T8 Recharge 407 PS", "T8 Recharge 455 PS", "D3 150 PS", "D4 190 PS", "D5 235 PS"]]],
    "Volvo|S90": [["S90 II", "ab 2016", ["T4 190 PS", "T5 250 PS", "T6 320 PS", "B5 250 PS", "T8 Recharge 390 PS", "T8 Recharge 407 PS", "T8 Recharge 455 PS", "D3 150 PS", "D4 190 PS", "D5 235 PS"]]],
    "Volvo|XC40": [["XC40", "ab 2017", ["T2 129 PS", "T3 156 PS", "T3 163 PS", "T4 190 PS", "T4 197 PS", "T5 247 PS", "T5 252 PS", "B4 197 PS", "B5 250 PS", "T5 Recharge 262 PS", "D3 150 PS", "D4 190 PS"]]],
    "Volvo|XC60": [["XC60 I", "2008–2017", ["T5 240 PS", "T5 245 PS", "T6 304 PS", "T6 306 PS", "D3 136 PS", "D3 150 PS", "D3 163 PS", "D4 163 PS", "D4 181 PS", "D4 190 PS", "D5 185 PS", "D5 205 PS", "D5 215 PS", "D5 220 PS"]], ["XC60 II", "ab 2017", ["T5 250 PS", "T6 310 PS", "T6 320 PS", "B4 197 PS", "B5 250 PS", "T8 Recharge 390 PS", "T8 Recharge 407 PS", "T8 Recharge 455 PS", "D4 190 PS", "D5 235 PS"]]],
    "Volvo|XC90": [["XC90 I", "2002–2014", ["2.5T 210 PS", "3.2 238 PS", "3.2 243 PS", "V8 315 PS", "D5 163 PS", "D5 185 PS", "D5 200 PS"]], ["XC90 II", "ab 2015", ["T5 250 PS", "T6 310 PS", "T6 320 PS", "B5 235 PS", "B5 250 PS", "B6 300 PS", "T8 Recharge 390 PS", "T8 Recharge 407 PS", "T8 Recharge 455 PS", "D4 190 PS", "D5 225 PS", "D5 235 PS"]]],
    "Toyota|Hilux": [["AN120 / AN130", "ab 2016", ["2.4 D-4D 150 PS", "2.8 D-4D 177 PS", "2.8 D-4D 204 PS"]], ["AN10 / AN20 / AN30", "2005–2015", ["2.5 D-4D 120 PS", "2.5 D-4D 144 PS", "3.0 D-4D 171 PS"]]],
    "Toyota|Land Cruiser": [["J150", "2009–2024", ["2.8 D-4D 177 PS", "2.8 D-4D 204 PS", "3.0 D-4D 173 PS", "3.0 D-4D 190 PS", "4.0 V6 282 PS"]]],
    "Toyota|Supra": [["A90", "ab 2019", ["2.0 258 PS", "3.0 340 PS", "3.0 387 PS"]]],
    "Toyota|RAV4": [["XA40", "2013–2018", ["2.0 D-4D 124 PS", "2.0 D-4D 143 PS", "2.2 D-4D 150 PS", "2.5 Hybrid 197 PS"]], ["XA50", "ab 2019", ["2.0 175 PS", "2.5 Hybrid 218 PS", "2.5 Hybrid 222 PS", "Plug-in Hybrid 306 PS"]]],
    "Toyota|Proace": [["MDZ", "ab 2016", ["1.5 D-4D 102 PS", "1.5 D-4D 120 PS", "1.6 D-4D 95 PS", "1.6 D-4D 115 PS", "2.0 D-4D 122 PS", "2.0 D-4D 144 PS", "2.0 D-4D 150 PS", "2.0 D-4D 177 PS", "2.0 D-4D 180 PS"]]],
    "Hyundai|i30": [["GD", "2012–2017", ["1.4 100 PS", "1.6 GDI 135 PS", "Turbo 1.6 T-GDI 186 PS", "1.4 CRDi 90 PS", "1.6 CRDi 110 PS", "1.6 CRDi 128 PS", "1.6 CRDi 136 PS"]], ["PD / PDE", "ab 2017", ["1.0 T-GDI 120 PS", "1.4 T-GDI 140 PS", "1.5 T-GDI 160 PS", "N 2.0 T-GDI 250 PS", "N 2.0 T-GDI 275 PS", "N 2.0 T-GDI 280 PS", "1.6 CRDi 95 PS", "1.6 CRDi 110 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS"]]],
    "Hyundai|Tucson": [["TL", "2015–2020", ["1.6 GDI 132 PS", "1.6 T-GDI 177 PS", "1.7 CRDi 116 PS", "1.7 CRDi 141 PS", "2.0 CRDi 136 PS", "2.0 CRDi 185 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS"]], ["NX4", "ab 2020", ["1.6 T-GDI 150 PS", "1.6 T-GDI 180 PS", "Hybrid 230 PS", "Plug-in Hybrid 265 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS"]]],
    "Hyundai|Santa Fe": [["DM", "2012–2018", ["2.4 GDI 188 PS", "2.0 CRDi 150 PS", "2.2 CRDi 197 PS", "2.2 CRDi 200 PS"]], ["TM", "2018–2020", ["2.4 GDI 185 PS", "2.2 CRDi 200 PS"]], ["TM Facelift / MX5", "ab 2020", ["Hybrid 230 PS", "Plug-in Hybrid 265 PS", "2.2 CRDi 202 PS"]]],
    "Kia|Ceed": [["JD", "2012–2018", ["1.4 100 PS", "1.6 GDI 135 PS", "GT 1.6 T-GDI 204 PS", "1.4 CRDi 90 PS", "1.6 CRDi 110 PS", "1.6 CRDi 128 PS", "1.6 CRDi 136 PS"]], ["CD", "ab 2018", ["1.0 T-GDI 120 PS", "1.4 T-GDI 140 PS", "1.5 T-GDI 160 PS", "GT 1.6 T-GDI 204 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS"]]],
    "Kia|Sportage": [["QL", "2016–2021", ["1.6 GDI 132 PS", "1.6 T-GDI 177 PS", "1.7 CRDi 115 PS", "1.7 CRDi 141 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS", "2.0 CRDi 136 PS", "2.0 CRDi 185 PS"]], ["NQ5", "ab 2021", ["1.6 T-GDI 150 PS", "1.6 T-GDI 180 PS", "Hybrid 230 PS", "Plug-in Hybrid 265 PS", "1.6 CRDi 115 PS", "1.6 CRDi 136 PS"]]],
    "Kia|Sorento": [["UM", "2015–2020", ["2.4 GDI 188 PS", "2.2 CRDi 200 PS"]], ["MQ4", "ab 2020", ["Hybrid 230 PS", "Plug-in Hybrid 265 PS", "2.2 CRDi 193 PS"]]],
    "Mazda|Mazda3": [["BM / BN", "2013–2019", ["1.5 100 PS", "2.0 120 PS", "2.0 165 PS", "1.5 Skyactiv-D 105 PS", "2.2 Skyactiv-D 150 PS"]], ["BP", "ab 2019", ["2.0 122 PS", "2.0 150 PS", "2.0 Skyactiv-X 180 PS", "2.0 Skyactiv-X 186 PS", "1.8 Skyactiv-D 116 PS"]]],
    "Mazda|CX-5": [["KE", "2012–2017", ["2.0 160 PS", "2.0 165 PS", "2.5 192 PS", "2.2 Skyactiv-D 150 PS", "2.2 Skyactiv-D 175 PS"]], ["KF", "ab 2017", ["2.0 165 PS", "2.5 194 PS", "2.2 Skyactiv-D 150 PS", "2.2 Skyactiv-D 175 PS", "2.2 Skyactiv-D 184 PS"]]],
    "Mazda|MX-5": [["ND", "ab 2015", ["1.5 131 PS", "1.5 132 PS", "2.0 160 PS", "2.0 184 PS"]]],
    "Nissan|Qashqai": [["J11", "2013–2021", ["1.2 DIG-T 115 PS", "1.3 DIG-T 140 PS", "1.3 DIG-T 160 PS", "1.6 DIG-T 163 PS", "1.5 dCi 110 PS", "1.5 dCi 115 PS", "1.6 dCi 130 PS"]], ["J12", "ab 2021", ["1.3 DIG-T Mild-Hybrid 140 PS", "1.3 DIG-T Mild-Hybrid 158 PS", "e-Power 190 PS"]]],
    "Nissan|Navara": [["D40", "2005–2015", ["2.5 dCi 144 PS", "2.5 dCi 171 PS", "2.5 dCi 190 PS", "3.0 V6 dCi 231 PS"]], ["D23", "ab 2015", ["2.3 dCi 160 PS", "2.3 dCi 190 PS"]]],
    "Peugeot|208": [["A9", "2012–2019", ["1.2 PureTech 82 PS", "1.2 PureTech 110 PS", "1.6 THP 156 PS", "GTi 1.6 THP 200 PS", "GTi 1.6 THP 208 PS", "1.4 HDi 68 PS", "1.6 BlueHDi 75 PS", "1.6 BlueHDi 100 PS", "1.6 BlueHDi 120 PS"]], ["P21", "ab 2019", ["1.2 PureTech 75 PS", "1.2 PureTech 100 PS", "1.2 PureTech 130 PS", "1.5 BlueHDi 100 PS"]]],
    "Peugeot|308": [["T9", "2013–2021", ["1.2 PureTech 110 PS", "1.2 PureTech 130 PS", "1.6 THP 125 PS", "1.6 THP 156 PS", "1.6 THP 205 PS", "GTi 1.6 THP 250 PS", "GTi 1.6 THP 270 PS", "1.5 BlueHDi 100 PS", "1.5 BlueHDi 130 PS", "1.6 BlueHDi 100 PS", "1.6 BlueHDi 120 PS", "2.0 BlueHDi 150 PS", "2.0 BlueHDi 180 PS"]], ["P5", "ab 2021", ["1.2 PureTech 110 PS", "1.2 PureTech 130 PS", "Hybrid 180 PS", "Hybrid 225 PS", "1.5 BlueHDi 130 PS"]]],
    "Peugeot|3008": [["P84", "2016–2023", ["1.2 PureTech 130 PS", "1.6 THP 165 PS", "1.6 THP 180 PS", "Hybrid 225 PS", "Hybrid4 300 PS", "1.5 BlueHDi 130 PS", "1.6 BlueHDi 120 PS", "2.0 BlueHDi 150 PS", "2.0 BlueHDi 180 PS"]]],
    "Peugeot|5008": [["P87", "2017–2023", ["1.2 PureTech 130 PS", "1.6 THP 165 PS", "1.6 THP 180 PS", "1.5 BlueHDi 130 PS", "1.6 BlueHDi 120 PS", "2.0 BlueHDi 150 PS", "2.0 BlueHDi 180 PS"]]],
    "Peugeot|508": [["R8", "ab 2018", ["1.6 PureTech 180 PS", "1.6 PureTech 225 PS", "Hybrid 225 PS", "PSE 360 PS", "1.5 BlueHDi 130 PS", "2.0 BlueHDi 160 PS", "2.0 BlueHDi 180 PS"]]],
    "Peugeot|Expert": [["K0", "ab 2016", ["1.5 BlueHDi 100 PS", "1.5 BlueHDi 102 PS", "1.5 BlueHDi 120 PS", "1.6 BlueHDi 95 PS", "1.6 BlueHDi 115 PS", "2.0 BlueHDi 122 PS", "2.0 BlueHDi 144 PS", "2.0 BlueHDi 150 PS", "2.0 BlueHDi 177 PS", "2.0 BlueHDi 180 PS"]]],
    "Peugeot|Boxer": [["Boxer III", "ab 2006", ["2.2 HDi 100 PS", "2.2 HDi 120 PS", "2.2 HDi 130 PS", "2.2 HDi 150 PS", "2.0 BlueHDi 110 PS", "2.0 BlueHDi 130 PS", "2.0 BlueHDi 163 PS", "2.2 BlueHDi 120 PS", "2.2 BlueHDi 140 PS", "2.2 BlueHDi 165 PS", "3.0 HDi 157 PS", "3.0 HDi 177 PS"]]],
    "Citroën|Jumpy": [["K0", "ab 2016", ["1.5 BlueHDi 100 PS", "1.5 BlueHDi 102 PS", "1.5 BlueHDi 120 PS", "1.6 BlueHDi 95 PS", "1.6 BlueHDi 115 PS", "2.0 BlueHDi 122 PS", "2.0 BlueHDi 144 PS", "2.0 BlueHDi 150 PS", "2.0 BlueHDi 177 PS", "2.0 BlueHDi 180 PS"]]],
    "Citroën|Jumper": [["Jumper III", "ab 2006", ["2.2 HDi 100 PS", "2.2 HDi 120 PS", "2.2 HDi 130 PS", "2.2 HDi 150 PS", "2.0 BlueHDi 110 PS", "2.0 BlueHDi 130 PS", "2.0 BlueHDi 163 PS", "2.2 BlueHDi 120 PS", "2.2 BlueHDi 140 PS", "2.2 BlueHDi 165 PS", "3.0 HDi 157 PS", "3.0 HDi 177 PS"]]],
    "Citroën|Berlingo": [["K9", "ab 2018", ["1.2 PureTech 110 PS", "1.2 PureTech 130 PS", "1.5 BlueHDi 75 PS", "1.5 BlueHDi 100 PS", "1.5 BlueHDi 102 PS", "1.5 BlueHDi 130 PS"]]],
    "Renault|Clio": [["Clio IV", "2012–2019", ["0.9 TCe 75 PS", "0.9 TCe 90 PS", "1.2 TCe 120 PS", "RS 1.6 TCe 200 PS", "RS 1.6 TCe 220 PS", "1.5 dCi 75 PS", "1.5 dCi 90 PS", "1.5 dCi 110 PS"]], ["Clio V", "ab 2019", ["1.0 TCe 90 PS", "1.0 TCe 100 PS", "1.3 TCe 130 PS", "E-Tech Hybrid 140 PS", "E-Tech Hybrid 145 PS", "1.5 Blue dCi 85 PS", "1.5 Blue dCi 100 PS", "1.5 Blue dCi 115 PS"]]],
    "Renault|Megane": [["Megane III", "2008–2016", ["1.2 TCe 115 PS", "1.2 TCe 130 PS", "1.4 TCe 130 PS", "RS 2.0 T 250 PS", "RS 2.0 T 265 PS", "RS 2.0 T 275 PS", "1.5 dCi 90 PS", "1.5 dCi 110 PS", "1.6 dCi 130 PS", "1.9 dCi 130 PS", "2.0 dCi 160 PS"]], ["Megane IV", "2016–2023", ["1.2 TCe 100 PS", "1.2 TCe 130 PS", "1.3 TCe 115 PS", "1.3 TCe 140 PS", "1.3 TCe 160 PS", "RS 1.8 TCe 280 PS", "RS 1.8 TCe 300 PS", "1.5 dCi 90 PS", "1.5 dCi 110 PS", "1.5 dCi 115 PS", "1.6 dCi 130 PS", "1.6 dCi 165 PS", "1.7 Blue dCi 150 PS"]]],
    "Renault|Captur": [["J87", "2013–2019", ["0.9 TCe 90 PS", "1.2 TCe 120 PS", "1.3 TCe 130 PS", "1.3 TCe 150 PS", "1.5 dCi 90 PS", "1.5 dCi 110 PS"]], ["HF", "ab 2019", ["1.0 TCe 90 PS", "1.0 TCe 100 PS", "1.3 TCe 130 PS", "1.3 TCe 140 PS", "1.3 TCe 155 PS", "1.3 TCe 160 PS", "E-Tech 145 PS", "E-Tech 160 PS", "1.5 Blue dCi 95 PS", "1.5 Blue dCi 115 PS"]]],
    "Renault|Trafic": [["Trafic III", "ab 2014", ["1.6 dCi 90 PS", "1.6 dCi 95 PS", "1.6 dCi 115 PS", "1.6 dCi 120 PS", "1.6 dCi 125 PS", "1.6 dCi 145 PS", "2.0 Blue dCi 110 PS", "2.0 Blue dCi 120 PS", "2.0 Blue dCi 130 PS", "2.0 Blue dCi 145 PS", "2.0 Blue dCi 150 PS", "2.0 Blue dCi 170 PS"]]],
    "Renault|Master": [["Master III", "ab 2010", ["2.3 dCi 100 PS", "2.3 dCi 110 PS", "2.3 dCi 125 PS", "2.3 dCi 130 PS", "2.3 dCi 135 PS", "2.3 dCi 145 PS", "2.3 dCi 150 PS", "2.3 dCi 163 PS", "2.3 dCi 165 PS", "2.3 dCi 170 PS", "2.3 dCi 180 PS"]]],
    "Dacia|Duster": [["HM", "2017–2024", ["1.0 TCe 90 PS", "1.0 TCe 100 PS", "1.3 TCe 130 PS", "1.3 TCe 150 PS", "1.5 dCi 95 PS", "1.5 dCi 115 PS"]]],
    "Fiat|500": [["312", "ab 2007", ["1.2 69 PS", "0.9 TwinAir 85 PS", "0.9 TwinAir 105 PS", "1.4 100 PS", "1.3 Multijet 75 PS", "1.3 Multijet 95 PS"]]],
    "Fiat|Ducato": [["250 / 290", "2006–2021", ["2.0 Multijet 115 PS", "2.3 Multijet 120 PS", "2.3 Multijet 130 PS", "2.3 Multijet 150 PS", "2.3 Multijet 160 PS", "2.3 Multijet 180 PS", "3.0 Multijet 157 PS", "3.0 Multijet 177 PS"]], ["Ducato 8", "ab 2021", ["2.2 Multijet 120 PS", "2.2 Multijet 140 PS", "2.2 Multijet 160 PS", "2.2 Multijet 180 PS"]]],
    "Abarth|500 / 595 / 695": [["312", "ab 2008", ["1.4 T-Jet 135 PS", "1.4 T-Jet 140 PS", "1.4 T-Jet 145 PS", "1.4 T-Jet 160 PS", "1.4 T-Jet 165 PS", "1.4 T-Jet 180 PS"]]],
    "Alfa Romeo|Giulietta": [["940", "2010–2020", ["1.4 TB 120 PS", "1.4 TB 150 PS", "1.4 TB 170 PS", "1750 TBi 235 PS", "1750 TBi 240 PS", "1.6 JTDM 105 PS", "1.6 JTDM 120 PS", "2.0 JTDM 140 PS", "2.0 JTDM 150 PS", "2.0 JTDM 170 PS", "2.0 JTDM 175 PS"]]],
    "Alfa Romeo|Giulia": [["952", "ab 2016", ["2.0 Turbo 200 PS", "2.0 Turbo 280 PS", "Quadrifoglio 2.9 V6 510 PS", "Quadrifoglio 2.9 V6 520 PS", "2.2 JTD 136 PS", "2.2 JTD 150 PS", "2.2 JTD 160 PS", "2.2 JTD 180 PS", "2.2 JTD 190 PS", "2.2 JTD 210 PS"]]],
    "Alfa Romeo|Stelvio": [["949", "ab 2017", ["2.0 Turbo 200 PS", "2.0 Turbo 280 PS", "Quadrifoglio 2.9 V6 510 PS", "Quadrifoglio 2.9 V6 520 PS", "2.2 JTD 160 PS", "2.2 JTD 190 PS", "2.2 JTD 210 PS"]]],
    "Jeep|Grand Cherokee": [["WK2", "2010–2021", ["3.6 V6 286 PS", "SRT 6.4 V8 468 PS", "3.0 CRD 190 PS", "3.0 CRD 241 PS", "3.0 CRD 250 PS"]]],
    "Jeep|Wrangler": [["JL", "ab 2018", ["2.0 Turbo 272 PS", "4xe 380 PS", "2.2 CRD 200 PS"]]],
    "Jeep|Compass": [["M6", "ab 2017", ["1.3 T4 130 PS", "1.3 T4 150 PS", "1.4 MultiAir 140 PS", "1.4 MultiAir 170 PS", "4xe 190 PS", "4xe 240 PS", "1.6 Multijet 120 PS", "1.6 Multijet 130 PS", "2.0 Multijet 140 PS", "2.0 Multijet 170 PS"]]],
    "Jeep|Renegade": [["BU", "ab 2014", ["1.0 T3 120 PS", "1.3 T4 150 PS", "1.4 MultiAir 140 PS", "1.4 MultiAir 170 PS", "4xe 190 PS", "4xe 240 PS", "1.6 Multijet 120 PS", "1.6 Multijet 130 PS", "2.0 Multijet 140 PS", "2.0 Multijet 170 PS"]]],
    "Mitsubishi|L200": [["KJ / KK / KL", "2015–2024", ["2.4 DI-D 154 PS", "2.4 DI-D 181 PS", "2.2 DI-D 150 PS"]], ["KB", "2006–2015", ["2.5 DI-D 136 PS", "2.5 DI-D 178 PS"]]],
    "Mitsubishi|Outlander": [["GF", "2012–2021", ["2.0 150 PS", "2.2 DI-D 150 PS", "Plug-in Hybrid 203 PS", "Plug-in Hybrid 224 PS"]]],
    "Honda|Civic": [["FK2 / FK8 / FL5 Type R", "2015–2023", ["Type R 310 PS", "Type R 320 PS", "Type R 329 PS"]], ["FK (X)", "2017–2022", ["1.0 VTEC Turbo 126 PS", "1.0 VTEC Turbo 129 PS", "1.5 VTEC Turbo 182 PS", "1.6 i-DTEC 120 PS"]]],
    "Suzuki|Swift": [["AZ", "ab 2017", ["1.2 90 PS", "Sport 1.4 Boosterjet 129 PS", "Sport 1.4 Boosterjet 140 PS"]]],
    "Suzuki|Vitara": [["LY", "ab 2015", ["1.0 Boosterjet 111 PS", "1.4 Boosterjet 129 PS", "1.4 Boosterjet 140 PS", "1.6 DDiS 120 PS"]]],
    "Iveco|Daily": [["Daily VI / VII", "ab 2014", ["2.3 116 PS", "2.3 136 PS", "2.3 156 PS", "3.0 150 PS", "3.0 160 PS", "3.0 170 PS", "3.0 180 PS", "3.0 207 PS", "3.0 210 PS"]]],
    "MAN|TGE": [["SY", "ab 2017", ["2.0 TDI 102 PS", "2.0 TDI 122 PS", "2.0 TDI 140 PS", "2.0 TDI 177 PS"]]]
  };

  // Stage-1-Faktoren je Motortyp (von Sinan, 16.11.2026). Mert kann sie hier anpassen.
  // Angezeigt wird eine Spanne: von 75 % bis 100 % des Zuwachses, auf 5 PS gerundet
  var FAKTOREN = {
    turbo:    {name:"Turbobenziner", ps:0.22},
    diesel:   {name:"Turbodiesel", ps:0.20},
    leistung: {name:"Performance / Biturbo", ps:0.16},
    sauger:   {name:"Saugmotor", ps:0.06}
  };
  var DIESEL=/TDI|CDI|CRD|\dsd\b|dCi|TDCi|EcoBlue|HDi|Multijet|JTD|D-4D|DI-D|i-DTEC|Skyactiv-D|CDTI|CRDi|DDiS|Diesel|BlueTEC|TDV\d|SDV\d|\bTD4|\bSD4|\bTd6|\bSd4|\bD\d{3}\b|\bD\d\b|\d+d\b|\bd\b|Cooper S?D\b/;
  var HYBRID=/Hybrid|GTE|\d+e\b|P\d{3}e\b|PHEV|Recharge|\bT8\b|\biV\b|e-Power|E-Tech|4xe|Plug-in|\b\d+ e\b/;
  var LEISTUNG=/AMG|\bRS\s?\d|\bRS Q\d|RS\d|BiTDI|BiTurbo|^M[2-6]\b|M5|Competition|\bCS\b|Turbo S|\bSVR\b|Quadrifoglio|V8|V10|V12|\bS[4-8] \d\.\d|SQ[5-8]|\b1M\b|GT3|Type R|\bN \d|VZ5|Raptor|SRT|M550d|M50d|M550i|M50i/;
  // Saugmotoren nach Marke und Baureihe, soweit bekannt (ohne Gewähr)
  var SAUGER=[
    ["BMW",/^E46$/,/i\b/],["BMW",/^E90/,/^3(1[68]|2[05]|30)i/],["BMW",/^E60/,/^52[35]i|^530i|^540i|^550i/],["BMW",/^E8[1278]/,/^11[68]i|^120i|^130i/],
    ["BMW",/^E83/,/si\b/],["BMW",/^E70/,/3\.0si|4\.8i/],["BMW",/^E89/,/^2[3]i|^30i/],
    ["Audi",null,/3\.2 FSI|2\.8 FSI|3\.6 FSI|4\.2 FSI|4\.2 V8|5\.2 V10/],["Volkswagen",null,/FSI 1|1\.6 FSI|2\.0 FSI|3\.2 V6|3\.6 V6|R32|^1\.0 \d|4\.2 V8/],
    ["Mercedes-Benz",/W203|W211/,/^[CE] (2[38]0|350|500)\b/],["Mercedes-Benz",/W204|W221|W166/,/^C 350 306|^S 350 272|^ML 350 306/],
    ["Porsche",/^997$/,/^Carrera|^GT3/],["Porsche",/^991$/,/^Carrera (S )?(350|400)|^GTS 430|^GT3/],["Porsche",/^981$/,/./],["Porsche",/^92A$/,/3\.6 V6|^S 400|^GTS 420/],["Porsche",/^970$/,/3\.6 V6|^4S 400|^GTS/],["Porsche",/718/,/GTS 4\.0/],
    ["Ford",null,/^1\.25|^1\.4 \d|^1\.6 \d|Ti-VCT|^1\.8 \d|^2\.0 \d|^1\.1 \d|5\.0 V8/],["Opel",null,/^1\.2 \d|^1\.4 \d|^1\.6 \d|^1\.8 \d/],
    ["Mazda",null,/^1\.5 \d|^2\.0 \d|^2\.5 \d/],["Hyundai",null,/^1\.4 \d|\d\.\d GDI|^2\.4/],["Kia",null,/^1\.4 \d|\d\.\d GDI|^2\.4/],
    ["Fiat",null,/^1\.2 \d|^1\.4 \d/],["Toyota",/^J150$/,/4\.0 V6/],["Toyota",/^XA50$/,/^2\.0 \d/],["Jeep",null,/3\.6 V6|6\.4 V8/],["Suzuki",null,/^1\.2 \d/],["Mitsubishi",null,/^2\.0 \d/]
  ];
  function motortyp(marke,baureihe,motor){
    if(HYBRID.test(motor))return "hybrid";
    if(DIESEL.test(motor))return LEISTUNG.test(motor)?"leistung":"diesel";
    for(var i=0;i<SAUGER.length;i++){var r=SAUGER[i];if(r[0]===marke&&(!r[1]||r[1].test(baureihe))&&r[2].test(motor))return "sauger"}
    if(LEISTUNG.test(motor))return "leistung";
    return "turbo";
  }
  function rund5(x){return Math.round(x/5)*5}

  var NS = "http://www.w3.org/2000/svg";
  var ruhig = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Schematische Kurven: typische Drehmomentform je Motortyp (Drehzahl, Anteil vom Maximum), Leistung = Drehmoment x Drehzahl,
     danach auf Serien-PS und geschätzte Stage-1-PS skaliert. Keine Messwerte. */
  var PROFIL={
    diesel:{bis:4800,t:[[1000,.45],[1500,.8],[1800,1],[2750,1],[3500,.86],[4200,.72],[4800,.56]]},
    turbo:{bis:6500,t:[[1000,.45],[1500,.85],[1800,1],[4500,1],[5500,.88],[6500,.72]]},
    leistung:{bis:7000,t:[[1000,.4],[2000,.85],[2500,1],[5000,1],[6000,.9],[7000,.78]]},
    sauger:{bis:7000,t:[[1000,.7],[2500,.8],[4500,1],[5500,.98],[6500,.88],[7000,.8]]}
  };
  var X0=36,X1=308,Y0=30,Y1=180,PUNKTE=72;
  function tWert(k,n){for(var i=1;i<k.length;i++){if(n<=k[i][0]){var a=k[i-1],b=k[i],x=(n-a[0])/(b[0]-a[0]);x=(1-Math.cos(x*Math.PI))/2;return a[1]+(b[1]-a[1])*x}}return k[k.length-1][1]}
  function anhebung(x){return x<.6?.5+.5*Math.sin(Math.PI*x/1.2):1-(x-.6)*.6}
  function kurven(e){
    var p=PROFIL[e.typ]||PROFIL.turbo, g=e.hoch/e.ps, roh=[], rohT=[], i, n;
    for(i=0;i<=PUNKTE;i++){n=1000+(p.bis-1000)*i/PUNKTE;var t=tWert(p.t,n);roh.push(t*n);rohT.push(t*n*(1+g*anhebung(i/PUNKTE)))}
    function glatt(w){for(var r=0;r<3;r++){w=w.map(function(_,i){var su=0,an=0;for(var j=i-6;j<=i+6;j++){if(j>=0&&j<w.length){su+=w[j];an++}}return su/an})}return w}
    roh=glatt(roh);rohT=glatt(rohT);
    var mS=Math.max.apply(null,roh), mT=Math.max.apply(null,rohT), s=[], h=[], l=[];
    for(i=0;i<=PUNKTE;i++){s.push(roh[i]/mS*e.ps);var hv=rohT[i]/mT*(e.ps+e.hoch);h.push(Math.max(hv,s[i]));l.push(Math.max(hv*(e.ps+e.tief)/(e.ps+e.hoch),s[i]))}
    return {s:s,h:h,l:l,bis:p.bis};
  }
  function skala(oben){var o=oben*1.08,stufe=[10,20,25,50,100,200].find(function(x){return Math.ceil(o/x)<=6})||250;return {max:Math.ceil(o/stufe)*stufe,stufe:stufe}}
  function yMax(oben){return skala(oben).max}
  function diagrammBauen(ziel,e,kennung){
    ziel.textContent="";
    var k=kurven(e), sk=skala(e.ps+e.hoch), max=sk.max, stufe=sk.stufe;
    function el(tag,attr,text,eltern){var x=document.createElementNS(NS,tag);for(var a in attr)x.setAttribute(a,attr[a]);if(text!=null)x.textContent=text;(eltern||ziel).appendChild(x);return x}
    function px(i){return X0+(X1-X0)*i/PUNKTE}
    function py(v){return Y1-(Y1-Y0)*v/max}
    function linie(w){return w.map(function(v,i){return (i?"L":"M")+px(i).toFixed(1)+" "+py(v).toFixed(1)}).join(" ")}
    var defs=el("defs",{});
    function clip(n){var c=el("clipPath",{id:kennung+n},null,defs);return el("rect",{x:X0-2,y:0,width:0,height:Y1+4},null,c)}
    var cS=clip("s"), cT=clip("t");
    for(var j=0;j*stufe<=max;j++){var v=stufe*j,y=py(v);el("line",{"class":"gitter",x1:X0,y1:y,x2:X1,y2:y});el("text",{"class":"achse rechts",x:X0-6,y:y+3.5},String(v))}
    for(var n=1000;n<=k.bis;n+=1000){var x=X0+(X1-X0)*(n-1000)/(k.bis-1000);el("text",{"class":"achse mitte",x:x,y:Y1+14},String(n/1000))}
    el("text",{"class":"achse mitte",x:(X0+X1)/2,y:Y1+30},"Drehzahl in 1.000 U/min");
    el("text",{"class":"achse",x:4,y:Y0-8},"PS");
    el("line",{"class":"leg-serie",x1:X0,y1:12,x2:X0+16,y2:12});el("text",{"class":"achse",x:X0+21,y:15.5},"Serie");
    el("line",{"class":"leg-stage",x1:X0+60,y1:12,x2:X0+76,y2:12});el("text",{"class":"achse",x:X0+81,y:15.5},"Stage 1, geschätzt");
    el("text",{"class":"achse rechts",x:X1,y:15.5},"schematisch");
    var gT=el("g",{"clip-path":"url(#"+kennung+"t)"});
    el("path",{"class":"band",d:linie(k.h)+" "+k.l.slice().reverse().map(function(v,i){return "L"+px(PUNKTE-i).toFixed(1)+" "+py(v).toFixed(1)}).join(" ")+" Z"},null,gT);
    el("path",{"class":"k-stage",d:linie(k.h)},null,gT);
    el("path",{"class":"k-serie",d:linie(k.s),"clip-path":"url(#"+kennung+"s)"});
    var zeiger=el("line",{"class":"zeiger",x1:X0,y1:Y0,x2:X0,y2:Y1,opacity:0});
    function spitze(w){var m=0,i=0;w.forEach(function(v,j){if(v>m){m=v;i=j}});return i}
    var iS=spitze(k.s), iT=spitze(k.h);
    var pS=el("circle",{"class":"p-serie",cx:px(iS),cy:py(k.s[iS]),r:3.5,opacity:0}), pT=el("circle",{"class":"p-stage",cx:px(iT),cy:py(k.h[iT]),r:4,opacity:0});
    function bis(w,f){var m=0,ende=Math.round(f*PUNKTE);for(var i=0;i<=ende;i++)if(w[i]>m)m=w[i];return m}
    var d={
      serie:function(f){cS.setAttribute("width",(X1-X0+4)*f);zeiger.setAttribute("opacity",f<1?1:0);zeiger.setAttribute("x1",px(f*PUNKTE));zeiger.setAttribute("x2",px(f*PUNKTE));return bis(k.s,f)},
      stage:function(f){cT.setAttribute("width",(X1-X0+4)*f);zeiger.setAttribute("opacity",f<1?1:0);zeiger.setAttribute("x1",px(f*PUNKTE));zeiger.setAttribute("x2",px(f*PUNKTE));return bis(k.h,f)},
      ende:function(){d.serie(1);d.stage(1);pS.setAttribute("opacity",1);pT.setAttribute("opacity",1)}
    };
    return d;
  }

  var $ = function(id){ return document.getElementById(id); };
  var form = $("form"); if (!form) return;
  var marke=$("marke"), modell=$("modell"), frei=$("modell-frei"), freiFeld=$("modell-frei-feld"),
      baureihe=$("baureihe"), baureiheFeld=$("baureihe-feld"), motorListe=$("motor-liste"), motorListeFeld=$("motor-liste-feld"),
      motor=$("motor"), motorFreiFeld=$("motor-frei-feld"), kraftstoff=$("kraftstoff"), kraftstoffFeld=$("kraftstoff-feld"),
      baujahr=$("baujahr"), motorHinweis=$("motor-hinweis"), anmerkung=$("anmerkung"), text=$("text"), senden=$("senden");
  var schritte=[$("schritt-1"),$("schritt-2"),$("schritt-3")], punkte=[].slice.call(form.querySelectorAll(".fortschritt li"));
  var NICHT_DABEI="__frei", aktiv=0, aktuell=null, gezeigt="", lauf=0;
  var PREIS_STAGE1="ab 350 €";   // (bestätigen) von Mert

  function daten(){ return MOTOREN[marke.value+"|"+modell.value]; }

  Object.keys(FAHRZEUGE).sort(function(a,b){return a.localeCompare(b,"de")}).forEach(function(m){ marke.appendChild(new Option(m,m)); });
  marke.appendChild(new Option("Andere Marke","__andere"));
  for (var jahr=new Date().getFullYear(); jahr>=2000; jahr--) baujahr.appendChild(new Option(String(jahr),String(jahr)));
  baujahr.appendChild(new Option("vor 2000","vor 2000"));

  function modelleFuellen(){
    modell.textContent="";
    var m=marke.value;
    if(!m){ modell.disabled=true; modell.appendChild(new Option("Erst Marke wählen","")); freiFeld.hidden=true; return; }
    if(m==="__andere"){ modell.disabled=true; modell.appendChild(new Option("Bitte unten eintragen","")); freiFeld.hidden=false; return; }
    modell.disabled=false;
    modell.appendChild(new Option("Bitte wählen",""));
    FAHRZEUGE[m].forEach(function(x){ modell.appendChild(new Option(x,x)); });
    modell.appendChild(new Option("Anderes Modell","__andere"));
    freiFeld.hidden=true;
  }
  function baureihenFuellen(){
    var d=daten(); baureihe.textContent="";
    baureiheFeld.hidden=!d;
    if(!d) return;
    baureihe.appendChild(new Option("Bitte wählen",""));
    d.forEach(function(b,i){ baureihe.appendChild(new Option(b[0]+" ("+b[1]+")",String(i))); });
    baureihe.appendChild(new Option("Weiß ich nicht",NICHT_DABEI));
  }
  function motorenFuellen(){
    var d=daten(), b=d&&d[Number(baureihe.value)];
    var liste=!!(d&&baureihe.value!==""&&baureihe.value!==NICHT_DABEI&&b);
    motorListe.textContent="";
    motorListeFeld.hidden=!liste; motorHinweis.hidden=!liste;
    if(liste){
      motorListe.appendChild(new Option("Bitte wählen",""));
      b[2].forEach(function(m){ motorListe.appendChild(new Option(m,m)); });
      motorListe.appendChild(new Option("Mein Motor ist nicht dabei",NICHT_DABEI));
    }
    motorFrei();
  }
  // Kraftstoff nur fragen, wenn der Motor von Hand eingetragen wird; sonst aus dem Motor ableiten
  function motorFrei(){
    var vonHand = motorListeFeld.hidden || motorListe.value===NICHT_DABEI;
    motorFreiFeld.hidden=!vonHand; kraftstoffFeld.hidden=!vonHand;
    if(!vonHand && motorListe.value){ var n=motorListe.value.replace(/ \d+ PS$/,""); kraftstoff.value=HYBRID.test(n)?"Hybrid":DIESEL.test(n)?"Diesel":"Benzin"; }
  }
  function wert(){
    var m=marke.value==="__andere"?"":marke.value;
    var mod=(marke.value==="__andere"||modell.value==="__andere")?frei.value.trim():modell.value;
    var d=daten(), br="", mo=motor.value.trim(), gewaehlt=false;
    if(d){ var b=d[Number(baureihe.value)]; if(baureihe.value!==""&&baureihe.value!==NICHT_DABEI&&b) br=b[0]; }
    if(!motorListeFeld.hidden && motorListe.value && motorListe.value!==NICHT_DABEI){ mo=motorListe.value; gewaehlt=true; }
    else if(motorFreiFeld.hidden) mo="";
    var w=(form.querySelector('input[name="wunsch"]:checked')||{}).value||"Stage 1";
    return {m:m, mod:mod+(br?" ("+br+")":""), br:br, mo:mo, j:baujahr.value, k:kraftstoff.value, w:w, gewaehlt:gewaehlt};
  }
  function schaetzen(v){
    if(!v.gewaehlt) return null;
    var ps=Number((v.mo.match(/(\d+) PS/)||[])[1]), typ=motortyp(marke.value,v.br,v.mo);
    if(typ==="hybrid"||!ps) return null;
    var f=FAKTOREN[typ], hoch=rund5(ps*f.ps), tief=rund5(ps*f.ps*0.75);
    if(hoch<5) return null;
    if(tief<=0) tief=hoch;
    return {ps:ps, tief:tief, hoch:hoch, typ:typ, schluessel:[marke.value,modell.value,v.br,v.mo].join("|")};
  }
  function bereich(e){ return e.tief<e.hoch ? "ca. "+(e.ps+e.tief)+"–"+(e.ps+e.hoch)+" PS" : "ca. "+(e.ps+e.hoch)+" PS"; }
  function spanne(e){ return (e.tief<e.hoch ? (e.ps+e.tief)+"–"+(e.ps+e.hoch) : String(e.ps+e.hoch))+"\u00a0PS"; }
  function plus(e){ return (e.tief<e.hoch ? "+"+e.tief+" bis +"+e.hoch+"\u00a0PS" : "+"+e.hoch+"\u00a0PS")+" gegenüber Serie ("+e.ps+"\u00a0PS)"; }

  function nachricht(){
    var v=wert(), e=aktuell, anm=anmerkung.value.trim();
    var fz=[v.m,v.mod].filter(Boolean).join(" ")||"…";
    var z=["Hallo Brenz KFZ, "+(v.w==="Beratung"?"ich hätte gern eine Beratung, was bei meinem Fahrzeug möglich ist.":"ich interessiere mich für "+v.w+".")];
    z.push("Fahrzeug: "+fz+(v.j?", Baujahr "+v.j:"")+(v.k?", "+v.k:"")+(v.mo?", "+v.mo:""));
    if(e && v.w!=="Stage 2") z.push("Schätzung im Rechner (Stage 1): "+bereich(e));
    if(anm) z.push("Anmerkung: "+anm);
    var t=z.join("\n");
    text.textContent=t;
    var ok=!!(v.mod&&v.j);
    senden.setAttribute("aria-disabled",ok?"false":"true");
    senden.href=ok?"https://wa.me/"+NUMMER+"?text="+encodeURIComponent(t):"#";
  }

  function ergebnisZeigen(animieren){
    var v=wert(), e=schaetzen(v);
    aktuell=e;
    $("fahrzeug-text").textContent=[[v.m,v.mod].filter(Boolean).join(" "), v.mo, v.j].filter(Boolean).join(" · ");
    $("ergebnis").hidden=!e; $("keine-schaetzung").hidden=!!e;
    var w1=$("wahl-stage1"); w1.textContent = e ? PREIS_STAGE1+" · geschätzt ca. " : PREIS_STAGE1;
    if(e){ var sp=document.createElement("span"); sp.style.whiteSpace="nowrap"; sp.textContent=spanne(e); w1.appendChild(sp); }
    nachricht();
    if(!e) return;
    var gesamt=$("erg-wert"), ca=$("erg-ca"), plusZeile=$("erg-plus"), status=$("erg-status");
    var d=diagrammBauen($("dia-svg"),e,"i"), id=++lauf;
    var erledigt=false;
    function fertig(){ if(erledigt) return; erledigt=true; d.ende(); ca.hidden=false; gesamt.textContent=spanne(e); plusZeile.textContent=plus(e); status.textContent="Geschätzt nach Stage 1: "+bereich(e); gezeigt=e.schluessel; }
    if(!animieren || ruhig || e.schluessel===gezeigt){ fertig(); return; }
    plusZeile.textContent="\u00a0"; ca.hidden=true;
    setTimeout(function(){ if(id===lauf) fertig(); }, 3200);   // falls der Browser keine Bilder zeichnet (Tab im Hintergrund)
    function weich(x){ return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2; }
    var A=1100, P=250, C=1200, start=null;
    function bild(ts){
      if(id!==lauf || erledigt) return;
      if(start===null) start=ts;
      var z=ts-start;
      if(z<A) gesamt.textContent=Math.round(d.serie(weich(z/A)))+"\u00a0PS";
      else if(z<A+P) gesamt.textContent=e.ps+"\u00a0PS";
      else if(z<A+P+C) gesamt.textContent=Math.round(d.stage(weich((z-A-P)/C)))+"\u00a0PS";
      else { fertig(); return; }
      requestAnimationFrame(bild);
    }
    requestAnimationFrame(bild);
  }

  function pruefen(){
    var ok1=!!marke.value && ((marke.value!=="__andere" && modell.value && modell.value!=="__andere") || !!frei.value.trim()) && (baureiheFeld.hidden || baureihe.value!=="");
    $("weiter-1").disabled=!ok1;
    $("weiter-2").disabled=!baujahr.value;
    var v=wert(), auswahl=$("auswahl");
    auswahl.textContent=[v.m,v.mod].filter(Boolean).join(" ");
    auswahl.hidden=aktiv!==1;
  }
  function zeige(i,fokus){
    aktiv=i;
    schritte.forEach(function(s,j){ s.hidden=j!==i; });
    punkte.forEach(function(p,j){ p.classList.toggle("fertig",j<i); if(j===i) p.setAttribute("aria-current","step"); else p.removeAttribute("aria-current"); });
    pruefen();
    if(i===2) ergebnisZeigen(true);
    if(fokus){
      var f=$("frage-"+(i+1)); if(f) f.focus({preventScroll:true});
      var oben=form.getBoundingClientRect().top;
      if(oben<0||oben>innerHeight*.4) form.scrollIntoView({block:"start",behavior:ruhig?"auto":"smooth"});
    }
  }

  marke.addEventListener("change",function(){ modelleFuellen(); baureihenFuellen(); motorenFuellen(); pruefen(); });
  modell.addEventListener("change",function(){ freiFeld.hidden=!(marke.value==="__andere"||modell.value==="__andere"); baureihenFuellen(); motorenFuellen(); pruefen(); });
  baureihe.addEventListener("change",function(){ motorenFuellen(); pruefen(); });
  motorListe.addEventListener("change",function(){ motorFrei(); pruefen(); });
  [frei,motor].forEach(function(e){ e.addEventListener("input",pruefen); });
  [baujahr,kraftstoff].forEach(function(e){ e.addEventListener("change",pruefen); });
  [].forEach.call(form.querySelectorAll('input[name="wunsch"]'),function(r){ r.addEventListener("change",nachricht); });
  anmerkung.addEventListener("input",nachricht);
  $("weiter-1").addEventListener("click",function(){ zeige(1,true); });
  $("weiter-2").addEventListener("click",function(){ zeige(2,true); });
  $("aendern").addEventListener("click",function(){ zeige(0,true); });
  [].forEach.call(form.querySelectorAll("[data-zurueck]"),function(b){ b.addEventListener("click",function(){ zeige(aktiv-1,true); }); });
  form.addEventListener("submit",function(e){ e.preventDefault(); });
  modelleFuellen(); baureihenFuellen(); motorenFuellen(); zeige(0,false);
})();
