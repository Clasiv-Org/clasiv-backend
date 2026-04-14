CREATE TABLE IF NOT EXISTS roles (
	id SMALLSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	scope TEXT NOT NULL CHECK (scope IN ('base', 'extension', 'both')),
);
