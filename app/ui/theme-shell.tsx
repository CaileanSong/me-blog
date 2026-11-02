'use client';

import { useEffect, useState } from 'react';
import CodeSliceBackground from './code-slice-background';
import NavLink from './nav-link';

const THEME_STORAGE_KEY = 'ne-sd-theme';

export default function ThemeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark') {
      setDarkMode(true);
      return;
    }

    if (storedTheme === 'light') {
      setDarkMode(false);
      return;
    }

    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="relative flex h-screen flex-col md:flex-col md:overflow-hidden bg-light-background dark:bg-dark-background transition-all duration-500">
        <CodeSliceBackground darkMode={darkMode} />
        <div className="relative z-10 w-full flex flex-row-reverse mt-6 pr-10">
          <NavLink
            darkMode={darkMode}
            onAction={() => setDarkMode((currentValue) => !currentValue)}
          />
        </div>
        <div className="relative z-10 flex-grow p-6 md:overflow-y-auto md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
