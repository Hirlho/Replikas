CREATE TABLE test (id int, name varchar(255));

CREATE TABLE utilisateur (
    u_id SERIAL PRIMARY KEY,
    u_login varchar(255) NOT NULL,
    u_password varchar(255) NOT NULL,
    u_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    u_entreprise BOOLEAN NOT NULL DEFAULT FALSE /* TRUE if entreprise account, FALSE if acheteur */
);

CREATE TABLE acheteur (
    u_id INTEGER REFERENCES utilisateur (u_id) ON DELETE CASCADE PRIMARY KEY,
    a_nom varchar(50) NOT NULL,
    a_prenom varchar(50) NOT NULL
);

CREATE TABLE session (
    u_id INTEGER REFERENCES acheteur (u_id),
    s_token varchar(64) NOT NULL,
    s_date_creation TIMESTAMP NOT NULL,
    s_date_expiration TIMESTAMP NOT NULL,
    PRIMARY KEY(u_id, s_token)
);

CREATE TABLE entreprise (
    u_id INTEGER REFERENCES utilisateur (u_id) ON DELETE CASCADE PRIMARY KEY,
    e_name varchar(50) NOT NULL
);

CREATE TABLE article (
    art_id SERIAL PRIMARY KEY,
    art_name varchar(128) NOT NULL,
    art_description varchar(2000) NOT NULL,
    art_prix_base INTEGER NOT NULL,
    art_encherissement_min INTEGER NOT NULL,
    art_debut_vente TIMESTAMP NOT NULL,
    art_fin_vente TIMESTAMP NOT NULL,
    e_id INTEGER REFERENCES entreprise (u_id),
    f_id INTEGER NOT NULL
);

CREATE TABLE article_image (
    art_id INTEGER REFERENCES article (art_id),
    img_path varchar(255) NOT NULL
);

CREATE TABLE encheri (
    a_id INTEGER REFERENCES acheteur (u_id),
    art_id INTEGER REFERENCES article (art_id),
    montant INTEGER NOT NULL,
    PRIMARY KEY(a_id, art_id)
);

CREATE TABLE interesse (
    a_id INTEGER REFERENCES acheteur (u_id),
    art_id INTEGER REFERENCES article (art_id),
    PRIMARY KEY(a_id, art_id)
);

CREATE TABLE acqueri (
    a_id INTEGER REFERENCES acheteur (u_id),
    art_id INTEGER REFERENCES article (art_id),
    est_paye BOOLEAN NOT NULL,
    PRIMARY KEY(a_id, art_id)
);


-- PERMISSONS
ALTER TABLE test OWNER TO replikas_usr;
ALTER TABLE utilisateur OWNER TO replikas_usr;
ALTER TABLE acheteur OWNER TO replikas_usr;
ALTER TABLE session OWNER TO replikas_usr;
ALTER TABLE entreprise OWNER TO replikas_usr;
ALTER TABLE article OWNER TO replikas_usr;
ALTER TABLE article_image OWNER TO replikas_usr;
ALTER TABLE encheri OWNER TO replikas_usr;
ALTER TABLE interesse OWNER TO replikas_usr;
ALTER TABLE acqueri OWNER TO replikas_usr;