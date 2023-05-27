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
    id_usuario INT,
    titulo TEXT,
    codigosprojeto TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);

SELECT * FROM projetos WHERE  id_usuario = 1;



select * from projetos;
drop table projetos;
drop database registros;
