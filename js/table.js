// table.js
// Construit le tableau de conversion "brouillon" : 9 colonnes (une case vide
// au-delà de kilo, k h da _ d c m, une case vide au-delà de milli), une case
// texte invisible par colonne, avance automatique du curseur vers la droite
// après la saisie d'un chiffre (sauf en toute dernière colonne, où le
// curseur se retire et il faut recliquer). Le tableau peut être vidé à la
// demande (à chaque nouvelle conversion).

(function () {
  const COLUMN_LABELS = ['', 'k_', 'h_', 'da_', '_', 'd_', 'c_', 'm_', ''];

  function buildTable(container) {
    container.innerHTML = '';

    const headerRow = document.createElement('div');
    headerRow.className = 'draft-row draft-header';
    COLUMN_LABELS.forEach((label) => {
      const cell = document.createElement('div');
      cell.className = 'draft-cell draft-head-cell';
      cell.textContent = label;
      headerRow.appendChild(cell);
    });
    container.appendChild(headerRow);

    const inputRow = document.createElement('div');
    inputRow.className = 'draft-row draft-input-row';
    const inputs = [];

    COLUMN_LABELS.forEach((label, idx) => {
      const cell = document.createElement('div');
      cell.className = 'draft-cell draft-input-cell';

      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'draft-input';
      input.inputMode = 'numeric';
      input.autocomplete = 'off';
      input.setAttribute('aria-label', label ? 'Colonne ' + label : 'Colonne supplémentaire');

      cell.appendChild(input);
      inputRow.appendChild(cell);
      inputs.push(input);
    });

    container.appendChild(inputRow);

    inputs.forEach((input, idx) => {
      input.addEventListener('input', () => {
        const digitOnly = input.value.replace(/[^0-9]/g, '').slice(0, 1);
        input.value = digitOnly;

        if (digitOnly !== '') {
          if (idx < inputs.length - 1) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
          } else {
            input.blur();
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].select();
        }
      });
    });
  }

  // Vide toutes les cases du tableau sans le reconstruire (les écouteurs
  // restent en place).
  function resetTable(container) {
    const inputs = container.querySelectorAll('.draft-input');
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  window.DraftTable = { buildTable, resetTable };
})();
