import { NextRequest, NextResponse } from 'next/server';

const Stripe = require('stripe');
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
}) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Extract metadata
      const userId = session.metadata?.userId;
      const creditAmount = parseInt(session.metadata?.creditAmount || '0');
      
      if (userId && creditAmount > 0) {
        try {
          // Call backend to update credits
          const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/user/update-credits`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              creditAmount,
              transactionType: 'purchase',
              description: `Stripe purchase - Session ${session.id}`,
              metadata: {
                sessionId: session.id,
                purchaseType: 'stripe_checkout',
                amount: session.amount_total ? session.amount_total / 100 : 0,
              }
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update credits in backend');
          }

          console.log(`Credits updated for user ${userId}: +${creditAmount} credits`);
        } catch (error) {
          console.error('Error updating credits:', error);
          // You might want to add error handling/retry logic here
        }
      }
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}