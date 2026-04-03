import React from 'react';

export interface Theme {
  name: 'dark' | 'light';
  colors: Record<string, string>;
}

export const defaultTheme: Theme = {
  name: 'dark',
  colors: {
    bg: '#000000',
    fg: '#ffffff',
  },
};

export const ThemeContext = React.createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return React.useContext(ThemeContext);
}
