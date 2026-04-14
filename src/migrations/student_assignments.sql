CREATE TABLE IF NOT EXISTS student_assignments (
	assignment_id UUID NOT NULL REFERENCES assignments(id) ON UPDATE CASCADE ON DELETE CASCADE,
	student_id UUID NOT NULL REFERENCES students(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted')),
	submitted_at TIMESTAMPTZ,
	is_late BOOLEAN NOT NULL DEFAULT false,
	attachment_key TEXT,
	PRIMARY KEY (assignment_id, student_id)
);
