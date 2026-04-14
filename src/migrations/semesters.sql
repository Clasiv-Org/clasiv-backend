CREATE TABLE IF NOT EXISTS semesters (
	id SMALLINT NOT NULL,
	course_id UUID NOT NULL REFERENCES courses(id),
	PRIMARY KEY (id, course_id)
);
