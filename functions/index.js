const functions = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

const ZOHO_SMTP_USER = defineSecret('ZOHO_SMTP_USER');
const ZOHO_SMTP_PASSWORD = defineSecret('ZOHO_SMTP_PASSWORD');
const ADMIN_TRIGGER_SECRET = defineSecret('ADMIN_TRIGGER_SECRET');

// Where new-signup alerts go. Change if you want a different inbox.
const ADMIN_NOTIFY_EMAIL = 'help@skedaddleenterprises26.com';

// Must be the Zoho mailbox whose credentials are stored in ZOHO_SMTP_USER /
// ZOHO_SMTP_PASSWORD below, otherwise Zoho's SMTP server will reject the send.
const SENDER_EMAIL = 'support@skedaddleenterprises26.com';
const SENDER_NAME = 'Skedaddle';
// Postal address in every marketing email footer (required by CAN-SPAM).
const MAILING_ADDRESS = '1343 NW 120th Way, Gainesville, FL 32606';

// Fill these in with the real store listing URLs before triggering the
// launch announcement — they're placeholders until the app is published.
const APP_STORE_URL = 'https://apps.apple.com/app/idPASTE_YOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=PASTE_YOUR_PACKAGE_NAME';

// Public beta links sent to every new signup. Also in apps/web/lib/beta.ts; keep both in sync.
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/YERuvqvg';
const PLAY_BETA_URL = 'https://play.google.com/apps/testing/com.skedaddle.app';

function setCors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Secret');
}

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: ZOHO_SMTP_USER.value(),
      pass: ZOHO_SMTP_PASSWORD.value(),
    },
  });
}

// Fires every time a new email lands in the `waitlist` collection.
// Sends a one-line alert to ADMIN_NOTIFY_EMAIL, and the beta download links
// (TestFlight + Play open testing) to the person who just signed up.
exports.notifyOnSignup = functions
  .runWith({ secrets: [ZOHO_SMTP_USER, ZOHO_SMTP_PASSWORD] })
  .firestore.document('waitlist/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const transporter = getTransporter();
    const from = `"${SENDER_NAME}" <${SENDER_EMAIL}>`;

    const adminAlert = transporter.sendMail({
      from,
      to: ADMIN_NOTIFY_EMAIL,
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
          <img src="https://skedaddleenterprises26.com/email-logo.png" width="64" height="64" alt="Skedaddle" style="display:block;margin:0 auto 16px;border:0">
          <h1 style="font-family:Georgia,serif;font-size:22px;color:#2C3B2F;margin:0 0 12px">You're in! 🎉</h1>
          <p style="font-size:14px;color:#56635A;line-height:1.6;margin:0 0 24px">
            The Skedaddle beta is open. Sign up takes a minute: verify your phone number with a text code and you're in.
          </p>
          <div>
            <a href="${TESTFLIGHT_URL}" style="display:inline-block;background:#2C3B2F;color:#fff;font-weight:700;font-size:13px;padding:12px 20px;border-radius:999px;text-decoration:none;margin:0 6px 10px">iPhone: Get it on TestFlight</a>
            <a href="${PLAY_BETA_URL}" style="display:inline-block;background:#C8784A;color:#fff;font-weight:700;font-size:13px;padding:12px 20px;border-radius:999px;text-decoration:none;margin:0 6px 10px">Android: Get it on Google Play</a>
          </div>
          <p style="font-size:12px;color:#56635A;line-height:1.6;margin:16px 0 0">
            iPhone: install TestFlight from the App Store first, then tap the button.<br>
            Android: tap "Become a tester", then install from Google Play (US only for now).<br>
            Tell us what works and what doesn't. Just reply to this email.
          </p>
        </div>
        <p style="max-width:480px;margin:16px auto 0;font-size:11px;color:#8A938C;text-align:center;line-height:1.6">
          Skedaddle Enterprises Inc · ${MAILING_ADDRESS} · ${SENDER_EMAIL}<br>
          You're getting this because you signed up at skedaddleenterprises26.com. Don't want these emails? Reply "unsubscribe" and we'll remove you.
        </p>
      </div>`;

    const welcomeText = [
      "You're in! The Skedaddle beta is open.",
      '',
      `iPhone (install TestFlight from the App Store first): ${TESTFLIGHT_URL}`,
      `Android (tap "Become a tester", US only for now): ${PLAY_BETA_URL}`,
      '',
      "Sign up takes a minute: verify your phone number with a text code and you're in.",
      "Tell us what works and what doesn't. Just reply to this email.",
      '',
      `Skedaddle Enterprises Inc · ${MAILING_ADDRESS} · ${SENDER_EMAIL}`,
      'Don\'t want these emails? Reply "unsubscribe" and we\'ll remove you.',
    ].join('\n');

    const welcomeEmail = transporter.sendMail({
      from,
      to: data.email,
      subject: "You're in: try the Skedaddle beta",
      text: welcomeText,
      html: welcomeHtml,
    });

    await Promise.all([adminAlert, welcomeEmail]);
  });

// Manually triggered from the admin dashboard's "Send Launch Announcement"
// action. Emails everyone currently in the waitlist collection, once, that
// the app is live.
exports.sendLaunchAnnouncement = functions
  .runWith({ secrets: [ZOHO_SMTP_USER, ZOHO_SMTP_PASSWORD, ADMIN_TRIGGER_SECRET] })
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

    const transporter = getTransporter();
    const from = `"${SENDER_NAME}" <${SENDER_EMAIL}>`;

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

    const text = [
      "Skedaddle is officially live.",
      "",
      `App Store: ${APP_STORE_URL}`,
      `Google Play: ${PLAY_STORE_URL}`,
    ].join('\n');

    // Sent individually (not one email with every address visible) so
    // recipients' addresses stay private from each other, same as the
    // previous SendGrid isMultiple behavior.
    let sent = 0;
    for (const email of emails) {
      try {
        await transporter.sendMail({ from, to: email, subject: 'Skedaddle is live!', text, html });
        sent += 1;
      } catch (err) {
        console.error(`Failed to send launch announcement to ${email}:`, err);
      }
    }

    const sentAt = admin.firestore.FieldValue.serverTimestamp();
    await Promise.all([
      metaRef.set({ sentAt, count: sent }),
      db.collection('config').doc('site').set({ isLive: true, wentLiveAt: sentAt, notifiedCount: sent }, { merge: true }),
    ]);

    res.status(200).json({ sent });
  });
