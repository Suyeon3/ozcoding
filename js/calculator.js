/**
 * Pure calculation logic for pricing strategies.
 * No DOM side-effects. Fully unit-testable.
 */

export function calculateStrategies({ min, max, marketPrice }) {
  const TOTAL_FEE_RATE = 0.06;

  // Strategy 1 — Profit Max
  const profitMax = calculateStrategyResult({
    sellerFeeRate: 0.01,
    targetPrice: max,
    isTargetNet: true,
    marketPrice,
  });

  // Strategy 2 — Deal Closer (auto-search algorithm)
  let dealCloser = null;
  if (marketPrice) {
    const rates = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    for (const rate of rates) {
      const buyerFeeRate = TOTAL_FEE_RATE - rate;
      const listPrice = Math.floor(marketPrice / (1 + buyerFeeRate));
      const netPrice = Math.floor(listPrice * (1 - rate));

      if (netPrice >= min && netPrice <= max) {
        dealCloser = {
          sellerFeeRate: rate,
          buyerFeeRate,
          listPrice,
          netPrice,
          buyerTotal: Math.floor(listPrice * (1 + buyerFeeRate)),
          competitiveness: (listPrice * (1 + buyerFeeRate)) / marketPrice,
        };
        break;
      }
    }
  }

  // Strategy 3 — Quick Sell
  const quickSell = calculateStrategyResult({
    sellerFeeRate: 0.06,
    targetPrice: min,
    isTargetNet: true,
    marketPrice,
  });

  return {
    profitMax,
    dealCloser,
    quickSell,
  };
}

/**
 * Internal helper to calculate core metrics for a strategy.
 */
function calculateStrategyResult({
  sellerFeeRate,
  targetPrice,
  isTargetNet,
  marketPrice,
}) {
  const TOTAL_FEE_RATE = 0.06;
  const buyerFeeRate = TOTAL_FEE_RATE - sellerFeeRate;

  let listPrice;
  if (isTargetNet) {
    listPrice = Math.floor(targetPrice / (1 - sellerFeeRate));
  } else {
    // This path is used if we targeted a specific list price, currently not in core strategies but good for utility
    listPrice = targetPrice;
  }

  const netPrice = Math.floor(listPrice * (1 - sellerFeeRate));
  const buyerTotal = Math.floor(listPrice * (1 + buyerFeeRate));
  const competitiveness = marketPrice ? buyerTotal / marketPrice : null;

  return {
    sellerFeeRate,
    buyerFeeRate,
    listPrice,
    netPrice,
    buyerTotal,
    competitiveness,
  };
}
