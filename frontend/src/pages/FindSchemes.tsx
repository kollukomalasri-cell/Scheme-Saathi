import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMatches, getSchemes } from '../api';
import { Notice } from '../components/Notice';
import { SchemeCard } from '../components/SchemeCard';
import { useLanguage } from '../i18n';
import type { Match, Profile, Scheme } from '../types';

const categories = ['Agriculture', 'Education', 'Health', 'Housing', 'Business', 'Women'];
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

export function FindSchemes() {
  const { language, t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? 'All');
  const [stateFilter, setStateFilter] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const search = new URLSearchParams();
    if (query.trim()) search.set('q', query.trim());
    if (category !== 'All') search.set('category', category);
    if (stateFilter) search.set('state', stateFilter);
    getSchemes(search.size ? `?${search.toString()}` : '')
      .then(setSchemes).catch(() => setError(true)).finally(() => setLoading(false));
  }, [query, category, stateFilter]);

  useEffect(() => { setQuery(params.get('q') ?? ''); setCategory(params.get('category') ?? 'All'); }, [params]);

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const profile: Profile = {
      age: Number(data.get('age')),
      state: String(data.get('state')),
      gender: String(data.get('gender') || 'Prefer not to say'),
      occupation: String(data.get('occupation') || 'Any'),
      annual_income: data.get('income') ? Number(data.get('income')) : null,
      category: category === 'All' ? null : category,
    };
    setMatching(true);
    try { setMatches(await getMatches(profile)); }
    catch { setError(true); }
    finally { setMatching(false); }
  }

  function updateQuery(value: string) { setQuery(value); setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set('q', value); else next.delete('q'); return next; }); }
  const shownSchemes = matches ? matches.map(item => item.scheme) : schemes;
  return <main className="page-shell"><section className="page-heading"><div className="container"><span className="eyebrow"><SlidersHorizontal size={15} /> {t('find')}</span><h1>{t('browseTitle')}</h1><p>{t('browseDescription')}</p></div></section>
    <div className="container find-layout"><aside className="filter-panel"><div className="panel-title"><SlidersHorizontal size={18} /><h2>{t('find')}</h2></div><form onSubmit={submitProfile}>
      <label>{t('age')}<input name="age" type="number" min="0" max="120" required placeholder="e.g. 28" /></label>
      <label>{t('state')}<select name="state" required defaultValue=""><option value="" disabled>{t('choose')}</option>{states.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>{t('gender')}<select name="gender" defaultValue="Prefer not to say"><option value="Prefer not to say">{t('any')}</option><option value="female">{language === 'te' ? 'మహిళ' : 'Woman'}</option><option value="male">{language === 'te' ? 'పురుషుడు' : 'Man'}</option><option value="other">{t('other')}</option></select></label>
      <label>{t('occupation')}<select name="occupation" defaultValue="Any"><option value="Any">{t('any')}</option><option value="student">{t('student')}</option><option value="farmer">{t('farmer')}</option><option value="worker">{t('worker')}</option><option value="entrepreneur">{t('entrepreneur')}</option><option value="other">{t('other')}</option></select></label>
      <label>{t('income')}<input name="income" type="number" min="0" step="1000" placeholder="e.g. 250000" /></label>
      <p className="field-note">{t('profileNote')}</p><button className="primary-button full-button" disabled={matching}>{matching ? t('matching') : t('getMatches')}</button>
    </form></aside>
    <section className="results-area"><div className="results-toolbar"><div><h2>{matches ? t('results') : t('directory')}</h2><p>{matches ? t('resultsIntro') : t('directoryText')}</p></div><span className="result-count">{shownSchemes.length} {t('resultCount')}</span></div>
      <div className="catalog-filters"><label className="catalog-search"><Search size={17} /><input value={query} onChange={e => updateQuery(e.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} /></label><select aria-label={t('allCategories')} value={category} onChange={e => { setCategory(e.target.value); setMatches(null); }}><option value="All">{t('allCategories')}</option>{categories.map(item => <option key={item} value={item}>{item === 'Agriculture' ? t('agriculture') : item === 'Health' ? t('health') : item === 'Housing' ? t('housing') : item === 'Business' ? t('business') : item === 'Women' ? t('women') : t('education')}</option>)}</select><select aria-label={t('state')} value={stateFilter} onChange={e => setStateFilter(e.target.value)}><option value="">{t('state')}</option>{states.map(item => <option key={item}>{item}</option>)}</select></div>
      {error && <div role="alert" className="error-box">{t('apiError')} <button onClick={() => setError(false)}>{t('retry')}</button></div>}
      {loading ? <div className="loading-state" role="status">{t('loading')}</div> : shownSchemes.length ? <div className="scheme-grid">{shownSchemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} match={matches?.find(item => item.scheme.id === scheme.id)} />)}</div> : <div className="empty-state"><Search size={26} /><h3>{t('noResults')}</h3><a href="/find">{t('browse')} <ArrowUpRight size={15} /></a></div>}
      {matches && <button className="reset-button" onClick={() => setMatches(null)}>{t('browse')}</button>}
      <div className="results-notice">{t('officialNotice')}</div>
    </section></div><div className="container bottom-notice"><Notice /></div></main>;
}
