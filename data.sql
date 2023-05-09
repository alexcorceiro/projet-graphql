CREATE TABLE eleves (
 id INT PRIMARY KEY AUTO_INCREMENT	, 
 nom VARCHAR(150) NOT NULL, 
 prenom VARCHAR(150) NOT NULL,
 email VARCHAR(150) NOT NULL, 
 promotion VARCHAR(150) NOT NULL
);

CREATE TABLE matieres (
id INT PRIMARY KEY AUTO_INCREMENT, 
nom VARCHAR(150) NOT NULL,
description VARCHAR(150)
);

CREATE TABLE profs (
id INT PRIMARY KEY AUTO_INCREMENT, 
nom VARCHAR(150) NOT NULL, 
prenom VARCHAR(150) NOT NULL, 
email VARCHAR(150) NOT NULL,
matiere_id INT NOT NULL,
FOREIGN KEY (matiere_id) REFERENCES matireres(id)
);

CREATE TABLE salles (
 id INT PRIMARY KEY AUTO_INCREMENT, 
 nom VARCHAR(100) NOT NULL, 
 batiment VARCHAR(100) NOT NULL
 );

CREATE TABLE horaires (
 id INT PRIMARY KEY AUTO_INCREMENT,
 debut VARCHAR(100) NOT NULL,
 fin VARCHAR(100) NOT NULL
);

CREATE TABLE plannings(
id INT PRIMARY KEY AUTO_INCREMENT, 
date VARCHAR(100) NOT NULL, 
salle_id INT NOT NULL, 
cours_id INT NOT NULL,
eleve_id INT NOT NULL,
FOREIGN KEY (salle_id) REFERENCES salles (id),
FOREIGN KEY (cours_id) REFERENCES cours (id),
FOREIGN KEY (eleve_id) REFERENCES eleve (id)
);

CREATE TABLE cours (
id INT PRIMARY KEY AUTO_INCREMENT,
prof_id INT NOT NULL,
matiere_id INT NOT NULL, 
horaire_id INT NOT NULL, 
FOREIGN KEY (prof_id) REFERENCES profs (id), 
FOREIGN KEY (matiere_id) REFERENCES matieres (id),
FOREIGN KEY (horaire_id) REFERENCES horaires (id)
);

CREATE TABLE notes (
id INT PRIMARY KEY AUTO_INCREMENT,
eleve_id INT NOT NULL,
matiere_id INT NOT NULL,
prof_id INT NOT NULL,
note FLOAT NOT NULL, 
FOREIGN KEY (eleve_id) REFERENCES eleves (id), 
FOREIGN KEY (matiere_id) REFERENCES matires (id),
FOREIGN KEY (prof_id) REFERENCES profs (id)
);

INSERT INTO eleves (nom, prenom, email, promotion)
VALUES ('Dupont', 'Pierre', 'pierre.dupont@hotmail.com', 'Mastere 1'),
       ('Martin', 'Paul', 'paul.martin@hotmail.com', 'Bachelor 2'),
       ('Durand', 'Sophie', 'sophie.durand@hotmail.com', 'Bachelor 3'),
       ('Leroy', 'Marie', 'marie.leroy@hotmail.com', 'Mastère 2');

INSERT INTO matieres (nom, description)
VALUES ('graphql', 'Apprendre les bases de la programmation en sql'),
       ('Node js ', 'Apprendre la progammation backend en js '),
       ('Base de données', 'Apprendre à concevoir et gérer des bases de données'),
       ('IA', 'Découvrir les concepts de l''intelligence artificielle et du machine learning');

INSERT INTO profs (nom, prenom, email, matiere_id)
VALUES ('Bissor','Melvin',  'melvin.bissor@gmail.com', 1),
       ( 'Corceiro','Alex', 'alex.corceirod@gmail.com', 2),
       ('Gedussor ', 'Tom', 'tom.gedussor@gmail.com', 3),
       ('Spector', 'Marc', 'marc.spector@gmail.com', 4);

INSERT INTO salles (nom, batiment)
VALUES ('A101', 'Bâtiment A'),
       ('A102', 'Bâtiment A'),
       ('B201', 'Bâtiment B'),
       ('B202', 'Bâtiment B');

INSERT INTO horaires (debut, fin)
VALUES ('08:00', '10:00'),
       ('10:15', '12:15'),
       ('13:30', '15:30'),
       ('15:45', '17:45');

INSERT INTO cours (prof_id, matiere_id, horaire_id)
VALUES (1, 1, 1),
       (2, 2, 2),
       (3, 3, 3),
       (4, 4, 4);

INSERT INTO plannings (date, salle_id, cours_id, eleve_id)
VALUES ('2023-02-11', 1, 1, 1),
       ('2023-05-21', 2, 2, 2),
       ('2023-07-01', 3, 3, 3),
       ('2023-08-01', 4, 4, 4);

INSERT INTO notes (eleve_id, matiere_id, prof_id, note)
VALUES (1, 1, 1, 15.5),
       (2, 2, 2, 16.0),
       (3, 3, 3, 14.0),
       (4, 4, 4, 17.5);