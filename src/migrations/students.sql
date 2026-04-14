CREATE TABLE IF NOT EXISTS students (
	user_id UUID NOT NULL PRIMARY KEY REFERENCES users(id),
	roll_no TEXT NOT NULL UNIQUE,
	reg_no TEXT NOT NULL UNIQUE,
	dob DATE,
	semester_id SMALLINT NOT NULL,
	course_id UUID NOT NULL REFERENCES courses(id),
	FOREIGN KEY (semester_id, course_id) REFERENCES semesters(id, course_id)
);
