import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import {StripeService} from "../../../contexts/services/StripeServices"
import OrdersModel from "../../../models/supabase/orders.model"
import ProductModel from "../../../models/supabase/product.model";
import CreditTrackModel from "../../../models/supabase/creditTrack.model";
import CreditTransactionModel from "../../../models/supabase/creditTransaction.model";
import { logger } from "../../../utils/logger";


class StripeWebhookController extends StripeService{
    private stripeWebhookSecret: string
    constructor() {
        super()
        this.stripeWebhookSecret=process.env.STRIPE_WEBHOOK_SECRET as string
    }

    stripeWebhookEvent= async(req: any,res: Response,next: NextFunction)=>{
        const responseHandler = new ResponseHandler(res, next);
        const sig = req.headers['stripe-signature'];
        const event = this.stripe.webhooks.constructEvent(req.body, sig, this.stripeWebhookSecret);
        console.log(event)
        try {
            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                const paymentIntent = event.data.object; // PaymentIntent object
                console.log('PaymentIntent was successful!', paymentIntent);
                break;
                case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                console.log('PaymentIntent failed!', failedPaymentIntent);
                break;
                // Add other event cases as needed
                default:
                console.log('Unhandled event type:', event.type);
            }

            responseHandler.success(event);
        } catch (error: any) {
            responseHandler.error(error);
        }
    }

    handleCreateCheckoutSession = async(req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler(res, next);
        
        try {
            const { userId, creditAmount, priceInCents, successUrl, cancelUrl } = req.body;
            
            // Validate required fields
            if (!userId || !creditAmount || !priceInCents || !successUrl || !cancelUrl) {
                throw new Error('Missing required fields: userId, creditAmount, priceInCents, successUrl, cancelUrl');
            }
            
            // Validate credit amount and price
            if (creditAmount <= 0 || priceInCents <= 0) {
                throw new Error('Credit amount and price must be positive numbers');
            }
            
            // Verify user exists (optional but recommended)
            // You can uncomment this if you want to verify user exists
            // const user = await UserModel.getUserById(userId);
            // if (!user) {
            //     throw new Error('User not found');
            // }
            
            // Create checkout session using the parent StripeService method
            const session = await this.createCheckoutSession({
                userId,
                creditAmount,
                priceInCents,
                successUrl,
                cancelUrl
            });
            
            logger.info('Checkout session created successfully', {
                sessionId: session.id,
                userId,
                creditAmount,
                priceInCents
            });
            
            responseHandler.success({
                sessionId: session.id,
                checkoutUrl: session.url,
                sessionUrl: session.url
            });
            
        } catch (error: any) {
            logger.error('Failed to create checkout session', {
                error: error.message,
                body: req.body
            });
            responseHandler.error(error);
        }
    }

    creditWebhook = async(req: any, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler(res, next);
        let event;

        try {
            // Verify webhook signature
            const sig = req.headers['stripe-signature'];
            
            if (!sig) {
                logger.error('Missing stripe-signature header');
                return res.status(400).send('Missing stripe-signature header');
            }

            event = this.stripe.webhooks.constructEvent(
                req.body, 
                sig, 
                this.stripeWebhookSecret
            );

            logger.info(`Stripe webhook received: ${event.type}`, { eventId: event.id });

            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as any; // Checkout Session object
                    
                    // Extract metadata
                    const { userId, creditAmount } = session.metadata || {};
                    
                    if (!userId || !creditAmount) {
                        logger.error('Missing required metadata in checkout session', {
                            sessionId: session.id,
                            metadata: session.metadata
                        });
                        // Return success to Stripe even if metadata is missing
                        return res.status(200).json({ received: true, error: 'Missing metadata' });
                    }

                    // Convert creditAmount to number
                    const credits = parseInt(creditAmount, 10);
                    
                    if (isNaN(credits) || credits <= 0) {
                        logger.error('Invalid credit amount', {
                            sessionId: session.id,
                            creditAmount,
                            credits
                        });
                        // Return success to Stripe even if credit amount is invalid
                        return res.status(200).json({ received: true, error: 'Invalid credit amount' });
                    }

                    // Update user's credit balance with idempotency check
                    try {
                        // Check if this session was already processed (idempotency)
                        const existingTransaction = await CreditTransactionModel.getCreditTransactionBySessionId(session.id);
                        
                        if (existingTransaction) {
                            logger.info(`Session ${session.id} already processed`, {
                                userId,
                                existingTransactionId: existingTransaction.id
                            });
                            return res.status(200).json({ 
                                received: true,
                                message: 'Session already processed',
                                transactionId: existingTransaction.id
                            });
                        }

                        // Calculate amount paid in dollars
                        const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

                        // Update credits in credit_track table
                        const updatedCredits = await CreditTrackModel.incrementCredits(userId, credits);
                        
                        // Record the transaction
                        const creditTransaction = await CreditTransactionModel.createCreditTransaction({
                            user_id: userId,
                            amount: credits,
                            type: 'purchase',
                            stripe_session_id: session.id,
                            description: `Purchased ${credits} credits for $${amountPaid}`,
                            metadata: {
                                amountPaid,
                                currency: session.currency || 'usd',
                                paymentMethod: 'stripe',
                                customerEmail: session.customer_email,
                                paymentStatus: session.payment_status
                            }
                        });
                        
                        logger.info('Credits successfully updated', {
                            userId,
                            creditAmount: credits,
                            newAvailableCredits: updatedCredits.available_credit,
                            sessionId: session.id,
                            transactionId: creditTransaction.id
                        });

                        return res.status(200).json({ 
                            received: true,
                            message: 'Credits updated successfully',
                            availableCredits: updatedCredits.available_credit,
                            transactionId: creditTransaction.id
                        });
                    } catch (dbError: any) {
                        logger.error('Failed to update credits in database', {
                            error: dbError.message,
                            stack: dbError.stack,
                            userId,
                            creditAmount: credits,
                            sessionId: session.id
                        });
                        // Always return 200 to Stripe to prevent retries
                        return res.status(200).json({ 
                            received: true, 
                            error: 'Database error - logged for manual review' 
                        });
                    }
                    break;

                default:
                    logger.info(`Unhandled webhook event type: ${event.type}`);
                    return res.status(200).json({ received: true, message: 'Event type not handled' });
            }

        } catch (err: any) {
            if (err.name === 'StripeSignatureVerificationError') {
                logger.error('Stripe signature verification failed', {
                    error: err.message,
                    header: req.headers['stripe-signature']
                });
                return res.status(400).send('Webhook signature verification failed');
            }
            
            logger.error('Webhook processing error', {
                error: err.message,
                stack: err.stack
            });
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }

}

const binding = new BindMethods(new StripeWebhookController());
export default binding.bindMethods();
