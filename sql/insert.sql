INSERT INTO account (a_id, a_login, a_password) VALUES (14, 'gaspard@replikas.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
INSERT INTO buyer (a_id, b_last_name, b_first_name) VALUES (14, 'Culis', 'Gaspard');

INSERT INTO account (a_id, a_login, a_password) VALUES (1, 'gaspard@jaajcorp.org', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
INSERT INTO company VALUES (1, 'jaajCorp');

INSERT INTO article (art_name, art_description, art_price, art_min_bidding, art_auction_start, art_auction_end, c_id, f_id)
VALUES
('Sabre laser', 'Le sable laser utilisé par dark vador Star Wars épisode 4', 1000, 100, '2023-01-01 00:00:00', '2023-02-01 00:00:00', 1, 1),
('Epee de Legolas', 'L épée utilisée par Legolas dans le Seigneur des Anneaux', 1500, 200, '2022-05-01 00:00:00', '2022-06-01 00:00:00', 1, 2),
('Fleur de Lotus', 'La fleur utilisée par Neo dans Matrix', 200, 50, '2022-07-01 00:00:00', '2022-08-01 00:00:00', 1, 3),
('Kylo Ren saber', 'Le sabre laser utilisé par Kylo Ren dans Star Wars épisode 7', 1000, 100, '2022-09-01 00:00:00', '2022-10-01 00:00:00', 1, 4),
('La coupe de Vif-Argent', 'La coupe utilisée par Harry Potter dans le tournoi des 3 sorciers', 1500, 200, '2022-11-01 00:00:00', '2022-12-01 00:00:00', 1, 5),
('L arme de Captain America', 'Le bouclier utilisé par Captain America dans les Avengers', 2000, 250, '2023-01-01 00:00:00', '2023-02-01 00:00:00', 1, 6),
('L épée de l Archange', 'L épée utilisée par Michael dans la série Supernatural', 1000, 100, '2023-03-01 00:00:00', '2023-04-01 00:00:00', 1, 7),
('La lance de Thor', 'La lance utilisée par Thor dans les Avengers', 1500, 200, '2023-05-01 00:00:00', '2023-06-01 00:00:00', 1, 8),
('La pierre du coeur', 'La pierre utilisée par Doctor Strange dans les Avengers', 2500, 300, '2023-07-01 00:00:00', '2023-08-01 00:00:00', 1, 9),
('Les lunettes de Neo', 'Les lunettes utilisées par Neo dans Matrix', 150, 50, '2023-09-01 00:00:00', '2023-10-01 00:00:00', 1, 10),
('La moto de Tron', 'La moto utilisée par Tron dans le film Tron', 5000, 1000, '2023-11-01 00:00:00', '2023-12-01 00:00:00', 1, 11),
('La réplique de la DeLorean', 'La réplique de la DeLorean utilisée dans Retour vers le futur', 10000, 2000, '2024-01-01 00:00:00', '2024-02-01 00:00:00', 1, 12),
('Le pistolet de James Bond', 'Le pistolet utilisé par James Bond dans les films de James Bond', 1000, 100, '2024-03-01 00:00:00', '2024-04-01 00:00:00', 1, 13),
('Le sabre laser de Darth Maul', 'Le sabre laser utilisé par Darth Maul dans Star Wars épisode 1', 1000, 100, '2024-05-01 00:00:00', '2024-06-01 00:00:00', 1, 14),
('Le sabre laser de Darth Vader', 'Le sabre laser utilisé par Darth Vader dans Star Wars épisode 4', 1000, 100, '2024-07-01 00:00:00', '2024-08-01 00:00:00', 1, 15),
('Le sabre laser de Mace Windu', 'Le sabre laser utilisé par Mace Windu dans Star Wars épisode 3', 1000, 100, '2024-09-01 00:00:00', '2024-10-01 00:00:00', 1, 16),
('Le sabre laser de Obi-Wan Kenobi', 'Le sabre laser utilisé par Obi-Wan Kenobi dans Star Wars épisode 4', 1000, 100, '2024-11-01 00:00:00', '2024-12-01 00:00:00', 1, 17),
('Le sabre laser de Yoda', 'Le sabre laser utilisé par Yoda dans Star Wars épisode 4', 1000, 100, '2025-01-01 00:00:00', '2025-02-01 00:00:00', 1, 18),
('Le sabre laser de Luke Skywalker', 'Le sabre laser utilisé par Luke Skywalker dans Star Wars épisode 4', 1000, 100, '2025-03-01 00:00:00', '2025-04-01 00:00:00', 1, 17),
('Armes de Kill Bill', 'Les armes utilisées par Uma Thurman dans Kill Bill', 500, 20, '2022-04-01 00:00:00', '2022-05-01 00:00:00', 1, 4),
('Casque de Iron Man', 'Le casque utilisé par Tony Stark dans Iron Man', 3000, 250, '2022-03-01 00:00:00', '2022-04-01 00:00:00', 1, 5),
('Costume de Spider-Man', 'Le costume utilisé par Tobey Maguire dans Spider-Man', 1500, 100, '2022-02-01 00:00:00', '2022-03-01 00:00:00', 1, 6),
('Manteau de Blade Runner', 'Le manteau utilisé par Harrison Ford dans Blade Runner', 1000, 50, '2022-01-01 00:00:00', '2022-02-01 00:00:00', 1, 7),
('Lance de Conan', 'La lance utilisée par Arnold Schwarzenegger dans Conan', 900, 40, '2021-12-01 00:00:00', '2021-01-01 00:00:00', 1, 8),
('Epee de 300', 'L épée utilisée par Gerard Butler dans 300', 800, 30, '2021-11-01 00:00:00', '2021-12-01 00:00:00', 1, 9),
('Hache de Thor', 'La hache utilisée par Chris Hemsworth dans Thor', 700, 20, '2021-10-01 00:00:00', '2021-11-01 00:00:00', 1, 10),
('Armes de John Wick', 'Les armes utilisées par Keanu Reeves dans John Wick', 600, 10, '2021-09-01 00:00:00', '2021-10-01 00:00:00', 1, 11),
('Costume de Superman', 'Le costume utilisé par Christopher Reeve dans Superman', 5000, 400, '2021-08-01 00:00:00', '2021-09-01 00:00:00', 1, 12),
('Manteau de Matrix', 'Le manteau utilisé par Keanu Reeves dans Matrix', 4000, 300, '2021-07-01 00:00:00', '2021-08-01 00:00:00', 1, 13),
('Couteau de combat', 'Le couteau utilisé par John Rambo dans Rambo', 500, 50, '2022-09-01 00:00:00', '2022-09-30 00:00:00', 1, 2),
('Costume Spider-Man', 'Le costume complet porté par Tobey Maguire dans Spider-Man', 2000, 200, '2022-10-01 00:00:00', '2022-11-01 00:00:00', 1, 3),
('Arme de Predator', 'L arme utilisée par le Predator dans Predator', 2500, 250, '2022-11-01 00:00:00', '2022-12-01 00:00:00', 1, 4),
('Masque de Jason', 'Le masque porté par Jason Voorhees dans Vendredi 13', 800, 80, '2023-01-01 00:00:00', '2023-02-01 00:00:00', 1, 5),
('Gantelets Iron Man', 'Les gantelets portés par Robert Downey Jr. dans Iron Man', 3500, 350, '2022-11-01 00:00:00', '2022-12-01 00:00:00', 1, 7),
('Chapeau de Indiana Jones', 'Le chapeau porté par Harrison Ford dans Indiana Jones', 1000, 100, '2022-11-01 00:00:00', '2022-12-01 00:00:00', 1, 9),
('Sabre de Luke Skywalker', 'Le sabre laser utilisé par Mark Hamill dans Star Wars épisode IV', 2000, 200, '2023-01-01 00:00:00', '2023-02-01 00:00:00', 1, 10),
('Arme de RoboCop', 'L arme utilisée par RoboCop dans RoboCop', 1500, 150, '2022-09-01 00:00:00', '2022-10-01 00:00:00', 1, 11),
('Lunettes de Neo', 'Les lunettes portées par Keanu Reeves dans Matrix', 800, 80, '2022-11-01 00:00:00', '2022-12-01 00:00:00', 1, 12),
('Casque de Darth Vader', 'Le casque porté par David Prowse dans Star Wars épisode IV', 4000, 400, '2022-09-01 00:00:00', '2022-10-01 00:00:00', 1, 12);