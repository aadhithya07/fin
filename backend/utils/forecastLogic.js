/**
 * Calculates a simple projection for the next month based on historical monthly totals.
 * @param {Array} historicalData - Array of monthly totals (e.g., [1200, 1350, 1100, 1400])
 * @returns {Number} - The projected amount for the next month
 */
const projectNextMonth = (historicalData) => {
  if (!historicalData || historicalData.length === 0) {
    return 0;
  }

  // Calculate the sum of all historical data points
  const total = historicalData.reduce((acc, curr) => acc + curr, 0);
  
  // Calculate the simple average
  const average = total / historicalData.length;

  // Add a slight weighted trend based on the difference between the most recent month and the average
  const mostRecent = historicalData[historicalData.length - 1];
  const trendAdjustment = (mostRecent - average) * 0.2; // 20% weight to recent trend

  const projection = average + trendAdjustment;

  // Return rounded to 2 decimal places
  return Math.round(projection * 100) / 100;
};

/**
 * Calculates projected savings based on projected income and projected expenses.
 */
const projectSavings = (projectedIncome, projectedExpenses) => {
  const savings = projectedIncome - projectedExpenses;
  return savings > 0 ? savings : 0;
};

module.exports = {
  projectNextMonth,
  projectSavings
};