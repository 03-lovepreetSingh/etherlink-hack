declare module 'next-themes' {
  import React from 'react';
  
  interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export function useTheme(): { theme: string; setTheme: (theme: string) => void };
}

