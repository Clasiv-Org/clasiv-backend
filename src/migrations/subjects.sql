CREATE TABLE IF NOT EXISTS subjects (
	code TEXT NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	course_id UUID NOT NULL REFERENCES courses(id),
	semester_id SMALLINT NOT NULL,
	FOREIGN KEY (semester_id, course_id) REFERENCES semesters(id, course_id)
);
