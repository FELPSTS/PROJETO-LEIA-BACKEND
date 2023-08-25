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

          res.send({ msg: "Cadastrado com Ãªxito" });
        }
      );
    } else {
      res.status(141).send({ msg: "UsuÃ¡rio jÃ¡ estÃ¡ cadastrado" });
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
        res.send({ /*msg: "UsuÃ¡rio logado com sucesso",*/ userId: userid });
      } else {
        res.status(401).send({ msg: "Email ou senha incorretos" });
      }
    }
  );
});

/*--------------------------LOGIN----------------*/

/*--------------------------SAVEDOCS----------------*/
app.post("/savedocs", (req, res) => {
  const projectId = req.body.id_project;
  const docsId = req.body.docsId;
  const titulo = req.body.titulo;
  const content = req.body.content;
  const preview = req.body.preview;

  db.query(
    "SELECT * FROM docs WHERE id = ? AND id_project = ?",
    [docsId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO docs (id_project, titulo, content, preview) VALUES ( ?, ?, ?, ?)",
          [projectId, titulo, content, preview],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com Ãªxito" });
          }
        );
      } else {
        db.query(
          "UPDATE docs SET titulo = ?, content = ?, preview = ? WHERE id = ?",
          [titulo, content, preview, docsId],
          (err, resultUpdate) => {
            if (err) {
              res.status(500).send(err);
              return;
              cd;
            }

            if (resultUpdate.affectedRows === 0) {
              res.status(404).send({ msg: "Projeto nÃ£o encontrado" });
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

/*---------------------------SEARCHDOCS----------------------*/
app.post("/searchdocs", (req, res) => {
  const projectId = req.body.id_project;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM docs WHERE titulo LIKE CONCAT('%', ?, '%') AND id_project = ?",
    [titulo, projectId],
    (err, result) => {
      if (err) {
        res.status(510).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------SEARCHDOCS----------------------*/
/*------------------------------ALTERLOGIN--------------------------*/
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
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
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

/*------------------------------ALTERLOGIN--------------------------*/
/*------------------------------ALTERPROJECT--------------------------*/
app.post("/alterproject", (req, res) => {
  const userId = req.body.id_usuario;
  const projectId = req.body.id_project;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  db.query(
    "SELECT * FROM project WHERE id_usuario = ? AND id = ?",
    [userId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
        return;
      }

      db.query(
        "UPDATE project SET titulo = ? AND descricao= ? Where id_project= ?",
        [titulo, descricao, projectId],
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

/*------------------------------ALTERPROJECT--------------------------*/

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
          [userId, titulo /*team_icon*/],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com Ãªxito" });
          }
        );
      }
    }
  );
});

/*---------------------------------TEAMS------------------------------*/

/*---------------------------------SENDPROJECT------------------------------*/
app.post("/sendproject", (req, res) => {
  const userId = req.body.id_usuario;
  const projectId = req.body.projectId;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  db.query(
    "SELECT * FROM project WHERE titulo = ? AND id_usuario = ? ",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO project (id_usuario, titulo, descricao) VALUES ( ?, ?, ?)",
          [userId, titulo, descricao],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com Ãªxito" });
          }
        );
      } else {
        db.query(
          "UPDATE project SET titulo = ? AND descricao= ? WHERE id= ?",
          [titulo, descricao, projectId],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Alterado com sucesso" });
          }
        );
      }
    }
  );
});

/*---------------------------------SENDPROJECT------------------------------*/

/*---------------------------------CREATEFOLDER------------------------------*/
app.post("/createfolder", (req, res) => {
  const userId = req.body.id_usuario;
  const id_project = req.body.id_project;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM folder WHERE titulo = ? and id_project",
    [titulo, id_project],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO folder (id_usuario, titulo, id_project) VALUES ( ?, ?, ?)",
          [userId, titulo, id_project],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com Ãªxito" });
          }
        );
      }
    }
  );
});

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
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
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
            res.status(500).send({ msg: "Registro nÃ£o encontrado" });
          } else {
            res.send({ msg: "Registro deletado com Ãªxito" });
          }
        }
      );
    }
  );
});

/*--------------------------------------DELETEUSER------------------------------------*/

