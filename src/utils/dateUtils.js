/**
 * Date utility functions for SmartMeal calendar and plan screens.
 */

/**
 * Format a date string (YYYY-MM-DD) into a human readable string.
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date like "Tuesday, Sep 1, 2026"
 */
export function formatDateReadable(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format year and month for calendar header.
 * @param {number} year 
 * @param {number} month - 0 indexed (0 = Jan, 11 = Dec)
 * @returns {string} e.g. "September 2026"
 */
export function formatMonthYear(year, month) {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Get date string YYYY-MM-DD from a Date object.
 * @param {Date} dateObj 
 * @returns {string}
 */
export function toDateString(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current date string YYYY-MM-DD.
 * @returns {string}
 */
export function getTodayDateString() {
  return toDateString(new Date());
}

/**
 * Get previous date string given YYYY-MM-DD.
 * @param {string} dateStr 
 * @returns {string}
 */
export function getPreviousDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}

/**
 * Get next date string given YYYY-MM-DD.
 * @param {string} dateStr 
 * @returns {string}
 */
export function getNextDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  return toDateString(d);
}

/**
 * Check if a YYYY-MM-DD string is today.
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function isTodayDate(dateStr) {
  const today = toDateString(new Date());
  return dateStr === today;
}

/**
 * Generate full calendar grid matrix for a given year and month.
 * @param {number} year 
 * @param {number} month - 0 indexed
 * @returns {Array<{ dateStr: string, dayNum: number, isCurrentMonth: boolean, isToday: boolean }>}
 */
export function getCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const totalDaysInMonth = lastDayOfMonth.getDate();
  
  const grid = [];
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dateStr = toDateString(prevDate);
    grid.push({
      dateStr,
      dayNum: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: isTodayDate(dateStr),
    });
  }
  
  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = toDateString(curDate);
    grid.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: isTodayDate(dateStr),
    });
  }
  
  // Next month padding to complete 35 or 42 grid cells
  const remainingCells = (42 - grid.length) % 7 === 0 && grid.length >= 35 ? 0 : (7 - (grid.length % 7));
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateStr = toDateString(nextDate);
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
      isToday: isTodayDate(dateStr),
    });
  }
  
  return grid;
}

export const MEAL_TYPES = [
  'Pre-Breakfast',
  'Breakfast',
  'Mid-morning Snacks',
  'Lunch',
  'Dinner',
];
