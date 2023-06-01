const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "registros",
});
/*--------------------------CONNECT BD----------------*/

/*--------------------------REGISTER----------------*/
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.status(141).send(err); // Retorna status 500 em caso de erro
      return;
    }
    if (result.length == 0) {
      db.query(
        "INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        (err, result) => {
          if (err) {
            res.status(141).send(err);
            return;
          }

          res.send({ msg: "Cadastrado com êxito" });
        }
      );
    } else {
      res.status(141).send({ msg: "Usuário já está cadastrado" });
    }
  });
});

/*--------------------------REGISTER----------------*/

/*--------------------------LOGIN----------------*/
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length > 0) {
        const user = result[0];
        const userid = user.id;
        res.send({ /*msg: "Usuário logado com sucesso",*/ userId: userid });
      } else {
        res.status(401).send({ msg: "Email ou senha incorretos" });
      }
    }
  );
});

/*--------------------------LOGIN----------------*/

/*--------------------------USUARIO----------------*/
app.get("/usuarios/:id", (req, res) => {
  const userid = req.params.userid;

  db.query("SELECT * FROM usuarios WHERE id = ?", [userid], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (result.length == 0) {
      res.status(404).send("Usuário não encontrado");
      return;
    }

    const usuario = result[0];
    res.send(usuario);
  });
});

/*--------------------------USURAIO----------------*/

/*--------------------------PROJETOS----------------*/
app.post("/savedocs", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;
  const codigosprojeto = req.body.content;

  db.query(
    "SELECT * FROM projetos WHERE titulo = ? and id_usuario = ?",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        res.send({ msg: "ERRO DE PUSH AO BD" });
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO projetos (id_usuario, titulo, codigosprojeto) VALUES (?, ?, ?)",
          [userId, titulo, codigosprojeto],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              res.send({ msg: "ERRO DE LIGAMENTO AO BD" });
              return;
            }

            res.send({ msg: "Cadastrado com êxito" });
          }
        );
      } else {
        res.status(400).send({ msg: "Projeto já está cadastrado" });
      }
    }
  );
});

/*--------------------------PROJETOS----------------*/

/*---------------------------FORGOT----------------------*/

/*---------------------------FORGOT----------------------*/

/*---------------------------SEARCH----------------------*/
/*app.post("/search", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;


  db.query(
    "SELECT * FROM projetos WHERE titulo like ? and userid = ?",
    [titulo , userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (result.length > 0) {
        const userid = user;
      }
    })
*/
/*---------------------------SEARCH----------------------*/

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});
