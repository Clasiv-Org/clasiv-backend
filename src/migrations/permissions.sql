CREATE TABLE IF NOT EXISTS permissions (
	id SMALLSERIAL PRIMARY KEY,
	action TEXT NOT NULL CHECK (action IN ('manage', 'create', 'update', 'read', 'delete')),
	resource TEXT NOT NULL
);
