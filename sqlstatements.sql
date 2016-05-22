CREATE database planner;

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    task varchar(500),
	complete boolean default false
);
