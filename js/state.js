/**
 * Shared state management persisted via sessionStorage.
 */

const STORAGE_KEY = 'c2c_price_helper_state';

const defaultState = {
  inputs: {
    min: null,            // number
    max: null,            // number
    marketPrice: null     // number | null (optional)
  },
  strategies: null,       // result from calculateStrategies()
  selectedStrategy: null  // 'profitMax' | 'dealCloser' | 'quickSell'
};

export function getState() {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse state from sessionStorage', e);
    return defaultState;
  }
}

export function setState(partial) {
  const current = getState();
  const next = {
    ...current,
    ...partial,
    inputs: {
      ...current.inputs,
      ...(partial.inputs || {})
    }
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearState() {
  sessionStorage.removeItem(STORAGE_KEY);
}
