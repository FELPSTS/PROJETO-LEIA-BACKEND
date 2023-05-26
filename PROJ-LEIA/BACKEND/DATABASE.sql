create database registros;
use registros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) UNIQUE,
    email VARCHAR(45),
    password VARCHAR(200)
);

select * from usuarios;

CREATE TABLE projetos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45),
    titulo TEXT,
    codigosprojeto VARCHAR(1100),
    FOREIGN KEY (username) REFERENCES usuarios (username)
);

select * from projetos;

drop table projetos;
drop database registros;
