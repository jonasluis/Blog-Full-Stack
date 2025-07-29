create table users(

    id BIGSERIAL PRIMARY KEY,
    username varchar(100) not null unique,
    password varchar(100) not null
)