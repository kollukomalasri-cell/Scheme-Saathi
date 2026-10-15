import { BookOpenCheck, Eye, LockKeyhole, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n';

export function About() {
  const { t } = useLanguage();
  const cards = [
    { icon: LockKeyhole, title: t('privacyHeading'), text: t('privacyText') },
    { icon: BookOpenCheck, title: t('sourcesHeading'), text: t('sourcesText') },
    { icon: Eye, title: t('limitationsHeading'), text: t('limitationsText') },
  ];
  return <main className="page-shell"><section className="page-heading"><div className="container"><span className="eyebrow"><ShieldAlert size={15} />{t('safety')}</span><h1>{t('safetyHeading')}</h1><p>{t('noGovernment')}</p></div></section><div className="container safety-grid">{cards.map(({ icon: Icon, title, text }) => <article className="safety-card" key={title}><span className="topic-icon"><Icon size={21} /></span><h2>{title}</h2><p>{text}</p></article>)}</div><div className="container safety-footnote"><ShieldAlert size={19} /><p>{t('disclaimerText')}</p></div></main>;
}
