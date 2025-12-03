import React, { createContext, useState, useMemo, useCallback } from 'react';
import { message } from 'antd';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {}, notify: () => {} });

export const ThemeProvider = ({ children, initialTheme = 'light' }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [api, contextHolder] = message.useMessage();

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const notify = useCallback((content) => {
    api.success(content);
  }, [api]);

  const value = useMemo(() => ({ theme, toggleTheme, notify }), [theme, toggleTheme, notify]);

  return (
    <ThemeContext.Provider value={value}>
      {contextHolder}
      {children}
    </ThemeContext.Provider>
  );
};
