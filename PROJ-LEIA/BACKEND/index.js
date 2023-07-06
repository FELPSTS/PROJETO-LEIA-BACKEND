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

/*--------------------------LOGIN---------------*/
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

/*--------------------------SAVEDOCS----------------*/
app.post("/savedocs", (req, res) => {
  const userId = req.body.id_usuario;
  /*const folderID = req.body.folderID; */
  const titulo = req.body.titulo;
  const content = req.body.content;
  const preview = req.body.preview;

  db.query(
    "SELECT * FROM projetos WHERE titulo = ? AND id_usuario = ?",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO projetos (id_usuario, titulo, content, preview) VALUES ( ?, ?, ?, ?)",
          [userId, /*folderID*/ , titulo, content, preview],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com êxito" });
          }
        );
      } else {
        const projectId = result[0].id;

        db.query(
          "UPDATE projetos SET titulo = ?, content = ?, preview = ? WHERE id = ? AND id_usuario = ?",
          [titulo, content, preview, projectId, userId],
          (err, resultUpdate) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            if (resultUpdate.affectedRows === 0) {
              res.status(404).send({ msg: "Projeto não encontrado" });
              return;
            }

            res.send({ msg: "Projeto atualizado com sucesso" });
          }
        );
      }
    }
  );
});

/*--------------------------SAVEDOCS----------------*/

/*---------------------------SEARCH----------------------*/
app.post("/search", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM projetos WHERE titulo LIKE CONCAT('%', ?, '%') AND id_usuario = ?",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(510).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------SEARCH----------------------*/

/*------------------------------ALTER--------------------------*/
app.post("/alter", (req, res) => {
  const userId = req.body.id_usuario;
  const Apassword = req.body.oldpassword;
  const Npassword = req.body.newpassword;

  db.query(
    "SELECT * FROM usuarios WHERE id = ? AND password = ?",
    [userId, Apassword],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "Usuário não encontrado" });
        return;
      }

      db.query(
        "UPDATE usuarios SET password = ? Where id= ?",
        [Npassword, userId],
        (err, resultInsert) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          res.send({ msg: "Alterado com sucesso" });
        }
      );
    }
  );
});

/*------------------------------ALTER--------------------------*/

/*---------------------------------TEAMS------------------------------*/
app.post("/createteams", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;
 /* const team_icon= req.body.team_icon; */

  db.query(
    "SELECT * FROM team WHERE titulo = ? AND id_usuario = ?",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO project (id_usuario, titulo) VALUES ( ?, ?, ?, ?)",
          [userId , titulo, /*team_icon*/],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com êxito" });
          }
        )
        }
      }
    )
   }
);
 
/*---------------------------------TEAMS------------------------------*/

/*---------------------------------CREATEPROJECT------------------------------*/
app.post("/createproject", (req, res) => {
  const userId = req.body.id_usuario;
  const teamsID= req.body.id_temas;
  const titulo = req.body.titulo;
  const descricao = req.body.content;
 /* const icon = req.body.icon; */

  db.query(
    "SELECT * FROM project WHERE titulo = ? AND id_usuario = ? and temasID",
    [titulo, userId, teamsID],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO project (id_usuario, titulo, id_teams, descricao) VALUES ( ?, ?, ?, ?)",
          [userId , titulo, teamsID, descricao, /*icon*/],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com êxito" });
          }
        )
        }
      }
    )
   }
);

/*---------------------------------CREATEPROJECT------------------------------*/

/*---------------------------------CREATEFOLDER------------------------------*/
app.post("/createfolder", (req, res) => {
  const userId = req.body.id_usuario;
  const id_project= req.body.id_project;
  const titulo = req.body.titulo;
 

  db.query(
    "SELECT * FROM folder WHERE titulo = ? and id_project",
    [titulo , id_project],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO folder (id_usuario, titulo, id_project) VALUES ( ?, ?, ?)",
          [userId , titulo, id_project],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com êxito" });
          }
        )
        }
      }
    )
   }
);

/*---------------------------------CREATEFOLDER------------------------------*/

/*--------------------------------------DELETEUSER------------------------------------*/
app.post("/UserDelete", (req, res) => {
  const userId = req.body.id_usuario;
  const password = req.body.password;
  const email = req.body.email;

  db.query(
    "SELECT * FROM usuarios WHERE id = ? AND email = ?",
    [userId, email],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "Usuário não encontrado" });
        return;
      }

      db.query(
        "DELETE FROM usuarios WHERE id = ? AND email = ? AND password = ?",
        [userId, email, password],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          if (result.affectedRows === 0) {
            res.status(500).send({ msg: "Registro não encontrado" });
          } else {
            res.send({ msg: "Registro deletado com êxito" });
          }
        }
      );
    }
  );
});

/*--------------------------------------DELETEUSER------------------------------------*/


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

/*------------------------------GETUSER--------------------------*/
app.post("/getuser", (req, res) => {
  const userId = req.body.id_usuario;

  db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (result.length === 0) {
      res.send({ msg: "Usuário não encontrado" });
      return;
    }
    res.send(result);
  });
});

/*------------------------------GETUSER--------------------------*/

/*---------------------------GETPROJECTBYID-------------------*/
app.post("/getprojectbyid", (req, res) => {
  const projectId = req.body.projectId;

  db.query(
    "SELECT * FROM projetos WHERE id = ?",
    [projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETPROJECTBYID-------------------*/

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

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});
