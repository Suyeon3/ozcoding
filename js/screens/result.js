import { getState, setState } from '../state.js';
import { renderStepper } from '../components/stepper.js';
import { renderComparisonHTML } from '../components/comparison.js';

const ui = {
  summaryChips: document.getElementById('summary-chips'),
  strategyList: document.getElementById('strategy-list'),
  comparisonRoot: document.getElementById('comparison-root'),
  btnToggleCompare: document.getElementById('btn-toggle-compare')
};

function init() {
  const state = getState();
  if (!state.strategies) {
    location.href = 'index.html';
    return;
  }

  const stepperRoot = document.getElementById('stepper-root');
  renderStepper(stepperRoot, 1);

  renderSummary(state.inputs);
  renderStrategies(state.strategies);
  
  ui.btnToggleCompare.addEventListener('click', () => toggleCompare(state.strategies));
}

function toggleCompare(strategies) {
  const isHidden = ui.comparisonRoot.style.display === 'none';
  if (isHidden) {
    ui.comparisonRoot.innerHTML = renderComparisonHTML(strategies);
    ui.comparisonRoot.style.display = 'block';
    ui.btnToggleCompare.textContent = '▲ 전략 비교 상세 접기';
    
    // Smooth scroll to comparison
    ui.comparisonRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    ui.comparisonRoot.style.display = 'none';
    ui.btnToggleCompare.textContent = '▼ 전략 비교 상세 보기';
  }
}

function renderSummary(inputs) {
  const chips = [
    `MIN <b>${inputs.min.toLocaleString()}</b>`,
    `MAX <b>${inputs.max.toLocaleString()}</b>`
  ];
  if (inputs.marketPrice) {
    chips.push(`시장가 <b>${inputs.marketPrice.toLocaleString()}</b>`);
  }

  ui.summaryChips.innerHTML = chips.map(c => `<div class="chip">${c}</div>`).join('');
}

function renderStrategies(strategies) {
  const items = [
    { key: 'profitMax', name: '최대 수익형', data: strategies.profitMax },
    { key: 'dealCloser', name: '거래 성사형', data: strategies.dealCloser, isRecommended: true },
    { key: 'quickSell', name: '빠른 판매형', data: strategies.quickSell, isQuick: true }
  ];

  ui.strategyList.innerHTML = items.map(item => renderCard(item)).join('');
  
  // Attach event listeners after rendering
  ui.strategyList.querySelectorAll('.btn--apply').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.target.dataset.key;
      setState({ selectedStrategy: key });
      location.href = 'apply.html';
    });
  });
}

function renderCard(item) {
  const { key, name, data, isRecommended, isQuick } = item;
  
  if (!data) {
    return `
      <div class="strategy-card card strategy-card--disabled">
        <div class="strategy-card__header">
          <span class="strategy-name">${name}</span>
        </div>
        <div class="error-msg">시장가 조건과 희망 수익 범위가 맞지 않아 추천이 어렵습니다</div>
      </div>
    `;
  }

  const compClass = data.competitiveness > 1 ? 'competitiveness--up' : 
                   (data.competitiveness === 1 ? 'competitiveness--perfect' : 'competitiveness--down');
  const compSymbol = data.competitiveness > 1 ? '▲' : (data.competitiveness === 1 ? '=' : '▼');
  const compText = data.competitiveness ? `${(data.competitiveness * 100).toFixed(0)}% ${compSymbol}` : '-';

  return `
    <div class="strategy-card card ${isRecommended ? 'card--accent' : ''}">
      ${isRecommended ? '<span class="badge badge--accent badge-top">★ 추천</span>' : ''}
      ${isQuick ? '<span class="badge badge--warn badge-top">⚡ 빠른판매 예상</span>' : ''}
      
      <div class="strategy-card__header">
        <span class="strategy-name">${name}</span>
        <div class="fee-info">
          <div class="fee-row">판매자 ${data.sellerFeeRate * 100}%</div>
          <div class="fee-row">구매자 ${data.buyerFeeRate * 100}%</div>
        </div>
      </div>

      <div class="price-display">
        <span class="price-label">추천 판매가</span>
        <span class="price-value text-bold">${data.listPrice.toLocaleString()}</span>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">정산가</span>
          <span class="stat-value">${data.netPrice.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">구매자최종</span>
          <span class="stat-value">${data.buyerTotal.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">시장가대비</span>
          <span class="stat-value ${compClass}">${compText}</span>
        </div>
      </div>

      <button class="btn ${isRecommended ? 'btn--secondary' : 'btn--primary'} btn--apply" data-key="${key}" style="margin-top: 16px;">
        이 전략으로 설정하기
      </button>
    </div>
  `;
}

init();
