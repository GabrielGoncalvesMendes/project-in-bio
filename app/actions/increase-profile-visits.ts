"use server";

import { FieldValue } from "firebase-admin/firestore";
import { auth } from "../lib/auth";
import { fireStore } from "../lib/firebase";

export async function increaseProfileVisits(profileId: string) {
  const session = await auth();
  if (!session) {
    return;
  }

  try {
    const profileRef = fireStore.collection("profiles").doc(profileId);

    await fireStore.runTransaction(async (transaction) => {
        const profileDoc = await transaction.get(profileRef);

        if (!profileDoc.exists) {
          return;
        }

        transaction.update(profileRef,{
          totalVisits: FieldValue.increment(1),
        });
      }
    );

  } catch (error) {
    console.error("Error increasing profile visits:", error);
  }
}