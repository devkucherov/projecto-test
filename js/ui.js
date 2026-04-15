// работа с DOM, рендеринг, экраны
import { questions } from './data.js';
import { currentStep, answers, totalQuestions, setAnswer, resetState } from './state.js';

// DOM элементы
export const welcomeSection = document.getElementById('welcomeSection');
export const questionSection = document.getElementById('questionSection');
export const emailSection = document.getElementById('emailSection');
export const successScreen = document.getElementById('successScreen');

export const startBtn = document.getElementById('startBtn');
export const prevBtn = document.getElementById('prevBtn');
export const nextBtn = document.getElementById('nextBtn');
export const backToQuestionsBtn = document.getElementById('backToQuestionsBtn');
export const submitEmailBtn = document.getElementById('submitEmailBtn');
export const restartBtn = document.getElementById('restartBtn');

export const questionText = document.getElementById('questionText');
export const optionsContainer = document.getElementById('optionsContainer');
export const currentQNumberSpan = document.getElementById('currentQNumber');
export const progressFill = document.getElementById('progressFill');

export const userEmailInput = document.getElementById('userEmailInput');
export const emailError = document.getElementById('emailError');

export function showScreen(screenId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

export function renderQuestion() {
  const q = questions[currentStep];
  questionText.textContent = q.text;
  currentQNumberSpan.textContent = currentStep + 1;
  const percent = ((currentStep + 1) / totalQuestions) * 100;
  progressFill.style.width = percent + '%';

  const selectedLetter = answers[currentStep];

  let html = '';
  q.options.forEach((opt) => {
    const isSelected = (selectedLetter === opt.letter);
    html += `
      <div class="question__option-card ${isSelected ? 'selected' : ''}" data-opt-letter="${opt.letter}">
        <span class="question__option-letter">${opt.letter}</span>
        <span class="question__option-text">${opt.text}</span>
      </div>
    `;
  });
  optionsContainer.innerHTML = html;

  // Обработчики выбора варианта
  document.querySelectorAll('.question__option-card').forEach(card => {
    card.addEventListener('click', () => {
      const letter = card.dataset.optLetter;
      setAnswer(currentStep, letter);
      renderQuestion(); // перерисовать для подсветки выбранного
      updateNextButtonState();
    });
  });

  // Управление кнопкой "Назад"
  prevBtn.style.display = currentStep === 0 ? 'none' : 'block';

  // Текст кнопки "Далее"
  if (currentStep === totalQuestions - 1) {
    nextBtn.textContent = 'К результату';
  } else {
    nextBtn.textContent = `Следующий вопрос →`;
  }

  updateNextButtonState();
}

export function updateNextButtonState() {
  nextBtn.disabled = (answers[currentStep] === null);
}

export function clearEmailError() {
  emailError.textContent = '';
}

export function showEmailError(message) {
  emailError.textContent = message;
}

export function disableSubmitButton() {
  submitEmailBtn.disabled = true;
  submitEmailBtn.innerHTML = `Отправка... <span class="spinner"></span>`;
}

export function enableSubmitButton() {
  submitEmailBtn.disabled = false;
  submitEmailBtn.textContent = 'Узнать, какой вы руководитель';
}

export function resetUI() {
  userEmailInput.value = '';
  clearEmailError();
  enableSubmitButton();
}