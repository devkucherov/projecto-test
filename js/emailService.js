// отправка письма через EmailJS
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID
} from './config.js';
import { questions, typeDetails } from './data.js';
import { answers, calculateResult } from './state.js';

export function initEmailJS() {
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.warn('EmailJS не настроен — письмо не отправится (демо).');
  }
}

export async function sendResultEmail(email) {
  const resultType = calculateResult();
  const detail = typeDetails[resultType];

  // Формируем HTML-список сильных сторон
  const strengthsHtml = detail.strengths.map(s => `<li>✅ ${s}</li>`).join('');

  // Формируем HTML-таблицу с ответами
  let answersHtml = '';
  questions.forEach((q, i) => {
    const letter = answers[i];
    const selectedOption = q.options.find(opt => opt.letter === letter);
    const displayLetter = letter || '—';
    const displayText = selectedOption ? selectedOption.text : 'нет ответа';
    answersHtml += `<tr><td style="padding:8px; border-bottom:1px solid #e0e7ef;">${i + 1}. ${q.text}</td><td style="padding:8px; border-bottom:1px solid #e0e7ef;"><strong>${displayLetter}</strong> ${displayText}</td></tr>`;
  });

  const templateParams = {
    to_email: email,
    subject: 'Ваш результат: Какой вы руководитель?',
    result_type: resultType,
    description: detail.description,
    strengths_list: strengthsHtml,
    risk: detail.risk,
    answers_table: answersHtml
  };

  // Если ключ не заменён — имитация отправки
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    console.log('[ДЕМО] Параметры письма:', templateParams);
    return { success: true, demo: true };
  }

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log('Email sent', response);
    return { success: true, demo: false };
  } catch (error) {
    console.error('EmailJS error', error);
    throw error;
  }
}