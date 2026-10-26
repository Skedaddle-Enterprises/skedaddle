import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import Content, { title, lastUpdated, description } from '@/content/legal/child-safety.mdx';

export async function generateMetadata(): Promise<Metadata> {
  return { title, description };
}

export default function ChildSafetyPage() {
  return (
    <>
      <Ticker />
      <Nav />
      <section className="pillars">
        <div className="pillars-inner" style={{ maxWidth: 760 }}>
          <div className="section-header">
            <div className="sk-label">Legal</div>
            <h2>{title}</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
              Last updated: {lastUpdated}
            </p>
          </div>
          <article className="legal-content">
            <Content />
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
