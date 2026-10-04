/**
 * Illustrative stock photography (Unsplash License). Every entry was viewed
 * before selection. These people are NOT Job Link Uganda staff, candidates or
 * clients, and no location is our office; captions and alt text must never
 * suggest otherwise. Replace with original photography when available.
 */
export type StockImage = {
  /** images.unsplash.com base URL (no query string). */
  src: string
  width: number
  height: number
  alt: string
  /** CSS object-position used when the image is cropped. */
  focus?: string
  credit: { name: string; url: string }
}

export const stockImages = {
  waitress: {
    src: 'https://images.unsplash.com/photo-1496811425508-6d7ebb7ff32c',
    width: 4918,
    height: 3376,
    alt: 'A waitress in a white shirt, bow tie and brown apron, standing in a restaurant',
    focus: '50% 30%',
    credit: { name: 'Steven Cleghorn', url: 'https://unsplash.com/photos/psomVjxL29Y' },
  },
  chef: {
    src: 'https://images.unsplash.com/photo-1731576089290-e6230a18dcb4',
    width: 4000,
    height: 6000,
    alt: 'A young chef in a white jacket and apron working in a commercial kitchen',
    focus: '50% 40%',
    credit: { name: 'Martin Baron', url: 'https://unsplash.com/photos/9CEsgroCdBo' },
  },
  hotelHost: {
    src: 'https://images.unsplash.com/photo-1591933320290-adfceefb40be',
    width: 5760,
    height: 3840,
    alt: 'A man in a white kaftan carrying linen through a hotel restaurant and lounge',
    focus: '55% 40%',
    credit: { name: 'Nino Kojo', url: 'https://unsplash.com/photos/ktDSSPC2AEE' },
  },
  employersPlanning: {
    src: 'https://images.unsplash.com/photo-1688372296394-f8c21c15ed65',
    width: 7360,
    height: 4912,
    alt: 'Two businessmen reviewing printed plans together at a wooden table',
    focus: '55% 30%',
    credit: { name: 'Ali Mkumbwa', url: 'https://unsplash.com/photos/69I10EF57UY' },
  },
  jobSeeker: {
    src: 'https://images.unsplash.com/photo-1666867540898-aaa1993ffabc',
    width: 2000,
    height: 2998,
    alt: 'A smiling young woman in a light blue shirt and blue headscarf, arms folded',
    focus: '50% 18%',
    credit: { name: 'Raymond Owusu-Afriyie', url: 'https://unsplash.com/photos/VPvYUK2Iibo' },
  },
  conversation: {
    src: 'https://images.unsplash.com/photo-1655720355810-fcdfd7a742b5',
    width: 5568,
    height: 3712,
    alt: 'A woman and a man in conversation, seated in a bright office lounge',
    focus: '50% 40%',
    credit: { name: 'Iwaria Inc.', url: 'https://unsplash.com/photos/U7zb_4mTVPQ' },
  },
  teamDiscussion: {
    src: 'https://images.unsplash.com/photo-1655720357872-ce227e4164ba',
    width: 5568,
    height: 3712,
    alt: 'Three women discussing work around a laptop in an office lounge',
    focus: '50% 45%',
    credit: { name: 'Iwaria Inc.', url: 'https://unsplash.com/photos/M7ALc3UuX_g' },
  },
  // Hospitality training (added 2026-10-02). Illustrative only: not a Job Link Uganda session or client.
  restaurantTeam: {
    src: 'https://images.unsplash.com/photo-1786034760172-16ee03955ec5',
    width: 3840,
    height: 2880,
    alt: 'A large restaurant team in uniforms and hairnets, gathered together in their dining room',
    focus: '50% 55%',
    credit: { name: 'Jose Gaspar', url: 'https://unsplash.com/photos/3ELTTDBFoME' },
  },
  tableService: {
    src: 'https://images.unsplash.com/photo-1512061942530-e6a4e9a5cf27',
    width: 6016,
    height: 4016,
    alt: 'A waiter in a white shirt and apron setting places at a long banquet table',
    focus: '68% 40%',
    credit: { name: 'CHUTTERSNAP', url: 'https://unsplash.com/photos/OB7ol699Iww' },
  },
  kitchenCook: {
    src: 'https://images.unsplash.com/photo-1565608087341-404b25492fee',
    width: 4000,
    height: 6000,
    alt: 'A cook in a white hat and grey apron plating food at the pass in a restaurant kitchen',
    focus: '50% 30%',
    credit: { name: 'Jeff Siepman', url: 'https://unsplash.com/photos/kyuPjZudBKs' },
  },
  // Visual system (added 2026-10-04). Kampala photos are by Ugandan photographers.
  kampalaSkyline: {
    src: 'https://images.unsplash.com/photo-1763220207281-c4d0febb61a8',
    width: 7938,
    height: 5292,
    alt: 'The Kampala skyline at sunset',
    focus: '55% 45%',
    credit: { name: 'Robin Kutesa', url: 'https://unsplash.com/photos/Q3ymlvOJGFs' },
  },
  // No visible brand or company signage (a photo showing a hotel's logo was rejected).
  kampalaCity: {
    src: 'https://images.unsplash.com/photo-1777887544354-74a7248c8a74',
    width: 5468,
    height: 3645,
    alt: "Kampala's office towers rising among green trees",
    focus: '45% 50%',
    credit: { name: 'Michael Starkie', url: 'https://unsplash.com/photos/KWHsl_llyvc' },
  },
  jobSeekerLaptop: {
    src: 'https://images.unsplash.com/photo-1765648684630-ac9c15ac98d5',
    width: 4016,
    height: 6016,
    alt: 'A smiling young woman in a light blue shirt working on a laptop',
    focus: '50% 32%',
    credit: { name: 'FOTOGRAFÍA EDITORIAL', url: 'https://unsplash.com/photos/Ys9lVXQ-EhU' },
  },
  interview: {
    src: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507',
    width: 5760,
    height: 3840,
    alt: 'Two women talking across a table by a window, in an interview setting',
    focus: '60% 45%',
    credit: { name: 'Christina @ wocintechchat.com', url: 'https://unsplash.com/photos/LQ1t-8Ms5PY' },
  },
  cvWriting: {
    src: 'https://images.unsplash.com/photo-1616291554507-bc2c14742f81',
    width: 3456,
    height: 5184,
    alt: 'A young woman in glasses writing notes with a pen',
    focus: '45% 24%',
    credit: { name: 'Baptista Ime James', url: 'https://unsplash.com/photos/c4hoY6orn8s' },
  },
} satisfies Record<string, StockImage>

export type StockImageKey = keyof typeof stockImages
