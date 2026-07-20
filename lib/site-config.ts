export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://farukyilmaz.com').replace(
    /\/$/,
    ''
  );

export const SITE_NAME = 'Faruk Yılmaz';
export const SITE_BRAND = 'OFY';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const TWITTER_HANDLE = '@farukyilmaz';
