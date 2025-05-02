"use server";

import { Timestamp } from "firebase-admin/firestore";
import { fireStore } from "../lib/firebase";
import { auth } from "../lib/auth";

export async function createSocialLinks({
  profileId,
  github,
  linkedin,
  instagram,
  twitter,
}: {
  profileId: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
}) {

  const session = await auth();
  if (!session) {
    return;
  }

  try {
    await fireStore.collection("profiles").doc(profileId).update({
      socialMedias: {
        github,
        linkedin,
        instagram,
        twitter,
      },
      updatedAt: Timestamp.now().toMillis(),
    });
    return true;
  } catch (error) {
    console.error("Error creating social links:", error);
    return false;
  }
}