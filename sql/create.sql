CREATE TABLE test (id int, name varchar(255));

CREATE TABLE account (
    a_id SERIAL PRIMARY KEY,
    u_login varchar(255) NOT NULL,
    u_password varchar(255) NOT NULL,
    u_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    u_is_company BOOLEAN NOT NULL DEFAULT FALSE /* TRUE if company account, FALSE if acheteur */
);

CREATE TABLE buyer (
    a_id INTEGER REFERENCES account (a_id) ON DELETE CASCADE PRIMARY KEY,
    b_last_name varchar(50) NOT NULL,
    b_first_name varchar(50) NOT NULL
);

CREATE TABLE session (
    a_id INTEGER REFERENCES account (a_id),
    s_token varchar(64) NOT NULL,
    s_created_at TIMESTAMP NOT NULL,
    s_expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY(a_id, s_token)
);

CREATE TABLE company (
    a_id INTEGER REFERENCES account (a_id) ON DELETE CASCADE PRIMARY KEY,
    c_name varchar(50) NOT NULL
);

CREATE TABLE article (
    art_id SERIAL PRIMARY KEY,
    art_name varchar(128) NOT NULL,
    art_description varchar(2000) NOT NULL,
    art_floor_price INTEGER NOT NULL,
    art_min_bidding INTEGER NOT NULL,
    art_auction_start TIMESTAMP NOT NULL,
    art_auction_end TIMESTAMP NOT NULL,
    c_id INTEGER REFERENCES company (a_id),
    f_id INTEGER NOT NULL
);

CREATE TABLE article_image (
    art_id INTEGER REFERENCES article (art_id),
    img_path varchar(255) NOT NULL
);

CREATE TABLE bid (
    b_id INTEGER REFERENCES buyer (a_id),
    art_id INTEGER REFERENCES article (art_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY(b_id, art_id)
);

CREATE TABLE interests (
    b_id INTEGER REFERENCES buyer (a_id),
    art_id INTEGER REFERENCES article (art_id),
    PRIMARY KEY(b_id, art_id)
);

CREATE TABLE aquired (
    b_id INTEGER REFERENCES buyer (a_id),
    art_id INTEGER REFERENCES article (art_id),
    is_paid BOOLEAN NOT NULL,
    PRIMARY KEY(b_id, art_id)
);


-- PERMISSONS
ALTER TABLE test OWNER TO replikas_usr;
ALTER TABLE account OWNER TO replikas_usr;
ALTER TABLE buyer OWNER TO replikas_usr;
ALTER TABLE session OWNER TO replikas_usr;
ALTER TABLE company OWNER TO replikas_usr;
ALTER TABLE article OWNER TO replikas_usr;
ALTER TABLE article_image OWNER TO replikas_usr;
ALTER TABLE bid OWNER TO replikas_usr;
ALTER TABLE interests OWNER TO replikas_usr;
ALTER TABLE aquired OWNER TO replikas_usr;