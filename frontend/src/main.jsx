import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { Provider, useSelector } from 'react-redux';
import App from './App';
import store from './store';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import './styles/global.css';

const ThemedApp = () => {
  const theme = useSelector((state) => state.ui.theme);
  const algorithm = theme === 'dark' ? [antdTheme.darkAlgorithm] : undefined;
  return (
    <ThemeContext.Consumer>
      {({ notify }) => (
        <ConfigProvider theme={{ algorithm }}>
          <AntdApp>
            <App notify={notify} />
          </AntdApp>
        </ConfigProvider>
      )}
    </ThemeContext.Consumer>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider initialTheme={store.getState()?.ui?.theme || 'light'}>
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
