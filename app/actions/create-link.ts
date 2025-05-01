"use server";

import { Timestamp } from 'firebase-admin/firestore';
import { fireStore } from '../lib/firebase';
import { auth } from '../lib/auth';

export default async function CreateLink(link: string) {
  const session = await auth();

  if(!session?.user) {
    return;
  };

  try {
    await fireStore.collection('profiles').doc(link).set({
      userId: session.user.id,
      totalVisits: 0,
      createdAt: Timestamp.now().toMillis(),
    });
  
    return true;
  } catch (error) {
    console.error("Error creating link:", error);
    return false;
  }
}