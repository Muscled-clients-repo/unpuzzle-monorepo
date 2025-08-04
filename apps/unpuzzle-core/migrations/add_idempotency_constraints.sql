-- Add unique constraint to prevent duplicate enrollments
-- This ensures a user can only be enrolled once in a specific course
ALTER TABLE enrollments 
ADD CONSTRAINT unique_user_course_enrollment 
UNIQUE (user_id, course_id);

-- Add unique constraint on payment_id in orders table
-- This prevents duplicate order creation from webhook retries
ALTER TABLE orders 
ADD CONSTRAINT unique_payment_id 
UNIQUE (payment_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course 
ON enrollments(user_id, course_id);

CREATE INDEX IF NOT EXISTS idx_orders_payment_id 
ON orders(payment_id);

-- Optional: Add a webhook_events table to track processed events
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payload JSONB,
    status VARCHAR(50) DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id 
ON webhook_events(stripe_event_id);