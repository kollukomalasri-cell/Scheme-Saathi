import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n';

export function Notice() {
  const { t } = useLanguage();
  return <aside className="notice" role="note"><span className="notice-icon"><ShieldAlert size={19} /></span><div><strong>{t('disclaimerTitle')}</strong><p>{t('disclaimerText')}</p></div></aside>;
}
