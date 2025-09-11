import { auth } from "@/app/lib/auth";
import { fireStore } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { metadata, isSubscription } = await request.json();
  const price = isSubscription ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID : process.env.STRIPE_PRICE_ID;
  
  const userSession = await auth();

  if(!userSession || !userSession.user?.id || !userSession.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = userSession.user?.id;
  const userEmail = userSession.user?.email;
  const userName = userSession.user?.name;

  const userRef = fireStore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  let customerId = userDoc.exists ? userDoc.data()?.customerId : null;

  if(!customerId) {
    const newCustomer = await stripe.customers.create({
      email: userEmail,
      name: userName || "No Name",
      metadata: { userId }
    });

    customerId = newCustomer.id;
    await userRef.update({ customerId });
  }

  const session = await stripe.checkout.sessions.create({ 
    customer: customerId,
    line_items: [{
        price,
        quantity: 1
    }],
    mode: isSubscription ? 'subscription' : 'payment',
    payment_method_types: isSubscription ? ['card'] : ['card', 'boleto'],
    success_url: `${request.headers.get('origin')}/${metadata.profileId}`,
    cancel_url: `${request.headers.get('origin')}/${metadata.profileId}/upgrade`,
    client_reference_id: userId,
    metadata
  });

  return NextResponse.json({ sessionId: session.id });
}