import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import AboutPreview from '../components/home/AboutPreview';
import ServicesPreview from '../components/home/ServicesPreview';
import Testimonials from '../components/home/Testimonials';
import GalleryPreview from '../components/home/GalleryPreview';
import FAQ from '../components/home/FAQ';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>La Bella Aesthetic | Premium Aesthetic Treatments in Polokwane</title>
        <meta name="description" content="Polokwane's premier luxury aesthetic studio. Facials, microneedling, chemical peels, lash extensions, brow treatments and more. Book your appointment today." />
        <meta property="og:title" content="La Bella Aesthetic | Polokwane" />
        <meta property="og:description" content="Premium aesthetic treatments in Polokwane. Experience luxury skincare and beauty treatments by certified professionals." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://labellaaesthetic.co.za" />
      </Helmet>
      <Hero />
      <AboutPreview />
      <ServicesPreview />
      <Testimonials />
      <GalleryPreview />
      <FAQ />
      <ContactSection />
    </Layout>
  );
}