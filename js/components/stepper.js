/**
 * Reusable Stepper Component
 * Renders a 4-step progress indicator.
 */

const STEPS = [
  { id: 'input', label: '가격 설정' },
  { id: 'result', label: '추천 전략' },
  { id: 'apply', label: '최종 확인' }
];

/**
 * Renders the stepper into a target element.
 * @param {HTMLElement} target - The container element to render into.
 * @param {number} activeIndex - The index of the current active step (0-3).
 */
export function renderStepper(target, activeIndex) {
  if (!target) return;

  const html = `
    <nav class="stepper container">
      ${STEPS.map((step, index) => {
        let statusClass = '';
        if (index === activeIndex) statusClass = 'stepper__item--active';
        else if (index < activeIndex) statusClass = 'stepper__item--completed';

        return `
          <div class="stepper__item ${statusClass}">
            <div class="stepper__dot"></div>
            <span class="stepper__label">${step.label}</span>
          </div>
        `;
      }).join('')}
    </nav>
  `;

  target.innerHTML = html;
}
