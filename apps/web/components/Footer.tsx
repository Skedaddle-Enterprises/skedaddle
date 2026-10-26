import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-badge">
              <Image src="/logo-mark.svg" alt="" width={34} height={34} />
            </div>
            <div className="nav-logo-text">
              Sked<span>addle</span>
            </div>
          </Link>
          <p>
            We handle the logistics of friendship — the planning, the scheduling, the
            follow-through — so real relationships have room to happen.
          </p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li>
              <a href="/#tiers">Tribes</a>
            </li>
            <li>
              <a href="/#tiers">Family Pods</a>
            </li>
            <li>
              <a href="/#tiers">Community OS</a>
            </li>
            <li>
              <a href="/#graph">Connection Graph™</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="/team">Team</Link>
            </li>
            <li>
              <Link href="/support">Support</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/trust">Trust &amp; Safety</Link>
            </li>
            <li>
              <Link href="/child-safety">Child Safety Standards</Link>
            </li>
            <li>
              <Link href="/delete-account">Delete Your Account</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Skedaddle Enterprises, Inc. All rights reserved.</span>
        <span>Gainesville, FL — Confidential &amp; Proprietary</span>
      </div>
    </footer>
  );
}
