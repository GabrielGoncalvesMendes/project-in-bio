"use server";

import { FieldValue } from "firebase-admin/firestore";
import { auth } from "../lib/auth";
import { fireStore } from "../lib/firebase";

export async function increaseProjectVisits(profileId: string, projectId: string) {
  const session = await auth();
  if (!session) {
    return;
  }

  try {
    const projectRef = fireStore.collection("profiles").doc(profileId).collection("projects").doc(projectId);

    await fireStore.runTransaction(async (transaction) => {
        const projectDoc = await transaction.get(projectRef);

        if (!projectDoc.exists) {
          return;
        }

        transaction.update(projectRef,{
          totalVisits: FieldValue.increment(1),
        });
      }
    );

  } catch (error) {
    console.error("Error increasing profile visits:", error);
  }
}