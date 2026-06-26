"use strict";

/**
 * Vamos Contar!
 *
 * A aplicação está organizada em módulos internos para manter este primeiro
 * projeto em um único arquivo JavaScript sem misturar responsabilidades.
 * Novos jogos podem reutilizar GameEngine, Timer, AudioManager e Renderer,
 * substituindo principalmente a configuração e o gerador de perguntas.
 */

// ---------------------------------------------------------------------------
// Configuração e conteúdo
// ---------------------------------------------------------------------------

const GAME_CONFIG = Object.freeze({
  totalQuestions: 10,
  levels: Object.freeze({
    1: Object.freeze({ label: "Nível 1", min: 1, max: 10 }),
    2: Object.freeze({ label: "Nível 2", min: 1, max: 20 }),
  }),
});

/**
 * As ilustrações são SVGs próprios, sem imagens, fontes ou serviços externos.
 * Cada função retorna somente marcação estática controlada pela aplicação.
 */
const OBJECT_LIBRARY = Object.freeze([
  {
    name: "flores",
    singular: "flor",
    render: () => `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M40 44v25" stroke="#24885f" stroke-width="6" stroke-linecap="round"/>
        <path d="M40 57c-10-8-18-3-18-3 3 10 11 13 18 9" fill="#5ed19a"/>
        <path d="M40 51c9-8 17-3 17-3-2 9-10 12-17 9" fill="#42b981"/>
        <circle cx="40" cy="29" r="13" fill="#ffd34e"/>
        <circle cx="40" cy="13" r="12" fill="#ff7185"/>
        <circle cx="55" cy="24" r="12" fill="#ff8a9a"/>
        <circle cx="49" cy="40" r="12" fill="#ff7185"/>
        <circle cx="31" cy="40" r="12" fill="#ff8a9a"/>
        <circle cx="25" cy="24" r="12" fill="#ff7185"/>
        <circle cx="40" cy="28" r="8" fill="#ffc328"/>
      </svg>`,
  },
  {
    name: "peixes",
    singular: "peixe",
    render: () => `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M59 40 74 25v30L59 40Z" fill="#ff8564"/>
        <ellipse cx="37" cy="40" rx="29" ry="21" fill="#57b8ff"/>
        <path d="M25 23c8 5 10 11 10 17-7-4-13-9-16-15l6-2Z" fill="#3198e4"/>
        <path d="M25 57c8-5 10-11 10-17-7 4-13 9-16 15l6 2Z" fill="#3198e4"/>
        <circle cx="23" cy="35" r="4.5" fill="#fff"/>
        <circle cx="23" cy="35" r="2" fill="#253052"/>
        <path d="M13 45c5 4 10 4 14 0" fill="none" stroke="#277ab9" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M44 23c7 7 9 14 8 28" fill="none" stroke="#83ccff" stroke-width="3"/>
      </svg>`,
  },
  {
    name: "bolas",
    singular: "bola",
    render: () => `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="32" fill="#ffcf4a"/>
        <path d="M15 25c16 2 33-2 45-10" fill="none" stroke="#ff7a59" stroke-width="7"/>
        <path d="M12 53c17-8 35-8 54 1" fill="none" stroke="#635bdb" stroke-width="7"/>
        <path d="M39 9c-6 18-5 41 4 62" fill="none" stroke="#20b987" stroke-width="7"/>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e9a826" stroke-width="3"/>
      </svg>`,
  },
  {
    name: "estrelas",
    singular: "estrela",
    render: () => `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="m40 7 10 21 24 3-17 17 4 24-21-11-21 11 4-24L6 31l24-3L40 7Z" fill="#ffd34e" stroke="#edae24" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="31" cy="39" r="2.5" fill="#5d4a3b"/>
        <circle cx="49" cy="39" r="2.5" fill="#5d4a3b"/>
        <path d="M32 49c5 5 11 5 16 0" fill="none" stroke="#5d4a3b" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
  },
  {
    name: "maçãs",
    singular: "maçã",
    render: () => `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M41 24c-1-9 4-15 9-18" fill="none" stroke="#75502f" stroke-width="5" stroke-linecap="round"/>
        <path d="M45 15c8-8 18-4 20 0-7 7-15 7-20 0Z" fill="#43b879"/>
        <path d="M40 25c18-12 34 2 32 20-2 20-18 30-32 25C26 75 10 65 8 45 6 27 22 13 40 25Z" fill="#ff5f6d" stroke="#d84553" stroke-width="3"/>
        <path d="M27 29c-7 4-10 10-10 16" fill="none" stroke="#ff9aa4" stroke-width="5" stroke-linecap="round"/>
      </svg>`,
  },
]);

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

const Utils = Object.freeze({
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle(values) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Utils.randomInteger(0, index);
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  },

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  },
});

// ---------------------------------------------------------------------------
// Gerador de perguntas
// ---------------------------------------------------------------------------

const QuestionGenerator = Object.freeze({
  createSession(levelConfig, totalQuestions) {
    const values = [];

    for (let value = levelConfig.min; value <= levelConfig.max; value += 1) {
      values.push(value);
    }

    // No nível 1, as dez quantidades aparecem uma vez. No nível 2, dez
    // quantidades diferentes são sorteadas, evitando repetição na partida.
    return Utils.shuffle(values)
      .slice(0, totalQuestions)
      .map((answer, index) => {
        const object = OBJECT_LIBRARY[index % OBJECT_LIBRARY.length];
        return {
          answer,
          alternatives: QuestionGenerator.createAlternatives(answer, levelConfig),
          object,
        };
      });
  },

  createAlternatives(answer, levelConfig) {
    const alternatives = new Set([answer]);
    const nearbyOffsets = Utils.shuffle([-3, -2, -1, 1, 2, 3]);

    for (const offset of nearbyOffsets) {
      const candidate = answer + offset;
      if (candidate >= levelConfig.min && candidate <= levelConfig.max) {
        alternatives.add(candidate);
      }
      if (alternatives.size === 3) break;
    }

    // Garantia defensiva para intervalos futuros menores ou regras alteradas.
    while (alternatives.size < 3) {
      alternatives.add(Utils.randomInteger(levelConfig.min, levelConfig.max));
    }

    return Utils.shuffle([...alternatives]);
  },
});

// ---------------------------------------------------------------------------
// Temporizador e áudio
// ---------------------------------------------------------------------------

class GameTimer {
  constructor(onTick) {
    this.onTick = onTick;
    this.elapsedSeconds = 0;
    this.intervalId = null;
  }

  start() {
    this.stop();
    this.elapsedSeconds = 0;
    this.onTick(this.elapsedSeconds);
    this.intervalId = window.setInterval(() => {
      this.elapsedSeconds += 1;
      this.onTick(this.elapsedSeconds);
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    return this.elapsedSeconds;
  }
}

class AudioManager {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  ensureContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.context = new AudioContextClass();
    }

    if (this.context?.state === "suspended") {
      this.context.resume();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.ensureContext();
    this.playTone(523.25, 0, 0.12);
    this.playTone(659.25, 0.11, 0.13);
    this.playTone(783.99, 0.23, 0.18);
  }

  playWrong() {
    if (!this.enabled) return;
    this.ensureContext();
    this.playTone(220, 0, 0.16, "triangle");
    this.playTone(174.61, 0.13, 0.22, "triangle");
  }

  playTone(frequency, delay, duration, type = "sine") {
    if (!this.context) return;

    const startTime = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

class GameRenderer {
  constructor() {
    this.elements = {
      screens: {
        start: document.querySelector("#start-screen"),
        game: document.querySelector("#game-screen"),
        result: document.querySelector("#result-screen"),
      },
      audioToggle: document.querySelector("#audio-toggle"),
      audioLabel: document.querySelector("#audio-label"),
      startButton: document.querySelector("#start-button"),
      nextButton: document.querySelector("#next-button"),
      restartButton: document.querySelector("#restart-button"),
      changeLevelButton: document.querySelector("#change-level-button"),
      questionCounter: document.querySelector("#question-counter"),
      progressTrack: document.querySelector(".progress-track"),
      progressBar: document.querySelector("#progress-bar"),
      levelBadge: document.querySelector("#level-badge"),
      objectsArea: document.querySelector("#objects-area"),
      answers: document.querySelector("#answers"),
      feedback: document.querySelector("#feedback"),
      score: document.querySelector("#score-value"),
      correct: document.querySelector("#correct-value"),
      wrong: document.querySelector("#wrong-value"),
      time: document.querySelector("#time-value"),
      finalScore: document.querySelector("#final-score-value"),
      finalCorrect: document.querySelector("#final-correct-value"),
      finalWrong: document.querySelector("#final-wrong-value"),
      finalTime: document.querySelector("#final-time-value"),
      resultTitle: document.querySelector("#result-title"),
      resultMessage: document.querySelector("#result-message"),
    };
  }

  showScreen(name) {
    Object.entries(this.elements.screens).forEach(([screenName, screen]) => {
      screen.hidden = screenName !== name;
    });

    const heading = this.elements.screens[name].querySelector("h1, h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }

  getSelectedLevel() {
    return Number(document.querySelector('input[name="level"]:checked').value);
  }

  updateAudioControl(enabled) {
    this.elements.audioToggle.setAttribute("aria-pressed", String(enabled));
    this.elements.audioToggle.setAttribute(
      "aria-label",
      enabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros",
    );
    this.elements.audioLabel.textContent = enabled ? "Som ligado" : "Som desligado";
  }

  renderQuestion(question, state) {
    const currentNumber = state.currentIndex + 1;
    const progress = (currentNumber / GAME_CONFIG.totalQuestions) * 100;
    const columns = question.answer <= 5 ? question.answer : 5;

    this.elements.questionCounter.textContent =
      `Pergunta ${currentNumber} de ${GAME_CONFIG.totalQuestions}`;
    this.elements.progressTrack.setAttribute("aria-valuenow", String(currentNumber));
    this.elements.progressBar.style.width = `${progress}%`;
    this.elements.levelBadge.textContent = GAME_CONFIG.levels[state.level].label;
    this.elements.feedback.textContent = "";
    this.elements.feedback.className = "feedback";
    this.elements.nextButton.hidden = true;

    this.elements.objectsArea.style.setProperty("--columns", String(columns));
    this.elements.objectsArea.setAttribute(
      "aria-label",
      `Grupo de ${question.object.name} para contar`,
    );
    this.elements.objectsArea.replaceChildren();

    for (let index = 0; index < question.answer; index += 1) {
      const object = document.createElement("span");
      object.className = "counting-object";
      object.style.setProperty("--index", String(index));
      object.innerHTML = question.object.render();
      this.elements.objectsArea.append(object);
    }

    this.elements.answers.replaceChildren();
    question.alternatives.forEach((alternative) => {
      const button = document.createElement("button");
      button.className = "answer-button";
      button.type = "button";
      button.dataset.answer = String(alternative);
      button.textContent = String(alternative);
      button.setAttribute("aria-label", `Resposta ${alternative}`);
      this.elements.answers.append(button);
    });

    this.updateStats(state);
    this.elements.answers.querySelector("button")?.focus();
  }

  showAnswerFeedback(selectedAnswer, correctAnswer, object) {
    const buttons = this.elements.answers.querySelectorAll(".answer-button");
    buttons.forEach((button) => {
      const buttonAnswer = Number(button.dataset.answer);
      button.disabled = true;

      if (buttonAnswer === correctAnswer) {
        button.classList.add("is-correct");
      } else if (buttonAnswer === selectedAnswer) {
        button.classList.add("is-wrong");
      }
    });

    if (selectedAnswer === correctAnswer) {
      this.elements.feedback.textContent = "Acertou! Muito bem!";
      this.elements.feedback.classList.add("correct");
    } else {
      const noun = correctAnswer === 1 ? object.singular : object.name;
      this.elements.feedback.textContent =
        `Quase! A resposta certa é ${correctAnswer} ${noun}.`;
      this.elements.feedback.classList.add("wrong");
    }

    this.elements.nextButton.textContent =
      this.isLastQuestion()
        ? "Ver meu resultado"
        : "Próxima pergunta";
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = '<path d="m9 5 7 7-7 7"></path>';
    this.elements.nextButton.append(arrow);
    this.elements.nextButton.hidden = false;
    this.elements.nextButton.focus();
  }

  isLastQuestion() {
    return this.elements.questionCounter.textContent.startsWith(
      `Pergunta ${GAME_CONFIG.totalQuestions} `,
    );
  }

  updateStats(state) {
    this.elements.score.textContent = String(state.score);
    this.elements.correct.textContent = String(state.correct);
    this.elements.wrong.textContent = String(state.wrong);
  }

  updateTime(seconds) {
    this.elements.time.textContent = Utils.formatTime(seconds);
  }

  renderResult(state) {
    const resultCopy = this.getResultCopy(state.correct);
    this.elements.resultTitle.textContent = resultCopy.title;
    this.elements.resultMessage.textContent = resultCopy.message;
    this.elements.finalScore.textContent = String(state.score);
    this.elements.finalCorrect.textContent = String(state.correct);
    this.elements.finalWrong.textContent = String(state.wrong);
    this.elements.finalTime.textContent = Utils.formatTime(state.elapsedSeconds);
    this.showScreen("result");
  }

  getResultCopy(correct) {
    if (correct === 10) {
      return {
        title: "Excelente!",
        message: "Você contou tudo certinho!",
      };
    }
    if (correct >= 7) {
      return {
        title: "Muito bem!",
        message: "Você está contando cada vez melhor!",
      };
    }
    if (correct >= 4) {
      return {
        title: "Bom trabalho!",
        message: "Mais uma partida vai deixar sua contagem ainda melhor.",
      };
    }
    return {
      title: "Continue praticando!",
      message: "Conte com calma. Você consegue!",
    };
  }
}

// ---------------------------------------------------------------------------
// Motor da partida
// ---------------------------------------------------------------------------

class GameEngine {
  constructor(renderer, timer, audio) {
    this.renderer = renderer;
    this.timer = timer;
    this.audio = audio;
    this.state = this.createInitialState();
    this.questions = [];
  }

  createInitialState(level = 1) {
    return {
      level,
      currentIndex: 0,
      score: 0,
      correct: 0,
      wrong: 0,
      elapsedSeconds: 0,
      answered: false,
    };
  }

  start(level) {
    const levelConfig = GAME_CONFIG.levels[level];
    if (!levelConfig) return;

    this.state = this.createInitialState(level);
    this.questions = QuestionGenerator.createSession(
      levelConfig,
      GAME_CONFIG.totalQuestions,
    );
    this.renderer.showScreen("game");
    this.timer.start();
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    this.state.answered = false;
    this.renderer.renderQuestion(
      this.questions[this.state.currentIndex],
      this.state,
    );
  }

  answer(selectedAnswer) {
    if (this.state.answered) return;
    this.state.answered = true;

    const question = this.questions[this.state.currentIndex];
    const isCorrect = selectedAnswer === question.answer;

    if (isCorrect) {
      this.state.correct += 1;
      this.state.score += 1;
      this.audio.playCorrect();
    } else {
      this.state.wrong += 1;
      this.audio.playWrong();
    }

    this.renderer.updateStats(this.state);
    this.renderer.showAnswerFeedback(
      selectedAnswer,
      question.answer,
      question.object,
    );
  }

  next() {
    if (!this.state.answered) return;

    if (this.state.currentIndex >= GAME_CONFIG.totalQuestions - 1) {
      this.finish();
      return;
    }

    this.state.currentIndex += 1;
    this.renderCurrentQuestion();
  }

  finish() {
    this.state.elapsedSeconds = this.timer.stop();
    this.renderer.renderResult(this.state);
  }
}

// ---------------------------------------------------------------------------
// Inicialização e eventos
// ---------------------------------------------------------------------------

const renderer = new GameRenderer();
const audioManager = new AudioManager();
const timer = new GameTimer((seconds) => renderer.updateTime(seconds));
const game = new GameEngine(renderer, timer, audioManager);

renderer.elements.startButton.addEventListener("click", () => {
  audioManager.ensureContext();
  game.start(renderer.getSelectedLevel());
});

renderer.elements.answers.addEventListener("click", (event) => {
  const button = event.target.closest(".answer-button");
  if (!button) return;
  game.answer(Number(button.dataset.answer));
});

renderer.elements.nextButton.addEventListener("click", () => game.next());

renderer.elements.restartButton.addEventListener("click", () => {
  game.start(game.state.level);
});

renderer.elements.changeLevelButton.addEventListener("click", () => {
  timer.stop();
  renderer.showScreen("start");
});

renderer.elements.audioToggle.addEventListener("click", () => {
  const enabled = !audioManager.enabled;
  audioManager.setEnabled(enabled);
  if (enabled) audioManager.ensureContext();
  renderer.updateAudioControl(enabled);
});

renderer.updateAudioControl(audioManager.enabled);
