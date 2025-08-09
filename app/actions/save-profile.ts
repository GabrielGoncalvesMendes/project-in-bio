"use server";
import { randomUUID } from "node:crypto";
import { fireStorage, fireStore } from "../lib/firebase";
import { auth } from "../lib/auth";

export async function saveProfile(formData: FormData) {
  const session = await auth();
  
  if (!session) {
    return;
  }

  try {
    const profileId = formData.get("profileId") as string;
    const yourName = formData.get("yourName") as string;
    const yourDescription = formData.get("yourDescription") as string;
    const profilePic = formData.get("profilePic") as File;

    let imagePath = null;
    const hasFile = profilePic && profilePic.size > 0;

    if(hasFile) {
      const currentProfile = await fireStore.collection("profiles").doc(profileId).get();

      const currentImagePath = currentProfile?.data()?.imagePath;

      if(currentImagePath) {
        const currentStorageRef = fireStorage.file(currentImagePath);
        const [exists] = await currentStorageRef.exists();

        if(exists) {
          await currentStorageRef.delete();
        } 
      }

      const storageRef = fireStorage.file(`profiles-images/${profileId}/${randomUUID()}`);
      const arrayBuffer = await profilePic.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await storageRef.save(buffer);
      imagePath = storageRef.name;
    }

    await fireStore.collection("profiles").doc(profileId).update({
      name: yourName,
      description: yourDescription,
      ...(hasFile && { imagePath }),
      updatedAt: Date.now(),
    });

    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
}