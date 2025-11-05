import React from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();

  const setLang = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="container">
      <header className="header">
        <h1>{t('siteTitle')}</h1>
        <div className="lang-switch">
          <button onClick={() => setLang('en')}>EN</button>
          <button onClick={() => setLang('pt')}>PT</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <h2>{t('welcomeTitle')}</h2>
          <p>{t('welcomeText')}</p>
        </section>

        <section className="content">
          <h3>{t('features.title')}</h3>
          <ul>
            <li>{t('features.easyEdit')}</li>
            <li>{t('features.dockerReady')}</li>
            <li>{t('features.simple')}</li>
          </ul>
        </section>
      </main>

      <footer>
        <small>{t('footer')}</small>
      </footer>
    </div>
  );
}
