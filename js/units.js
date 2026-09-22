// units.js
// Définit les 3 grandeurs (masse, distance, volume), les 7 rangs de préfixes
// (k h da _ d c m) et des utilitaires pour le mode Custom (identifiants
// d'unité, regroupement par famille).

(function () {
  const PREFIXES = ['k', 'h', 'da', '', 'd', 'c', 'm'];
  // Exposant en base 10 associé à chaque rang (index 0 = k, index 6 = m)
  const EXPONENTS = [3, 2, 1, 0, -1, -2, -3];

  const CATEGORIES = [
    { key: 'masse', base: 'g' },
    { key: 'distance', base: 'm' },
    { key: 'volume', base: 'L' },
    { key: 'courant', base: 'A' },
    { key: 'tension', base: 'V' }
  ];

  const CATEGORY_LABELS = {
    masse: 'Masse',
    distance: 'Longueur',
    volume: 'Volume',
    courant: 'Courant électrique',
    tension: 'Tension électrique'
  };

  // Pool par défaut (4e) vs pool étendu (3e et au-delà) : le générateur et le
  // mode Custom restent sur BASIC tant qu'on ne demande pas explicitement le
  // pool étendu, pour ne jamais changer le comportement du 4e par erreur.
  const BASIC_CATEGORY_KEYS = ['masse', 'distance', 'volume'];
  const EXTENDED_CATEGORY_KEYS = ['masse', 'distance', 'volume', 'courant', 'tension'];
  function unitLabel(category, rank) {
    return PREFIXES[rank] + category.base;
  }

  function categoryByKey(key) {
    return CATEGORIES.find((c) => c.key === key);
  }

  // Identifiant stable d'une unité, utilisé comme value d'option <select>
  // (ex: "distance:0" pour km)
  function unitId(categoryKey, rank) {
    return categoryKey + ':' + rank;
  }

  function parseUnitId(id) {
    const [categoryKey, rankStr] = id.split(':');
    return { categoryKey, rank: parseInt(rankStr, 10) };
  }

  // Retourne la liste des 7 unités d'une famille, dans l'ordre k -> m
  function unitsForCategory(categoryKey) {
    const category = categoryByKey(categoryKey);
    return PREFIXES.map((prefix, rank) => ({
      id: unitId(categoryKey, rank),
      rank,
      label: unitLabel(category, rank)
    }));
  }

  // --- Temps : modèle dédié (facteurs non uniformes, pas de préfixes) ---
  // Ordre du plus grand au plus petit : année, jour, heure, minute, seconde.
  // FACTORS[i] relie l'unité i à l'unité i+1 (ex: 1 année = 365 jours).
  const TIME_UNITS = [
    { key: 'annee', full: 'année', short: 'an' },
    { key: 'jour', full: 'jours', short: 'j' },
    { key: 'heure', full: 'heure', short: 'h' },
    { key: 'minute', full: 'minute', short: 'min' },
    { key: 'seconde', full: 'seconde', short: 's' }
  ];
  const TIME_FACTORS = [365, 24, 60, 60]; // entre TIME_UNITS[i] et TIME_UNITS[i+1]

  // Liste ordonnée des opérations (op:'×'|'÷', factor) pour aller de fromIndex à toIndex
  function timeRequiredOps(fromIndex, toIndex) {
    const ops = [];
    if (fromIndex < toIndex) {
      for (let i = fromIndex; i < toIndex; i++) {
        ops.push({ op: '×', factor: TIME_FACTORS[i] });
      }
    } else if (fromIndex > toIndex) {
      for (let i = fromIndex - 1; i >= toIndex; i--) {
        ops.push({ op: '÷', factor: TIME_FACTORS[i] });
      }
    }
    return ops;
  }

  function timeConvert(value, fromIndex, toIndex) {
    const ops = timeRequiredOps(fromIndex, toIndex);
    let result = value;
    ops.forEach((o) => {
      result = o.op === '×' ? result * o.factor : result / o.factor;
    });
    return Math.round(result * 1e6) / 1e6;
  }

  // --- Familles dédiées au mode Custom (inclut temps et vitesse, qui ne
  // suivent pas le système de rangs/préfixes des autres familles) ---
  const CUSTOM_FAMILIES = {
    masse: { label: CATEGORY_LABELS.masse, getUnits: () => unitsForCategory('masse') },
    distance: { label: CATEGORY_LABELS.distance, getUnits: () => unitsForCategory('distance') },
    volume: { label: CATEGORY_LABELS.volume, getUnits: () => unitsForCategory('volume') },
    courant: { label: CATEGORY_LABELS.courant, getUnits: () => unitsForCategory('courant') },
    tension: { label: CATEGORY_LABELS.tension, getUnits: () => unitsForCategory('tension') },
    temps: {
      label: 'Temps',
      getUnits: () => TIME_UNITS.map((u, idx) => ({ id: 'temps:' + idx, label: u.full }))
    },
    vitesse: {
      label: 'Vitesse',
      getUnits: () => [
        { id: 'vitesse:ms', label: 'm/s' },
        { id: 'vitesse:kmh', label: 'km/h' }
      ]
    }
  };

  const CUSTOM_BASIC_FAMILY_KEYS = ['masse', 'distance', 'volume'];
  const CUSTOM_EXTENDED_FAMILY_KEYS = ['masse', 'distance', 'volume', 'courant', 'tension', 'temps', 'vitesse'];

  window.Units = {
    PREFIXES,
    EXPONENTS,
    CATEGORIES,
    CATEGORY_LABELS,
    unitLabel,
    categoryByKey,
    unitId,
    parseUnitId,
    unitsForCategory,
    BASIC_CATEGORY_KEYS,
    EXTENDED_CATEGORY_KEYS,
    TIME_UNITS,
    TIME_FACTORS,
    timeRequiredOps,
    timeConvert,
    CUSTOM_FAMILIES,
    CUSTOM_BASIC_FAMILY_KEYS,
    CUSTOM_EXTENDED_FAMILY_KEYS
  };
})();
