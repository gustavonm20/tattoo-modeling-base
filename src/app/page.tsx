import { contact, site } from '@/content';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import StyleCards from '@/components/StyleCards';
import Portfolio from '@/components/Portfolio';
import Deck from '@/components/Deck';
import Testimonials from '@/components/Testimonials';
import BookingForm from '@/components/BookingForm';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import SiteEffects from '@/components/SiteEffects';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  telephone: `+${contact.whatsapp}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  areaServed: site.city,
  founder: { '@type': 'Person', name: site.artist },
  sameAs: [contact.instagram],
};

export default function Home() {
  return (
    <div className="vk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <h1 className="sr">Vulto Ink, tatuagem autoral em São Paulo</h1>
        <Hero />
        <Marquee />
        <About />
        <StyleCards />
        <Portfolio />
        <Deck />
        <Testimonials />
        <BookingForm />
        <Faq />
      </main>
      <Footer />
      {/* por último: roda depois que as seções criaram seus ScrollTriggers */}
      <SiteEffects />
    </div>
  );
}
