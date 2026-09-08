// app.js
// Contrôleur principal : gère la navigation entre écrans, la logique d'un
// exercice de conversion (validation, échec/réessai, enchaînement infini)
// et le mode Évaluation (chronomètre indicatif + score sur 5).

(function () {
  // --- Références DOM ---
  const screens = {
    home: document.getElementById('screen-home'),
    exercise: document.getElementById('screen-exercise'),
    recap: document.getElementById('screen-recap')
  };

  const diffCards = document.querySelectorAll('.diff-card');
  const btnBack = document.getElementById('btn-back');
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

  // --- État ---
  let currentLevel = 'facile';
  let currentConversion = null;
  let hasFailedOnce = false;
  let advanceTimeoutId = null;
  let chronoIntervalId = null;
  let questionStart = 0;

  let evalStats = { count: 0, correctCount: 0, times: [] };

  // --- Construction du tableau brouillon (une seule fois, persiste ensuite) ---
  DraftTable.buildTable(draftTableEl);

  // --- Navigation entre écrans ---
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].classList.toggle('active', key === name);
    });
    draftWrap.classList.toggle('hidden', name !== 'exercise');
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

  // --- Démarrage d'une session (facile / moyen / évaluation) ---
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

  // --- Chargement d'une nouvelle conversion ---
  function loadNewConversion() {
    clearPendingTimers();
    hasFailedOnce = false;

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

  // --- Validation d'une réponse ---
  function sanitizeAnswerInput() {
    const raw = answerInput.value;
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
    answerInput.value = cleaned;
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
    Confetti.burst(confettiCanvas);

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

  // --- Récapitulatif du mode Évaluation ---
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
      Confetti.burst(confettiCanvas);
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

  // --- Écouteurs d'événements ---
  diffCards.forEach((card) => {
    card.addEventListener('click', () => startSession(card.dataset.diff));
  });

  btnBack.addEventListener('click', goHome);
  btnHome.addEventListener('click', goHome);
  btnRestart.addEventListener('click', () => startSession('evaluation'));

  btnValidate.addEventListener('click', validateAnswer);
  btnNext.addEventListener('click', revealAndContinue);

  answerInput.addEventListener('input', sanitizeAnswerInput);
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

  // Écran de départ
  showScreen('home');
})();
