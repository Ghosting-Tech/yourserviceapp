import admin from "firebase-admin";
import { NextResponse } from "next/server";

const firebaseConfig = {
  type: "service_account",
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderCertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
  universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export async function POST(request) {
  const { token, title, message, link } = await request.json();

  const payload = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcm_options: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
