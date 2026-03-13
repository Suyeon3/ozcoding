import { getState } from '../state.js';
import { renderStepper } from '../components/stepper.js';

const ui = {
  hero: document.getElementById('hero-strategy'),
  sellerFee: document.getElementById('val-seller-fee'),
  listPrice: document.getElementById('val-list-price'),
  buyerFee: document.getElementById('val-buyer-fee'),
  buyerTotal: document.getElementById('val-buyer-total'),
  netPrice: document.getElementById('val-net-price'),
  ctaApply: document.getElementById('cta-apply')
};

function init() {
  const state = getState();
  const strategyKey = state.selectedStrategy;
  const strategies = state.strategies;

  if (!strategies || !strategyKey) {
    location.href = 'index.html';
    return;
  }

  const stepperRoot = document.getElementById('stepper-root');
  renderStepper(stepperRoot, 2);

  const data = strategies[strategyKey];
  const nameMap = {
    profitMax: '최대 수익형',
    dealCloser: '거래 성사형',
    quickSell: '빠른 판매형'
  };

  renderHero(nameMap[strategyKey], data);
  renderPreview(data);

  ui.ctaApply.addEventListener('click', () => {
    alert('등록이 완료되었습니다!');
    // Optional: clearState() or navigate home
  });
}

function renderHero(name, data) {
  ui.hero.innerHTML = `
    <span class="strategy-name">${name}</span>
    <span class="main-val text-bold">${data.sellerFeeRate * 100}%</span>
    <span class="sub-val">판매자 부담 수수료</span>
  `;
}

function renderPreview(data) {
  ui.sellerFee.textContent = `${data.sellerFeeRate * 100}%`;
  ui.listPrice.textContent = `${data.listPrice.toLocaleString()}원`;
  ui.buyerFee.textContent = `${data.buyerFeeRate * 100}%`;
  ui.buyerTotal.textContent = `${data.buyerTotal.toLocaleString()}원`;
  ui.netPrice.textContent = `${data.netPrice.toLocaleString()}원`;
}

init();
