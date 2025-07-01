export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh', 'ja', 'ko', 'pt', 'es', 'de', 'fr', 'vi'],
} as const;

export const i18nMetadata = i18n.locales.map((lang) => {
  return {
    lang: lang,
  };
});

export const i18nLanguages = [
  {
    name: 'English',
    url: '/',
    code: 'en',
  },
  {
    name: '简体中文',
    url: '/zh',
    code: 'zh',
  },
  // {
  //   name: '繁體中文',
  //   url: '/tw',
  // },
  {
    name: '한국어',
    url: '/ko',
    code: 'ko',
  },
  {
    name: '日本語',
    url: '/ja',
    code: 'ja',
  },
  {
    name: 'Português',
    url: '/pt',
    code: 'pt',
  },
  {
    name: 'Español',
    url: '/es',
    code: 'es',
  },
  {
    name: 'Deutsch',
    url: '/de',
    code: 'de',
  },
  {
    name: 'Français',
    url: '/fr',
    code: 'fr',
  },
  {
    name: 'Tiếng Việt',
    url: '/vi',
    code: 'vi',
  },
];

export type Locale = (typeof i18n)['locales'][number];
