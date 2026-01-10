import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./Context/themeContext";

/* PWA launch redirect: when the app is opened from the home screen, send users
   to the login page. Respects HashRouter (#/login) and only redirects if the
   user is not authenticated (no 'user' in localStorage). Detects PWA via:
   - display-mode: standalone
   - window.navigator.standalone (iOS)
   - ?pwa=1 in search or hash (set in manifest start_url)
*/
(function () {
  try {
    const isDisplayStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = window.navigator.standalone === true;
    const hasPwaParam = location.search.includes('pwa=1') || location.hash.includes('pwa=1');
    const isPwa = isDisplayStandalone || isNavigatorStandalone || hasPwaParam;

    const isOnLogin = location.hash.startsWith('#/login') || location.hash.startsWith('#/login') || location.pathname === '/login';
    const isAuthenticated = !!localStorage.getItem('user');

    if (isPwa && !isOnLogin && !isAuthenticated) {
      const target = `${location.origin}${location.pathname}#/login`;
      location.replace(target);
    }
  } catch (e) {
    // Failsafe: if something goes wrong, don't block the app
    console.warn('PWA redirect check failed:', e);
  }
})();

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
