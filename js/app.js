// app.js
// Contrôleur principal : navigation entre écrans, logique d'un exercice
// généré (facile / moyen / évaluation), logique du mode Custom, logique du
// mode Tuto guidé, chronomètre et score.

(function () {
  // --- Références DOM communes ---
  const screens = {
    levelSelect: document.getElementById('screen-level-select'),
    home: document.getElementById('screen-home'),
    home3e: document.getElementById('screen-home-3e'),
    tuto3eMenu: document.getElementById('screen-tuto3e-menu'),
    entrainement3eMenu: document.getElementById('screen-entrainement3e-menu'),
    mixedReady: document.getElementById('screen-mixed-ready'),
    mixed: document.getElementById('screen-mixed'),
    exercise: document.getElementById('screen-exercise'),
    custom: document.getElementById('screen-custom'),
    tuto: document.getElementById('screen-tuto'),
    tutoTemps: document.getElementById('screen-tuto-temps'),
    tutoVitesse: document.getElementById('screen-tuto-vitesse'),
    recap: document.getElementById('screen-recap')
  };

  const levelCards = document.querySelectorAll('.level-card');
  const btnToLevelSelect = document.getElementById('btn-to-level-select');
  const btnToLevelSelect3e = document.getElementById('btn-to-level-select-3e');
  const btnBackTuto3eMenu = document.getElementById('btn-back-tuto3e-menu');
  const btnBackEntrainement3eMenu = document.getElementById('btn-back-entrainement3e-menu');

  const diffCards = document.querySelectorAll('.diff-card');
  const btnBack = document.getElementById('btn-back');
  const btnBackCustom = document.getElementById('btn-back-custom');
  const btnBackTuto = document.getElementById('btn-back-tuto');
  const chronoEl = document.getElementById('chrono');
  const chronoValueEl = document.getElementById('chrono-value');
  const scoreDisplayEl = document.getElementById('score-display');
  const scoreValueEl = document.getElementById('score-value');

  const fromValueEl = document.getElementById('from-value');
  const fromUnitEl = document.getElementById('from-unit');
  const toUnitEl = document.getElementById('to-unit');
  const answerInput = document.getElementById('answer-input');
  const btnHint = document.getElementById('btn-hint');
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

  // --- Références DOM du mode Tuto ---
  const tutoFromValueEl = document.getElementById('tuto-from-value');
  const tutoFromUnitEl = document.getElementById('tuto-from-unit');
  const tutoToUnitEl = document.getElementById('tuto-to-unit');
  const tutoAnswerInput = document.getElementById('tuto-answer-input');
  const tutoStepTextEl = document.getElementById('tuto-step-text');
  const btnTutoPrev = document.getElementById('btn-tuto-prev');
  const btnTutoNext = document.getElementById('btn-tuto-next');
  const btnTutoValidate = document.getElementById('btn-tuto-validate');
  const tutoFeedbackEl = document.getElementById('tuto-feedback');
  const tutoSuccessEl = document.getElementById('tuto-success');
  const btnTutoRetry = document.getElementById('btn-tuto-retry');
  const btnTutoHome = document.getElementById('btn-tuto-home');
  const tutoStack = document.querySelector('#screen-tuto .conversion-stack');

  // --- Références DOM du Tuto Temps ---
  const ttFromValueEl = document.getElementById('tt-from-value');
  const ttFromUnitEl = document.getElementById('tt-from-unit');
  const ttToUnitEl = document.getElementById('tt-to-unit');
  const ttAnswerInput = document.getElementById('tt-answer-input');
  const ttStepTextEl = document.getElementById('tt-step-text');
  const ttDiagramEl = document.getElementById('tt-diagram');
  const ttKeypadEl = document.getElementById('tt-keypad');
  const ttExpressionEl = document.getElementById('tt-expression');
  const ttFinalHintEl = document.getElementById('tt-final-hint');
  const btnTtErase = document.getElementById('btn-tt-erase');
  const btnTtPrev = document.getElementById('btn-tt-prev');
  const btnTtNext = document.getElementById('btn-tt-next');
  const btnTtValidate = document.getElementById('btn-tt-validate');
  const ttFeedbackEl = document.getElementById('tt-feedback');
  const ttSuccessEl = document.getElementById('tt-success');
  const btnTtRetry = document.getElementById('btn-tt-retry');
  const btnTtHome = document.getElementById('btn-tt-home');
  const ttStack = document.querySelector('#screen-tuto-temps .conversion-stack');
  const btnBackTutoTemps = document.getElementById('btn-back-tuto-temps');
  const ttOpButtons = document.querySelectorAll('.tt-op-btn');

  // --- Références DOM du Tuto Vitesse ---
  const tvFromValueEl = document.getElementById('tv-from-value');
  const tvFromUnitEl = document.getElementById('tv-from-unit');
  const tvToUnitEl = document.getElementById('tv-to-unit');
  const tvAnswerInput = document.getElementById('tv-answer-input');
  const tvStepTextEl = document.getElementById('tv-step-text');
  const tvChoiceEl = document.getElementById('tv-choice');
  const btnTvMult = document.getElementById('btn-tv-mult');
  const btnTvDiv = document.getElementById('btn-tv-div');
  const tvExpressionEl = document.getElementById('tv-expression');
  const tvFinalHintEl = document.getElementById('tv-final-hint');
  const btnTvPrev = document.getElementById('btn-tv-prev');
  const btnTvNext = document.getElementById('btn-tv-next');
  const btnTvValidate = document.getElementById('btn-tv-validate');
  const tvFeedbackEl = document.getElementById('tv-feedback');
  const tvSuccessEl = document.getElementById('tv-success');
  const btnTvRetry = document.getElementById('btn-tv-retry');
  const btnTvHome = document.getElementById('btn-tv-home');
  const tvStack = document.querySelector('#screen-tuto-vitesse .conversion-stack');
  const btnBackTutoVitesse = document.getElementById('btn-back-tuto-vitesse');

  // --- Références DOM du mode mixte (Entraînement Temps/Vitesse + Évaluation Experte) ---
  const btnBackMixedReady = document.getElementById('btn-back-mixed-ready');
  const btnMixedReady = document.getElementById('btn-mixed-ready');
  const btnBackMixed = document.getElementById('btn-back-mixed');
  const mixedChronoEl = document.getElementById('mixed-chrono');
  const mixedChronoValueEl = document.getElementById('mixed-chrono-value');
  const mixedScoreDisplayEl = document.getElementById('mixed-score-display');
  const mixedScoreValueEl = document.getElementById('mixed-score-value');
  const mixedFromValueEl = document.getElementById('mixed-from-value');
  const mixedFromUnitEl = document.getElementById('mixed-from-unit');
  const mixedToUnitEl = document.getElementById('mixed-to-unit');
  const mixedAnswerInput = document.getElementById('mixed-answer-input');
  const mixedTimeDiagramEl = document.getElementById('mixed-time-diagram');
  const mixedSpeedDiagramEl = document.getElementById('mixed-speed-diagram');
  const btnMixedValidate = document.getElementById('btn-mixed-validate');
  const btnMixedNext = document.getElementById('btn-mixed-next');
  const mixedFeedbackEl = document.getElementById('mixed-feedback');

  const TT_STEP_TEXTS = {
    1: 'Étape 1 : Sélectionner l\u2019unité de départ',
    2: 'Étape 2 : Sélectionner l\u2019unité d\u2019arrivée',
    3: 'Étape 3 : Appliquer toutes les opérations entre les deux unités à la valeur de départ',
    4: 'Étape 4 : Il n\u2019y a plus qu\u2019à calculer, à la calculatrice !'
  };

  const TV_STEP1_TEXT = 'Étape 1 : Apprendre les deux cas possibles<span class="tuto-substep">Pour transformer des m/s en km/h, il faut multiplier par 3,6. Pour transformer des km/h en m/s, il faut diviser par 3,6.</span>';
  const TV_STEP2_TEXT = 'Étape 2 : Essaie par toi-même';
  const TV_STEP3_TEXT = 'Étape 3 : Il n\u2019y a plus qu\u2019à calculer, à la calculatrice !';

  const TUTO_STEP_TEXTS = {
    1: 'Étape 1 : Repérer la <span class="text-tuto-green">colonne de départ</span> et la <span class="text-tuto-red">colonne d\u2019arrivée</span>',
    2: 'Étape 2 : Repérer le chiffre des unités et le placer dans la <span class="text-tuto-green">colonne de départ</span><span class="tuto-substep">C\u2019est le chiffre juste avant la virgule</span>',
    3: 'Étape 3 : Placer les autres chiffres, mais sans la virgule',
    4: 'Étape 4 : Compléter avec des zéros jusqu\u2019à la <span class="text-tuto-red">colonne d\u2019arrivée</span>, et y placer mentalement une virgule si besoin'
  };

  // --- État ---
  let currentLevel = 'facile';
  let currentConversion = null;
  let hasFailedOnce = false;
  let advanceTimeoutId = null;
  let chronoIntervalId = null;
  let questionStart = 0;
  let evalStats = { count: 0, correctCount: 0, times: [] };
  let sessionScore = { correct: 0, total: 0 };
  let customRevealed = false;

  let tutoConversion = null;
  let tutoStep = 1;
  let tutoReturnScreen = 'home';
  let customReturnScreen = 'home';

  let ttConversion = null;
  let ttStep = 1;
  let ttFromSelected = null;
  let ttToSelected = null;
  let ttAppliedOps = [];

  let tvConversion = null;
  let tvStep = 1;

  let mixedMode = 'entrainement'; // 'entrainement' | 'evaluation'
  let mixedCurrent = null;
  let mixedFailedOnce = false;
  let mixedScore = { correct: 0, total: 0 };
  let mixedQuestionStart = 0;
  let mixedChronoIntervalId = null;
  let mixedTypeQueue = [];
  let pendingMixedStart = null; // 'entrainement' | 'evaluation'

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
  attachNumericSanitizer(tutoAnswerInput);
  attachNumericSanitizer(ttAnswerInput);
  attachNumericSanitizer(tvAnswerInput);
  attachNumericSanitizer(mixedAnswerInput);

  // --- Navigation entre écrans ---
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].classList.toggle('active', key === name);
    });
    const showTable = name === 'exercise' || name === 'custom' || name === 'tuto';
    draftWrap.classList.toggle('hidden', !showTable);
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
    scoreDisplayEl.classList.add('hidden');
    setTheme('');
    showScreen('home');
  }

  function goToLevelSelect() {
    clearPendingTimers();
    chronoEl.classList.add('hidden');
    scoreDisplayEl.classList.add('hidden');
    setTheme('');
    showScreen('levelSelect');
  }

  function goToHome3e() {
    clearPendingTimers();
    chronoEl.classList.add('hidden');
    scoreDisplayEl.classList.add('hidden');
    setTheme('level3e');
    showScreen('home3e');
  }

  // Applique une couleur de fond différente selon le mode actif (pur habillage,
  // n'affecte aucune logique de jeu).
  function setTheme(name) {
    document.body.dataset.theme = name;
  }

  // ===================================================================
  //  Modes générés : Facile / Moyen / Évaluation
  // ===================================================================

  function updateScoreDisplay() {
    scoreValueEl.textContent = sessionScore.correct + '/' + sessionScore.total;
  }

  let exerciseReturnScreen = 'home';
  let exerciseCategoryPool = null;
  let recapRestartFn = null;

  function startSession(level, opts) {
    opts = opts || {};
    currentLevel = level;
    exerciseReturnScreen = opts.returnTo || 'home';
    exerciseCategoryPool = opts.categoryPool || null;
    setTheme(opts.theme || level);
    recapRestartFn = () => startSession(level, opts);

    if (level === 'evaluation') {
      evalStats = { count: 0, correctCount: 0, times: [] };
      chronoEl.classList.remove('hidden');
      scoreDisplayEl.classList.add('hidden');
    } else if (level === 'facile' || level === 'moyen') {
      sessionScore = { correct: 0, total: 0 };
      updateScoreDisplay();
      chronoEl.classList.add('hidden');
      scoreDisplayEl.classList.remove('hidden');
    } else {
      chronoEl.classList.add('hidden');
      scoreDisplayEl.classList.add('hidden');
    }

    showScreen('exercise');
    loadNewConversion();
  }

  function goToReturnScreen() {
    clearPendingTimers();
    chronoEl.classList.add('hidden');
    scoreDisplayEl.classList.add('hidden');
    if (exerciseReturnScreen === 'entrainement3eMenu') {
      setTheme('entrainement3e');
      showScreen('entrainement3eMenu');
    } else {
      setTheme('');
      showScreen('home');
    }
  }

  function loadNewConversion() {
    clearPendingTimers();
    hasFailedOnce = false;
    DraftTable.resetTable(draftTableEl); // Modif 1 : tableau vidé à chaque nouvelle conversion

    const generationLevel = currentLevel === 'evaluation' ? 'moyen' : currentLevel;
    currentConversion = Generator.generate(generationLevel, exerciseCategoryPool);

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

    btnHint.classList.toggle('hidden', currentLevel !== 'facile');
    btnHint.disabled = false;

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

  function onHintClick() {
    if (!currentConversion) return;
    DraftTable.fillDigits(currentConversion.fromRank, currentConversion.fromValue);
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
    btnHint.disabled = true;

    if (currentLevel === 'evaluation') {
      clearInterval(chronoIntervalId);
      chronoIntervalId = null;
      const elapsed = (performance.now() - questionStart) / 1000;
      evalStats.times.push(elapsed);
      evalStats.correctCount += 1;
      evalStats.count += 1;
    } else if (currentLevel === 'facile' || currentLevel === 'moyen') {
      sessionScore.total += 1;
      if (!hasFailedOnce) sessionScore.correct += 1;
      updateScoreDisplay();
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
    btnHint.disabled = true;
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
    } else if (currentLevel === 'facile' || currentLevel === 'moyen') {
      sessionScore.total += 1; // ratée puis résolue (ou passée) = comptée comme une erreur
      updateScoreDisplay();
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
    mixedChronoEl.classList.add('hidden');

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

  function populateFromUnitSelect(poolKeys) {
    const keys = poolKeys || Units.BASIC_CATEGORY_KEYS;
    customFromUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    Units.CATEGORIES.filter((c) => keys.includes(c.key)).forEach((category) => {
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

  let customCategoryPool = null;

  function resetCustomForm() {
    customRevealed = false;
    DraftTable.resetTable(draftTableEl); // Modif 1 : tableau vidé aussi entre 2 conversions custom

    customFromValueInput.value = '';
    customFromValueInput.disabled = false;

    customToValueInput.value = '';
    customToValueInput.disabled = true;
    customToValueInput.classList.remove('wrong', 'revealed');

    customFromUnitSelect.innerHTML = '<option value="" disabled selected>Unité...</option>';
    populateFromUnitSelect(customCategoryPool);
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

  function startCustomSession(returnTo, categoryPool) {
    customReturnScreen = returnTo || 'home';
    customCategoryPool = categoryPool || null;
    setTheme('custom');
    showScreen('custom');
    resetCustomForm();
  }

  function goBackFromCustom() {
    clearPendingTimers();
    if (customReturnScreen === 'home3e') {
      goToHome3e();
    } else {
      goHome();
    }
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

  // ===================================================================
  //  Mode Tuto
  // ===================================================================

  function tutoFromCol() {
    return tutoConversion.fromRank + 1;
  }

  function tutoToCol() {
    return tutoConversion.toRank + 1;
  }

  function tutoDigitsInfo() {
    const intPart = Math.trunc(tutoConversion.fromValue);
    const intStr = String(intPart);
    const unitsDigit = intStr[intStr.length - 1];
    const tensDigit = intStr.length > 1 ? intStr[intStr.length - 2] : null;
    const decimalDigit = tutoConversion.fromValue.toFixed(1).split('.')[1];
    return { unitsDigit, tensDigit, decimalDigit };
  }

  function startTutoSession(returnTo, theme) {
    tutoReturnScreen = returnTo || 'home';
    setTheme(theme || 'tuto');
    showScreen('tuto');
    newTutoExample();
  }

  function goBackFromTuto() {
    clearPendingTimers();
    if (tutoReturnScreen === 'tuto3eMenu') {
      setTheme('tuto3e');
      showScreen('tuto3eMenu');
    } else {
      goHome();
    }
  }

  function newTutoExample() {
    clearPendingTimers();
    tutoConversion = Generator.generateTuto();
    DraftTable.resetTable(draftTableEl);

    tutoFromValueEl.textContent = Generator.formatNumberFR(tutoConversion.fromValue);
    tutoFromUnitEl.textContent = tutoConversion.fromLabel;
    tutoToUnitEl.textContent = tutoConversion.toLabel;
    tutoFromUnitEl.classList.remove('circle-mark-green');
    tutoToUnitEl.classList.remove('circle-mark-red');

    tutoAnswerInput.value = '';
    tutoAnswerInput.classList.remove('wrong');
    tutoSuccessEl.classList.add('hidden');
    tutoStack.classList.remove('shake-clear');

    renderTutoStep(1);
  }

  function renderTutoStep(step) {
    tutoStep = step;
    tutoFeedbackEl.textContent = '';
    tutoFeedbackEl.className = 'feedback';
    btnTutoPrev.classList.toggle('hidden', step === 1);

    if (step <= 4) {
      tutoAnswerInput.classList.add('hidden');
      btnTutoValidate.classList.add('hidden');
      btnTutoNext.classList.remove('hidden');
      tutoSuccessEl.classList.add('hidden');
      tutoStepTextEl.innerHTML = TUTO_STEP_TEXTS[step];

      if (step === 1) {
        // Rien à faire : la colonne de départ/arrivée et les flèches sont
        // montrées directement, on peut avancer tout de suite.
        DraftTable.setColumnArrow(tutoFromCol(), 'from');
        DraftTable.setColumnArrow(tutoToCol(), 'to');
        tutoFromUnitEl.classList.add('circle-mark-green');
        tutoToUnitEl.classList.add('circle-mark-red');
        btnTutoNext.disabled = false;
      } else {
        btnTutoNext.disabled = true;
        revalidateTutoStep();
      }
    } else {
      // Étape 5 : réponse finale
      tutoStepTextEl.innerHTML = '';
      btnTutoNext.classList.add('hidden');
      btnTutoValidate.classList.remove('hidden');
      btnTutoValidate.disabled = false;
      tutoAnswerInput.classList.remove('hidden');
      tutoAnswerInput.value = '';
      tutoAnswerInput.disabled = false;
      tutoAnswerInput.classList.remove('wrong');
      tutoAnswerInput.focus();
    }
  }

  function revalidateTutoStep() {
    if (!tutoConversion || tutoStep < 2 || tutoStep > 4) return;

    const info = tutoDigitsInfo();
    const fromCol = tutoFromCol();
    const toCol = tutoToCol();
    const requiredMap = {};

    if (tutoStep === 2) {
      requiredMap[fromCol] = info.unitsDigit;
    } else if (tutoStep === 3) {
      requiredMap[fromCol] = info.unitsDigit;
      if (info.tensDigit !== null) requiredMap[fromCol - 1] = info.tensDigit;
      requiredMap[fromCol + 1] = info.decimalDigit;
    } else if (tutoStep === 4) {
      const leftmostDigitCol = info.tensDigit !== null ? fromCol - 1 : fromCol;
      for (let c = toCol; c <= leftmostDigitCol - 1; c++) {
        requiredMap[c] = '0';
      }
    }

    let allCorrect = true;
    let anyWrongNonEmpty = false;

    Object.keys(requiredMap).forEach((colStr) => {
      const col = Number(colStr);
      const expected = requiredMap[colStr];
      const val = DraftTable.getCellValue(col);
      if (val === '') {
        allCorrect = false;
      } else if (val !== expected) {
        allCorrect = false;
        anyWrongNonEmpty = true;
        DraftTable.flashCellError(col);
      }
    });

    // Étape 3 : aucune autre case du tableau ne doit être remplie que celles
    // nécessaires à cette conversion.
    let hasExtraDigit = false;
    if (tutoStep === 3) {
      for (let c = 0; c < 9; c++) {
        if (requiredMap[c] !== undefined) continue;
        if (DraftTable.getCellValue(c) !== '') {
          hasExtraDigit = true;
          DraftTable.flashCellError(c);
        }
      }
    }

    btnTutoNext.disabled = !allCorrect || hasExtraDigit;

    if (hasExtraDigit) {
      tutoFeedbackEl.textContent = 'Il ne doit y avoir que les chiffres nécessaires à cette conversion.';
      tutoFeedbackEl.className = 'feedback error';
    } else if (anyWrongNonEmpty) {
      tutoFeedbackEl.textContent = 'Ce n\'est pas encore ça, réessaie.';
      tutoFeedbackEl.className = 'feedback error';
    } else {
      tutoFeedbackEl.textContent = '';
      tutoFeedbackEl.className = 'feedback';
    }
  }

  function onTutoNext() {
    if (tutoStep < 4) {
      renderTutoStep(tutoStep + 1);
    } else if (tutoStep === 4) {
      renderTutoStep(5);
    }
  }

  function onTutoPrev() {
    if (tutoStep > 1) {
      renderTutoStep(tutoStep - 1);
    }
  }

  function validateTutoAnswer() {
    const parsed = Generator.parseUserValue(tutoAnswerInput.value);

    if (isNaN(parsed)) {
      tutoFeedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      tutoFeedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(parsed, tutoConversion.answer)) {
      tutoAnswerInput.disabled = true;
      btnTutoValidate.disabled = true;
      btnTutoPrev.classList.add('hidden');
      tutoFeedbackEl.textContent = '';
      tutoFeedbackEl.className = 'feedback';
      tutoSuccessEl.classList.remove('hidden');
      safeBurstConfetti();
    } else {
      tutoAnswerInput.value = '';
      tutoStack.classList.remove('shake-clear');
      void tutoStack.offsetWidth; // force le rejeu de l'animation
      tutoStack.classList.add('shake-clear');
      tutoFeedbackEl.textContent = 'Ce n\'est pas encore ça, réessaie.';
      tutoFeedbackEl.className = 'feedback error';
      tutoAnswerInput.focus();
    }
  }

  // ===================================================================
  //  Tuto Temps (3e)
  // ===================================================================

  function buildTimeDiagram(container, interactive) {
    const target = container || ttDiagramEl;
    const isInteractive = interactive !== false;
    target.innerHTML = '';
    const units = Units.TIME_UNITS;

    for (let i = 0; i < units.length - 1; i++) {
      const top = document.createElement('div');
      top.className = 'td-arrow-top';
      top.style.gridColumn = String(i * 2 + 2);
      top.innerHTML = '× ' + Units.TIME_FACTORS[i] + '<span>&rarr;</span>';
      target.appendChild(top);

      const bottom = document.createElement('div');
      bottom.className = 'td-arrow-bottom';
      bottom.style.gridColumn = String(i * 2 + 2);
      bottom.innerHTML = '<span>&larr;</span>÷ ' + Units.TIME_FACTORS[i];
      target.appendChild(bottom);
    }

    units.forEach((u, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'td-unit';
      btn.textContent = u.full;
      btn.style.gridColumn = String(idx * 2 + 1);
      if (isInteractive) {
        btn.addEventListener('click', () => onTimeUnitClick(idx));
      } else {
        btn.disabled = true;
      }
      target.appendChild(btn);
    });
  }

  function getTimeUnitButtons() {
    return ttDiagramEl.querySelectorAll('.td-unit');
  }

  function markTimeUnit(idx, color) {
    const cls = color === 'red' ? 'td-selected-red' : 'td-selected-green';
    getTimeUnitButtons().forEach((b) => b.classList.remove(cls));
    const target = getTimeUnitButtons()[idx];
    if (target) target.classList.add(cls);
  }

  function onTimeUnitClick(idx) {
    if (ttStep === 1) {
      ttFromSelected = idx;
      markTimeUnit(idx, 'green');
      btnTtNext.disabled = idx !== ttConversion.fromIndex;
    } else if (ttStep === 2) {
      if (idx === ttFromSelected) return;
      ttToSelected = idx;
      markTimeUnit(idx, 'red');
      btnTtNext.disabled = idx !== ttConversion.toIndex;
    }
  }

  function updateTtExpression() {
    let expr = Generator.formatNumberFR(ttConversion.fromValue) + ' ' + ttConversion.fromUnit.short;
    ttAppliedOps.forEach((o) => {
      expr += ' ' + o.op + ' ' + o.factor;
    });
    ttExpressionEl.textContent = expr;
  }

  function opsMultisetEqual(a, b) {
    if (a.length !== b.length) return false;
    const toKey = (o) => o.op + o.factor;
    const aKeys = a.map(toKey).sort();
    const bKeys = b.map(toKey).sort();
    return aKeys.every((k, i) => k === bKeys[i]);
  }

  function checkTtOpsComplete() {
    const complete = opsMultisetEqual(ttAppliedOps, ttConversion.ops);
    btnTtNext.disabled = !complete;
  }

  function onTtOpClick(op, factor) {
    if (ttStep !== 3) return;
    ttAppliedOps.push({ op, factor });
    updateTtExpression();
    checkTtOpsComplete();
  }

  function onTtErase() {
    if (ttStep !== 3 || ttAppliedOps.length === 0) return;
    ttAppliedOps.pop();
    updateTtExpression();
    checkTtOpsComplete();
  }

  function renderTtStep(step) {
    ttStep = step;
    ttFeedbackEl.textContent = '';
    ttFeedbackEl.className = 'feedback';
    btnTtPrev.classList.toggle('hidden', step === 1);
    ttStepTextEl.textContent = TT_STEP_TEXTS[step] || '';

    ttKeypadEl.classList.add('hidden');
    ttExpressionEl.classList.add('hidden');
    ttFinalHintEl.classList.add('hidden');
    btnTtErase.classList.add('hidden');
    ttAnswerInput.classList.add('hidden');
    btnTtNext.classList.remove('hidden');
    btnTtValidate.classList.add('hidden');
    ttSuccessEl.classList.add('hidden');

    const unitButtons = getTimeUnitButtons();

    if (step === 1) {
      unitButtons.forEach((b) => { b.disabled = false; });
      btnTtNext.disabled = ttFromSelected !== ttConversion.fromIndex;
    } else if (step === 2) {
      unitButtons.forEach((b) => { b.disabled = false; });
      ttToUnitEl.classList.add('circle-mark-red');
      btnTtNext.disabled = ttToSelected !== ttConversion.toIndex;
    } else if (step === 3) {
      unitButtons.forEach((b) => { b.disabled = true; });
      ttKeypadEl.classList.remove('hidden');
      ttExpressionEl.classList.remove('hidden');
      btnTtErase.classList.remove('hidden');
      updateTtExpression();
      checkTtOpsComplete();
    } else if (step === 4) {
      unitButtons.forEach((b) => { b.disabled = true; });
      btnTtNext.classList.add('hidden');
      btnTtValidate.classList.remove('hidden');
      btnTtValidate.disabled = false;
      ttExpressionEl.classList.remove('hidden');
      updateTtExpression();
      ttFinalHintEl.classList.remove('hidden');
      ttAnswerInput.classList.remove('hidden');
      ttAnswerInput.value = '';
      ttAnswerInput.disabled = false;
      ttAnswerInput.classList.remove('wrong');
      ttAnswerInput.focus();
    }
  }

  function onTtNext() {
    if (ttStep < 4) renderTtStep(ttStep + 1);
  }

  function onTtPrev() {
    if (ttStep > 1) renderTtStep(ttStep - 1);
  }

  function validateTtAnswer() {
    const parsed = Generator.parseUserValue(ttAnswerInput.value);

    if (isNaN(parsed)) {
      ttFeedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      ttFeedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(parsed, ttConversion.answer)) {
      ttAnswerInput.disabled = true;
      btnTtValidate.disabled = true;
      btnTtPrev.classList.add('hidden');
      ttFeedbackEl.textContent = '';
      ttFeedbackEl.className = 'feedback';
      ttSuccessEl.classList.remove('hidden');
      safeBurstConfetti();
    } else {
      ttAnswerInput.value = '';
      ttStack.classList.remove('shake-clear');
      void ttStack.offsetWidth;
      ttStack.classList.add('shake-clear');
      ttFeedbackEl.textContent = 'Ce n\'est pas encore ça, réessaie.';
      ttFeedbackEl.className = 'feedback error';
      ttAnswerInput.focus();
    }
  }

  function startTutoTempsSession() {
    setTheme('tuto3e-temps');
    showScreen('tutoTemps');
    newTutoTempsExample();
  }

  function newTutoTempsExample() {
    clearPendingTimers();
    ttConversion = Generator.generateTutoTemps();
    ttFromSelected = null;
    ttToSelected = null;
    ttAppliedOps = [];

    buildTimeDiagram(ttDiagramEl, true);

    ttFromValueEl.textContent = Generator.formatNumberFR(ttConversion.fromValue);
    ttFromUnitEl.textContent = ttConversion.fromUnit.short;
    ttToUnitEl.textContent = ttConversion.toUnit.short;
    ttFromUnitEl.classList.add('circle-target');
    ttToUnitEl.classList.add('circle-target');
    ttFromUnitEl.classList.remove('circle-mark-green');
    ttToUnitEl.classList.remove('circle-mark-red');

    ttAnswerInput.value = '';
    ttSuccessEl.classList.add('hidden');
    ttStack.classList.remove('shake-clear');

    renderTtStep(1);
    ttFromUnitEl.classList.add('circle-mark-green');
  }

  // ===================================================================
  //  Tuto Vitesse (3e)
  // ===================================================================

  function renderTvStep(step) {
    tvStep = step;
    tvFeedbackEl.textContent = '';
    tvFeedbackEl.className = 'feedback';
    btnTvPrev.classList.toggle('hidden', step === 1);
    tvChoiceEl.classList.add('hidden');
    tvExpressionEl.classList.add('hidden');
    tvFinalHintEl.classList.add('hidden');
    tvAnswerInput.classList.add('hidden');
    btnTvNext.classList.add('hidden');
    btnTvValidate.classList.add('hidden');
    tvSuccessEl.classList.add('hidden');

    if (step === 1) {
      tvStack.classList.add('hidden');
      tvStepTextEl.innerHTML = TV_STEP1_TEXT;
      btnTvNext.classList.remove('hidden');
      btnTvNext.disabled = false;
    } else if (step === 2) {
      tvStack.classList.remove('hidden');
      tvStepTextEl.textContent = TV_STEP2_TEXT;
      tvChoiceEl.classList.remove('hidden');
    } else if (step === 3) {
      tvStack.classList.remove('hidden');
      tvStepTextEl.textContent = TV_STEP3_TEXT;
      tvExpressionEl.classList.remove('hidden');
      tvExpressionEl.textContent = Generator.formatNumberFR(tvConversion.fromValue) + ' ' + tvConversion.fromUnit + ' ' + tvConversion.operation;
      tvFinalHintEl.classList.remove('hidden');
      tvAnswerInput.classList.remove('hidden');
      btnTvValidate.classList.remove('hidden');
      btnTvValidate.disabled = false;
      tvAnswerInput.value = '';
      tvAnswerInput.disabled = false;
      tvAnswerInput.classList.remove('wrong');
      tvAnswerInput.focus();
    }
  }

  function onTvChoice(chosenOp) {
    if (tvStep !== 2) return;
    const correctOp = tvConversion.direction === 'ms-to-kmh' ? '×' : '÷';
    if (chosenOp === correctOp) {
      renderTvStep(3);
    } else {
      tvFeedbackEl.textContent = 'Ce n\'est pas encore ça, réessaie.';
      tvFeedbackEl.className = 'feedback error';
    }
  }

  function onTvPrev() {
    if (tvStep > 1) renderTvStep(tvStep - 1);
  }

  function validateTvAnswer() {
    const parsed = Generator.parseUserValue(tvAnswerInput.value);

    if (isNaN(parsed)) {
      tvFeedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      tvFeedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(parsed, tvConversion.answer)) {
      tvAnswerInput.disabled = true;
      btnTvValidate.disabled = true;
      btnTvPrev.classList.add('hidden');
      tvFeedbackEl.textContent = '';
      tvFeedbackEl.className = 'feedback';
      tvSuccessEl.classList.remove('hidden');
      safeBurstConfetti();
    } else {
      tvAnswerInput.value = '';
      tvStack.classList.remove('shake-clear');
      void tvStack.offsetWidth;
      tvStack.classList.add('shake-clear');
      tvFeedbackEl.textContent = 'Ce n\'est pas encore ça, réessaie.';
      tvFeedbackEl.className = 'feedback error';
      tvAnswerInput.focus();
    }
  }

  function startTutoVitesseSession() {
    setTheme('tuto3e-vitesse');
    showScreen('tutoVitesse');
    newTutoVitesseExample();
  }

  function newTutoVitesseExample() {
    clearPendingTimers();
    tvConversion = Generator.generateTutoVitesse();

    tvFromValueEl.textContent = Generator.formatNumberFR(tvConversion.fromValue);
    tvFromUnitEl.textContent = tvConversion.fromUnit;
    tvToUnitEl.textContent = tvConversion.toUnit;

    tvAnswerInput.value = '';
    tvSuccessEl.classList.add('hidden');
    tvStack.classList.remove('shake-clear');

    renderTvStep(1);
  }

  // ===================================================================
  //  Mode mixte : Entraînement Temps/Vitesse (3e) et Évaluation Experte (3e)
  // ===================================================================

  function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateMixedExercise(kind) {
    if (kind === 'classique') {
      const g = Generator.generate('moyen', Units.EXTENDED_CATEGORY_KEYS);
      return { kind, fromValue: g.fromValue, fromLabel: g.fromLabel, toLabel: g.toLabel, answer: g.answer };
    }
    if (kind === 'temps') {
      const g = Generator.generateTutoTemps();
      return { kind, fromValue: g.fromValue, fromLabel: g.fromUnit.short, toLabel: g.toUnit.short, answer: g.answer };
    }
    const g = Generator.generateTutoVitesse();
    return { kind, fromValue: g.fromValue, fromLabel: g.fromUnit, toLabel: g.toUnit, answer: g.answer };
  }

  function buildExpertQueue() {
    const guaranteed = ['classique', 'temps', 'vitesse'];
    const extra = [randChoice(['classique', 'temps', 'vitesse']), randChoice(['classique', 'temps', 'vitesse'])];
    const all = guaranteed.concat(extra);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = all[i];
      all[i] = all[j];
      all[j] = tmp;
    }
    return all;
  }

  function updateMixedScoreDisplay() {
    mixedScoreValueEl.textContent = mixedScore.correct + '/' + mixedScore.total;
  }

  function updateMixedChrono() {
    const elapsed = (performance.now() - mixedQuestionStart) / 1000;
    mixedChronoValueEl.textContent = elapsed.toFixed(1) + ' s';
  }

  function startEntrainementTV() {
    pendingMixedStart = 'entrainement';
    setTheme('entrainement3e-tv');
    showScreen('mixedReady');
  }

  function startEvaluationExperte() {
    pendingMixedStart = 'evaluation';
    setTheme('eval3e-experte');
    showScreen('mixedReady');
  }

  function beginMixedEntrainement() {
    mixedMode = 'entrainement';
    exerciseReturnScreen = 'entrainement3eMenu';
    mixedScore = { correct: 0, total: 0 };
    updateMixedScoreDisplay();
    mixedChronoEl.classList.add('hidden');
    mixedScoreDisplayEl.classList.remove('hidden');
    setTheme('entrainement3e-tv');
    showScreen('mixed');
    loadMixedExercise();
  }

  function beginMixedEvaluation() {
    mixedMode = 'evaluation';
    exerciseReturnScreen = 'entrainement3eMenu';
    evalStats = { count: 0, correctCount: 0, times: [] };
    mixedTypeQueue = buildExpertQueue();
    recapRestartFn = () => beginMixedEvaluation();
    mixedChronoEl.classList.remove('hidden');
    mixedScoreDisplayEl.classList.add('hidden');
    setTheme('eval3e-experte');
    showScreen('mixed');
    loadMixedExercise();
  }

  function loadMixedExercise() {
    clearPendingTimers();
    mixedFailedOnce = false;

    const kind = mixedMode === 'evaluation' ? mixedTypeQueue.shift() : randChoice(['temps', 'vitesse']);
    mixedCurrent = generateMixedExercise(kind);

    mixedFromValueEl.textContent = Generator.formatNumberFR(mixedCurrent.fromValue);
    mixedFromUnitEl.textContent = mixedCurrent.fromLabel;
    mixedToUnitEl.textContent = mixedCurrent.toLabel;

    mixedAnswerInput.value = '';
    mixedAnswerInput.disabled = false;
    mixedAnswerInput.classList.remove('wrong', 'revealed');
    btnMixedValidate.disabled = false;
    btnMixedValidate.classList.remove('hidden');
    btnMixedNext.classList.add('hidden');
    mixedFeedbackEl.textContent = '';
    mixedFeedbackEl.className = 'feedback';

    mixedTimeDiagramEl.classList.toggle('hidden', kind !== 'temps');
    mixedSpeedDiagramEl.classList.toggle('hidden', kind !== 'vitesse');
    draftWrap.classList.toggle('hidden', kind !== 'classique');
    if (kind === 'temps') buildTimeDiagram(mixedTimeDiagramEl, false);
    if (kind === 'classique') DraftTable.resetTable(draftTableEl);

    if (mixedMode === 'evaluation') {
      mixedQuestionStart = performance.now();
      updateMixedChrono();
      mixedChronoIntervalId = setInterval(updateMixedChrono, 100);
    }

    mixedAnswerInput.focus();
  }

  function validateMixedAnswer() {
    const parsed = Generator.parseUserValue(mixedAnswerInput.value);

    if (isNaN(parsed)) {
      mixedFeedbackEl.textContent = 'Entre un nombre valide (chiffres, virgule ou point).';
      mixedFeedbackEl.className = 'feedback info';
      return;
    }

    if (Generator.nearlyEqual(parsed, mixedCurrent.answer)) {
      handleMixedSuccess();
    } else {
      handleMixedFailure();
    }
  }

  function handleMixedSuccess() {
    mixedFeedbackEl.textContent = 'Bravo, c\'est la bonne réponse !';
    mixedFeedbackEl.className = 'feedback success';
    mixedAnswerInput.disabled = true;
    btnMixedValidate.disabled = true;
    btnMixedNext.classList.add('hidden');

    if (mixedMode === 'evaluation') {
      clearInterval(mixedChronoIntervalId);
      mixedChronoIntervalId = null;
      const elapsed = (performance.now() - mixedQuestionStart) / 1000;
      evalStats.times.push(elapsed);
      evalStats.correctCount += 1;
      evalStats.count += 1;
    } else {
      mixedScore.total += 1;
      if (!mixedFailedOnce) mixedScore.correct += 1;
      updateMixedScoreDisplay();
    }

    advanceTimeoutId = setTimeout(() => {
      if (mixedMode === 'evaluation' && evalStats.count >= 5) {
        showRecap();
      } else {
        loadMixedExercise();
      }
    }, 1100);

    safeBurstConfetti();
  }

  function handleMixedFailure() {
    mixedAnswerInput.value = '';
    mixedAnswerInput.classList.add('wrong');
    mixedFeedbackEl.textContent = 'Ce n\'est pas la bonne réponse, réessaie !';
    mixedFeedbackEl.className = 'feedback error';
    mixedFailedOnce = true;
    btnMixedNext.classList.remove('hidden');
    mixedAnswerInput.focus();
  }

  function revealMixedAndContinue() {
    if (!mixedFailedOnce) return;

    btnMixedValidate.disabled = true;
    btnMixedNext.disabled = true;
    mixedAnswerInput.disabled = true;
    mixedAnswerInput.classList.remove('wrong');
    mixedAnswerInput.classList.add('revealed');
    mixedAnswerInput.value = Generator.formatNumberFR(mixedCurrent.answer);

    mixedFeedbackEl.textContent = 'La bonne réponse était : ' + Generator.formatNumberFR(mixedCurrent.answer) + ' ' + mixedCurrent.toLabel;
    mixedFeedbackEl.className = 'feedback info';

    if (mixedMode === 'evaluation') {
      clearInterval(mixedChronoIntervalId);
      mixedChronoIntervalId = null;
      const elapsed = (performance.now() - mixedQuestionStart) / 1000;
      evalStats.times.push(elapsed);
      evalStats.count += 1;
    } else {
      mixedScore.total += 1;
      updateMixedScoreDisplay();
    }

    advanceTimeoutId = setTimeout(() => {
      btnMixedNext.disabled = false;
      if (mixedMode === 'evaluation' && evalStats.count >= 5) {
        showRecap();
      } else {
        loadMixedExercise();
      }
    }, 2000);
  }

  // --- Écouteurs d'événements : niveaux et accueils ---
  levelCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (card.dataset.level === '3e') {
        goToHome3e();
      } else {
        setTheme('');
        showScreen('home');
      }
    });
  });
  btnToLevelSelect.addEventListener('click', goToLevelSelect);
  btnToLevelSelect3e.addEventListener('click', goToLevelSelect);
  btnBackTuto3eMenu.addEventListener('click', goToHome3e);
  btnBackEntrainement3eMenu.addEventListener('click', goToHome3e);

  // --- Écouteurs d'événements : mode mixte ---
  btnBackMixedReady.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('entrainement3e');
    showScreen('entrainement3eMenu');
  });
  btnMixedReady.addEventListener('click', () => {
    if (pendingMixedStart === 'entrainement') {
      beginMixedEntrainement();
    } else {
      beginMixedEvaluation();
    }
  });
  btnBackMixed.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('entrainement3e');
    showScreen('entrainement3eMenu');
  });
  btnMixedValidate.addEventListener('click', validateMixedAnswer);
  btnMixedNext.addEventListener('click', revealMixedAndContinue);
  mixedAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!btnMixedNext.classList.contains('hidden') && !btnMixedNext.disabled) {
        btnMixedNext.click();
      } else if (!btnMixedValidate.disabled) {
        btnMixedValidate.click();
      }
    }
  });

  // --- Écouteurs d'événements : modes générés ---
  diffCards.forEach((card) => {
    card.addEventListener('click', () => {
      const diff = card.dataset.diff;
      if (diff === 'custom') {
        startCustomSession('home');
      } else if (diff === 'custom3e') {
        startCustomSession('home3e', Units.EXTENDED_CATEGORY_KEYS);
      } else if (diff === 'tuto') {
        startTutoSession('home', 'tuto');
      } else if (diff === 'tuto3e') {
        setTheme('tuto3e');
        showScreen('tuto3eMenu');
      } else if (diff === 'tuto3e-classique') {
        startTutoSession('tuto3eMenu', 'tuto3e-classique');
      } else if (diff === 'tuto3e-temps') {
        startTutoTempsSession();
      } else if (diff === 'tuto3e-vitesse') {
        startTutoVitesseSession();
      } else if (diff === 'entrainement3e') {
        setTheme('entrainement3e');
        showScreen('entrainement3eMenu');
      } else if (diff === 'entrainement3e-classique') {
        startSession('moyen', {
          returnTo: 'entrainement3eMenu',
          categoryPool: Units.EXTENDED_CATEGORY_KEYS,
          theme: 'entrainement3e-classique'
        });
      } else if (diff === 'entrainement3e-tv') {
        startEntrainementTV();
      } else if (diff === 'evaluation3e-classique') {
        startSession('evaluation', {
          returnTo: 'entrainement3eMenu',
          categoryPool: Units.EXTENDED_CATEGORY_KEYS,
          theme: 'eval3e-classique'
        });
      } else if (diff === 'evaluation3e-experte') {
        startEvaluationExperte();
      } else {
        startSession(diff);
      }
    });
  });

  btnBack.addEventListener('click', goToReturnScreen);
  btnBackCustom.addEventListener('click', goBackFromCustom);
  btnBackTuto.addEventListener('click', goBackFromTuto);
  btnHome.addEventListener('click', goToReturnScreen);
  btnRestart.addEventListener('click', () => { if (recapRestartFn) recapRestartFn(); });

  btnHint.addEventListener('click', onHintClick);
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

  // --- Écouteurs d'événements : mode Tuto (classique) ---
  btnTutoPrev.addEventListener('click', onTutoPrev);
  btnTutoNext.addEventListener('click', onTutoNext);
  btnTutoValidate.addEventListener('click', validateTutoAnswer);
  btnTutoRetry.addEventListener('click', newTutoExample);
  btnTutoHome.addEventListener('click', goBackFromTuto);
  tutoAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !btnTutoValidate.classList.contains('hidden')) {
      e.preventDefault();
      btnTutoValidate.click();
    }
  });

  // --- Écouteurs d'événements : Tuto Temps ---
  btnBackTutoTemps.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('tuto3e');
    showScreen('tuto3eMenu');
  });
  btnTtPrev.addEventListener('click', onTtPrev);
  btnTtNext.addEventListener('click', onTtNext);
  btnTtValidate.addEventListener('click', validateTtAnswer);
  btnTtErase.addEventListener('click', onTtErase);
  btnTtRetry.addEventListener('click', newTutoTempsExample);
  btnTtHome.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('tuto3e');
    showScreen('tuto3eMenu');
  });
  ttOpButtons.forEach((btn) => {
    btn.addEventListener('click', () => onTtOpClick(btn.dataset.op, Number(btn.dataset.factor)));
  });
  ttAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !btnTtValidate.classList.contains('hidden')) {
      e.preventDefault();
      btnTtValidate.click();
    }
  });

  // --- Écouteurs d'événements : Tuto Vitesse ---
  btnBackTutoVitesse.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('tuto3e');
    showScreen('tuto3eMenu');
  });
  btnTvPrev.addEventListener('click', onTvPrev);
  btnTvNext.addEventListener('click', () => renderTvStep(2));
  btnTvValidate.addEventListener('click', validateTvAnswer);
  btnTvMult.addEventListener('click', () => onTvChoice('×'));
  btnTvDiv.addEventListener('click', () => onTvChoice('÷'));
  btnTvRetry.addEventListener('click', newTutoVitesseExample);
  btnTvHome.addEventListener('click', () => {
    clearPendingTimers();
    setTheme('tuto3e');
    showScreen('tuto3eMenu');
  });
  tvAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !btnTvValidate.classList.contains('hidden')) {
      e.preventDefault();
      btnTvValidate.click();
    }
  });
  // Revalidation en direct des étapes 2 à 4 à chaque saisie dans le tableau
  draftTableEl.addEventListener('input', () => {
    if (screens.tuto.classList.contains('active')) {
      revalidateTutoStep();
    }
  });

  // Écran de départ
  showScreen('levelSelect');
})();
