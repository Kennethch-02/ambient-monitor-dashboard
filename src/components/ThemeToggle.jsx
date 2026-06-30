// src/components/ThemeToggle.jsx
import React, { useState } from 'react';
import { toggleTheme, getTheme } from '../lib/theme';

// Shared toggle (dashboard, landing, embed builder). Sun shows in dark mode,
// moon in light mode — matching the mockup. Forces a re-render after toggling
// since the theme lives on <html>, not in React state.
const ThemeToggle = () => {
  const [, bump] = useState(0);
  const theme = getTheme();

  const onClick = () => {
    toggleTheme();
    bump((n) => n + 1);
  };

  return (
    <button
      onClick={onClick}
      title="Toggle theme"
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
        color: 'var(--txt2)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {theme === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
