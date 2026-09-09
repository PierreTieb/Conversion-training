// app.js
// Contrôleur principal : navigation entre écrans, logique d'un exercice
// généré (facile / moyen / évaluation), logique du mode Custom, chronomètre
// et score du mode Évaluation.

(function () {
  // --- Références DOM communes ---
  const screens = {
    home: document.getElementById('screen-home'),
    exercise: document.getElementById('screen-exercise'),
    custom: document.getElementById('screen-custom'),
    recap: document.getElementById('screen-recap')
  };

  const diffCards = document.querySelectorAll('.diff-card');
  const btnBack = document.getElementById('btn-back');
  const btnBackCustom = document.getElementById('btn-back-custom');
  const chronoEl = document.getElementById('chrono');
  const chronoValueEl = document.getElementById('chrono-value');

  const fromValueEl = document.getElementById('from-value');
  const fromUnitEl = document.getElementById('from-unit');
  const toUnitEl = document.getElementById('to-unit');
  const answerInput = document.getElementById('answer-input');
  const btnValidate = document.getElementById('btn-validate');
  const btnNext = document.getElementById('btn-next');
  const feedbackEl = document.getElementById('feedback');

  const recapTitle = document.getElementById('recap-title');
  const recapScore = document.getElementById('recap-score');
  const recapTime = document.getElementById('recap-time');
  const recapMessage = document.getElementById('recap-message');
  const recapCard = document.getElementById('recap-card');
  const btnRestart = document.getElementById('btn-restart');
  const btnHome = document.getElementById('btn-home');

  const draftWrap = document.getElementById('draft-table-wrap');
  const draftTableEl = document.getElementById('draft-table');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // --- Références DOM du mode Custom ---
  const customFromValueInput = document.getElementById('custom-from-value');
  const customFromUnitSelect = document.getElementById('custom-from-unit');
  const customToValueInput = document.getElementById('custom-to-value');
  const customToUnitSelect = document.getElementById('custom-to-unit');
  const btnCustomValidate = document.getElementById('btn-custom-validate');
  const btnCustomSolve = document.getElementById('btn-custom-solve');
  const customFeedbackEl = document.getElementById('custom-feedback');

  // --- État ---
  let currentLevel = 'facile';
  let currentConversion = null;
  let hasFailedOnce = false;
  let advanceTimeoutId = null;
  let chronoIntervalId = null;
  let questionStart = 0;
  let evalStats = { count: 0, correctCount: 0, times: [] };
  let customRevealed = false;

  // --- Tableau brouillon (construit une seule fois) ---
  DraftTable.buildTable(draftTableEl);

  // --- Confettis "sûrs" : un souci d'affichage ne doit jamais bloquer le jeu ---
  function safeBurstConfetti() {
    try {
      Confetti.burst(confettiCanvas);
    } catch (e) {
      /* l'animation est purement décorative : on ignore silencieusement */
    }
  }

  // --- Utilitaire : n'autoriser que chiffres + un seul séparateur décimal ---
  function attachNumericSanitizer(input) {
    input.addEventListener('input', () => {
      const raw = input.value;
      let cleaned = '';
      let sepUsed = false;
      for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (ch === '.' || ch === ',') {
          if (!sepUsed) {
            cleaned += ch;
            sepUsed = true;
          }
        } else if (ch >= '0' && ch <= '9') {
          cleaned += ch;
        }
      }
      input.value = cleaned;
    });
  }
  attachNumericSanitizer(answerInput);
  attachNumericSanitizer(customFromValueInput);
  attachNumericSanitizer(customToValueInput);

  // --- Navigation entre écrans ---
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].classList.toggle('active', key === name);
    });
    draftWrap.classList.toggle('hidden', name !== 'exercise' && name !== 'custom');
  }

  function clearPendingTimers() {
    if (advanceTimeoutId) {
      clearTimeout(advanceTimeoutId);
      advanceTimeoutId = null;
    }
    if (chronoIntervalId) {
      clearInterval(chronoIntervalId);
      chronoIntervalId = null;
    }
  }

  function goHome() {
    clearPendingTimers();
    chronoEl.classList.add('hidden');
    showScreen('home');
  }

  // ===================================================================
  //  Modes générés : Facile / Moyen / Évaluation
  // ===================================================================

  function startSession(level) {
    currentLevel = level;
    if (level === 'evaluation') {
      evalStats = { count: 0, correctCount: 0, times: [] };
      chronoEl.classList.remove('hidden');
    } else {
      chronoEl.classList.add('hidden');
    }
    showScreen('exercise');
    loadNewConversion();
  }

  function loadNewConversion() {
    clearPendingTimers();
    hasFailedOnce = false;
    DraftTable.resetTable(draftTableEl); // Modif 1 : tableau vidé à chaque nouvelle conversion

    const generationLevel = currentLevel === 'evaluation' ? 'moyen' : currentLevel;
    currentConversion = Generator.generate(generationLevel);

    fromValueEl.textContent = Generator.formatNumberFR(currentConversion.fromValue);
    fromUnitEl.textContent = currentConversion.fromLabel;
    toUnitEl.textContent = currentConversion.toLabel;

    answerInput.value = '';
    answerInput.classList.remove('wrong', 'revealed');
    answerInput.disabled = false;
    answerInput.focus();

    btnValidate.disabled = false;
    btnValidate.classList.remove('hidden');
    btnNext.classList.add('hidden');

    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    if (currentLevel === 'evaluation') {
      questionStart = performance.now();
      updateChrono();
      chronoIntervalId = setInterval(updateChrono, 100);
    }
  }

  function updateChrono() {
    const elapsed = (performance.now() - questionStart) / 1000;
    chronoValueEl.textContent = elapsed.toFixed(1) + ' s';
  }

  function validateAnswer() {
    const parsed = Generator.parseUserValue(answerInput.value);

    if (isNaN(parsed)) {
      feedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      feedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(parsed, currentConversion.answer)) {
      handleSuccess();
    } else {
      handleFailure();
    }
  }

  function handleSuccess() {
    feedbackEl.textContent = 'Bravo, c\'est la bonne réponse !';
    feedbackEl.className = 'feedback success';
    answerInput.disabled = true;
    btnValidate.disabled = true;
    btnNext.classList.add('hidden');

    if (currentLevel === 'evaluation') {
      clearInterval(chronoIntervalId);
      chronoIntervalId = null;
      const elapsed = (performance.now() - questionStart) / 1000;
      evalStats.times.push(elapsed);
      evalStats.correctCount += 1;
      evalStats.count += 1;
    }

    advanceTimeoutId = setTimeout(() => {
      if (currentLevel === 'evaluation' && evalStats.count >= 5) {
        showRecap();
      } else {
        loadNewConversion();
      }
    }, 1100);

    safeBurstConfetti();
  }

  function handleFailure() {
    answerInput.value = '';
    answerInput.classList.add('wrong');
    feedbackEl.textContent = 'Ce n\'est pas la bonne réponse, réessaie !';
    feedbackEl.className = 'feedback error';
    hasFailedOnce = true;
    btnNext.classList.remove('hidden');
    answerInput.focus();
  }

  function revealAndContinue() {
    if (!hasFailedOnce) return;

    btnValidate.disabled = true;
    btnNext.disabled = true;
    answerInput.disabled = true;
    answerInput.classList.remove('wrong');
    answerInput.classList.add('revealed');
    answerInput.value = Generator.formatNumberFR(currentConversion.answer);

    feedbackEl.textContent = 'La bonne réponse était : ' + Generator.formatNumberFR(currentConversion.answer) + ' ' + currentConversion.toLabel;
    feedbackEl.className = 'feedback info';

    if (currentLevel === 'evaluation') {
      clearInterval(chronoIntervalId);
      chronoIntervalId = null;
      const elapsed = (performance.now() - questionStart) / 1000;
      evalStats.times.push(elapsed);
      evalStats.count += 1;
    }

    advanceTimeoutId = setTimeout(() => {
      btnNext.disabled = false;
      if (currentLevel === 'evaluation' && evalStats.count >= 5) {
        showRecap();
      } else {
        loadNewConversion();
      }
    }, 2000);
  }

  function showRecap() {
    clearPendingTimers();
    chronoEl.classList.add('hidden');

    const avg = evalStats.times.reduce((a, b) => a + b, 0) / evalStats.times.length;
    const score = evalStats.correctCount;

    recapScore.textContent = 'Score : ' + score + '/5';
    recapTime.textContent = 'Temps moyen par conversion : ' + avg.toFixed(1) + ' s';

    recapCard.classList.remove('festive');

    if (score === 5 && avg < 20) {
      recapTitle.textContent = '🎉 Bravo ! 🎉';
      recapMessage.textContent = 'Score parfait et rythme excellent, tu maîtrises parfaitement ces conversions !';
      recapMessage.className = 'recap-message green';
      recapCard.classList.add('festive');
      safeBurstConfetti();
    } else {
      recapTitle.textContent = 'Résultats';
      if (avg < 20) {
        recapMessage.textContent = 'Rythme satisfaisant !';
        recapMessage.className = 'recap-message green';
      } else if (avg <= 40) {
        recapMessage.textContent = 'Rythme un peu lent, mais correct.';
        recapMessage.className = 'recap-message yellow';
      } else if (score >= 2) {
        recapMessage.textContent = 'Rythme insuffisant, mais continue, tu progresses !';
        recapMessage.className = 'recap-message red';
      } else {
        recapMessage.textContent = 'Rythme insuffisant, entraîne-toi encore un peu.';
        recapMessage.className = 'recap-message red';
      }
    }

    showScreen('recap');
  }

  // ===================================================================
  //  Mode Custom
  // ===================================================================

  function populateFromUnitSelect() {
    customFromUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    Units.CATEGORIES.forEach((category) => {
      const group = document.createElement('optgroup');
      group.label = Units.CATEGORY_LABELS[category.key];
      Units.unitsForCategory(category.key).forEach((unit) => {
        const opt = document.createElement('option');
        opt.value = unit.id;
        opt.textContent = unit.label;
        group.appendChild(opt);
      });
      customFromUnitSelect.appendChild(group);
    });
  }

  function populateToUnitSelect(categoryKey) {
    customToUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    Units.unitsForCategory(categoryKey).forEach((unit) => {
      const opt = document.createElement('option');
      opt.value = unit.id;
      opt.textContent = unit.label;
      customToUnitSelect.appendChild(opt);
    });
    customToUnitSelect.disabled = false;
  }

  function resetCustomForm() {
    customRevealed = false;
    DraftTable.resetTable(draftTableEl); // Modif 1 : tableau vidé aussi entre 2 conversions custom

    customFromValueInput.value = '';
    customFromValueInput.disabled = false;

    customToValueInput.value = '';
    customToValueInput.disabled = true;
    customToValueInput.classList.remove('wrong', 'revealed');

    customFromUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    populateFromUnitSelect();
    customFromUnitSelect.disabled = false;

    customToUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    customToUnitSelect.disabled = true;

    btnCustomValidate.disabled = true;
    btnCustomSolve.disabled = true;
    btnCustomSolve.textContent = 'Résoudre';

    customFeedbackEl.textContent = '';
    customFeedbackEl.className = 'feedback';

    customFromValueInput.focus();
  }

  function startCustomSession() {
    showScreen('custom');
    resetCustomForm();
  }

  function onCustomFromUnitChange() {
    if (!customFromUnitSelect.value) return;
    const { categoryKey } = Units.parseUnitId(customFromUnitSelect.value);
    populateToUnitSelect(categoryKey);
    customToValueInput.value = '';
    customToValueInput.disabled = true;
    btnCustomValidate.disabled = true;
    btnCustomSolve.disabled = true;
  }

  function onCustomToUnitChange() {
    if (!customFromUnitSelect.value || !customToUnitSelect.value) return;
    customToValueInput.disabled = false;
    btnCustomValidate.disabled = false;
    btnCustomSolve.disabled = false;
  }

  function getCustomExpectedAnswer() {
    const fromValue = Generator.parseUserValue(customFromValueInput.value);
    if (isNaN(fromValue)) return null;
    const from = Units.parseUnitId(customFromUnitSelect.value);
    const to = Units.parseUnitId(customToUnitSelect.value);
    return {
      fromValue,
      toLabel: Units.unitLabel(Units.categoryByKey(to.categoryKey), to.rank),
      answer: Generator.computeAnswer(fromValue, from.rank, to.rank)
    };
  }

  function validateCustomAnswer() {
    const expected = getCustomExpectedAnswer();
    if (!expected) {
      customFeedbackEl.textContent = 'Indique d\'abord une valeur de départ valide.';
      customFeedbackEl.className = 'feedback info';
      return;
    }

    const userAnswer = Generator.parseUserValue(customToValueInput.value);
    if (isNaN(userAnswer)) {
      customFeedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      customFeedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(userAnswer, expected.answer)) {
      customFeedbackEl.textContent = 'Bravo, c\'est la bonne réponse !';
      customFeedbackEl.className = 'feedback success';
      customFromValueInput.disabled = true;
      customFromUnitSelect.disabled = true;
      customToUnitSelect.disabled = true;
      customToValueInput.disabled = true;
      btnCustomValidate.disabled = true;
      btnCustomSolve.disabled = true;
      advanceTimeoutId = setTimeout(resetCustomForm, 1400);
      safeBurstConfetti();
    } else {
      customToValueInput.value = '';
      customToValueInput.classList.add('wrong');
      customFeedbackEl.textContent = 'Ce n\'est pas la bonne réponse, réessaie ! (ou clique sur "Résoudre")';
      customFeedbackEl.className = 'feedback error';
      customToValueInput.focus();
    }
  }

  function solveOrContinueCustom() {
    if (!customRevealed) {
      const expected = getCustomExpectedAnswer();
      if (!expected) {
        customFeedbackEl.textContent = 'Indique d\'abord une valeur de départ valide.';
        customFeedbackEl.className = 'feedback info';
        return;
      }
      customToValueInput.value = Generator.formatNumberFR(expected.answer);
      customToValueInput.classList.remove('wrong');
      customToValueInput.classList.add('revealed');
      customFeedbackEl.textContent = 'Réponse : ' + Generator.formatNumberFR(expected.answer) + ' ' + expected.toLabel;
      customFeedbackEl.className = 'feedback info';

      customFromValueInput.disabled = true;
      customFromUnitSelect.disabled = true;
      customToUnitSelect.disabled = true;
      customToValueInput.disabled = true;
      btnCustomValidate.disabled = true;

      customRevealed = true;
      btnCustomSolve.textContent = 'Conversion suivante';
    } else {
      resetCustomForm();
    }
  }

  // --- Écouteurs d'événements : modes générés ---
  diffCards.forEach((card) => {
    card.addEventListener('click', () => {
      const diff = card.dataset.diff;
      if (diff === 'custom') {
        startCustomSession();
      } else {
        startSession(diff);
      }
    });
  });

  btnBack.addEventListener('click', goHome);
  btnBackCustom.addEventListener('click', goHome);
  btnHome.addEventListener('click', goHome);
  btnRestart.addEventListener('click', () => startSession('evaluation'));

  btnValidate.addEventListener('click', validateAnswer);
  btnNext.addEventListener('click', revealAndContinue);

  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!btnNext.classList.contains('hidden') && !btnNext.disabled) {
        btnNext.click();
      } else if (!btnValidate.disabled) {
        btnValidate.click();
      }
    }
  });

  // --- Écouteurs d'événements : mode Custom ---
  customFromUnitSelect.addEventListener('change', onCustomFromUnitChange);
  customToUnitSelect.addEventListener('change', onCustomToUnitChange);
  btnCustomValidate.addEventListener('click', validateCustomAnswer);
  btnCustomSolve.addEventListener('click', solveOrContinueCustom);
  customToValueInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !btnCustomValidate.disabled) {
      e.preventDefault();
      btnCustomValidate.click();
    }
  });

  // Écran de départ
  showScreen('home');
})();
