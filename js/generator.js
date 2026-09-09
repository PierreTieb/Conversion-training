// generator.js
// Génère des conversions aléatoires pour les modes "facile", "moyen" et "evaluation"
// (le mode evaluation réutilise les règles du mode "moyen").

(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomCategory() {
    return Units.CATEGORIES[randInt(0, Units.CATEGORIES.length - 1)];
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
    // Filet de sécurité (ne devrait jamais arriver)
    return { from: 3, to: 0 };
  }

  function computeAnswer(value, fromRank, toRank) {
    const shift = Units.EXPONENTS[fromRank] - Units.EXPONENTS[toRank];
    let result = value * Math.pow(10, shift);
    // Arrondi pour neutraliser les artefacts de virgule flottante
    result = Math.round(result * 1e6) / 1e6;
    return result;
  }

  // Valeur entière simple (mode facile) : 1 à 99
  function randomIntegerValue() {
    return randInt(1, 99);
  }

  // Valeur avec décimales possibles (mode moyen / évaluation)
  function randomDecimalValue() {
    const intPart = randInt(0, 999);
    let value = intPart === 0 ? randInt(1, 9) : intPart;
    if (Math.random() < 0.65) {
      const decimals = randInt(1, 2);
      const maxDec = Math.pow(10, decimals) - 1;
      const decPart = randInt(1, maxDec);
      value = parseFloat((value + decPart / Math.pow(10, decimals)).toFixed(decimals));
    }
    return value;
  }

  function generate(level) {
    const category = randomCategory();
    let ranks, value;

    if (level === 'facile') {
      ranks = pickRanks(3);
      value = randomIntegerValue();
    } else {
      ranks = pickRanks(null);
      value = randomDecimalValue();
    }

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

  window.Generator = { generate, nearlyEqual, parseUserValue, formatNumberFR };
})();
