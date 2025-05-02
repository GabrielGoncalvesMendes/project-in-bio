import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import "server-only";

const decodedKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64!, 'base64').toString('utf-8');

// Certificado
export const firebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodedKey
});

// Instance
if(!getApps().length) {
  initializeApp({
    credential: firebaseCert,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export const fireStore = getFirestore();

export const fireStorage = getStorage().bucket();

export async function getDownloadUrlFromPath(path?: string) {
  if(!path) return null;

  const file = fireStorage.file(path);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "31-12-2500", // Nao deixa expirar
  });

  return url;
}
