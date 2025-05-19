/**
 * Utility functions for formatting and displaying data
 */

/**
 * Formats an ISO date string to Norwegian date format (DD.MM.YYYY)
 * @param {string} isoDate - ISO formatted date string
 * @returns {string|null} Formatted date string or null if input is invalid
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

/**
 * Calculates the number of days between two date strings
 * @param {string} startDate - ISO formatted start date
 * @param {string} endDate - ISO formatted end date
 * @returns {number|null} Number of days between dates or null if input is invalid
 */
export const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formats a borrower status for display
 * @param {string} status - Status code
 * @returns {string} Formatted status text in Norwegian
 */
export const formatStatus = (status) => {
  const statusMap = {
    'VENTER': 'Venter på henting',
    'HENTET': 'Hentet',
    'UTLØPT': 'Utløpt',
    'RETURNERT': 'Returnert',
    'KANSELLERT': 'Kansellert'
  };
  
  return statusMap[status] || status;
};

/**
 * Gets CSS class name for a status
 * @param {string} status - Status code
 * @returns {string} CSS class name
 */
export const getStatusClassName = (status) => {
  return `status-${status.toLowerCase()}`;
};

/**
 * Formats a phone number to Norwegian format
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it's a Norwegian mobile number (8 digits starting with 4 or 9)
  if (digits.length === 8 && (digits.startsWith('4') || digits.startsWith('9'))) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  }
  
  // Default formatting for other numbers
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

/**
 * Generates random genres for a borrower
 * @returns {string[]} Array of randomly selected genres
 */
export const generateRandomGenres = () => {
  const allGenres = [
    'Krim', 'Roman', 'Biografi', 'Fantasy', 'Science Fiction', 
    'Historisk', 'Drama', 'Thriller', 'Ungdom', 'Barn', 
    'Poesi', 'Reise', 'Kokebok', 'Selvhjelp', 'Faglitteratur'
  ];
  
  // Velg tilfeldig antall sjangere (2 eller 3)
  const numGenres = Math.random() < 0.5 ? 2 : 3;
  
  // Bland arrayen og velg de første numGenres elementene
  const shuffled = [...allGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numGenres);
};