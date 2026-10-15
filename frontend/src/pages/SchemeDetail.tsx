import { ArrowLeft, ArrowUpRight, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getScheme } from '../api';
import { useLanguage } from '../i18n';
import type { Scheme } from '../types';

export function SchemeDetail() {
  const { slug = '' } = useParams();
  const { language, t } = useLanguage();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { getScheme(slug).then(setScheme).catch(() => setError(true)); }, [slug]);
  if (error) return <main className="container page-content"><div className="error-box" role="alert">{t('apiError')} <Link to="/find">{t('back')}</Link></div></main>;
  if (!scheme) return <main className="container page-content"><div className="loading-state" role="status">{t('loading')}</div></main>;
  const list = (en: string[], te: string[]) => language === 'te' ? te : en;
  const name = language === 'te' ? scheme.name_te : scheme.name;
  return <main className="container detail-page"><Link className="back-link" to="/find"><ArrowLeft size={16} />{t('back')}</Link>
    <div className="detail-hero"><div><div className="detail-tags"><span className="category-chip">{scheme.category === 'Agriculture' ? t('agriculture') : scheme.category === 'Health' ? t('health') : scheme.category === 'Housing' ? t('housing') : scheme.category === 'Business' ? t('business') : scheme.category === 'Women' ? t('women') : t('education')}</span><span className="central-chip">{scheme.level === 'Central' ? t('central') : t('stateScheme')}</span></div><h1>{name}</h1><p>{language === 'te' ? scheme.summary_te : scheme.summary}</p><div className="verified-line"><ShieldCheck size={16} />{t('lastVerified')}: {scheme.last_verified ?? t('notRecorded')}</div></div><a className="primary-button" href={scheme.official_url} target="_blank" rel="noreferrer">{t('official')} <ExternalLink size={17} /></a></div>
    <div className="detail-columns"><div className="detail-main"><section className="detail-section"><span className="eyebrow">{t('category')}</span><h2>{name}</h2><p>{language === 'te' ? scheme.description_te : scheme.description}</p></section>
      <section className="detail-section"><h2>{t('benefits')}</h2><ul className="check-list">{list(scheme.benefits, scheme.benefits_te).map(item => <li key={item}><FileCheck2 size={17} />{item}</li>)}</ul></section>
      <section className="detail-section"><h2>{t('eligibility')}</h2><ul>{list(scheme.eligibility, scheme.eligibility_te).map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="detail-section"><h2>{t('applySteps')}</h2><ol className="ordered-list">{list(scheme.application_steps, scheme.application_steps_te).map(item => <li key={item}>{item}</li>)}</ol></section></div>
      <aside className="detail-sidebar"><div className="side-card"><h2>{t('documents')}</h2><ul>{list(scheme.documents, scheme.documents_te).map(item => <li key={item}>{item}</li>)}</ul></div><div className="source-card"><span className="source-icon"><ShieldCheck /></span><h3>{t('official')}</h3><p>{t('officialNotice')}</p><a href={scheme.official_url} target="_blank" rel="noreferrer">{new URL(scheme.official_url).hostname} <ArrowUpRight size={15} /></a></div></aside></div>
    <div className="detail-disclaimer">{t('disclaimerText')}</div>
  </main>;
}
