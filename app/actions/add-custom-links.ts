"use server";

import { fireStore } from "../lib/firebase";

export type CustomLink = {
  title: string; 
  url: string; 
}

export default async function addCustomLinks({ 
  profileId, link1, link2, link3 
}: { 
  profileId: string, link1: CustomLink; link2: CustomLink; link3: CustomLink 
}) {
  try {
    await fireStore.collection("profiles").doc(profileId).update({
      link1,
      link2,
      link3,
    });
  } catch (error) {
    console.error("Error saving custom links:", error);
    return false;
  }
}