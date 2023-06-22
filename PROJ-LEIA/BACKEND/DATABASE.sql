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
    content TEXT,
    preview VARCHAR(1000),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
select * from projetos;

drop database registros;
