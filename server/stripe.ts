import { Express, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export function setupStripeRoutes(app: Express) {
  // Create a payment intent for reservation
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert dollars to cents
        currency: "usd",
        metadata: {
          integration_check: "usf_parking_app_payment"
        }
      });
      
      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        error: `Payment failed: ${error.message}`
      });
    }
  });

  // Confirm payment status
  app.get("/api/payment-status/:paymentIntentId", async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.params;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert cents to dollars
      });
    } catch (error: any) {
      console.error("Error retrieving payment intent:", error);
      res.status(500).json({
        error: `Failed to retrieve payment status: ${error.message}`
      });
    }
  });

  // Webhook to handle payment events from Stripe
  app.post("/api/webhook", async (req: Request, res: Response) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // Verify webhook signature
      // Note: In production, you should configure endpointSecret
      // const endpointSecret = 'your_webhook_secret';
      // event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      
      // For now, just parse the event
      event = payload;
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          
          // TODO: Update reservation status to confirmed
          // await storage.updateReservationByPaymentIntent(paymentIntent.id, 'confirmed');
          
          break;
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log('Payment failed:', failedPaymentIntent.id);
          
          // TODO: Handle failed payment
          // await storage.updateReservationByPaymentIntent(failedPaymentIntent.id, 'failed');
          
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
}