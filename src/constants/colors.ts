export const colors = {
  // Brand colors
  primary: {
    50: '#eff6ff',   // Lightest blue
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main blue
    600: '#2563eb',  // Darker blue (for hover)
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest blue
  },

  // Background colors
  background: {
    main: '#f9fafb',     // Main background
    card: '#ffffff',     // Card background
    hover: '#f3f4f6',    // Hover state
  },

  // Text colors
  text: {
    primary: '#1f2937',   // Main text
    secondary: '#4b5563', // Secondary text
    muted: '#6b7280',    // Muted text
    light: '#9ca3af',    // Light text
    white: '#ffffff',    // White text
  },

  // Border colors
  border: {
    light: '#e5e7eb',
    default: '#d1d5db',
    dark: '#9ca3af',
  },

  // Status colors
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }
} as const;

// Commonly used combinations
export const theme = {
  // Component specific
  sidebar: {
    background: colors.background.card,
    text: colors.text.primary,
    textHover: colors.primary[600],
    iconColor: colors.primary[500],
    hoverBg: colors.primary[50],
  },
  
  navbar: {
    background: colors.background.card,
    searchBg: colors.background.main,
    searchText: colors.text.primary,
    searchPlaceholder: colors.text.muted,
    buttonBg: colors.primary[600],
    buttonText: colors.text.white,
  },

  card: {
    background: colors.background.card,
    title: colors.text.primary,
    titleHover: colors.primary[600],
    text: colors.text.secondary,
    border: colors.border.light,
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    shadowHover: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },

  tag: {
    background: colors.primary[600],
    text: colors.text.white,
  }
} as const; 