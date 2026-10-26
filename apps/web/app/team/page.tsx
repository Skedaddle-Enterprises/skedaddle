import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import TeamGraph from '@/components/TeamGraph';

export const metadata: Metadata = {
  title: 'Team',
  description:
    "Meet the people building Skedaddle — an interactive Connection Graph of the team behind the operating system for belonging.",
};

export default function TeamPage() {
  return (
    <>
      <Ticker />
      <Nav />
      <TeamGraph />
      <Footer />
    </>
  );
}
