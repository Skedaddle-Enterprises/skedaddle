/* Skedaddle lightweight, self-hosted pageview analytics.
   Logs one pageview per load to the Firestore `pageviews` collection, with a
   coarse (city/country) location resolved from the visitor's IP. No cookies,
   no third-party tracker — just your own data, viewable in Admin.html.
   Requires the Firebase compat SDK (app + firestore) to be loaded first. */
(function () {
  if (typeof firebase === 'undefined') return;

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBsFwrAHKI4kf85Tz4YLZersyvhrhpW3h4",
        authDomain: "skedaddle-websitelanding.firebaseapp.com",
        projectId: "skedaddle-websitelanding",
        storageBucket: "skedaddle-websitelanding.firebasestorage.app",
        messagingSenderId: "1005105410569",
        appId: "1:1005105410569:web:bda3ce12c44f1740703ed8"
      });
    }
  } catch (e) { /* already initialized on this page */ }

  var db = firebase.firestore();

  function clip(v, max) { return (v == null ? '' : String(v)).slice(0, max || 100); }

  // Stable-ish visitor id so Admin can distinguish "visitors" from "views".
  var vid;
  try {
    vid = localStorage.getItem('sk_vid');
    if (!vid) {
      vid = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('sk_vid', vid);
    }
  } catch (e) { vid = 'v_anon'; }

  // Resolve coarse location once per session (cached), so we don't hammer the
  // geo APIs on every navigation. Tries providers in order for better accuracy,
  // and falls back to an empty location on total failure.
  function fromIpapi(g) {
    if (!g || g.error) return null;
    if (!g.country_code && !g.country) return null;
    return { country: g.country_name || g.country, countryCode: g.country_code, region: g.region, city: g.city };
  }
  function fromIpwho(g) {
    if (!g || g.success === false) return null;
    return { country: g.country, countryCode: g.country_code, region: g.region, city: g.city };
  }
  function tryProvider(url, parse) {
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (g) { var geo = parse(g); if (!geo) throw new Error('bad'); return geo; });
  }
  function getGeo() {
    try {
      var cached = sessionStorage.getItem('sk_geo');
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
    // ipapi.co (MaxMind-based) tends to be more accurate; ipwho.is is the fallback.
    return tryProvider('https://ipapi.co/json/', fromIpapi)
      .catch(function () { return tryProvider('https://ipwho.is/', fromIpwho); })
      .then(function (geo) {
        try { sessionStorage.setItem('sk_geo', JSON.stringify(geo)); } catch (e) {}
        return geo;
      })
      .catch(function () { return {}; });
  }

  getGeo().then(function (geo) {
    db.collection('pageviews').add({
      page:        clip(location.pathname, 500),
      referrer:    clip(document.referrer, 500),
      visitorId:   clip(vid, 64),
      country:     clip(geo.country, 100),
      countryCode: clip(geo.countryCode, 8),
      region:      clip(geo.region, 100),
      city:        clip(geo.city, 100),
      timestamp:   firebase.firestore.FieldValue.serverTimestamp(),
      userAgent:   clip(navigator.userAgent, 200)
    }).catch(function () { /* stay silent — never disrupt the page */ });
  });
})();
