CREATE DATABASE registros;
USE registros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) UNIQUE,
    email VARCHAR(45),
    icon_user blob,
    password VARCHAR(200)
);
SELECT * FROM usuarios; 

CREATE TABLE team(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuarios INT,
    titulo TEXT,
    team_icon blob,
    FOREIGN KEY (id_usuarios) REFERENCES usuarios (id)
);
SELECT * FROM team; 

CREATE TABLE project (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_teams INT,
    titulo TEXT,
    descricao TEXT,
    icon_project BLOB,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_teams) REFERENCES team (id)
);

CREATE TABLE folder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_project INT,
    id_usuario INT NOT NULL,
    titulo TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_project) REFERENCES project (id)
);
SELECT * FROM folder;

CREATE TABLE docs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_project INT,
    id_folder INT,
    collaboration TEXT,
    titulo TEXT,
    content TEXT,
    preview VARCHAR(8000),
	FOREIGN KEY	(id_project) REFERENCES project(id),
    FOREIGN KEY (id_folder)  REFERENCES folder(id)
);
SELECT * FROM docs;

DROP TABLE docs;
DROP TABLE folder;
DROP TABLE team;
DROP TABLE usuarios;

DELETE FROM docs WHERE id = 3 AND id_usuario = 1;

DROP DATABASE registros;