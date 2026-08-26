export const site = {
  name: 'Monaco Aquapark',
  phone: '+998 95 215 15 15',
  phoneHref: 'tel:+998952151515',
  address: 'Ташкент, Мирзо-Улугбекский район, массив Карасу-4, ул. Гулсанам',
  shortAddress: 'Карасу-4, ул. Гулсанам',
  hours: '06:00 — 23:00',
  instagram: '@monaco.aquapark',
  instagramUrl: 'https://www.instagram.com/monaco.aquapark/',
  bookingTelegram: '@djgjeigje',
  bookingTelegramUrl: 'https://t.me/djgjeigje',
  routeUrl: 'https://www.google.com/maps/search/?api=1&query=Monaco+Aquapark+Tashkent',
  mapEmbedUrl: 'https://www.google.com/maps?q=Monaco+Aquapark+Tashkent&output=embed'
} as const;

export const prices = {
  weekday: {
    adult: 130_000,
    child: 75_000
  },
  weekend: {
    adult: 180_000,
    child: 100_000
  },
  note: 'Детям до 5 лет — бесплатно. Детский тариф: 5–14 лет.'
} as const;

export const media = {
  hero: '/images/monaco/hero.webp',
  pool: '/images/monaco/pool-wide.webp',
  ship: '/images/monaco/ship-vertical.webp',
  sauna: '/images/monaco/sauna.jpg',
  party: '/images/monaco/party.webp'
} as const;
