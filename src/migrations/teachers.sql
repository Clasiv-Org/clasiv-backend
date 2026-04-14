CREATE TABLE IF NOT EXISTS teachers (
	user_id UUID NOT NULL PRIMARY KEY REFERENCES users(id),
	teacher_abbrv TEXT NOT NULL,
	department_id UUID NOT NULL REFERENCES departments(id)
);
