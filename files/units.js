// units.js
// Définit les 3 grandeurs (masse, distance, volume) et les 7 rangs de préfixes
// k_ h_ da_ _ d_ c_ m_ , chaque rang représente une puissance de 10 par rapport
// à l'unité de base (g, m ou L).

(function () {
  const PREFIXES = ['k', 'h', 'da', '', 'd', 'c', 'm'];
  // Exposant en base 10 associé à chaque rang (index 0 = k, index 6 = m)
  const EXPONENTS = [3, 2, 1, 0, -1, -2, -3];

  const CATEGORIES = [
    { key: 'masse', base: 'g' },
    { key: 'distance', base: 'm' },
    { key: 'volume', base: 'L' }
  ];

  function unitLabel(category, rank) {
    return PREFIXES[rank] + category.base;
  }

  window.Units = { PREFIXES, EXPONENTS, CATEGORIES, unitLabel };
})();
