CREATE TABLE IF NOT EXISTS courses (
	id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL UNIQUE,
	abbrv TEXT NOT NULL UNIQUE,
	department_id UUID NOT NULL REFERENCES departments(id),
	hod_id UUID REFERENCES users(id)
);
