alter table branches
add column location_id bigint references locations,
add column category varchar(255),
add column license_date date,
add column open_date date,
add column close_date date,
add column status varchar(255);