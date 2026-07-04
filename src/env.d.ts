/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    config: {
      /** blog title */
      title: string;
      /** your name */
      author: string;
      /** website description */
      desc: string;
      /** your deployed domain */
      website: string;
      /** your locale */
      locale: keyof typeof import('./i18n.ts').LANGUAGES;
      /** theme style */
      themeStyle: 'light' | 'auto' | 'dark';
      /** Google Analytics measurement ID */
      googleAnalyticsId?: string;
      /** your socials */
      socials: Array<{
        name: string;
        href: string;
      }>,
      /** your header info */
      header: {
        twitter: string;
      },
      /** your navigation links */
      navs: Array<{
        name: keyof typeof import('./i18n.ts').LANGUAGES['ja-jp'];
        href: string;
      }>,
      /** category mapping */
      category_map: Array<{
        name: string;
        path: string;
      }>
    }
    translate: (
      key: keyof typeof import('./i18n.ts').LANGUAGES['ja-jp'],
      param?: string | number
    ) => string;
  }
}
