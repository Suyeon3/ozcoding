import { setState, getState } from '../state.js';
import { calculateStrategies } from '../calculator.js';
import { renderStepper } from '../components/stepper.js';

const ui = {
  inputMin: document.getElementById('input-min'),
  inputMax: document.getElementById('input-max'),
  inputMarket: document.getElementById('input-market'),
  displayMin: document.getElementById('display-min'),
  displayMax: document.getElementById('display-max'),
  ctaRecommend: document.getElementById('cta-recommend'),
  errorToast: document.getElementById('error-toast')
};

function init() {
  const stepperRoot = document.getElementById('stepper-root');
  renderStepper(stepperRoot, 0);

  ui.inputMin.addEventListener('input', (e) => handleInput(e, 'min'));
  ui.inputMax.addEventListener('input', (e) => handleInput(e, 'max'));
  ui.inputMarket.addEventListener('input', (e) => handleInput(e, 'marketPrice'));
  
  ui.ctaRecommend.addEventListener('click', handleRecommend);
}

function handleInput(e, key) {
  let value = e.target.value.replace(/[^0-9]/g, '');
  const numValue = value === '' ? null : parseInt(value, 10);
  
  // Update state
  const partial = { inputs: {} };
  partial.inputs[key] = numValue;
  setState(partial);
  
  // Format display
  e.target.value = numValue !== null ? numValue.toLocaleString('ko-KR') : '';
  
  if (key === 'min') ui.displayMin.textContent = e.target.value || '0';
  if (key === 'max') ui.displayMax.textContent = e.target.value || '0';
  
  validate();
}

function validate() {
  const { inputs } = getState();
  const isValid = inputs.min !== null && inputs.max !== null && inputs.min <= inputs.max;
  
  ui.ctaRecommend.disabled = !isValid;
  
  if (inputs.min !== null && inputs.max !== null && inputs.min > inputs.max) {
    showError('최소 수익가가 최대 수익가보다 클 수 없습니다.');
    ui.inputMin.classList.add('input-field--error');
  } else {
    ui.inputMin.classList.remove('input-field--error');
    hideError();
  }
}

function showError(msg) {
  ui.errorToast.textContent = msg;
  ui.errorToast.style.opacity = '1';
}

function hideError() {
  ui.errorToast.style.opacity = '0';
}

function handleRecommend() {
  const { inputs } = getState();
  const strategies = calculateStrategies(inputs);
  
  setState({ strategies });
  
  window.location.href = 'result.html';
}

init();
