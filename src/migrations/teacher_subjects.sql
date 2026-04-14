CREATE TABLE IF NOT EXISTS teacher_subjects (
	subject_code TEXT NOT NULL REFERENCES subjects(code),
	teacher_id UUID NOT NULL REFERENCES teachers(user_id),
	PRIMARY KEY (subject_code, teacher_id)
);
