'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const LINKS = [
  { href: '/#app', label: 'The app' },
  { href: '/#how', label: 'How it works' },
  { href: '/#tiers', label: "Who it's for" },
  { href: '/#graph', label: 'The tech' },
  { href: '/team', label: 'Team' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-badge">
            <Image src="/logo-mark.svg" alt="" width={34} height={34} />
          </div>
          <div className="nav-logo-text">
            Sked<span>addle</span>
          </div>
        </Link>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="/#waitlist" className="nav-cta">
              Get the beta
            </a>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <a href={l.href} key={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="/#waitlist" onClick={() => setOpen(false)}>
          Get the beta
        </a>
      </div>
    </nav>
  );
}
