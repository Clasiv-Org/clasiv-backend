CREATE TABLE IF NOT EXISTS assignment_upload_logs (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	assignment_id UUID NOT NULL REFERENCES assignments(id) ON UPDATE CASCADE ON DELETE CASCADE,
	student_id UUID NOT NULL REFERENCES students(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
	attachment_key TEXT NOT NULL,
	uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
	file_size BIGINT,
	etag TEXT
);
