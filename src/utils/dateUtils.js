   // src/utils/dateUtils.js
   export const formatDateNorwegian = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  export const parseNorwegianDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('.');
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  export const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = parseNorwegianDate(startDate);
    const end = parseNorwegianDate(endDate);
    if (!start || !end) return null;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };