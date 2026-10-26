'use client';

import { useEffect, useRef, useState } from 'react';

const CAPTIONS = [
  "Welcome — let's find your people",
  "Tell us who's joining today",
  'Pick what lights you up',
  'Choose your ideal group size',
  "Set where you're based",
  'Meet your AI-matched Tribe',
];

function ScreenContent({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="scr-brand">
          <div className="logo">
            <img src="/logo-mark.svg" alt="" width={64} height={64} />
          </div>
          <div className="wm">
            Sked<span>addle</span>
          </div>
          <h3>
            Let&apos;s find <em>your people.</em>
          </h3>
          <p>A few warm questions. Then we&apos;ll show you who you&apos;re meant to meet.</p>
          <div className="scr-foot" style={{ width: '100%', padding: '24px 0 0' }}>
            <div className="scr-btn">Begin</div>
          </div>
          <div className="scr-login">
            Already have an account? <b>Log in</b>
          </div>
        </div>
      );
    case 1:
      return (
        <>
          <div className="scr-nav">
            <div className="scr-back">←</div>
            <div className="scr-prog">
              <i className="on" />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="scr-body">
            <div className="scr-title">
              Who&apos;s <em>joining</em> today?
            </div>
            <div className="scr-desc">We&apos;ll tailor everything from here.</div>
            <div className="opt sel">
              <div className="oi">🧭</div>
              <div className="ot">
                <b>Just me</b>
                <span>Find a Tribe of compatible people</span>
              </div>
              <div className="orad">✓</div>
            </div>
            <div className="opt">
              <div className="oi">🏡</div>
              <div className="ot">
                <b>My family</b>
                <span>Coordinate ours + connect with others</span>
              </div>
              <div className="orad" />
            </div>
            <div className="opt">
              <div className="oi">🏛️</div>
              <div className="ot">
                <b>My organization</b>
                <span>Church, school, or community group</span>
              </div>
              <div className="orad" />
            </div>
            <div className="scr-foot">
              <div className="scr-btn">Continue</div>
            </div>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className="scr-nav">
            <div className="scr-back">←</div>
            <div className="scr-prog">
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="scr-body">
            <div className="scr-title">
              What <em>lights you up?</em>
            </div>
            <div className="scr-desc">Pick whatever&apos;s true. More is better.</div>
            <div className="chips">
              <span className="chip sa">🌅 Early mornings</span>
              <span className="chip sn">🏃 Trail running</span>
              <span className="chip sg">🥑 Slow brunches</span>
              <span className="chip">📚 Book talk</span>
              <span className="chip sa">🎶 Live music</span>
              <span className="chip">🍷 Long dinners</span>
              <span className="chip">🎲 Game nights</span>
              <span className="chip sg">🧘 Yoga + quiet</span>
              <span className="chip">🎨 Making things</span>
              <span className="chip">🥾 Outdoors</span>
              <span className="chip">☕ Coffee + walks</span>
              <span className="chip more">···</span>
            </div>
            <div className="scr-foot">
              <div className="scr-btn">Continue</div>
            </div>
          </div>
        </>
      );
    case 3:
      return (
        <>
          <div className="scr-nav">
            <div className="scr-back">←</div>
            <div className="scr-prog">
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i />
            </div>
          </div>
          <div className="scr-body">
            <div className="scr-title">
              How big do you <em>like to gather?</em>
            </div>
            <div className="scr-desc">
              We default to small for a reason — it&apos;s where friendship actually sticks.
            </div>
            <div className="opt">
              <div className="ot">
                <b>Small</b>
                <span>Three to five people</span>
              </div>
              <div className="dotsx">
                <i style={{ background: 'var(--amber)' }} />
                <i style={{ background: 'var(--green)' }} />
              </div>
            </div>
            <div className="opt sel opt-rec">
              <span className="rec-tag">Recommended</span>
              <div className="ot">
                <b>Just right</b>
                <span>Five to seven — Skedaddle&apos;s sweet spot</span>
              </div>
              <div className="dotsx">
                <i style={{ background: 'var(--amber)' }} />
                <i style={{ background: 'var(--green)' }} />
                <i style={{ background: 'var(--navy)' }} />
                <i style={{ background: 'var(--violet)' }} />
              </div>
            </div>
            <div className="opt">
              <div className="ot">
                <b>Larger crew</b>
                <span>Seven to ten people</span>
              </div>
              <div className="dotsx">
                <i style={{ background: 'var(--amber)' }} />
                <i style={{ background: 'var(--green)' }} />
                <i style={{ background: 'var(--coral)' }} />
              </div>
            </div>
            <div className="scr-foot">
              <div className="scr-btn">Continue</div>
            </div>
          </div>
        </>
      );
    case 4:
      return (
        <>
          <div className="scr-nav">
            <div className="scr-back">←</div>
            <div className="scr-prog">
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
              <i className="on" />
            </div>
          </div>
          <div className="scr-body">
            <div className="scr-title">
              Where <em>are you</em> based?
            </div>
            <div className="scr-desc">We&apos;ll match within your area.</div>
            <div className="loc">
              <span className="pin">📍</span>
              <span className="lt">San Francisco, CA</span>
              <span className="conf">Confirmed</span>
            </div>
            <div className="radius">
              <div className="radius-top">
                <span className="rk">Travel radius</span>
                <span className="rv">12 miles</span>
              </div>
              <div className="radius-track">
                <div className="fill" />
                <div className="knob" />
              </div>
              <div className="radius-scale">
                <span>2 mi</span>
                <span>15 mi</span>
                <span>30 mi</span>
              </div>
            </div>
            <div className="week-note" style={{ padding: '0 2px' }}>
              Real-world friendships happen close to home. We weight nearby matches heavier.
            </div>
            <div className="scr-foot">
              <div className="scr-btn">Continue</div>
            </div>
          </div>
        </>
      );
    case 5:
    default:
      return (
        <>
          <div className="pay-head">
            <div className="kicker">Meet your Tribe</div>
            <h3>
              The <em>Dawn Runners.</em>
            </h3>
            <p>Five people. One first Sunday already planned.</p>
          </div>
          <div className="m-card">
            <div className="m-top">
              <div className="m-title">
                Dawn Runners
                <br />
                Tribe
              </div>
              <div className="m-badge">
                <span className="p">91%</span>
                <span className="l">Match</span>
              </div>
            </div>
            <div className="m-quote">
              <p>
                &quot;You share a love of early mornings, trail runs, and the kind of brunch that
                earns it.&quot;
              </p>
            </div>
            <div className="m-mlbl">Proposed Members</div>
            <div className="m-avs">
              <div className="a" style={{ background: '#C8784A' }}>
                M
              </div>
              <div className="a" style={{ background: '#5A7D55' }}>
                P
              </div>
              <div className="a" style={{ background: '#94A37E' }}>
                J
              </div>
              <div className="a" style={{ background: '#E8A07F' }}>
                S
              </div>
              <div className="a more">+1</div>
            </div>
            <div className="m-tags">
              <span className="sk-tag amber">🌅 Early Riser</span>
              <span className="sk-tag green">🏃 Trail Running</span>
              <span className="sk-tag violet">🥑 Brunch</span>
            </div>
            <div className="scr-btn amber">Join This Tribe</div>
            <div className="m-see">See another option</div>
          </div>
        </>
      );
  }
}

export default function AppShowcase() {
  const [cur, setCur] = useState(0);
  const [caption, setCaption] = useState(CAPTIONS[0]);
  const [captionVisible, setCaptionVisible] = useState(true);
  const [drag, setDrag] = useState<{ px: number; fade: number } | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const curRef = useRef(cur);
  curRef.current = cur;

  const N = CAPTIONS.length;

  function show(i: number) {
    const next = (i + N) % N;
    setCur(next);
    setCaptionVisible(false);
    setTimeout(() => {
      setCaption(CAPTIONS[next]);
      setCaptionVisible(true);
    }, 220);
  }
  function next() {
    show(curRef.current + 1);
  }
  function prev() {
    show(curRef.current - 1);
  }

  // Auto-play, pause on hover, only while in view
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer: ReturnType<typeof setInterval> | null = null;

    function start() {
      if (!reduce) timer = setInterval(next, 6000);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (es) => es.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0.25 },
      );
      observer.observe(stage);
    } else {
      start();
    }

    return () => {
      stop();
      stage.removeEventListener('mouseenter', stop);
      stage.removeEventListener('mouseleave', start);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe / drag on the main phone
  useEffect(() => {
    const swipeEl = swipeRef.current;
    if (!swipeEl) return;
    let down = false;
    let sx = 0;
    let sy = 0;
    let dx = 0;
    let swiping = false;

    function onDown(e: PointerEvent) {
      down = true;
      swiping = false;
      sx = e.clientX;
      sy = e.clientY;
      dx = 0;
      swipeEl!.setPointerCapture?.(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!down) return;
      dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!swiping && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) swiping = true;
      if (swiping) {
        e.preventDefault();
        setDrag({ px: dx * 0.45, fade: Math.max(0.35, 1 - Math.abs(dx) / 520) });
      }
    }
    function endSwipe() {
      if (!down) return;
      down = false;
      setDrag(null);
      if (swiping && Math.abs(dx) > 45) {
        dx < 0 ? next() : prev();
      }
      swiping = false;
    }

    swipeEl.addEventListener('pointerdown', onDown);
    swipeEl.addEventListener('pointermove', onMove);
    swipeEl.addEventListener('pointerup', endSwipe);
    swipeEl.addEventListener('pointercancel', endSwipe);
    swipeEl.addEventListener('pointerleave', endSwipe);
    return () => {
      swipeEl.removeEventListener('pointerdown', onDown);
      swipeEl.removeEventListener('pointermove', onMove);
      swipeEl.removeEventListener('pointerup', endSwipe);
      swipeEl.removeEventListener('pointercancel', endSwipe);
      swipeEl.removeEventListener('pointerleave', endSwipe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fit the full 3-phone composition into smaller screens
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    function fitStage() {
      if (!stage) return;
      stage.style.transform = '';
      stage.style.marginBottom = '';
      const vw = document.documentElement.clientWidth;
      if (vw > 980) return;
      const sb = stage.getBoundingClientRect();
      const cx = sb.left + sb.width / 2;
      let half = sb.width / 2;
      stage.querySelectorAll<HTMLElement>('.phone, .float-chip').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const b = el.getBoundingClientRect();
        half = Math.max(half, cx - b.left, b.right - cx);
      });
      const content = half * 2;
      const avail = vw - (vw <= 600 ? 16 : 28);
      const scale = Math.min(1, avail / content);
      stage.style.transform = `scale(${scale})`;
      stage.style.marginBottom = `${-Math.round(stage.offsetHeight * (1 - scale))}px`;
    }
    fitStage();
    window.addEventListener('resize', fitStage);
    window.addEventListener('load', fitStage);
    const t = setTimeout(fitStage, 400);
    return () => {
      window.removeEventListener('resize', fitStage);
      window.removeEventListener('load', fitStage);
      clearTimeout(t);
    };
  }, []);

  // Mouse-driven 3D parallax tilt
  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.matchMedia('(min-width: 981px)').matches) return;

    let raf: number | null = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (scene) scene.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    function onMove(e: MouseEvent) {
      const r = stage!.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 16;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -10;
      if (!raf) loop();
    }
    function onLeave() {
      tx = 0;
      ty = 0;
    }
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const prevIdx = (cur - 1 + N) % N;
  const nextIdx = (cur + 1) % N;

  return (
    <section className="app3d" id="app">
      <div className="app3d-inner">
        <div className="app3d-head">
          <div className="sk-label">See the actual app</div>
          <h2>
            This is how Skedaddle <em>actually works.</em>
          </h2>
          <p>
            A few warm questions, then the Assimilation Engine proposes your Tribe. Tap through
            the real onboarding flow — rendered live, in 3D.
          </p>
        </div>

        <div className="stage stage-fit" id="stage" ref={stageRef}>
          <div className="float-chip fc-1">
            <div className="fc-ic" style={{ background: 'var(--amber-bg)' }}>
              ✦
            </div>
            <div className="fc-t">
              AI match reasoning
              <span>Every Tribe explained</span>
            </div>
          </div>
          <div className="float-chip fc-2">
            <div className="fc-ic" style={{ background: 'var(--green-bg)' }}>
              🏃
            </div>
            <div className="fc-t">
              5 behavioral signals
              <span>Compatibility-first</span>
            </div>
          </div>
          <div className="float-chip fc-3">
            <div className="fc-ic" style={{ background: 'var(--violet-bg)' }}>
              📍
            </div>
            <div className="fc-t">
              Matched near you
              <span>Real places, real life</span>
            </div>
          </div>
          <div className="float-chip fc-4">
            <div className="fc-ic" style={{ background: 'var(--coral-bg)' }}>
              🛡️
            </div>
            <div className="fc-t">
              Everyone verified
              <span>So the trust holds</span>
            </div>
          </div>

          <div className="stage-scene" id="scene" ref={sceneRef}>
            <div className="cg-rings" aria-hidden="true">
              <div className="cg-ring" />
              <div className="cg-ring" />
              <div className="cg-ring" />
              <div className="cg-ring" />
            </div>
            <div className="cg-ring-label">Connection Graph™ · live</div>

            <div className="phone phone-side phone-left">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className="phone-glare" />
                <div className="scr on">
                  <div className="scr-status">
                    <span>9:41</span>
                    <span className="sig">5G ▸▸</span>
                  </div>
                  <ScreenContent index={prevIdx} />
                </div>
              </div>
            </div>

            <div className="phone phone-side phone-right">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className="phone-glare" />
                <div className="scr on">
                  <div className="scr-status">
                    <span>9:41</span>
                    <span className="sig">5G ▸▸</span>
                  </div>
                  <ScreenContent index={nextIdx} />
                </div>
              </div>
            </div>

            <div className="phone phone-main">
              <div className="phone-screen" ref={swipeRef}>
                <div className="phone-notch" />
                <div className="phone-glare" />
                {CAPTIONS.map((_, i) => {
                  const isCur = i === cur;
                  const style: React.CSSProperties =
                    isCur && drag
                      ? { transition: 'none', transform: `translateX(${drag.px}px)`, opacity: drag.fade }
                      : {};
                  return (
                    <div
                      key={i}
                      className={`scr${isCur ? ' on' : ''}${i === 5 ? ' payoff' : ''}`}
                      style={style}
                    >
                      <div className="scr-status">
                        <span>9:41</span>
                        <span className="sig">5G ▸▸</span>
                      </div>
                      <ScreenContent index={i} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="stage-dots" id="stageDots">
          {CAPTIONS.map((c, i) => (
            <button
              key={c}
              type="button"
              className={`stage-dot${i === cur ? ' active' : ''}`}
              aria-label={c}
              onClick={() => show(i)}
            />
          ))}
        </div>
        <div className="stage-caption" style={{ opacity: captionVisible ? 1 : 0 }}>
          {caption}
        </div>
        <div className="stage-hint">← Swipe the center phone · all three screens move with the flow →</div>
      </div>
    </section>
  );
}
