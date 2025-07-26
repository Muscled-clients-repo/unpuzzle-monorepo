'use client';

import React, { useEffect, useState } from 'react';

export default function DynamicHtmlWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeClass, setThemeClass] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme === 'true') {
      setThemeClass('dark');
      document.documentElement.classList.add('dark');
    } else {
      setThemeClass('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <html lang="en" className={`${themeClass}`}>
      {children}
    </html>
  );
}
