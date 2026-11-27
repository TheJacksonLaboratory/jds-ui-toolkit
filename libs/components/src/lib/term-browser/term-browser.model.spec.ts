import { JdsTerm, termLanguage, termName } from './term-browser.model';

const seizure: JdsTerm = {
  id: 'HP:0001250',
  name: 'Seizure',
  translations: [
    { language: 'de', name: 'Krampfanfall' },
    { language: 'fr', name: '' }
  ]
};

describe('termName', () => {
  it('returns the translation for the chosen language', () => {
    expect(termName(seizure, 'de')).toBe('Krampfanfall');
    expect(termLanguage(seizure, 'de')).toBe('de');
  });

  it('matches the language code in any case', () => {
    expect(termName(seizure, 'DE')).toBe('Krampfanfall');
  });

  it('falls back to the canonical name when the translation has no name', () => {
    expect(termName(seizure, 'fr')).toBe('Seizure');
    expect(termLanguage(seizure, 'fr')).toBeNull();
  });

  it('falls back to the canonical name when there is no translation for the language', () => {
    expect(termName(seizure, 'ja')).toBe('Seizure');
    expect(termLanguage(seizure, 'ja')).toBeNull();
  });

  it('returns the canonical name when no language is chosen', () => {
    expect(termName(seizure, null)).toBe('Seizure');
    expect(termLanguage(seizure, null)).toBeNull();
  });

  it('returns the canonical name for a term carrying no translations', () => {
    expect(termName({ id: 'HP:0000001', name: 'All' }, 'de')).toBe('All');
  });
});
