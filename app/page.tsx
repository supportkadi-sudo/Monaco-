import { Header } from '@/components/site/Header';
import { HeroSection } from '@/components/site/HeroSection';
import { ZonesSection } from '@/components/site/ZonesSection';
import { GallerySection } from '@/components/site/GallerySection';
import { PricesSection } from '@/components/site/PricesSection';
import { BookingSection } from '@/components/site/BookingSection';
import { ContactsSection } from '@/components/site/ContactsSection';
import { Footer, MobileCta } from '@/components/site/Footer';
import { site } from '@/lib/site';

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    name: 'Monaco Aquapark',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ташкент',
      streetAddress: 'массив Карасу-4, ул. Гулсанам',
      addressCountry: 'UZ'
    },
    openingHours: 'Mo-Su 06:00-23:00',
    sameAs: [site.instagramUrl],
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/monaco/hero.webp`
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ZonesSection />
        <GallerySection />
        <PricesSection />
        <BookingSection />
        <ContactsSection />
      </main>
      <Footer />
      <MobileCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
