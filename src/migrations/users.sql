CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	created_at TIMESTAMPTZ DEFAULT now(),
	full_name TEXT NOT NULL,
	user_name TEXT NOT NULL UNIQUE,
	email_id TEXT UNIQUE,
	phone_no TEXT,
	registered_at TIMESTAMPTZ,
	modified_at TIMESTAMPTZ DEFAULT now(),
	last_login TIMESTAMPTZ,
	base_role SMALLINT NOT NULL REFERENCES roles(id)
);
