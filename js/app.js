// инициализация и обработчики событий
import {
  welcomeSection, questionSection, emailSection, successScreen,
  startBtn, prevBtn, nextBtn, backToQuestionsBtn,
  submitEmailBtn, restartBtn, userEmailInput, emailError,
  showScreen, renderQuestion, updateNextButtonState,
  clearEmailError, showEmailError, disableSubmitButton, enableSubmitButton, resetUI
} from './ui.js';
import {
  currentStep, totalQuestions, answers,
  resetState, incrementStep, decrementStep
} from './state.js';
import { initEmailJS, sendResultEmail } from './emailService.js';

function goToNextStep() {
  if (answers[currentStep] === null) return;

  if (currentStep < totalQuestions - 1) {
    incrementStep();
    renderQuestion();
  } else {
    showScreen('emailSection');
  }
}

function goToPrevStep() {
  decrementStep();
  renderQuestion();
}

function handleStart() {
  resetState();
  renderQuestion();
  showScreen('questionSection');
}

function handleBackToQuestions() {
  showScreen('questionSection');
  renderQuestion();
}

async function handleEmailSubmit() {
  const email = userEmailInput.value.trim();
  clearEmailError();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    showEmailError('Введите корректный email адрес');
    return;
  }

  if (answers.some(a => a === null)) {
    showEmailError('Вы ответили не на все вопросы. Вернитесь и завершите тест.');
    return;
  }

  disableSubmitButton();
  try {
    await sendResultEmail(email);
    showScreen('successScreen');
  } catch (err) {
    showEmailError('Ошибка отправки. Попробуйте позже или проверьте настройки.');
  } finally {
    enableSubmitButton();
  }
}

function handleRestart() {
  resetState();
  resetUI();
  showScreen('welcomeSection');
}

export function initApp() {
  initEmailJS();

  startBtn.addEventListener('click', handleStart);
  nextBtn.addEventListener('click', goToNextStep);
  prevBtn.addEventListener('click', goToPrevStep);
  backToQuestionsBtn.addEventListener('click', handleBackToQuestions);
  submitEmailBtn.addEventListener('click', handleEmailSubmit);
  restartBtn.addEventListener('click', handleRestart);
}