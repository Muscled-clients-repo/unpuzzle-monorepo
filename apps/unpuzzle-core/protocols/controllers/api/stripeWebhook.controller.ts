import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import {StripeService} from "../../../contexts/services/StripeServices"
import OrdersModel from "../../../models/supabase/orders.model"
import ProductModel from "../../../models/supabase/product.model";
import CreditTrackModel from "../../../models/supabase/creditTrack.model";
import CreditTransactionModel from "../../../models/supabase/creditTransaction.model";
import EnrollmentModel from "../../../models/supabase/enrollment.model";
import CourseModel from "../../../models/supabase/course.model";
import { logger } from "../../../utils/logger";


class StripeWebhookController extends StripeService{
    private stripeWebhookSecret: string
    constructor() {
        super()
        this.stripeWebhookSecret=process.env.STRIPE_WEBHOOK_SECRET as string
    }

    // Single webhook handler for all Stripe events
    webhookHandler = async(req: any, res: Response, next: NextFunction) => {
        let event;

        try {
            // Verify webhook signature
            const sig = req.headers['stripe-signature'];
            
            if (!sig) {
                logger.error('Missing stripe-signature header');
                return res.status(400).send('Missing stripe-signature header');
            }

            // Debug logging
            logger.info('Stripe webhook received', {
                hasBody: !!req.body,
                bodyType: typeof req.body,
                isBuffer: Buffer.isBuffer(req.body),
                bodyLength: req.body?.length || JSON.stringify(req.body).length,
                signature: sig?.substring(0, 20) + '...',
                webhookSecret: this.stripeWebhookSecret?.substring(0, 10) + '...'
            });

            event = this.stripe.webhooks.constructEvent(
                req.body, 
                sig, 
                this.stripeWebhookSecret
            );

            logger.info(`Stripe webhook event: ${event.type}`, { eventId: event.id });

            // Handle different event types
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as any;
                    const piMetadata = paymentIntent.metadata || {};
                    
                    if (piMetadata.type === 'course_purchase') {
                        return await this.handleCoursePurchase({
                            ...paymentIntent,
                            metadata: piMetadata,
                            amount_total: paymentIntent.amount,
                            customer_email: paymentIntent.receipt_email,
                            payment_status: 'paid'
                        }, res);
                    } else if (piMetadata.type === 'credit_purchase') {
                        return await this.handleCreditPurchase({
                            ...paymentIntent,
                            metadata: piMetadata,
                            amount_total: paymentIntent.amount,
                            customer_email: paymentIntent.receipt_email,
                            payment_status: 'paid'
                        }, res);
                    }
                    break;
                    
                case 'checkout.session.completed':
                    const session = event.data.object as any;
                    const { type, userId, creditAmount, courseId } = session.metadata || {};
                    
                    // Log full session details for debugging
                    logger.info('Processing checkout session', {
                        sessionId: session.id,
                        metadata: session.metadata,
                        lineItems: session.line_items?.data?.[0]?.description,
                        customerEmail: session.customer_email,
                        amountTotal: session.amount_total
                    });
                    
                    // Route to appropriate handler based on purchase type
                    if (type === 'credit_purchase') {
                        return await this.handleCreditPurchase(session, res);
                    } else if (type === 'course_purchase') {
                        return await this.handleCoursePurchase(session, res);
                    } else {
                        // Fallback: Try to determine type from metadata or line items
                        if (creditAmount && userId) {
                            logger.info('Detected credit purchase from metadata (legacy format)', {
                                sessionId: session.id,
                                userId,
                                creditAmount
                            });
                            return await this.handleCreditPurchase(session, res);
                        } else if (courseId && userId) {
                            logger.info('Detected course purchase from metadata (legacy format)', {
                                sessionId: session.id,
                                userId,
                                courseId
                            });
                            return await this.handleCoursePurchase(session, res);
                        } else {
                            logger.warn('Cannot determine purchase type - missing metadata', {
                                sessionId: session.id,
                                metadata: session.metadata,
                                customerEmail: session.customer_email
                            });
                            return res.status(200).json({ 
                                received: true, 
                                message: 'Cannot determine purchase type - please check checkout session creation',
                                sessionId: session.id
                            });
                        }
                    }
                    
                default:
                    logger.info(`Unhandled webhook event type: ${event.type}`);
                    return res.status(200).json({ 
                        received: true, 
                        message: 'Event type not handled' 
                    });
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

    // Helper method to handle credit purchases
    private async handleCreditPurchase(session: any, res: Response) {
        const { userId, creditAmount } = session.metadata || {};
        
        if (!userId || !creditAmount) {
            logger.error('Missing required metadata in credit purchase session', {
                sessionId: session.id,
                metadata: session.metadata
            });
            return res.status(200).json({ received: true, error: 'Missing metadata' });
        }

        const credits = parseInt(creditAmount, 10);
        
        if (isNaN(credits) || credits <= 0) {
            logger.error('Invalid credit amount', {
                sessionId: session.id,
                creditAmount,
                credits
            });
            return res.status(200).json({ received: true, error: 'Invalid credit amount' });
        }

        try {
            // Check for idempotency
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

            const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

            // Update credits
            const updatedCredits = await CreditTrackModel.incrementCredits(userId, credits);
            
            // Record transaction
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
            return res.status(200).json({ 
                received: true, 
                error: 'Database error - logged for manual review' 
            });
        }
    }

    // Helper method to handle course purchases
    private async handleCoursePurchase(session: any, res: Response) {
        const { userId, courseId } = session.metadata || {};
        
        if (!userId || !courseId) {
            logger.error('Missing required metadata in course purchase session', {
                sessionId: session.id,
                metadata: session.metadata
            });
            return res.status(200).json({ received: true, error: 'Missing metadata' });
        }

        try {
            // Check if already enrolled
            const existingEnrollment = await EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
            
            if (existingEnrollment) {
                logger.info(`User ${userId} already enrolled in course ${courseId}`, {
                    sessionId: session.id,
                    enrollmentId: existingEnrollment.id
                });
                return res.status(200).json({ 
                    received: true,
                    message: 'User already enrolled',
                    enrollmentId: existingEnrollment.id
                });
            }

            // Get course details
            const course = await CourseModel.getCourseById(courseId);
            if (!course) {
                logger.error('Course not found for enrollment', {
                    courseId,
                    sessionId: session.id
                });
                return res.status(200).json({ 
                    received: true, 
                    error: 'Course not found' 
                });
            }

            const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

            // Create enrollment
            const enrollment = await EnrollmentModel.createEnrollment({
                user_id: userId,
                course_id: courseId
            } as any);
            
            // Create order record
            const order = await OrdersModel.createOrder({
                user_id: userId,
                product_id: courseId,
                product_type: 'course',
                amount: amountPaid,
                currency: session.currency || 'usd',
                status: 'completed',
                stripe_session_id: session.id,
                metadata: {
                    courseTitle: course.title,
                    customerEmail: session.customer_email,
                    paymentStatus: session.payment_status
                }
            } as any);
            
            logger.info('Course enrollment created successfully', {
                userId,
                courseId,
                courseTitle: course.title,
                amountPaid,
                sessionId: session.id,
                enrollmentId: enrollment.id,
                orderId: order?.id
            });

            return res.status(200).json({ 
                received: true,
                message: 'Course enrollment created successfully',
                enrollmentId: enrollment.id
            });
        } catch (dbError: any) {
            logger.error('Failed to create course enrollment', {
                error: dbError.message,
                stack: dbError.stack,
                userId,
                courseId,
                sessionId: session.id
            });
            return res.status(200).json({ 
                received: true, 
                error: 'Database error - logged for manual review' 
            });
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

            // Debug logging
            logger.info('Credit webhook received', {
                hasBody: !!req.body,
                bodyType: typeof req.body,
                isBuffer: Buffer.isBuffer(req.body),
                bodyLength: req.body?.length || JSON.stringify(req.body).length,
                signature: sig?.substring(0, 20) + '...',
                webhookSecret: this.stripeWebhookSecret?.substring(0, 10) + '...'
            });

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

    handleCreateCoursePaymentIntent = async(req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler(res, next);
        
        try {
            const { courseId } = req.body;
            const userId = (req as any).user?.id;
            
            // Validate required fields
            if (!userId) {
                throw new Error('User not authenticated');
            }
            if (!courseId) {
                throw new Error('Missing required field: courseId');
            }
            
            // Get course details
            const course = await CourseModel.getCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Check if user is already enrolled
            const existingEnrollment = await EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
            if (existingEnrollment) {
                throw new Error('User is already enrolled in this course');
            }
            
            // Convert price to cents
            const priceInCents = Math.round(course.price * 100);
            
            // Create payment intent
            const paymentIntent = await this.createCoursePaymentIntent({
                userId,
                courseId,
                courseTitle: course.title,
                priceInCents
            });
            
            logger.info('Course payment intent created successfully', {
                paymentIntentId: paymentIntent.id,
                userId,
                courseId,
                courseTitle: course.title,
                priceInCents
            });
            
            responseHandler.success({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: priceInCents,
                courseTitle: course.title
            });
            
        } catch (error: any) {
            logger.error('Failed to create course payment intent', {
                error: error.message,
                body: req.body
            });
            responseHandler.error(error);
        }
    }

    handleCreateCourseCheckoutSession = async(req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler(res, next);
        
        try {
            const { userId, courseId, successUrl, cancelUrl } = req.body;
            
            // Validate required fields
            if (!userId || !courseId || !successUrl || !cancelUrl) {
                throw new Error('Missing required fields: userId, courseId, successUrl, cancelUrl');
            }
            
            // Get course details
            const course = await CourseModel.getCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Check if user is already enrolled
            const existingEnrollment = await EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
            if (existingEnrollment) {
                throw new Error('User is already enrolled in this course');
            }
            
            // Convert price to cents
            const priceInCents = Math.round(course.price * 100);
            
            // Create checkout session using the parent StripeService method
            const session = await this.createCourseCheckoutSession({
                userId,
                courseId,
                courseTitle: course.title,
                priceInCents,
                successUrl,
                cancelUrl
            });
            
            logger.info('Course checkout session created successfully', {
                sessionId: session.id,
                userId,
                courseId,
                courseTitle: course.title,
                priceInCents,
                hasClientSecret: !!session.client_secret
            });
            
            responseHandler.success({
                sessionId: session.id,
                clientSecret: session.client_secret,  // For embedded checkout
                checkoutUrl: session.url,
                sessionUrl: session.url
            });
            
        } catch (error: any) {
            logger.error('Failed to create course checkout session', {
                error: error.message,
                body: req.body
            });
            responseHandler.error(error);
        }
    }

    courseWebhook = async(req: any, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler(res, next);
        let event;

        try {
            // Verify webhook signature
            const sig = req.headers['stripe-signature'];
            
            if (!sig) {
                logger.error('Missing stripe-signature header');
                return res.status(400).send('Missing stripe-signature header');
            }

            // Debug logging
            logger.info('Webhook received', {
                hasBody: !!req.body,
                bodyType: typeof req.body,
                isBuffer: Buffer.isBuffer(req.body),
                bodyLength: req.body?.length || JSON.stringify(req.body).length,
                signature: sig?.substring(0, 20) + '...',
                webhookSecret: this.stripeWebhookSecret?.substring(0, 10) + '...'
            });

            event = this.stripe.webhooks.constructEvent(
                req.body, 
                sig, 
                this.stripeWebhookSecret
            );

            logger.info(`Stripe course webhook received: ${event.type}`, { eventId: event.id });

            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as any; // Checkout Session object
                    
                    // Extract metadata
                    const { userId, courseId, type } = session.metadata || {};
                    
                    // Only process course purchases
                    if (type !== 'course_purchase') {
                        logger.info('Non-course purchase session, skipping', {
                            sessionId: session.id,
                            type
                        });
                        return res.status(200).json({ received: true, message: 'Not a course purchase' });
                    }
                    
                    if (!userId || !courseId) {
                        logger.error('Missing required metadata in course checkout session', {
                            sessionId: session.id,
                            metadata: session.metadata
                        });
                        return res.status(200).json({ received: true, error: 'Missing metadata' });
                    }

                    try {
                        // Check if user is already enrolled (idempotency)
                        const existingEnrollment = await EnrollmentModel.getEnrollmentByUserAndCourse(userId, courseId);
                        
                        if (existingEnrollment) {
                            logger.info(`User ${userId} already enrolled in course ${courseId}`, {
                                sessionId: session.id,
                                enrollmentId: existingEnrollment.id
                            });
                            return res.status(200).json({ 
                                received: true,
                                message: 'User already enrolled',
                                enrollmentId: existingEnrollment.id
                            });
                        }

                        // Get course details
                        const course = await CourseModel.getCourseById(courseId);
                        if (!course) {
                            logger.error('Course not found for enrollment', {
                                courseId,
                                sessionId: session.id
                            });
                            return res.status(200).json({ 
                                received: true, 
                                error: 'Course not found' 
                            });
                        }

                        // Calculate amount paid in dollars
                        const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

                        // Create enrollment
                        const enrollment = await EnrollmentModel.createEnrollment({
                            user_id: userId,
                            course_id: courseId
                        } as any);
                        
                        // Create order record for payment tracking
                        const order = await OrdersModel.createOrder({
                            user_id: userId,
                            product_id: courseId,
                            product_type: 'course',
                            amount: amountPaid,
                            currency: session.currency || 'usd',
                            status: 'completed',
                            stripe_session_id: session.id,
                            metadata: {
                                courseTitle: course.title,
                                customerEmail: session.customer_email,
                                paymentStatus: session.payment_status
                            }
                        } as any);
                        
                        logger.info('Course enrollment created successfully', {
                            userId,
                            courseId,
                            courseTitle: course.title,
                            amountPaid,
                            sessionId: session.id,
                            enrollmentId: enrollment.id,
                            orderId: order?.id
                        });

                        return res.status(200).json({ 
                            received: true,
                            message: 'Course enrollment created successfully',
                            enrollmentId: enrollment.id
                        });
                    } catch (dbError: any) {
                        logger.error('Failed to create course enrollment', {
                            error: dbError.message,
                            stack: dbError.stack,
                            userId,
                            courseId,
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
                    logger.info(`Unhandled course webhook event type: ${event.type}`);
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
            
            logger.error('Course webhook processing error', {
                error: err.message,
                stack: err.stack
            });
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }

}

const binding = new BindMethods(new StripeWebhookController());
export default binding.bindMethods();
