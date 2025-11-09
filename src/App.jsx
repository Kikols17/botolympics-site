import React, { useState, useEffect } from 'react';
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

  // new: registrations config fetched at runtime (fixed endpoint + periodic refresh)
  const [registrations, setRegistrations] = useState({});
  useEffect(() => {
    let mounted = true;
    const fetchCfg = () => {
      fetch('/_config/registrations.json').then(r => {
        if (!r.ok) return;
        return r.json();
      }).then(data => {
        if (mounted && data && typeof data === 'object') setRegistrations(data);
      }).catch(() => {});
    };
    fetchCfg();
    const intervalId = setInterval(fetchCfg, 5000); // poll every 5s so edits apply while running
    return () => { mounted = false; clearInterval(intervalId); };
  }, []);

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
            {challenges.items.map((c, i) => {
              // determine state from runtime config first, then from any fallback in the item
              const state = (registrations && registrations[c.id]) ? String(registrations[c.id]).toLowerCase() : '';
              const isBefore = state.includes('before');
              const isAfter = state.includes('after');
              const isClosed = isBefore || isAfter;
              const regLabel = isBefore
                ? challenges.registerBeforeLabel
                : isAfter
                ? challenges.registerAfterLabel
                : challenges.registerOpenLabel;

              return (
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
                          href={isClosed ? undefined : c.formUrl}
                          target={isClosed ? undefined : "_blank"}
                          rel={isClosed ? undefined : "noreferrer"}
                          aria-disabled={isClosed}
                          onClick={(e) => { if (isClosed) e.preventDefault(); }}
                        >
                          {regLabel}
                        </a>

                        <a className="btn-pill btn-pill-outline" href={c.rulesUrl} target="_blank" rel="noreferrer">
                          {challenges.regulationLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
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
              <h3 className="tier-name" style={{ color: tier.color }}>{tier.name}</h3>
              <div className="tier-logos">
                {tier.sponsors.map((s, si) => (
                  <a key={si} href={s.url} target="_blank" rel="noreferrer" className="sponsor-link">
                    <img src={s.logo} alt={s.name} />
                  </a>
                ))}
              </div>
            </div>
          ))}
          <p className="sponsor-contact" dangerouslySetInnerHTML={{
            __html: sponsors.contactNote.replace(
              /* email regex to convert all email in the text to mailto link */
              /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
              (email) => `<a href="mailto:${email}">${email}</a>`
            )
          }} />
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
              {Array.isArray(footer.socials) && footer.socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                  aria-label={s.name}
                >
                  <img src={s.icon} alt={s.name} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-center">
            <h3>{footer.contactsLabel}</h3>
            {Array.isArray(footer.contacts) && footer.contacts.map((c, ci) => (
              <div key={ci} className="contact-item">
                <div className="contact-label">{c.label}</div>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </div>
            ))}
          </div>

          <div className="footer-right">
            <h3>{footer.organizationLabel}</h3>
            <div className="org-logos">
              {Array.isArray(footer.organizations) && footer.organizations.map((o, oi) => (
                <a key={oi} href={o.url} target="_blank" rel="noreferrer" title={o.name}>
                  <img src={o.logo} alt={o.name} className="org-logo" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
