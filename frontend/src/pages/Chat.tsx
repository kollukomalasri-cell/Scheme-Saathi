import { Bot, Send, ShieldAlert, Sparkles, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { askChat } from '../api';
import { useLanguage } from '../i18n';

type Message = { role: 'assistant' | 'user'; text: string };

export function Chat() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: t('chatWelcome') }]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setMessages([{ role: 'assistant', text: t('chatWelcome') }]); setSuggestions([]); }, [language, t]);

  async function send(value = input) {
    const text = value.trim();
    if (!text || busy) return;
    setMessages(items => [...items, { role: 'user', text }]); setInput(''); setBusy(true); setError(false); setSuggestions([]);
    try {
      const result = await askChat(text, language);
      setMessages(items => [...items, { role: 'assistant', text: result.reply }]); setSuggestions(result.suggestions);
    } catch { setError(true); setMessages(items => [...items, { role: 'assistant', text: t('chatError') }]); }
    finally { setBusy(false); }
  }

  return <main className="page-shell chat-page"><div className="container chat-layout"><section className="chat-intro"><span className="eyebrow"><Sparkles size={15} /> {t('chatTitle')}</span><h1>{t('chatIntro')}</h1><p>{t('disclaimerText')}</p><div className="chat-trust"><ShieldAlert size={17} /><span>{t('profileNote')}</span></div></section>
    <section className="chat-window" aria-label={t('chatTitle')}><div className="chat-window-head"><span className="bot-avatar"><Bot size={20} /></span><div><strong>{t('chatTitle')}</strong><small><i /> {language === 'te' ? 'సాధారణ సమాచార సహాయకుడు' : 'Informational guide'}</small></div><button className="new-chat" onClick={() => { setMessages([{ role: 'assistant', text: t('chatWelcome') }]); setSuggestions([]); setError(false); }}>{t('newChat')}</button></div>
      <div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${index}-${message.text}`}><span className="message-avatar">{message.role === 'assistant' ? <Bot size={17} /> : <UserRound size={17} />}</span><div className="message-bubble">{message.text}</div></div>)}{busy && <div className="typing" role="status">{language === 'te' ? 'ఆలోచిస్తున్నాను…' : 'Saathi is thinking…'}</div>}<div ref={bottomRef} /></div>
      {error && <div role="alert" className="chat-error">{t('chatError')}</div>}
      {suggestions.length > 0 && <div className="suggestion-row">{suggestions.map(item => <button key={item} onClick={() => send(item)}>{item}</button>)}</div>}
      <form className="chat-compose" onSubmit={e => { e.preventDefault(); void send(); }}><input value={input} onChange={e => setInput(e.target.value)} placeholder={t('chatPlaceholder')} aria-label={t('chatPlaceholder')} maxLength={1000} /><button type="submit" disabled={!input.trim() || busy} aria-label={t('send')}><Send size={18} /><span>{t('send')}</span></button></form>
      <p className="chat-private"><ShieldAlert size={14} />{t('privacyText')}</p>
    </section></div></main>;
}
