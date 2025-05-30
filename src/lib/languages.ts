export interface Language {
  flag: string;
  language: string;
  code: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { flag: '🇺🇸', language: 'English', code: 'en' },
  { flag: '🇫🇷', language: 'French', code: 'fr' },
  { flag: '🇪🇸', language: 'Spanish', code: 'es' },
  { flag: '🇮🇹', language: 'Italian', code: 'it' },
  { flag: '🇩🇪', language: 'German', code: 'de' },
  { flag: '🇵🇭', language: 'Filipino', code: 'tl' },
  { flag: '🇵🇹', language: 'Portuguese', code: 'pt' },
];

export const DEFAULT_LANGUAGE = 'en';