/*--------------------------------------DELETECARD------------------------------------*/
app.post("/deletecard", (req, res) => {
  const projectId = req.body.id_project;
  const cardId = req.body.id_card;

  db.query(
    "SELECT * FROM docs WHERE id = ? AND id_project = ?",
    [cardId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
        return;
      }

      db.query(
        "DELETE FROM docs WHERE id = ? AND id_project = ?",
        [cardId, projectId],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          if (result.affectedRows === 0) {
            res.status(500).send({ msg: "Documento nÃ£o encontrado" });
          } else {
            res.send({ msg: "Documento deletado com Ãªxito" });
          }
        }
      );
    }
  );
});
/*--------------------------------------DELETECARD------------------------------------*/

/*--------------------------------------DELETEPROJECTS------------------------------------*/
app.post("/deleteprojects", (req, res) => {
  const userId = req.body.id_usuario;
  const projectId = req.body.id_projects;

  db.query(
    "SELECT * FROM project WHERE id = ? AND id_usuario = ?",
    [userId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
        return;
      }

      db.query(
        "DELETE FROM project WHERE id = ? AND id_usuario = ?",
        [userId, projectId],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          if (result.affectedRows === 0) {
            res.status(500).send({ msg: "Projeto nÃ£o encontrado" });
          } else {
            res.send({ msg: "Projeto deletado com Ãªxito" });
          }
        }
      );
    }
  );
});
/*--------------------------------------DELETEPROJECTS------------------------------------*/

/*--------------------------------------DELETEFOLDER------------------------------------*/
app.post("/deletefolder", (req, res) => {
  const userId = req.body.id_usuario;
  const foldertId = req.body.foldertId;

  db.query(
    "SELECT * FROM folder WHERE id = ? AND id_usuario = ?",
    [foldertId, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "folder nÃ£o encontrado" });
        return;
      }

      db.query(
        "DELETE FROM folder WHERE id = ? AND id_usuario = ?",
        [foldertId, userId],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          if (result.affectedRows === 0) {
            res.status(500).send({ msg: "Projeto nÃ£o encontrado" });
          } else {
            res.send({ msg: "Projeto deletado com Ãªxito" });
          }
        }
      );
    }
  );
});
/*--------------------------------------DELETEFOLDER------------------------------------*/

/*--------------------------------------DELETETEAM------------------------------------*/
app.post("/deleteteam", (req, res) => {
  const userId = req.body.id_usuario;
  const teamId = req.body.id_team;

  db.query(
    "SELECT * FROM team WHERE id = ? AND id_usuario = ?",
    [userId, teamId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
        return;
      }

      db.query(
        "DELETE FROM team WHERE id_usuario = ? AND id_team = ?",
        [userId, teamId],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }

          if (result.affectedRows === 0) {
            res.status(500).send({ msg: "Projeto nÃ£o encontrado" });
          } else {
            res.send({ msg: "Projeto deletado com Ãªxito" });
          }
        }
      );
    }
  );
});
/*--------------------------------------DELETETEAM------------------------------------*/

/*------------------------------GETUSER--------------------------*/
app.post("/getuser", (req, res) => {
  const userId = req.body.id_usuario;

  db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (result.length === 0) {
      res.send({ msg: "UsuÃ¡rio nÃ£o encontrado" });
      return;
    }
    res.send(result);
  });
});

/*------------------------------GETUSER--------------------------*/

/*---------------------------GETDOCSBYID-------------------*/
app.post("/getdocumentbyid", (req, res) => {
  const documentId = req.body.documentId;

  db.query("SELECT * FROM docs WHERE id = ?", [documentId], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(result);
  });
});

/*---------------------------GETDOCSBYID-------------------*/

/*---------------------------GETDOCS----------------------*/
app.post("/getdocs", (req, res) => {
  const projectId = req.body.id_project;

  db.query(
    "SELECT * FROM docs WHERE id_project = ?",
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

/*---------------------------GETDOCS----------------------*/

/*---------------------------GETPROEJCTS----------------------*/
app.post("/getprojects", (req, res) => {
  const userId = req.body.id_usuario;

  db.query(
    "SELECT * FROM project WHERE id_usuario = ?",
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

/*------------------------icon--------------------------------------*/
/*------------------------icon--------------------------------------*/

/*---------------------------FORGOT----------------------*/
/*---------------------------FORGOT----------------------*/

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});