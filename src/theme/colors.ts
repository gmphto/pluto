export const colors = {
  brand: {
    primary: '#E60023',
    primaryHover: '#AD081B',
    primaryLight: 'rgba(230, 0, 35, 0.1)',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9F9F9',
      100: '#E0E0E0',
      200: '#CCCCCC',
      300: '#999999',
      400: '#666666',
      500: '#555555',
      600: '#333333',
    },
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.85)',
    medium: 'rgba(0, 0, 0, 0.6)',
    light: 'rgba(255, 255, 255, 0.3)',
  },
  shadow: {
    primary: 'rgba(230, 0, 35, 0.4)',
    primaryHover: 'rgba(230, 0, 35, 0.5)',
    default: 'rgba(0, 0, 0, 0.1)',
  },
  status: {
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
  },
} as const;

export type Colors = typeof colors;
