import type { Metadata } from 'next';
import Ticker from '@/components/Ticker';
import Nav from '@/components/Nav';
import LaunchPopup from '@/components/LaunchPopup';
import Hero from '@/components/Hero';
import HeroImage from '@/components/HeroImage';
import AppShowcase from '@/components/AppShowcase';
import Comparison from '@/components/Comparison';
import Pillars from '@/components/Pillars';
import TribeCard from '@/components/TribeCard';
import ConnectionGraph from '@/components/ConnectionGraph';
import HowItWorks from '@/components/HowItWorks';
import Tiers from '@/components/Tiers';
import AppTeaser from '@/components/AppTeaser';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Skedaddle — Real people. Real places. Real belonging.',
  description:
    'Skedaddle is an AI coordination engine that moves people from strangers to shared real-world experiences — in days, not months.',
};

export default function HomePage() {
  return (
    <>
      <LaunchPopup />
      <Ticker />
      <Nav />
      <Hero />
      <HeroImage />
      <AppShowcase />
      <Comparison />
      <Pillars />
      <TribeCard />
      <ConnectionGraph />
      <HowItWorks />
      <Tiers />
      <AppTeaser />
      <WaitlistForm />
      <Footer />
    </>
  );
}
