// ABOUTME: Sets request-local theme config and translation helpers from the URL language.
// ABOUTME: Allows Japanese root pages and prefixed English/Chinese pages to share components.

import { defineMiddleware } from 'astro:middleware';
import { THEME_CONFIG } from "~/theme.config.ts";
import {
  getLanguageFromPathname,
  getLocalizedPath,
  getLocaleFromLanguage,
  LANGUAGES,
  SITE_LANGUAGES
} from "~/i18n.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  // Adding properties in env.d.ts
  const language = getLanguageFromPathname(context.url.pathname);
  const languageConfig = SITE_LANGUAGES[language];
  const locale = getLocaleFromLanguage(language);

  context.locals.config = {
    ...THEME_CONFIG,
    title: languageConfig.title,
    desc: languageConfig.desc,
    locale,
    navs: THEME_CONFIG.navs.map((nav) => ({
      ...nav,
      href: getLocalizedPath(nav.href, language)
    }))
  };

  const localeTranslate = LANGUAGES[locale];

  function validateKey(key: string): key is keyof typeof localeTranslate {
    return key in localeTranslate;
  }

  context.locals.translate = (key, param) => {
    if (!validateKey(key)) return key;
    else if (!param) return localeTranslate[key];
    else return localeTranslate[key].replace('%d', param.toString());
  }
  return next();
});
