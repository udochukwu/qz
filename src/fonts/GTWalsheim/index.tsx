import localFont from 'next/font/local';

export const GTWalsheim = localFont({
  src: [
    {
      path: './GTWalsheimPro-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './GTWalsheimPro-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './GTWalsheimPro-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './GTWalsheimPro-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './GTWalsheimPro-UltraBold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-gt-walsheim',
});
