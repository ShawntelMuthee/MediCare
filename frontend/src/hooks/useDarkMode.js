import { useEffect, useState } from 'react';

const STORAGE_KEY = 'medicare-theme';
const THEME_OPTIONS = ['light', 'dark', 'system'];

function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return THEME_OPTIONS.includes(savedTheme) ? savedTheme : 'system';
}

export function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [systemDark, setSystemDark] = useState(() => (
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return undefined;

    const handlePreferenceChange = (event) => setSystemDark(event.matches);
    mediaQuery.addEventListener?.('change', handlePreferenceChange);
    return () => mediaQuery.removeEventListener?.('change', handlePreferenceChange);
  }, []);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemDark);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDarkMode ? 'dark' : 'light';
    root.dataset.themePreference = theme;
    root.classList.toggle('dark-mode', isDarkMode);
    root.style.colorScheme = isDarkMode ? 'dark' : 'light';
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isDarkMode, theme]);

  const toggleDarkMode = () => {
    const currentIndex = THEME_OPTIONS.indexOf(theme);
    setTheme(THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length]);
  };

  return { isDarkMode, theme, setTheme, toggleDarkMode };
}
