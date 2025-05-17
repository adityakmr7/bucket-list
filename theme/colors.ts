export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
    light: '#60A5FA',
  },
  
  // Background colors
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
  },
  
  // Card colors
  card: {
    light: '#FFFFFF',
    dark: '#1E293B',
  },
  
  // Text colors
  text: {
    primary: {
      light: '#1E293B',
      dark: '#F8FAFC',
    },
    secondary: {
      light: '#64748B',
      dark: '#94A3B8',
    },
  },
  
  // Border colors
  border: {
    light: '#E2E8F0',
    dark: '#334155',
  },
  
  // Status colors
  status: {
    success: {
      light: '#10B981',
      dark: '#059669',
    },
    error: {
      light: '#F43F5E',
      dark: '#DC2626',
    },
    warning: {
      light: '#F59E0B',
      dark: '#D97706',
    },
  },
  
  // Button colors
  button: {
    primary: {
      light: '#EFF6FF',
      dark: '#1E293B',
    },
    danger: {
      light: '#FEE2E2',
      dark: '#7F1D1D',
    },
  },
  
  // Icon colors
  icon: {
    primary: {
      light: '#64748B',
      dark: '#94A3B8',
    },
    accent: {
      light: '#3B82F6',
      dark: '#60A5FA',
    },
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export type ColorPath = 
  | 'primary'
  | 'background'
  | 'card'
  | 'text.primary'
  | 'text.secondary'
  | 'border'
  | 'status.success'
  | 'status.error'
  | 'status.warning'
  | 'button.primary'
  | 'button.danger'
  | 'icon.primary'
  | 'icon.accent'
  | 'shadow';

export const getThemeColor = (color: ColorPath, scheme: ColorScheme) => {
  const parts = color.split('.');
  let current: any = colors;
  
  for (const part of parts) {
    current = current[part];
  }
  
  if (typeof current === 'string') return current;
  
  if ('light' in current && 'dark' in current) {
    return current[scheme];
  }
  
  return current.DEFAULT;
}; 