CREATE TABLE IF NOT EXISTS role_permissions (
	role_id SMALLINT NOT NULL REFERENCES roles(id),
	permission_id SMALLINT NOT NULL REFERENCES permissions(id),
	PRIMARY KEY (role_id, permission_id)
);
