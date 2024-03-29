CREATE DATABASE registros;
USE registros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) NOT NULL,
    icon_user BLOB,
    password VARCHAR(200) NOT NULL
);
SELECT * FROM usuarios; 

CREATE TABLE team(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuarios INT,
    titulo TEXT NOT NULL,
    content TEXT NOT NULL,
    team_icon BLOB,
    FOREIGN KEY (id_usuarios) REFERENCES usuarios (id)
);
SELECT * FROM team; 

CREATE TABLE teams(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_time INT,
    id_usuario INT,
    FOREIGN KEY (id_time) REFERENCES team (id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
SELECT * FROM teams; 

CREATE TABLE invitation(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_time INT,
    id_destinatário INT,
    id_remetente INT,			
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aceito INT DEFAULT 0,	
    FOREIGN KEY (id_time) REFERENCES teams (id),
    FOREIGN KEY (id_destinatário) REFERENCES usuarios (id),
    FOREIGN KEY (id_remetente) REFERENCES usuarios (id)
);
SELECT * FROM invitation; 

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

DELIMITER //
CREATE TRIGGER after_invite_update
AFTER UPDATE ON invitation
FOR EACH ROW
BEGIN
	IF NEW.aceito = 2 THEN
    DELETE FROM invitation WHERE id = NEW.id;
END IF;
END;
// DELIMITER ;

DROP TABLE docs;
DROP TABLE folder;
DROP TABLE team;
DROP TABLE docs;
DROP TABLE usuarios;

DROP DATABASE registros;
