"use server";

import { fireStore } from '../lib/firebase';

export async function verifyLink(link: string) {
  const snapshot = await fireStore.collection('profiles').doc(link).get();

  return snapshot.exists;
}