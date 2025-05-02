"use server";

import { auth } from "../lib/auth";
import { fireStorage, fireStore } from "../lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

export async function createProject(formData: FormData) {
  const session = await auth();
  if(!session) {
    return;
  }

  const profileId = formData.get("profileId") as string;
  const projectName = formData.get("projectName") as string;
  const projectDescription = formData.get("projectDescription") as string;
  const projectUrl = formData.get("projectUrl") as string;
  const file = formData.get("file") as File;

  const generatedId = randomUUID();

  const storageRef = fireStorage.file(`projects-images/${profileId}/${generatedId}`);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await storageRef.save(buffer);

  const imagePath = storageRef.name;
  
  try {
    await fireStore.collection("projects").doc(profileId).collection("projects").doc().set({
      userId: session?.user?.id,
      profileId,
      projectName,
      projectDescription,
      projectUrl,
      imagePath,
      createdAt: Timestamp.now().toMillis(),
    });

    return true;
  } catch (error) {
    console.error("Error creating project:", error);
    return false;
  }
}