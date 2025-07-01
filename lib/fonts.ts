import localFont from 'next/font/local';
import { EB_Garamond } from 'next/font/google';

// ACaslon Pro font family
export const acaslonPro = localFont({
  src: [
    {
      path: '../public/fonts/ACaslonPro-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ACaslonPro-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/ACaslonPro-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/ACaslonPro-SemiboldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/ACaslonPro-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ACaslonPro-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-acaslon',
  display: 'swap',
});

// Stilson font family
export const stilson = localFont({
  src: [
    {
      path: '../public/fonts/Stilson Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Stilson Display Bold Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-stilson',
  display: 'swap',
});

// Miller Daily One font
export const millerDaily = localFont({
  src: '../public/fonts/MillerDailyOne-Roman.ttf',
  variable: '--font-miller',
  display: 'swap',
});

// Newyorker font (replacing NY Irvin with Cygnet)
export const newyorker = localFont({
  src: '../public/fonts/CygnetRegular.ttf',
  variable: '--font-newyorker',
  display: 'swap',
});

//Ghost Handwriting font family
export const ghost = localFont({
  src: '../public/fonts/Ghost Hand.otf',
  variable: '--font-ghost',
  display: 'swap',
});


// Futura font family
export const futura = localFont({
  src: [
    {
      path: '../public/fonts/FuturaCyrillicLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicBook.ttf',
      weight: '400', // Book is often treated as normal
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicMedium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicDemi.ttf',
      weight: '600', // Demi is often treated as semibold
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaCyrillicHeavy.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-futura',
  display: 'swap',
});

// glacial font family
export const glacial = localFont({
  src: [
    {
      path: '../public/fonts/glacial-indifference.regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/glacial-indifference.regular.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-glacial',
  display: 'swap',
});


// EB Garamond font from Google Fonts
export const garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
});