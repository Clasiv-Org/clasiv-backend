CREATE TABLE IF NOT EXISTS otp_sessions (
	id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id),
	email_id TEXT NOT NULL,
	purpose TEXT NOT NULL,
	otp_hash TEXT NOT NULL,
	status TEXT CHECK (status IN ('pending', 'used', 'expired')) DEFAULT 'pending',
	otp_attempts SMALLINT DEFAULT 0,
	max_otp_attempts SMALLINT DEFAULT 5,
	resend_count SMALLINT DEFAULT 0,
	max_resend SMALLINT DEFAULT 3,
	change_email_count SMALLINT DEFAULT 0,
	max_email_change SMALLINT DEFAULT 3,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now(),
	expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '3 minutes'),
	ip INET,
	user_agent TEXT
);
