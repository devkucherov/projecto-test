// состояние теста и логика результата
import { questions } from './data.js';

export const totalQuestions = questions.length;

export let currentStep = 0;
export let answers = new Array(totalQuestions).fill(null);

export function resetState() {
  currentStep = 0;
  answers = new Array(totalQuestions).fill(null);
}

export function setAnswer(index, letter) {
  answers[index] = letter;
}

export function incrementStep() {
  if (currentStep < totalQuestions - 1) {
    currentStep++;
  }
}

export function decrementStep() {
  if (currentStep > 0) {
    currentStep--;
  }
}

export function calculateResult() {
  const counts = {
    'Авторитарный': 0,
    'Контролер': 0,
    'Стратег': 0,
    'Делегатор': 0,
    'Наставник': 0
  };

  answers.forEach((letter, idx) => {
    if (letter) {
      const question = questions[idx];
      const selectedOption = question.options.find(opt => opt.letter === letter);
      if (selectedOption) {
        counts[selectedOption.type]++;
      }
    }
  });

  let maxType = 'Авторитарный';
  let maxCount = 0;
  for (let type in counts) {
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      maxType = type;
    }
  }
  return maxType;
}