// generator.js
// Génère des conversions aléatoires pour les modes "facile", "moyen" et
// "evaluation" (evaluation réutilise les règles du mode "moyen"), en
// respectant la capacité du tableau brouillon à 9 colonnes : le nombre
// affiché ne doit jamais nécessiter plus de colonnes que celles disponibles,
// que ce soit avec l'unité de départ ou l'unité d'arrivée.
//
// Colonnes du tableau (9 au total) :
//   [extra-gauche] k h da _ d c m [extra-droite]
// Un rang r (0=k ... 6=m) occupe la colonne (r+1) sur 9 (index 0..8).
//   - colonnes disponibles à sa gauche = (r+1)   -> chiffres entiers max = r+2
//   - colonnes disponibles à sa droite = (7-r)   -> chiffres décimaux max = 7-r

(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomCategory(poolKeys) {
    const keys = poolKeys || Units.BASIC_CATEGORY_KEYS;
    const list = Units.CATEGORIES.filter((c) => keys.includes(c.key));
    return list[randInt(0, list.length - 1)];
  }

  // Choisit un rang de départ et un rang d'arrivée (0..6), avec un écart
  // maximal optionnel (en nombre de colonnes du tableau de conversion).
  function pickRanks(maxDiff) {
    let attempts = 0;
    while (attempts < 200) {
      attempts++;
      const from = randInt(0, 6);
      const options = [];
      for (let r = 0; r <= 6; r++) {
        if (r === from) continue;
        if (maxDiff && Math.abs(r - from) > maxDiff) continue;
        options.push(r);
      }
      if (options.length === 0) continue;
      const to = options[randInt(0, options.length - 1)];
      return { from, to };
    }
    return { from: 3, to: 0 }; // filet de sécurité, ne devrait jamais servir
  }

  function computeAnswer(value, fromRank, toRank) {
    const shift = Units.EXPONENTS[fromRank] - Units.EXPONENTS[toRank];
    let result = value * Math.pow(10, shift);
    result = Math.round(result * 1e6) / 1e6; // neutralise les artefacts flottants
    return result;
  }

  // Détermine la valeur (partie entière + décimales) en respectant la
  // capacité du tableau à 9 colonnes pour les deux rangs concernés, plus la
  // restriction "99 max" du mode facile et le plafond global de 3 décimales.
  function randomValueForRanks(fromRank, toRank, level) {
    let maxIntDigits = Math.min(fromRank, toRank) + 2;
    if (level === 'facile') {
      maxIntDigits = Math.min(maxIntDigits, 2); // reste dans l'esprit "<= 99"
    }

    let maxDecDigits = Math.min(3, 7 - Math.max(fromRank, toRank));
    if (maxDecDigits < 0) maxDecDigits = 0;
    if (level === 'facile') {
      maxDecDigits = 0; // le mode facile ne génère que des nombres entiers
    }

    const upperInt = Math.pow(10, maxIntDigits) - 1;
    const intPart = randInt(1, upperInt);

    const decDigits = randInt(0, maxDecDigits);
    let value = intPart;
    if (decDigits > 0) {
      const upperDec = Math.pow(10, decDigits) - 1;
      const decPart = randInt(1, upperDec);
      value = parseFloat((intPart + decPart / Math.pow(10, decDigits)).toFixed(decDigits));
    }
    return value;
  }

  function generate(level, poolKeys) {
    const category = randomCategory(poolKeys);
    const maxDiff = level === 'facile' ? 3 : null;
    const ranks = pickRanks(maxDiff);
    const value = randomValueForRanks(ranks.from, ranks.to, level);
    const answer = computeAnswer(value, ranks.from, ranks.to);

    return {
      category: category.key,
      fromRank: ranks.from,
      toRank: ranks.to,
      fromValue: value,
      fromLabel: Units.unitLabel(category, ranks.from),
      toLabel: Units.unitLabel(category, ranks.to),
      answer
    };
  }

  // Exemple pour le mode Tuto : toujours dans la famille des mètres, un
  // nombre < 100 avec exactement 1 décimale, converti vers une unité 3
  // rangs plus grande (facteur 1000) : mm->m, cm->dam, dm->hm, m->km.
  function generateTuto() {
    const category = Units.categoryByKey('distance');
    const fromRank = randInt(3, 6);
    const toRank = fromRank - 3;

    const intPart = randInt(1, 99);
    const decDigit = randInt(1, 9);
    const value = parseFloat((intPart + decDigit / 10).toFixed(1));

    const answer = computeAnswer(value, fromRank, toRank);

    return {
      category: 'distance',
      fromRank,
      toRank,
      fromValue: value,
      fromLabel: Units.unitLabel(category, fromRank),
      toLabel: Units.unitLabel(category, toRank),
      answer
    };
  }

  // Renvoie {rest, count} : combien de fois p divise n, et ce qu'il reste
  function factorOutPow(n, p) {
    let count = 0;
    let rest = n;
    while (rest % p === 0) {
      rest = rest / p;
      count++;
    }
    return { rest, count };
  }

  // Plus petit entier positif u tel que (u / F) ait au plus 3 décimales
  // exactement (pas d'arrondi : une vraie division qui se termine).
  function minimalDivisibleUnit(F) {
    const two = factorOutPow(F, 2);
    const five = factorOutPow(two.rest, 5);
    const extraTwo = Math.max(0, two.count - 3);
    const extraFive = Math.max(0, five.count - 3);
    return five.rest * Math.pow(2, extraTwo) * Math.pow(5, extraFive);
  }

  function decimalPlaces(num) {
    const rounded = Math.round(num * 1e6) / 1e6;
    const str = rounded.toString();
    const i = str.indexOf('.');
    return i === -1 ? 0 : str.length - i - 1;
  }

  // Exemple pour le Tuto Temps : 2 unités distinctes parmi les 5 (année à
  // seconde), n'importe quel écart (peut nécessiter plusieurs opérations).
  // La valeur est construite pour que la réponse ait toujours 3 décimales
  // maximum (jamais un nombre qui tombe "mal").
  function generateTutoTemps() {
    let fromIndex, toIndex;
    do {
      fromIndex = randInt(0, 4);
      toIndex = randInt(0, 4);
    } while (fromIndex === toIndex);

    const ops = Units.timeRequiredOps(fromIndex, toIndex);
    let value;

    if (fromIndex < toIndex) {
      // Uniquement des multiplications : le résultat est toujours entier.
      value = randInt(1, 99);
    } else {
      // Une ou plusieurs divisions : on construit une valeur qui tombe juste.
      const factor = ops.reduce((acc, o) => acc * o.factor, 1);
      const minimalUnit = minimalDivisibleUnit(factor);
      const kMax = Math.max(1, Math.min(99, Math.floor(999999 / minimalUnit)));
      value = minimalUnit * randInt(1, kMax);
    }

    let answer = Units.timeConvert(value, fromIndex, toIndex);
    if (decimalPlaces(answer) > 3) {
      answer = Math.round(answer * 1000) / 1000; // filet de sécurité, ne devrait pas servir
    }

    return {
      fromIndex,
      toIndex,
      fromValue: value,
      fromUnit: Units.TIME_UNITS[fromIndex],
      toUnit: Units.TIME_UNITS[toIndex],
      ops,
      answer
    };
  }

  // Exemple pour le Tuto Vitesse : m/s -> km/h (x3,6) ou km/h -> m/s (/3,6).
  // Pour la division, 9 est le plus petit multiple qui tombe toujours juste
  // (9 / 3,6 = 2,5 exactement), donc on multiplie 9 par un entier au hasard.
  function generateTutoVitesse() {
    const direction = randInt(0, 1) === 0 ? 'ms-to-kmh' : 'kmh-to-ms';
    let value;
    let answer;

    if (direction === 'ms-to-kmh') {
      value = randInt(1, 99);
      answer = Math.round(value * 3.6 * 1e6) / 1e6;
    } else {
      value = 9 * randInt(1, 99);
      answer = Math.round((value / 3.6) * 1e6) / 1e6;
    }

    return {
      direction,
      fromValue: value,
      fromUnit: direction === 'ms-to-kmh' ? 'm/s' : 'km/h',
      toUnit: direction === 'ms-to-kmh' ? 'km/h' : 'm/s',
      operation: direction === 'ms-to-kmh' ? '× 3,6' : '÷ 3,6',
      answer
    };
  }

  function nearlyEqual(a, b) {
    const diff = Math.abs(a - b);
    return diff <= Math.max(1e-6, Math.abs(b) * 1e-6);
  }

  // Accepte les nombres avec virgule ou point comme séparateur décimal
  function parseUserValue(str) {
    if (typeof str !== 'string') return NaN;
    const normalized = str.trim().replace(',', '.');
    if (normalized === '' || normalized === '.') return NaN;
    if (!/^\d*\.?\d+$/.test(normalized)) return NaN;
    return parseFloat(normalized);
  }

  // Formate un nombre pour l'affichage à la française (virgule décimale)
  function formatNumberFR(num) {
    const rounded = Math.round(num * 1e6) / 1e6;
    let str = rounded.toString();
    str = str.replace('.', ',');
    return str;
  }

  window.Generator = { generate, generateTuto, generateTutoTemps, generateTutoVitesse, computeAnswer, nearlyEqual, parseUserValue, formatNumberFR };
})();
