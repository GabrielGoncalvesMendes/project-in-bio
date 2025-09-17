import { auth } from "@/app/lib/auth";
import { fireStore } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user.id;

  if(!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await fireStore.collection('users').doc(userId).get();
  const customerId = user.data()?.customerId;

  if(!customerId) {
    return NextResponse.json({ error: "No customer ID found" }, { status: 400 });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get("origin")}`,
    });
  
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Unable to create portal session" }, { status: 500 });
  }
  
}