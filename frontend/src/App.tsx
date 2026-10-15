import { Route, Routes } from 'react-router-dom';
import { Header, Footer } from './components/Header';
import { About } from './pages/About';
import { Chat } from './pages/Chat';
import { FindSchemes } from './pages/FindSchemes';
import { Home } from './pages/Home';
import { SchemeDetail } from './pages/SchemeDetail';
import { useLanguage } from './i18n';

function NotFound() {
  const { t } = useLanguage();
  return <main className="container page-content"><div className="empty-state"><h1>404</h1><p>{t('noResults')}</p><a className="text-link" href="/find">{t('browse')}</a></div></main>;
}

export default function App() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><div id="main-content"><Routes><Route path="/" element={<Home />} /><Route path="/find" element={<FindSchemes />} /><Route path="/schemes/:slug" element={<SchemeDetail />} /><Route path="/chat" element={<Chat />} /><Route path="/about" element={<About />} /><Route path="*" element={<NotFound />} /></Routes></div><Footer /></>;
}
