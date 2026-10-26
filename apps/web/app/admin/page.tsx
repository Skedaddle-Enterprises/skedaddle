'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';

type WaitlistRow = {
  id: string;
  email: string;
  source: string;
  page: string;
  userAgent: string;
  timestamp: Date | null;
};

type PageviewRow = {
  id: string;
  page: string;
  visitorId: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timestamp: Date | null;
};

type LocationGroup = {
  key: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  views: number;
  visitors: Set<string>;
  lastSeen: Date | null;
};

const PAGE_SIZE = 25;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [allData, setAllData] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageviews, setPageviews] = useState<PageviewRow[]>([]);
  const [pvLoading, setPvLoading] = useState(false);
  const [pvUpdatedAt, setPvUpdatedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'email' | 'timestamp'>('timestamp');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);
      } else {
        setIsAdmin(false);
      }
      setAuthChecked(true);
    });
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const db = getDb();
      const snap = await getDocs(collection(db, 'waitlist'));
      const rows: WaitlistRow[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          email: data.email ?? '',
          source: data.source ?? '',
          page: data.page ?? '',
          userAgent: data.userAgent ?? '',
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
        };
      });
      setAllData(rows);
      showToast(`Loaded ${rows.length} entries`);
    } catch (err) {
      console.error('Failed to load waitlist:', err);
      showToast('Could not load waitlist data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPageviews = useCallback(async () => {
    setPvLoading(true);
    try {
      const db = getDb();
      const snap = await getDocs(collection(db, 'pageviews'));
      const rows: PageviewRow[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          page: data.page ?? '',
          visitorId: data.visitorId ?? '',
          country: data.country ?? '',
          countryCode: data.countryCode ?? '',
          region: data.region ?? '',
          city: data.city ?? '',
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
        };
      });
      setPageviews(rows);
      setPvUpdatedAt(new Date());
    } catch (err) {
      console.error('Failed to load pageviews:', err);
    } finally {
      setPvLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadPageviews();
    }
  }, [isAdmin, loadData, loadPageviews]);

  // Keep visitor locations feeling "live" while the dashboard is open.
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(() => loadPageviews(), 30000);
    return () => clearInterval(interval);
  }, [isAdmin, loadPageviews]);

  const locations = useMemo(() => {
    const groups = new Map<string, LocationGroup>();
    pageviews.forEach((r) => {
      const key = `${r.city}|${r.region}|${r.countryCode}`;
      let g = groups.get(key);
      if (!g) {
        g = {
          key,
          city: r.city,
          region: r.region,
          country: r.country,
          countryCode: r.countryCode,
          views: 0,
          visitors: new Set(),
          lastSeen: null,
        };
        groups.set(key, g);
      }
      g.views += 1;
      if (r.visitorId) g.visitors.add(r.visitorId);
      if (r.timestamp && (!g.lastSeen || r.timestamp > g.lastSeen)) g.lastSeen = r.timestamp;
    });
    return Array.from(groups.values()).sort(
      (a, b) => (b.lastSeen?.getTime() ?? 0) - (a.lastSeen?.getTime() ?? 0)
    );
  }, [pageviews]);

  const pvStats = useMemo(() => {
    const uniqueVisitors = new Set(pageviews.map((r) => r.visitorId).filter(Boolean));
    const uniqueCountries = new Set(pageviews.map((r) => r.countryCode).filter(Boolean));
    const now = Date.now();
    const last24h = pageviews.filter(
      (r) => r.timestamp && now - r.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;
    return {
      totalViews: pageviews.length,
      uniqueVisitors: uniqueVisitors.size,
      uniqueCountries: uniqueCountries.size,
      last24h,
    };
  }, [pageviews]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week = new Date(today.getTime() - 7 * 86400000);
    let t = 0;
    let w = 0;
    let p = 0;
    allData.forEach((r) => {
      const ts = r.timestamp ?? new Date(0);
      if (ts >= today) t++;
      if (ts >= week) w++;
      if (r.source === 'popup') p++;
    });
    return { total: allData.length, today: t, week: w, popup: p };
  }, [allData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const rows = q ? allData.filter((r) => r.email.toLowerCase().includes(q)) : [...allData];
    rows.sort((a, b) => {
      if (sortField === 'email') return sortDir * a.email.localeCompare(b.email);
      const ta = a.timestamp ?? new Date(0);
      const tb = b.timestamp ?? new Date(0);
      return sortDir * (ta.getTime() - tb.getTime());
    });
    return rows;
  }, [allData, search, sortField, sortDir]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  function sortBy(field: 'email' | 'timestamp') {
    if (sortField === field) {
      setSortDir((d) => (d === 1 ? -1 : 1) as 1 | -1);
    } else {
      setSortField(field);
      setSortDir(-1);
    }
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  function goPage(p: number) {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err) {
      setLoginError('Sign-in failed. Check your email and password.');
      console.error(err);
    }
  }

  async function handleDelete(row: WaitlistRow) {
    if (!confirm(`Remove this entry? (${row.email})`)) return;
    try {
      const db = getDb();
      await deleteDoc(doc(db, 'waitlist', row.id));
      try {
        await addDoc(collection(db, 'adminAudit'), {
          action: 'delete_waitlist_entry',
          targetId: row.id,
          targetEmail: row.email,
          performedBy: user?.email ?? 'unknown',
          timestamp: serverTimestamp(),
        });
      } catch (auditErr) {
        console.warn('Audit log write failed (non-blocking):', auditErr);
      }
      setAllData((prev) => prev.filter((r) => r.id !== row.id));
      showToast('Entry deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Delete failed');
    }
  }

  function exportCsv() {
    if (!filtered.length) {
      showToast('No data to export');
      return;
    }
    const header = ['#', 'Email', 'Date', 'Time', 'Source', 'Page'];
    const rows = filtered.map((r, i) => {
      const ts = r.timestamp ?? new Date(0);
      return [
        i + 1,
        r.email,
        ts.toLocaleDateString('en-US'),
        ts.toLocaleTimeString('en-US'),
        r.source,
        r.page,
      ];
    });
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skedaddle-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} rows`);
  }

  if (!authChecked) {
    return (
      <main style={{ padding: 40, fontFamily: 'var(--font-manrope-stack)' }}>
        <p>Loading…</p>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="admin-login-screen">
        <form onSubmit={handleLogin} className="admin-login-box">
          <div className="admin-login-badge">S</div>
          <h1>Admin Dashboard</h1>
          <p>Sign in with your admin account to view the waitlist.</p>
          {user && !isAdmin && (
            <p className="admin-login-err" style={{ marginBottom: 12 }}>
              Signed in as {user.email}, but this account does not have admin access.
            </p>
          )}
          <input
            type="email"
            placeholder="admin@skedaddle.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="admin-password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="admin-password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="admin-login-btn">
            Sign in
          </button>
          {loginError && <div className="admin-login-err">{loginError}</div>}
          {user && (
            <button
              type="button"
              className="admin-login-btn"
              style={{ marginTop: 10, background: 'var(--bg)', color: 'var(--navy)' }}
              onClick={() => signOut(getFirebaseAuth())}
            >
              Sign out
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-logo">
            <div className="admin-header-badge">S</div>
            <div className="admin-header-title">
              Sked<span>addle</span>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-header-tag">Admin Dashboard</div>
            <button className="admin-logout-btn" onClick={() => signOut(getFirebaseAuth())}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats-grid">
          <div className="admin-stat-card amber">
            <div className="admin-stat-label">Total signups</div>
            <div className="admin-stat-value">{stats.total}</div>
            <div className="admin-stat-sub">All time</div>
          </div>
          <div className="admin-stat-card green">
            <div className="admin-stat-label">Today</div>
            <div className="admin-stat-value">{stats.today}</div>
            <div className="admin-stat-sub">New signups</div>
          </div>
          <div className="admin-stat-card violet">
            <div className="admin-stat-label">This week</div>
            <div className="admin-stat-value">{stats.week}</div>
            <div className="admin-stat-sub">Last 7 days</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">From popup</div>
            <div className="admin-stat-value">{stats.popup}</div>
            <div className="admin-stat-sub">vs CTA button</div>
          </div>
        </div>

        <div className="admin-table-card">
          <div className="admin-table-header">
            <div className="admin-table-header-left">
              <h2>Waitlist Signups</h2>
              <p>
                {loading
                  ? 'Loading...'
                  : `${filtered.length.toLocaleString()} ${filtered.length === 1 ? 'signup' : 'signups'} total`}
              </p>
            </div>
            <div className="admin-table-actions">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="admin-action-btn secondary" onClick={() => loadData()}>
                ↻ Refresh
              </button>
              <button className="admin-action-btn green" onClick={exportCsv}>
                ⬇ Export CSV
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sortable" onClick={() => sortBy('email')}>
                    Email ↕
                  </th>
                  <th className="sortable" onClick={() => sortBy('timestamp')}>
                    Date Joined ↕
                  </th>
                  <th>Time</th>
                  <th>Source</th>
                  <th>Page</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="admin-loading-row">
                    <td colSpan={7}>
                      <div className="admin-loading-spinner" />
                      <div>Loading waitlist data...</div>
                    </td>
                  </tr>
                )}
                {!loading && pageRows.length === 0 && (
                  <tr className="admin-empty-row">
                    <td colSpan={7}>No results found</td>
                  </tr>
                )}
                {!loading &&
                  pageRows.map((r, i) => {
                    const ts = r.timestamp ?? new Date(0);
                    const date = ts.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    const time = ts.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const src = r.source === 'popup' ? 'popup' : 'landing';
                    const lbl = r.source === 'popup' ? 'Popup' : 'CTA Button';
                    const pg = (r.page || '').replace('https://', '').replace('http://', '').split('/')[0];
                    return (
                      <tr key={r.id}>
                        <td className="admin-row-num">{start + i + 1}</td>
                        <td className="email">
                          <a href={`mailto:${esc(r.email)}`}>{esc(r.email)}</a>
                        </td>
                        <td>{date}</td>
                        <td style={{ color: 'var(--muted)', fontSize: 12 }}>{time}</td>
                        <td>
                          <span className={`admin-source-badge ${src}`}>{lbl}</span>
                        </td>
                        <td
                          style={{
                            fontSize: 11,
                            color: 'var(--muted)',
                            maxWidth: 160,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {esc(pg) || '—'}
                        </td>
                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(r)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="admin-table-footer">
            <div className="admin-page-info">
              {filtered.length === 0
                ? 'No entries'
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()} entries`}
            </div>
            <div className="admin-page-btns">
              <button
                className="admin-page-btn"
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span key={`e${idx}`} className="admin-page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`admin-page-btn${p === currentPage ? ' active' : ''}`}
                      onClick={() => goPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                className="admin-page-btn"
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="admin-stats-grid" style={{ marginTop: 28 }}>
          <div className="admin-stat-card amber">
            <div className="admin-stat-label">Total pageviews</div>
            <div className="admin-stat-value">{pvStats.totalViews}</div>
            <div className="admin-stat-sub">All time</div>
          </div>
          <div className="admin-stat-card green">
            <div className="admin-stat-label">Unique visitors</div>
            <div className="admin-stat-value">{pvStats.uniqueVisitors}</div>
            <div className="admin-stat-sub">By browser id</div>
          </div>
          <div className="admin-stat-card violet">
            <div className="admin-stat-label">Last 24h</div>
            <div className="admin-stat-value">{pvStats.last24h}</div>
            <div className="admin-stat-sub">Views</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Countries reached</div>
            <div className="admin-stat-value">{pvStats.uniqueCountries}</div>
            <div className="admin-stat-sub">Distinct locations</div>
          </div>
        </div>

        <div className="admin-table-card" style={{ marginTop: 16 }}>
          <div className="admin-table-header">
            <div className="admin-table-header-left">
              <h2>Visitor Locations</h2>
              <p>
                {pvLoading
                  ? 'Loading...'
                  : `${locations.length.toLocaleString()} ${locations.length === 1 ? 'location' : 'locations'} reached`}
                {!pvLoading && pvUpdatedAt && (
                  <span style={{ marginLeft: 8, color: 'var(--muted)' }}>
                    · live, updated {pvUpdatedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </p>
            </div>
            <div className="admin-table-actions">
              <button className="admin-action-btn secondary" onClick={() => loadPageviews()}>
                ↻ Refresh
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Region</th>
                  <th>Country</th>
                  <th>Views</th>
                  <th>Visitors</th>
                  <th>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {pvLoading && (
                  <tr className="admin-loading-row">
                    <td colSpan={6}>
                      <div className="admin-loading-spinner" />
                      <div>Loading visitor locations...</div>
                    </td>
                  </tr>
                )}
                {!pvLoading && locations.length === 0 && (
                  <tr className="admin-empty-row">
                    <td colSpan={6}>No pageviews logged yet</td>
                  </tr>
                )}
                {!pvLoading &&
                  locations.map((loc) => (
                    <tr key={loc.key}>
                      <td>{loc.city || '—'}</td>
                      <td>{loc.region || '—'}</td>
                      <td>
                        {loc.country || '—'}
                        {loc.countryCode ? ` (${loc.countryCode})` : ''}
                      </td>
                      <td>{loc.views}</td>
                      <td>{loc.visitors.size}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {loc.lastSeen
                          ? loc.lastSeen.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className={`admin-toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}
