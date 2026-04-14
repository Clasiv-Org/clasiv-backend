CREATE TABLE IF NOT EXISTS role_extended_users (
	user_id UUID NOT NULL REFERENCES users(id),
	role_id SMALLINT NOT NULL REFERENCES roles(id),
	PRIMARY KEY (user_id, role_id)
);
