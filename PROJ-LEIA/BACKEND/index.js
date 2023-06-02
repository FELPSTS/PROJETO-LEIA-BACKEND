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
      res.status(141).send(err);
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

/*---------------------------GETPROEJCTS----------------------*/
app.post("/getprojects", (req, res) => {
  const userId = req.body.id_usuario;

  db.query(
    "SELECT * FROM projetos WHERE id_usuario = ?",
    [userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETPROEJCTS----------------------*/

/*---------------------------GETPROEJCTS----------------------*/
/*
app.put("/alter:id", (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;
  const newpassword = req.params.newpassword;

  const sql = "UPDATE usuarios SET username = ?, password = ? WHERE id = ?";
db.query(sql, [username, password, userId], (err, result) => {
    (err, result) => {
      res.status(500).send(err);
      return;
    };

  res.send("Dados do usuário alterados com sucesso!");
});
*/
/*---------------------------GETPROEJCTS----------------------*/

/*--------------------------SAVEDOCS----------------*/
app.post("/savedocs", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;
  const content = req.body.content;

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
          "INSERT INTO projetos (id_usuario, titulo, content) VALUES (?, ?, ?)",
          [userId, titulo, content],
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

/*--------------------------SAVEDOCS----------------*/

/*---------------------------SEARCH----------------------*/
/*
app.post("/search", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM projetos WHERE titulo LIKE ? AND userid = ?",
    [`%${titulo}%`, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length > 0) {
      }
    }
  );
});
*/
/*---------------------------SEARCH----------------------*/

/*---------------------------FORGOT----------------------*/
/*
app.post("/forgot", (req, res) => {
  const email = req.body.email;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (result.length > 0) {
      const userId = result[0].id;

      const resetToken = generateResetToken();

      db.query(
        "UPDATE usuarios SET reset_token = ? WHERE id = ?",
        [resetToken, userId],
        (err) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          sendResetEmail(email, resetToken);

          res.send("E-mail enviado com sucesso!");
        }
      );
    } else {
      res.status(404).send("Usuário não encontrado.");
    }
  });
});

function generateResetToken() {
  // Implemente a geração de um token de redefinição de senha aqui (você pode usar uma biblioteca como o uuid para gerar um token único)
  // Por exemplo: return uuid.v4();
}

const nodemailer = require("nodemailer");

function sendResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    service: "seu_provedor_de_email",
    auth: {
      user: "seu_email",
      pass: "sua_senha",
    },
  });

  const mailOptions = {
    from: "seu_email@gmail.com",
    to: email,
    subject: "Redefinição de senha",
    text: `Olá! Clique neste link para redefinir sua senha: ${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("E-mail enviado: " + info.response);
    }
  });
}
*/
/*---------------------------FORGOT----------------------*/

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});
