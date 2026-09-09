const gomb = document.querySelector('.főgomb');
const szöveg = document.querySelector('.szöveg');
const szorzógomb = document.querySelector('.szorzógomb');
const resetGomb = document.querySelector('.resetgomb');
const szorzóSzöveg = document.querySelector('.szorzószöveg');
const autoclickszöveg = document.querySelector('.autoclickszöveg');
const autoclickgomb = document.querySelector('.autoclickgomb');

let pontszám = Number(localStorage.getItem('pontok')) || 0;
let szorzó = Number(localStorage.getItem('szorzó')) || 1;
let automata = Number(localStorage.getItem('auto')) || 0;

const frissítés = () => {
    // Szövegek frissítése
    szöveg.textContent = "Pontszám: " + pontszám;
    szorzóSzöveg.textContent = "Kattintásonként " + szorzó + " pont";
    autoclickszöveg.textContent = "Autoclick: " + automata + " pont/mp";

    // JAVÍTÁS: Nem tüntetjük el a Reset gombot, hanem letiltjuk (disabled), ha alaphelyzetben van.
    // Így a CSS elrendezésed SOHA nem fog szétesni!
    if (pontszám === 0 && szorzó === 1 && automata === 0) {
        resetGomb.disabled = true;
        resetGomb.style.opacity = "0.5";
        resetGomb.style.cursor = "not-allowed";
    } else {
        resetGomb.disabled = false;
        resetGomb.style.opacity = "1";
        resetGomb.style.cursor = "pointer";
    }

    // Szorzó gomb szövege és ára
    if (szorzó < 10) {
        szorzógomb.textContent = `Fejlesztés ára: ${(szorzó + 1) * 10} pont`;
        szorzógomb.disabled = pontszám < (szorzó + 1) * 10; // Automatikusan letiltódik, ha nincs elég pontod
    }
    else if (szorzó < 100) {
        szorzógomb.textContent = `Fejlesztés ára: ${(szorzó + 10) * 10} pont`;
        szorzógomb.disabled = pontszám < (szorzó + 10) * 10;
    }
    else {
        szorzógomb.textContent = `Fejlesztés elérte a maximumot!`;
        szorzógomb.disabled = true;
    }

    // Autoclick gomb szövege és ára
    if (automata < 10) {
        autoclickgomb.textContent = `Fejlesztés ára: ${(automata + 1) * 50} pont`;
        autoclickgomb.disabled = pontszám < (automata + 1) * 50;
    }
    else if (automata < 100) {
        autoclickgomb.textContent = `Fejlesztés ára: ${(automata + 10) * 50} pont`;
        autoclickgomb.disabled = pontszám < (automata + 10) * 50;
    }
    else {
        autoclickgomb.textContent = `Fejlesztés elérte a maximumot!`;
        autoclickgomb.disabled = true;
    }

    // LocalStorage mentés
    localStorage.setItem('pontok', pontszám);
    localStorage.setItem('szorzó', szorzó);
    localStorage.setItem('auto', automata);
};

// Kezdő frissítés indítása
frissítés();

// Autoclick időzítő
setInterval(() => {
    if (automata > 0) {
        pontszám += automata;
        frissítés();
    }
}, 1000);

// Főgomb kattintás látványos effektussal
gomb.addEventListener('click', function(e) {
    pontszám += szorzó;
    frissítés();

    // Létrehozunk egy új szöveges elemet a +pontnak
    const lebege = document.createElement('div');
    lebege.classList.add('LebegoPont');
    lebege.textContent = `+${szorzó}`;

    // Kiszámoljuk a kattintás pontos helyét a bal-oldali panelen belül
    const panel = document.querySelector('.bal-oldal');
    const rect = panel.getBoundingClientRect();
    
    // Elhelyezzük a számot pontosan oda, ahol az egér kattintott
    lebege.style.left = `${e.clientX - rect.left - 10}px`;
    lebege.style.top = `${e.clientY - rect.top - 20}px`;

    // Berakjuk a számot a bal panelbe
    panel.appendChild(lebege);

    // 0.8 másodperc után (amikor az animáció véget ér) automatikusan kitöröljük az elemet, hogy ne lassítsa a böngészőt
    setTimeout(() => {
        lebege.remove();
    }, 800);
});


// Szorzó vásárlás
szorzógomb.addEventListener('click', function() {
    if (szorzó < 10) {
        let ár = (szorzó + 1) * 10;
        if (pontszám < ár) {
            alert(`A szorzó növeléséhez legalább ${ár} pont szükséges.`);
            return;
        }
        pontszám -= ár; // JAVÍTÁS: A pontos, kiírt árat vonjuk le!
        szorzó++;
    }
    else if (szorzó < 100) {
        let ár = (szorzó + 10) * 10;
        if (pontszám < ár) {
            alert(`A szorzó növeléséhez legalább ${ár} pont szükséges.`);
            return;
        }
        pontszám -= ár; // JAVÍTÁS: A pontos, kiírt árat vonjuk le!
        szorzó += 10;
    }
    frissítés();
});

// Autoclick vásárlás
autoclickgomb.addEventListener('click', function() {
    if (automata < 10) {
        let ár = (automata + 1) * 50;
        if (pontszám < ár) {
            alert(`Az autoclick növeléséhez legalább ${ár} pont szükséges.`);
            return;
        }
        pontszám -= ár; // JAVÍTÁS: A pontos árat vonjuk le!
        automata++;
    }
    else if (automata < 100) {
        let ár = (automata + 10) * 50;
        if (pontszám < ár) {
            alert(`Az autoclick növeléséhez legalább ${ár} pont szükséges.`);
            return;
        }
        pontszám -= ár; // JAVÍTÁS: A pontos árat vonjuk le!
        automata += 10;
    }
    frissítés();
});

// Reset gomb működése
resetGomb.addEventListener('click', function() {
    pontszám = 0;
    szorzó = 1;
    automata = 0;
    frissítés();
});
