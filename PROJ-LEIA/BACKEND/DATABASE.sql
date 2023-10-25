CREATE DATABASE registros;
USE registros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) NOT NULL,
    icon_user BLOB,
    password VARCHAR(200) NOT NULL
    Verified BOOLEAN DEFAULT FALSE,	
);
SELECT * FROM usuarios; 

/*
CREATE TABLE admins(
	id INT PRIMARY KEY AUTO_INCREMENT,
	userid INT,
	FOREIGN KEY (userid) REFERENCES usuarios (id)
);
SELECT * FROM admins;
*/

CREATE TABLE team(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuarios INT,
    titulo TEXT NOT NULL,
    team_icon BLOB,
    FOREIGN KEY (id_usuarios) REFERENCES usuarios (id)
);
SELECT * FROM team; 

CREATE TABLE teams_usuario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_time INT,
    id_usuario INT,
    FOREIGN KEY (id_time) REFERENCES team (id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
SELECT * FROM teams_usuario;
insert into teams_usuario (id_time, id_usuario) values (1,3);

CREATE TABLE project (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_teams INT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    icon_project BLOB,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_teams) REFERENCES team (id)
);
SELECT * FROM project;

CREATE TABLE folder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_project INT,
    id_usuario INT NOT NULL,
    titulo TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_project) REFERENCES project (id)
);
SELECT * FROM folder;

CREATE TABLE docs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_project INT,
    id_folder INT,
    collaboration TEXT,
    titulo TEXT NOT NULL ,
    content TEXT NOT NULL,
    preview VARCHAR(8000),
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY	(id_project) REFERENCES project(id),
    FOREIGN KEY (id_folder)  REFERENCES folder(id)
);
SELECT * FROM docs;

CREATE TABLE invites(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_time INT,
    id_destinatario INT,
    id_remetente INT,			
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aceito BOOLEAN DEFAULT FALSE,	
    FOREIGN KEY (id_time) REFERENCES team (id),
    FOREIGN KEY (id_destinatario) REFERENCES usuarios (id),
    FOREIGN KEY (id_remetente) REFERENCES usuarios (id)
);
SELECT * FROM invites; 

drop table invites;
DROP TABLE docs;
DROP TABLE folder;
DROP TABLE team;
DROP TABLE teams_usuario;
DROP TABLE docs;
DROP TABLE usuarios;
/* DROP TABLE admins; */

DROP DATABASE registros;
