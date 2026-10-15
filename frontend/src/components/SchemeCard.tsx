import { ArrowUpRight, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import type { Match, Scheme } from '../types';

export function SchemeCard({ scheme, match }: { scheme: Scheme; match?: Match }) {
  const { language, t } = useLanguage();
  return <article className="scheme-card">
    <div className="card-topline"><span className="category-chip"><Sprout size={14} />{scheme.category === 'Agriculture' ? t('agriculture') : scheme.category === 'Health' ? t('health') : scheme.category === 'Housing' ? t('housing') : scheme.category === 'Business' ? t('business') : scheme.category === 'Women' ? t('women') : t('education')}</span><span className="central-chip">{scheme.level === 'Central' ? t('central') : t('stateScheme')}</span></div>
    <h3>{language === 'te' ? scheme.name_te : scheme.name}</h3>
    <p>{language === 'te' ? scheme.summary_te : scheme.summary}</p>
    {match && <div className="match-note"><span>{t('score')}</span><strong>{match.score}%</strong><small>{(language === 'te' ? match.reasons_te : match.reasons)[0]}</small></div>}
    <Link className="text-link" to={`/schemes/${scheme.slug}`}>{t('details')} <ArrowUpRight size={16} /></Link>
  </article>;
}
