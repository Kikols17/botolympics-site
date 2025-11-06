import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FaqList from './components/FaqList';

export default function App() {
  const { t, i18n } = useTranslation();
  const setLang = (lng) => i18n.changeLanguage(lng);

  const header = t('header', { returnObjects: true });
  const landing = t('landing', { returnObjects: true });
  const about = t('about', { returnObjects: true });
  const challenges = t('challenges', { returnObjects: true });
  const schedule = t('schedule', { returnObjects: true });
  const faq = t('faq', { returnObjects: true });
  const previous = t('previousEdition', { returnObjects: true });
  const sponsors = t('sponsors', { returnObjects: true });
  const team = t('team', { returnObjects: true });
  const location = t('location', { returnObjects: true });
  const footer = t('footer', { returnObjects: true });

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="bo-site">
      <header className="bo-header">
        <div className="wrap header-row">
          <div className="brand-left">
            <img src={header.logo} alt="logo" className="site-logo" />
          </div>
          <div className="brand-right">
            {/* language buttons show active state depending on current language */}
            <button
              className={`lang-btn ${i18n.language && i18n.language.startsWith('pt') ? 'active' : ''}`}
              data-lang="pt"
              onClick={() => setLang('pt')}
              aria-pressed={i18n.language && i18n.language.startsWith('pt')}
            >
              PT
            </button>
            <button
              className={`lang-btn ${i18n.language && i18n.language.startsWith('en') ? 'active' : ''}`}
              data-lang="en"
              onClick={() => setLang('en')}
              aria-pressed={i18n.language && i18n.language.startsWith('en')}
            >
              EN
            </button>
            <a className="btn-cta" href="#challenges">{header.registerText}</a>
          </div>
        </div>
      </header>

      <section className="landing" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${landing.background}')`
      }}>
        <div className="wrap landing-inner">
          <img className="landing-logo" src={landing.foregroundLogo} alt="edition logo" />
          <div className="landing-date">{landing.date}</div>
        </div>
      </section>

      <main>
        {/*-------------------------- ABOUT SECTION -------------------------*/}
        <section className="wrap section" id="about">
          <h2>{about.title}</h2>
          <p>{about.text1}</p>
          <p>{about.text2}</p>
          <p>{about.text3}</p>
        </section>

        {/*----------------------- CHALLENGES SECTION -----------------------*/}
        <section className="wrap section" id="challenges">
          <h2>{challenges.title}</h2>
          <p>{challenges.text}</p>
          <div className="challenges-grid">
            {challenges.items.map((c, i) => (
              <article key={i} className="challenge-card" style={{ backgroundImage: `url('${c.bg}')` }}>
                <div className="challenge-overlay">
                  {/* boxed content */}
                  <div className="challenge-box">
                    <div className="challenge-header">
                      <h3 className="challenge-name">{c.name}</h3>
                      <img src={c.logo} alt={`${c.name} logo`} className="challenge-logo" />
                    </div>

                    <div className="divider" />

                    <div className="challenge-level">{c.subtitle}</div>

                    <p className="challenge-desc">{c.description}</p>

                    <div className="challenge-actions">
                      <a
                        className="btn-pill btn-pill-primary"
                        href={c.formUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-disabled={c.cta && c.cta.toLowerCase().includes('closed')}
                      >
                        {/* use c.cta for dynamic label */}
                        {c.cta || 'Register'}
                      </a>

                      <a className="btn-pill btn-pill-outline" href={c.rulesUrl} target="_blank" rel="noreferrer">
                        Regulations
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap section" id="schedule">
          <h2>{schedule.title}</h2>
          <p>{schedule.description}</p>
          <div className="schedule-image"><img src={schedule.image} alt="Schedule will be available soon!" /></div>
        </section>

        <section className="wrap section" id="faq">
          <h2>{faq.title}</h2>
          <FaqList items={faq.items} />
        </section>

        <section className="wrap section" id="previous">
          <h2>{previous.title}</h2>
          <div className="gallery-grid">
            {previous.images.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noreferrer" className="gallery-item">
                <img src={src} alt={`previous-${i}`} />
              </a>
            ))}
          </div>
        </section>

        <section className="wrap section" id="sponsors">
          <h2>{sponsors.title}</h2>
          {sponsors.tiers.map((tier, ti) => (
            <div key={ti} className="sponsor-tier">
              <h3 className="tier-name">{tier.name}</h3>
              <div className="tier-logos">
                {tier.sponsors.map((s, si) => (
                  <a key={si} href={s.url} target="_blank" rel="noreferrer" className="sponsor-link">
                    <img src={s.logo} alt={s.name} />
                  </a>
                ))}
              </div>
            </div>
          ))}
          <p className="sponsor-contact">{sponsors.contactNote}</p>
        </section>

        <section className="wrap section" id="team">
          <h2>Our team</h2>
          <div className="team-grid">
            {team.map((m, i) => (
              <div key={i} className="team-member">
                <div className="avatar" style={{ backgroundImage: `url('${m.img}')` }} />
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" id="location">
          <h2>{location.title}</h2>
          <p>{location.description}</p>
          <div className="map-embed">
            <iframe title="event-location" src={location.mapEmbedUrl} style={{ width: '100%', height: '420px', border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
        </section>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="wrap footer-inner">
          <div className="footer-left">
            <h3>{footer.socialsLabel}</h3>
            <div className="social-row" aria-label="Social media">
              <a href="https://www.facebook.com/botolympics" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png" alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/botolympics" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" />
              </a>
              <a href="https://www.tiktok.com/@botolympics" target="_blank" rel="noreferrer" className="social-btn" aria-label="TikTok">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" alt="TikTok" />
              </a>
              <a href="https://www.linkedin.com/company/botolympics" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="LinkedIn" />
              </a>
              <a href="https://www.youtube.com/@botolympics" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
              </a>
            </div>
          </div>

          <div className="footer-center">
            <h3>{footer.contactsLabel}</h3>
            <div className="contact-item">
              <div className="contact-label">General</div>
              <a href="mailto:geral@botolympics.pt" className="contact-link">geral@botolympics.pt</a>
            </div>
            <div className="contact-item">
              <div className="contact-label">Sponsors</div>
              <a href="mailto:patrocinios@botolympics.pt" className="contact-link">patrocinios@botolympics.pt</a>
            </div>
          </div>

          <div className="footer-right">
            <h3>{footer.organizationLabel}</h3>
            <div className="org-logos">
              <img src="/assets/2025/sponsors/institutional-1.png" alt="Clube de Robótica" className="org-logo" />
              <img src="/assets/2025/sponsors/institutional-2.png" alt="NEEEC" className="org-logo" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
