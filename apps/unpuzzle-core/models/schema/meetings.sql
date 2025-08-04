-- Extend users table for instructors
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_instructor BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- Instructor availability slots
CREATE TABLE IF NOT EXISTS instructor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting bookings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    meeting_link TEXT,
    notes TEXT,
    price_per_minute DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting sessions (for tracking actual time spent)
CREATE TABLE IF NOT EXISTS meeting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE instructor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructor_availability
CREATE POLICY "Users can view instructor availability" ON instructor_availability
    FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their availability" ON instructor_availability
    FOR ALL USING (auth.uid() = instructor_id);

-- RLS Policies for meetings
CREATE POLICY "Users can view their meetings" ON meetings
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = instructor_id);

CREATE POLICY "Students can create meetings" ON meetings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Instructors can update meeting status" ON meetings
    FOR UPDATE USING (auth.uid() = instructor_id);

-- RLS Policies for meeting_sessions
CREATE POLICY "Users can view their meeting sessions" ON meeting_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meetings 
            WHERE meetings.id = meeting_sessions.meeting_id 
            AND (meetings.student_id = auth.uid() OR meetings.instructor_id = auth.uid())
        )
    );

CREATE POLICY "Instructors can create session records" ON meeting_sessions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM meetings 
            WHERE meetings.id = meeting_sessions.meeting_id 
            AND meetings.instructor_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX idx_meetings_student_id ON meetings(student_id);
CREATE INDEX idx_meetings_instructor_id ON meetings(instructor_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meeting_sessions_meeting_id ON meeting_sessions(meeting_id);
CREATE INDEX idx_instructor_availability_instructor_id ON instructor_availability(instructor_id); 