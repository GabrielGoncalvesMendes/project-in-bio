import "server-only";

import { fireStore } from "../lib/firebase";
import { CustomLink } from "../actions/add-custom-links";

export type ProfileData = { 
  userId: string;
  totalVisits: number;
  createdAt: number;
  socialMedias?: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  link1?: CustomLink;
  link2?: CustomLink;
  link3?: CustomLink;
  updatedAt?: number;
  profileId?: string;
};

export type ProjectData = { 
  id: string;
  userId: string;
  projectName: string;
  projectDescription: string;
  projectUrl: string;
  imagePath: string;
  createdAt: string;
  totalVisits?: number;
}

export default async function GetProfileData(profileId: string) { 
  const snapshot = await fireStore.collection("profiles").doc(profileId).get();

  return snapshot.data() as ProfileData;
}

export async function GetProfileProjects(profileId: string) {
  const snapshot = await fireStore.collection("projects").doc(profileId).collection("projects").get();

  return snapshot.docs.map((doc) => doc.data() as ProjectData);
}