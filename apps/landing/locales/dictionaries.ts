import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  zh: () => import('./zh.json').then((module) => module.default),
};

type Params = Record<string, string | number>;

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return params[key.trim()]?.toString() ?? '';
  });
}

export async function useTranslate(locale: string) {
  // @ts-ignore
  if (!locale || !dictionaries[locale]) {
    locale = 'en';
  }
  // @ts-ignore
  const dict = await dictionaries[locale]();
  const fallbackDict = locale !== 'en' ? await dictionaries.en() : {};
  return function t(key: string, params?: Params): string {
    // @ts-ignore
    const template = dict[key] || fallbackDict[key] || key;
    return interpolate(template, params);
  };
}
