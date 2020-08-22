-- Create tables

-- Account
create table account
(
	id serial not null,
	username text default ''::text not null,
	password text default ''::text not null
);

alter table account owner to cliff_user;

create unique index user_id_uindex
	on account (id);

create unique index account_username_uindex
	on account (username);

-- Track

create table track
(
	id serial not null
		constraint track_pk
			primary key,
	counter double precision not null,
	createdat timestamp with time zone default CURRENT_TIMESTAMP not null
);

alter table track owner to cliff_user;

create unique index track_id_uindex
	on track (id);

