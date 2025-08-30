/**
 * Date utility functions for consistent dd-mm-yyyy formatting
 */

/**
 * Converts a date string from YYYY-MM-DD format to DD-MM-YYYY format
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Date in DD-MM-YYYY format
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  
  return dateString;
};

/**
 * Converts a date string from DD-MM-YYYY format to YYYY-MM-DD format
 * @param dateString - Date in DD-MM-YYYY format
 * @returns Date in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  
  return dateString;
};

/**
 * Parses a date string in DD-MM-YYYY format and returns day, month, year
 * @param dateString - Date in DD-MM-YYYY format
 * @returns Object with day, month, year or null if invalid
 */
export const parseDate = (dateString: string): { day: number; month: number; year: number } | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return { day, month, year };
    }
  }
  
  return null;
};

/**
 * Gets today's date in DD-MM-YYYY format
 * @returns Today's date in DD-MM-YYYY format
 */
export const getTodayDate = (): string => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Validates if a date string is in DD-MM-YYYY format
 * @param dateString - Date string to validate
 * @returns True if valid DD-MM-YYYY format
 */
export const isValidDate = (dateString: string): boolean => {
  const parsed = parseDate(dateString);
  if (!parsed) return false;
  
  const { day, month, year } = parsed;
  
  // Basic validation
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Check for valid days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
  if (month === 2 && isLeapYear) {
    return day <= 29;
  }
  
  return day <= daysInMonth[month - 1];
}; 


export function formatDateToMonthYear(dateStr: string): string {
  // Expecting input as "dd-mm-yyyy"
  const [ _day, month, year] = dateStr.split("-").map(Number);

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Adjust month index since Date months are 0-based
  const monthName = monthNames[month - 1];

  return `${monthName} - ${year}`;
}

export const zeroToDash = (value:any) =>{
  
  return parseFloat(value) ? value : '-';
}