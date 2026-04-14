CREATE TABLE IF NOT EXISTS assignments (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	description TEXT,
	assigned_by UUID REFERENCES users(id),
	semester_id SMALLINT NOT NULL,
	course_id UUID NOT NULL REFERENCES courses(id),
	subject_code TEXT REFERENCES subjects(code),
	max_marks SMALLINT,
	attachment_url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	due_at TIMESTAMPTZ NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	FOREIGN KEY (semester_id, course_id) REFERENCES semesters(id, course_id)
);
