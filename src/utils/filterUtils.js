/**
 * Utility functions for managing persistent filters across the application
 */

// Keys for localStorage
const FILTER_STORAGE_KEYS = {
  ADMIN_FOREX: 'admin_forex_filters',
  ADMIN_GIC: 'admin_gic_filters',
  AGENT_FOREX: 'agent_forex_filters',
  AGENT_GIC: 'agent_gic_filters',
  OSHC: 'agent_oshc_filters',
  ADMIN_OSHC: 'admin_oshc_filters',
};

/**
 * Save filters to localStorage
 * @param {string} key - The storage key for the specific table
 * @param {object} filters - The filters object to save
 */
export const saveFiltersToStorage = (key, filters) => {
  try {
    localStorage.setItem(key, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
};

/**
 * Load filters from localStorage
 * @param {string} key - The storage key for the specific table
 * @param {object} defaultFilters - Default filters if none exist in storage
 * @returns {object} The loaded filters or default filters
 */
export const loadFiltersFromStorage = (key, defaultFilters) => {
  try {
    const savedFilters = localStorage.getItem(key);
    if (savedFilters) {
      return { ...defaultFilters, ...JSON.parse(savedFilters) };
    }
  } catch (error) {
    console.error('Error loading filters from localStorage:', error);
  }
  return defaultFilters;
};

/**
 * Clear specific filters from localStorage
 * @param {string} key - The storage key for the specific table
 */
export const clearFiltersFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing filters from localStorage:', error);
  }
};

/**
 * Default filter configurations for each table
 */
export const DEFAULT_FILTERS = {
  ADMIN_FOREX: {
    dateSort: '',
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
    commissionStatus: [],
    country: [],
    docsStatus: [],
    ttCopyStatus: [],
  },
  ADMIN_GIC: {
    dateSort: 'desc', // Default to latest first
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
    commissionStatus: [],
    accountType: [],
    bankName: [],
    accountStatus: [],
  },
  AGENT_FOREX: {
    dateSort: '',
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
    countries: [],
    currencies: [],
    docsStatuses: [],
    ttCopyStatuses: [],
    commissionStatuses: [],
  },
  AGENT_GIC: {
    dateSort: 'desc', // Default to latest first
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
    commissionStatus: [],
    accountType: [],
    bankName: [],
    accountStatus: [],
  },
  OSHC: {
    studentName: '',
    email: '',
    mobile: '',
    partner: '',
    status: '',
    passportNumber: '',
    studentId: '',
    dateRange: { start: '', end: '' },
    showFilters: false
  },
  ADMIN_OSHC: {
    Agent: '',
    studentName: '',
    email: '',
    mobile: '',
    partner: '',
    status: '',
    passportNumber: '',
    studentId: '',
    dateRange: { start: '', end: '' },
    showFilters: false
  },
};

export { FILTER_STORAGE_KEYS };