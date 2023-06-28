CREATE DATABASE registros;
USE registros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) UNIQUE,
    email VARCHAR(45),
    password VARCHAR(200)
);
SELECT * FROM usuarios; 

CREATE TABLE team (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuarios INT,
    titulo TEXT,
    FOREIGN KEY (id_usuarios) REFERENCES usuarios (id)
);
SELECT * FROM team; 

CREATE TABLE folder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_teams INT,
    titulo TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_teams) REFERENCES team (id)
);
SELECT * FROM folder;


CREATE TABLE projetos /*ANTIGA PROJETOS*/(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_folder INT ,
    titulo TEXT,
    content TEXT,
    preview VARCHAR(1000),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_folder) REFERENCES folder (id)
);
SELECT * FROM projetos; 

DROP TABLE projetos ;
DROP TABLE folder;
DROP TABLE team;
DROP TABLE usuarios;

DROP DATABASE registros;
