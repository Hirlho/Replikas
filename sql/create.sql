CREATE TABLE test (id int, name varchar(255));

CREATE TABLE acheteurs (
    a_id SERIAL PRIMARY KEY,
    a_mail varchar(255) UNIQUE NOT NULL,
    a_password varchar(255) NOT NULL,
    nom varchar(255) NOT NULL,
    prenom varchar(255) NOT NULL
);