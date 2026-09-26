/**
 * Home hero photograph, supplied by Job Link Uganda (source:
 * assets/brand/jlu-hero1-original.jpg, 6144×3456). Colour-corrected (the
 * original had a strong orange cast), contrast-lifted, sharpened and exported
 * as AVIF/WebP at several widths plus a JPEG fallback in /public/images/hero.
 */
export const homeHero = {
  basePath: '/images/hero/jlu-hero',
  widths: [640, 1024, 1440, 1920, 2560],
  width: 2560,
  height: 1440,
  /** Tiny blurred preview shown instantly while the photo loads. */
  placeholder: 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABQBQCdASogABIAPuVep02pJSOiMAwBIByJYwC7M47DS2Zlt5cnkeFh4bKahI3Fp4pCu8AA/q8Qd0ihkvMu41hK18WvmBHfX2DcDcb48eNJfMYNYGmTpPsMv0F21CBikKgOONjklVw1tFCANHnXSWPDoxEkPsQWWKQiPf6VYXAAAA==',
  /** Keeps the subject (right of centre) in frame when the photo is cropped. */
  focus: '64% 42%',
} as const

export const heroSrcSet = (ext: 'avif' | 'webp') =>
  homeHero.widths.map((w) => `${homeHero.basePath}-${w}.${ext} ${w}w`).join(', ')
