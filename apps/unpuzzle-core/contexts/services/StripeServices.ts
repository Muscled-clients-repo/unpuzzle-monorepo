import Stripe from 'stripe';

export class StripeService {
  public stripe: Stripe;

  constructor() {
    // Initialize Stripe with the secret key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  // Create a Payment Intent
  createPaymentIntent=async(amount: number): Promise<Stripe.PaymentIntent> =>{
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      return paymentIntent;
    } catch (err: any) {
      throw new Error(`Payment Intent Creation Failed: ${err.message}`);
    }
  }

  // Create a Customer
  createCustomer=async(email: string, paymentMethodId: string): Promise<Stripe.Customer> =>{
    try {
      const customer = await this.stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      return customer;
    } catch (err: any) {
      throw new Error(`Customer Creation Failed: ${err.message}`);
    }
  }

  // Create a Refund
  createRefund=async(paymentIntentId: string): Promise<Stripe.Refund> =>{
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      return refund;
    } catch (err: any) {
      throw new Error(`Refund Creation Failed: ${err.message}`);
    }
  }

  // Create Checkout Session for Credit Purchase
  createCheckoutSession = async (params: {
    userId: string;
    creditAmount: number;
    priceInCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> => {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${params.creditAmount} Credits`,
                description: `Purchase ${params.creditAmount} credits for your account`,
              },
              unit_amount: params.priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          userId: params.userId,
          creditAmount: params.creditAmount.toString(),
        },
      });
      return session;
    } catch (err: any) {
      throw new Error(`Checkout Session Creation Failed: ${err.message}`);
    }
  }

  // Create Checkout Session for Course Purchase
  createCourseCheckoutSession = async (params: {
    userId: string;
    courseId: string;
    courseTitle: string;
    priceInCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> => {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: params.courseTitle,
                description: `Access to course: ${params.courseTitle}`,
              },
              unit_amount: params.priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          userId: params.userId,
          courseId: params.courseId,
          type: 'course_purchase',
        },
      });
      return session;
    } catch (err: any) {
      throw new Error(`Course Checkout Session Creation Failed: ${err.message}`);
    }
  }
}
