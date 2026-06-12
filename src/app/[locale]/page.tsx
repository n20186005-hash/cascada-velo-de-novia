import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import ManagementInfo from '@/components/ManagementInfo';
import BasicInfo from '@/components/BasicInfo';
import RouteSection from '@/components/RouteSection';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <ManagementInfo />
        <BasicInfo />
        <RouteSection />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <Gallery />
        <Reviews />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
