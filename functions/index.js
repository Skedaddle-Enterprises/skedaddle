const functions = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');
const ADMIN_TRIGGER_SECRET = defineSecret('ADMIN_TRIGGER_SECRET');

// Where new-signup alerts go. Change if you want a different inbox.
const ADMIN_NOTIFY_EMAIL = 'mr.mack85@skedaddleenterprises26.com';

// Must be a verified sender (or verified domain) in your SendGrid account,
// otherwise every send below will fail with a 403 from the SendGrid API.
const SENDER_EMAIL = 'hello@skedaddleinc.com';
const SENDER_NAME = 'Skedaddle';

// Fill these in with the real store listing URLs before triggering the
// launch announcement — they're placeholders until the app is published.
const APP_STORE_URL = 'https://apps.apple.com/app/idPASTE_YOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=PASTE_YOUR_PACKAGE_NAME';

function setCors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Secret');
}

// Fires every time a new email lands in the `waitlist` collection.
// Sends a one-line alert to ADMIN_NOTIFY_EMAIL, and a confirmation to the
// person who just signed up, so both sides know it went through.
exports.notifyOnSignup = functions
  .runWith({ secrets: [SENDGRID_API_KEY] })
  .firestore.document('waitlist/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    sgMail.setApiKey(SENDGRID_API_KEY.value());

    const adminAlert = sgMail.send({
      to: ADMIN_NOTIFY_EMAIL,
      from: { email: SENDER_EMAIL, name: SENDER_NAME },
      subject: `New waitlist signup: ${data.email}`,
      text: [
        `${data.email} just joined the Skedaddle waitlist.`,
        ``,
        `Source: ${data.source || 'unknown'}`,
        `Page: ${data.page || 'unknown'}`,
      ].join('\n'),
    });

    const welcomeHtml = `
      <div style="font-family:Helvetica,Arial,sans-serif;background:#F5F0E1;padding:32px 16px">
        <div style="max-width:480px;margin:0 auto;background:#FFFCF6;border-radius:16px;padding:32px;text-align:center">
          <div style="width:48px;height:48px;background:#2C3B2F;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#fff;margin-bottom:16px">S</div>
          <h1 style="font-family:Georgia,serif;font-size:22px;color:#2C3B2F;margin:0 0 12px">You're on the list! 🎉</h1>
          <p style="font-size:14px;color:#56635A;line-height:1.6;margin:0 0 4px">
            You've joined the Skedaddle waitlist. We'll email you the moment we launch — with links to download the app.
          </p>
        </div>
      </div>`;

    const welcomeEmail = sgMail.send({
      to: data.email,
      from: { email: SENDER_EMAIL, name: SENDER_NAME },
      subject: "You're on the Skedaddle waitlist",
      text: "You've joined the Skedaddle waitlist. We'll email you the moment we launch — with links to download the app.",
      html: welcomeHtml,
    });

    await Promise.all([adminAlert, welcomeEmail]);
  });

// Manually triggered from Admin.html's "Send Launch Announcement" button.
// Emails everyone currently in the waitlist collection, once, that the app is live.
exports.sendLaunchAnnouncement = functions
  .runWith({ secrets: [SENDGRID_API_KEY, ADMIN_TRIGGER_SECRET] })
  .https.onRequest(async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    if (req.get('X-Admin-Secret') !== ADMIN_TRIGGER_SECRET.value()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const force = req.body && req.body.force === true;
    const metaRef = db.collection('meta').doc('launchAnnouncement');
    const metaSnap = await metaRef.get();
    if (metaSnap.exists && metaSnap.data().sentAt && !force) {
      return res.status(409).json({
        error: 'Launch announcement was already sent. Pass { "force": true } to resend.',
        sentAt: metaSnap.data().sentAt.toDate(),
        count: metaSnap.data().count,
      });
    }

    const snap = await db.collection('waitlist').get();
    const emails = [...new Set(snap.docs.map((d) => d.data().email).filter(Boolean))];

    if (!emails.length) {
      return res.status(200).json({ sent: 0 });
    }

    sgMail.setApiKey(SENDGRID_API_KEY.value());

    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;background:#F5F0E1;padding:32px 16px">
        <div style="max-width:480px;margin:0 auto;background:#FFFCF6;border-radius:16px;padding:32px;text-align:center">
          <div style="width:48px;height:48px;background:#2C3B2F;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#fff;margin-bottom:16px">S</div>
          <h1 style="font-family:Georgia,serif;font-size:22px;color:#2C3B2F;margin:0 0 12px">Skedaddle is live 🎉</h1>
          <p style="font-size:14px;color:#56635A;line-height:1.6;margin:0 0 24px">
            Thanks for waiting around — the coordination engine you signed up for is officially open. Come find your people.
          </p>
          <div>
            <a href="${APP_STORE_URL}" style="display:inline-block;background:#2C3B2F;color:#fff;font-weight:700;font-size:13px;padding:12px 20px;border-radius:999px;text-decoration:none;margin:0 6px 10px">Download on the App Store</a>
            <a href="${PLAY_STORE_URL}" style="display:inline-block;background:#C8784A;color:#fff;font-weight:700;font-size:13px;padding:12px 20px;border-radius:999px;text-decoration:none;margin:0 6px 10px">Get it on Google Play</a>
          </div>
        </div>
      </div>`;

    const CHUNK = 500; // SendGrid's per-request recipient cap for `isMultiple`
    let sent = 0;
    for (let i = 0; i < emails.length; i += CHUNK) {
      const chunk = emails.slice(i, i + CHUNK);
      await sgMail.send({
        to: chunk,
        isMultiple: true,
        from: { email: SENDER_EMAIL, name: SENDER_NAME },
        subject: "Skedaddle is live!",
        text: [
          "Skedaddle is officially live.",
          "",
          `App Store: ${APP_STORE_URL}`,
          `Google Play: ${PLAY_STORE_URL}`,
        ].join('\n'),
        html,
      });
      sent += chunk.length;
    }

    const sentAt = admin.firestore.FieldValue.serverTimestamp();
    await Promise.all([
      metaRef.set({ sentAt, count: sent }),
      db.collection('config').doc('site').set({ isLive: true, wentLiveAt: sentAt, notifiedCount: sent }, { merge: true }),
    ]);

    res.status(200).json({ sent });
  });
