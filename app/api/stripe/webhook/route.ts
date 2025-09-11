import { fireStore } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
  
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
    if (!signature || !secret) {
      throw new Error("Missing signature or secret");
    }
  
    const event = stripe.webhooks.constructEvent(body, signature, secret);
  
    switch (event.type) {
      case "checkout.session.completed":
        // User completed checkout - SUBSCRIPTION or UNIQUE PAYMENT
        if(event.data.object.payment_status === "paid") {
          const userId = event.data.object.client_reference_id;

          if(userId) {
            await fireStore.collection("users").doc(userId).update({
              isSubscribed: true,
            });
          }
        }

        // Verify if the payment method is boleto
        if (event.data.object.payment_status === "unpaid" && event.data.object.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent.toString());
          const hostedVoucherUrl = paymentIntent.next_action?.boleto_display_details?.hosted_voucher_url;

          if (hostedVoucherUrl) {
            const userEmail = event.data.object.customer_details?.email;
            console.log("Boleto URL:", hostedVoucherUrl, "for user:", userEmail);
          }
        }
      
        break;
      case "checkout.session.async_payment_succeeded":
        // User paid boleto
        if(event.data.object.payment_status === "paid") {
          const userId = event.data.object.client_reference_id;
          if(userId) {
            await fireStore.collection("users").doc(userId).update({
              isSubscribed: true,
            });
          }
        }
        break;
      case "customer.subscription.deleted":
        // User canceled subscription
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        if(customerId) {
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;

          if(customer && customer.metadata?.userId) { 
            const userId = customer.metadata.userId;
            await fireStore.collection("users").doc(userId).update({
              isSubscribed: false,
            });
          }
        }
        break;
    }
  
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("Error in webhook:", error);
    return new NextResponse(null, { status: 500 });
  }
}