import { ArrowRight, GraduationCap, HeartPulse, House, Landmark, Search, Sprout, UsersRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Notice } from '../components/Notice';
import { useLanguage } from '../i18n';

const topics = [
  { key: 'agriculture', icon: Sprout, category: 'Agriculture' },
  { key: 'education', icon: GraduationCap, category: 'Education' },
  { key: 'health', icon: HeartPulse, category: 'Health' },
  { key: 'housing', icon: House, category: 'Housing' },
  { key: 'business', icon: Landmark, category: 'Business' },
  { key: 'women', icon: UsersRound, category: 'Women' },
];

export function Home() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/find${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" />{t('heroEyebrow')}</span>
        <h1>{t('heroTitle')}</h1><p className="hero-text">{t('heroText')}</p>
        <form className="hero-search" onSubmit={submit}><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} /><button type="submit">{t('search')} <ArrowRight size={16} /></button></form>
        <div className="hero-links"><Link to="/find">{t('getStarted')} <ArrowRight size={15} /></Link><span>•</span><Link to="/find">{t('browse')}</Link></div>
      </div>
      <div className="hero-visual" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-sun"/><div className="visual-paper"><div className="paper-kicker">{t('nextStep')}</div><div className="paper-line long"/><div className="paper-line medium"/><div className="paper-match"><span className="paper-check">✓</span><div><b>{t('usefulPossibilities')}</b><small>{t('clearSteps')}</small></div></div><div className="paper-pill">{t('madeForYou')} <span>✦</span></div></div><span className="float-tag tag-one">తెలుగు · English</span><span className="float-tag tag-two">{t('heroEyebrow')}</span></div>
    </div></section>
    <section className="section container topic-section"><div className="section-heading"><div><span className="eyebrow">{t('categories')}</span><h2>{t('featured')}</h2><p>{t('featuredText')}</p></div><Link className="text-link" to="/find">{t('browse')} <ArrowRight size={16} /></Link></div>
      <div className="topic-grid">{topics.map(({ key, icon: Icon, category }) => <Link className="topic-card" key={key} to={`/find?category=${category}`}><span className="topic-icon"><Icon size={21} /></span><span>{t(key)}</span><ArrowRight className="topic-arrow" size={16} /></Link>)}</div>
    </section>
    <section className="steps-section"><div className="container"><div className="center-heading"><span className="eyebrow">{t('stepsEyebrow')}</span><h2>{t('howWorks')}</h2></div><div className="steps-grid"><div className="step-card"><span>01</span><h3>{t('stepOne')}</h3><p>{t('stepOneText')}</p></div><div className="step-card"><span>02</span><h3>{t('stepTwo')}</h3><p>{t('stepTwoText')}</p></div><div className="step-card"><span>03</span><h3>{t('stepThree')}</h3><p>{t('stepThreeText')}</p></div></div></div></section>
    <section className="container section"><Notice /></section>
  </>;
}
