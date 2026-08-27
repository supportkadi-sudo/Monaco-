import { Header } from '@/components/site/Header';
import { HeroSection } from '@/components/site/HeroSection';
import { ZonesSection } from '@/components/site/ZonesSection';
import { GallerySection } from '@/components/site/GallerySection';
import { PricesSection } from '@/components/site/PricesSection';
import { BeforeVisitSection } from '@/components/site/BeforeVisitSection';
import { ReviewsSection } from '@/components/site/ReviewsSection';
import { BookingSection } from '@/components/site/BookingSection';
import { ContactsSection } from '@/components/site/ContactsSection';
import { Footer } from '@/components/site/Footer';
import { MobileCta } from '@/components/site/MobileCta';
import { site, verifiedReviews } from '@/lib/site';

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    name: 'Monaco Aquapark',
    url: siteUrl,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ташкент',
      streetAddress: 'массив Карасу-4, ул. Гулсанам',
      addressCountry: 'UZ'
    },
    sameAs: [site.instagramUrl, site.officialUrl],
    image: `${siteUrl}/images/monaco/hero.webp`
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ZonesSection />
        <GallerySection />
        <PricesSection />
        <BeforeVisitSection />
        <ReviewsSection reviews={verifiedReviews} />
        <BookingSection />
        <ContactsSection />
      </main>
      <Footer />
      <MobileCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
