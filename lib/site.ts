export const site = {
  name: 'Monaco Aquapark',
  phone: '+998 95 215 15 15',
  phoneHref: 'tel:+998952151515',
  email: 'monacoaquapark@gmail.com',
  emailHref: 'mailto:monacoaquapark@gmail.com',
  address: 'Ташкент, Мирзо-Улугбекский район, массив Карасу-4, ул. Гулсанам',
  shortAddress: 'Карасу-4, ул. Гулсанам',
  hours: 'Уточняйте по телефону',
  instagram: '@monaco.aquapark',
  instagramUrl: 'https://www.instagram.com/monaco.aquapark/',
  officialUrl: 'https://monaqua.uz/',
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

export const beforeVisitFaq = [
  {
    question: 'Можно ли приезжать круглый год?',
    answer: 'Да. Monaco — крытый комплекс, поэтому отдых не зависит от сезона и погоды.'
  },
  {
    question: 'Есть ли зона для детей?',
    answer: 'Да. В Monaco предусмотрены специальные детские зоны и неглубокие бассейны для маленьких гостей.'
  },
  {
    question: 'Что есть кроме бассейнов?',
    answer: 'В комплексе есть финские сауны, турецкие хаммамы, SPA, гидромассаж и джакузи.'
  },
  {
    question: 'Можно ли перекусить на месте?',
    answer: 'Да. На территории Monaco работает фуд-корт.'
  },
  {
    question: 'Как узнать актуальное время работы?',
    answer: `Точное время лучше уточнить перед поездкой по телефону ${site.phone}.`
  }
] as const;

export const verifiedReviews = [] as const;

export const media = {
  hero: '/images/monaco/hero.webp',
  pool: '/images/monaco/pool-wide.webp',
  ship: '/images/monaco/ship-vertical.webp',
  sauna: '/images/monaco/sauna.jpg',
  party: '/images/monaco/party.webp'
} as const;
