import "server-only";

import { fireStore } from "../lib/firebase";

export type ProfileData = { 
  userId: string;
  totalVisits: number;
  createdAt: number;
};

export default async function GetProfileData(profileId: string) { 
  const snapshot = await fireStore.collection("profiles").doc(profileId).get();

  return snapshot.data() as ProfileData;
}