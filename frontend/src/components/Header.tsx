import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n';

const mobileLabels = { en: { open: 'Open navigation', close: 'Close navigation', main: 'Main navigation', language: 'Select language' }, te: { open: 'నావిగేషన్ తెరవండి', close: 'నావిగేషన్ మూసివేయండి', main: 'ప్రధాన నావిగేషన్', language: 'భాషను ఎంచుకోండి' } };

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [['/', t('home')], ['/find', t('find')], ['/chat', t('chat')], ['/about', t('about')]];
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link to="/" className="brand" aria-label={language === 'te' ? 'SchemeSaathi హోమ్' : 'SchemeSaathi home'} onClick={() => setOpen(false)}>
        <span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.2} /></span>
        <span>Scheme<span className="brand-accent">Saathi</span><small>{language === 'te' ? 'సమాచారం, సులభంగా' : 'INFORMATION, MADE CLEAR'}</small></span>
      </Link>
      <button className="menu-toggle" aria-label={open ? mobileLabels[language].close : mobileLabels[language].open} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav-links nav-open' : 'nav-links'} aria-label={mobileLabels[language].main}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        <div className="language-switch" role="group" aria-label={mobileLabels[language].language}>
          <button aria-pressed={language === 'en'} className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')}>EN</button>
          <button aria-pressed={language === 'te'} className={language === 'te' ? 'selected' : ''} onClick={() => setLanguage('te')}>తెలుగు</button>
        </div>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  const { t } = useLanguage();
  return <footer className="site-footer"><div className="container footer-row"><div><div className="footer-brand">SchemeSaathi <ArrowRight size={15} /></div><p>{t('noGovernment')}</p></div><Link to="/about">{t('learnMore')}</Link></div></footer>;
}
