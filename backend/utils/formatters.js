/**
 * Formats a number into a standard currency string.
 * @param {Number} amount - The amount to format
 * @param {String} currencyCode - e.g., 'USD', 'INR', 'EUR'
 * @returns {String} - Formatted string (e.g., "$1,234.56")
 */
const formatCurrency = (amount, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Formats a MongoDB date object into a readable string format.
 * @param {Date} date - The date object from MongoDB
 * @returns {String} - Formatted string (e.g., "YYYY-MM-DD")
 */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  // padStart ensures single digit months/days have a leading zero
  const month = String(d.getMonth() + 1).padStart(2, '0'); 
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

module.exports = {
  formatCurrency,
  formatDate
};