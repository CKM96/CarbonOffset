CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES users(id)
);