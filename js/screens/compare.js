import { getState } from '../state.js';
import { renderStepper } from '../components/stepper.js';

const ui = {
  tableBody: document.getElementById('compare-table-body')
};

function init() {
  const state = getState();
  if (!state.strategies) {
    location.href = 'index.html';
    return;
  }

  const stepperRoot = document.getElementById('stepper-root');
  renderStepper(stepperRoot, 2);

  renderTable(state.strategies);
}

function renderTable(strategies) {
  const rows = [
    { name: '최대 수익형', data: strategies.profitMax, sColor: 'val--up' },
    { name: '거래 성사형', data: strategies.dealCloser, highlight: true, sColor: 'val--accent' },
    { name: '빠른 판매형', data: strategies.quickSell, sColor: 'val--down' }
  ];

  ui.tableBody.innerHTML = rows.map(row => {
    if (!row.data) return '';
    return `
      <tr class="${row.highlight ? 'row--highlight' : ''}">
        <td>${row.name}</td>
        <td class="${row.sColor}">${row.data.sellerFeeRate * 100}%</td>
        <td>${row.data.buyerFeeRate * 100}%</td>
        <td>${row.data.listPrice.toLocaleString()}</td>
        <td>${row.data.netPrice.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
}

init();
