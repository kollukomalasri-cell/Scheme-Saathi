import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { LanguageProvider } from './i18n';

describe('SchemeSaathi home', () => {
  it('renders the home introduction and language switcher', () => {
    render(<MemoryRouter><LanguageProvider><App /></LanguageProvider></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Select language' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find my schemes/i })).toBeInTheDocument();
  });
});
