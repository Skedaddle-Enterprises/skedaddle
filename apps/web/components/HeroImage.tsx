import Image from 'next/image';

// TODO(assets): the legacy site hotlinked this hero photo directly from
// Unsplash (images.unsplash.com/photo-1539635278303-...). That's both a
// performance/availability risk and not ours to hotlink long-term. This now
// points at a local placeholder that does not exist yet — drop a licensed
// or shot image at public/hero/tribe-outdoors.jpg (recommended >= 1400px
// wide) before shipping.
export default function HeroImage() {
  return (
    <section className="hero-img-section">
      <Image
        src="/hero/tribe-outdoors.jpg"
        alt="A small tribe of friends laughing together on an outdoor adventure"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 42%' }}
      />
      <div className="hero-img-overlay">
        <div className="hero-img-caption">
          <div className="cap-label">What Skedaddle creates</div>
          <h2>
            We handle logistics.
            <br />
            <em>You just show up.</em>
          </h2>
          <p>
            Matched groups, real places, and the kind of community that doesn&apos;t happen by
            accident. The hardest parts of finding your people — handled, so all that&apos;s left
            is showing up.
          </p>
        </div>
      </div>
    </section>
  );
}
