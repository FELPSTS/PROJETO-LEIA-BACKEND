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
  const folderId = req.body.folderId;

  if (!projectId || !titulo || !content) {
    res.status(400).send({ erro: "Todos os campos devem ser preenchidos" });
    return;
  }

  db.query(
    "SELECT * FROM docs WHERE id = ? AND id_project = ?",
    [docsId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        if (folderId) {
          db.query(
            "INSERT INTO docs (id_project, titulo, content, preview, id_folder) VALUES ( ?, ?, ?, ?, ?)",
            [projectId, titulo, content, preview, folderId],
            (err, resultInsert) => {
              if (err) {
                res.status(200).send(err);
                return;
              }

              res.send({ msg: "Cadastrado com Ãªxito" });
            }
          );
        } else {
          db.query(
            "INSERT INTO docs (id_project, titulo, content, preview) VALUES ( ?, ?, ?, ?)",
            [projectId, titulo, content, preview],
            (err, resultInsert) => {
              if (err) {
                res.status(200).send(err);
                return;
              }

              res.send({ msg: "Cadastrado com Ãªxito" });
            }
          );
        }
      } else {
        db.query(
          "UPDATE docs SET titulo = ?, content = ?, preview = ? WHERE id = ?",
          [titulo, content, preview, docsId],
          (err, resultUpdate) => {
            if (err) {
              res.status(201).send(err);
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

/*---------------------------SEACHALLDOCS----------------------*/
app.post("/searchdocs", (req, res) => {
  const projectId = req.body.id_project;
  const titulo = req.body.titulo;
  const folderId = req.body.folderId;

  if (folderId) {
    db.query(
      "SELECT * FROM docs WHERE titulo LIKE CONCAT('%', ?, '%') AND id_folder = ?",
      [titulo, projectId, folderId],
      (err, result) => {
        if (err) {
          res.status(510).send(err);
          return;
        }

        res.send(result);
      }
    );
  } else {
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
  }
});

/*---------------------------SEACHALLDOCS----------------------*/

/*---------------------------SEARCHPROJECTS----------------------*/
app.post("/searchproject", (req, res) => {
  const userId = req.body.user_id;
  const titulo = req.body.titulo;
  const team_id = req.body.team;

  db.query(
    "SELECT * FROM project WHERE titulo LIKE CONCAT('%', ?, '%') AND id_usuario = ? OR id_teams= ? ",
    [titulo, userId, team_id],
    (err, result) => {
      if (err) {
        res.status(510).send(err);
        return;
      }

      res.send(result);
    }
  );
});
/*---------------------------SEARCHPROJECTS----------------------*/

/*---------------------------SEARCHFOLDER----------------------*/
app.post("/searchproject", (req, res) => {
  const userId = req.body.user_id;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM folder WHERE titulo LIKE CONCAT('%', ?, '%') AND id_usuario = ?",
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
/*---------------------------SEARCHFOLDER----------------------*/

/*---------------------------SEARCHTEAM----------------------*/
app.post("/searchproject", (req, res) => {
  const userId = req.body.user_id;
  const titulo = req.body.titulo;

  db.query(
    "SELECT * FROM team WHERE titulo LIKE CONCAT('%', ?, '%') AND id_usuario = ?",
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
/*---------------------------SEARCHTEAM----------------------*/

/*------------------------------ALTERLOGIN==--------------------------*/
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

/*------------------------------ALTERFOLDER--------------------------*/
app.post("/alterfolder", (req, res) => {
  const userId = req.body.id_usuario;
  const folderId = req.body.id_folder;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  db.query(
    "SELECT * FROM folder WHERE id_usuario = ? AND id = ?",
    [userId, folderId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        res.send({ msg: "FOLDER nÃ£o encontrado" });
        return;
      }

      db.query(
        "UPDATE folder SET titulo = ? AND descricao= ? Where id_folder= ?",
        [titulo, descricao, folderId],
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

/*------------------------------ALTERFOLDER--------------------------*/

/*---------------------------------SENDTEAMS------------------------------*/
app.post("/saveteams", (req, res) => {
  const userId = req.body.id_usuario;
  const titulo = req.body.titulo;

  if (!userId || !titulo) {
    res.status(400).send({ erro: "Usuário e(ou) título não encontrado " });
    return;
  }

  db.query(
    "SELECT * FROM team WHERE titulo = ? AND id_usuarios = ?",
    [titulo, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO team (id_usuarios, titulo) VALUES (?, ?)",
          [userId, titulo],
          (err, resultInsert) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            res.status(201).send({ msg: "Time criado com sucesso" });
          }
        );
      } else {
        const content = req.body.content;
        const preview = req.body.preview;
        const docsId = req.body.docsId;

        db.query(
          "UPDATE team SET titulo = ?, content = ? WHERE id = ?",
          [titulo, content, docsId],
          (err, resultUpdate) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            if (resultUpdate.affectedRows === 0) {
              res.status(404).send({ msg: "Bigas non inveni" });
              return;
            }

            res.send({ msg: "Equipe atualizada com sucesso" });
          }
        );
      }
    }
  );
});

/*---------------------------------SENDTEAMS------------------------------*/

/*---------------------------------SENDPROJECT------------------------------*/
app.post("/sendproject", (req, res) => {
  const userId = req.body.id_usuario;
  const projectId = req.body.projectId;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  const team_id = 1;

  if (!team_id || !titulo) {
    res.status(400).send({ erro: "Omnes agros impleri" });
    return;
  }

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

  if (!userId || !id_project || !titulo) {
    res.status(400).send({ erro: "Todos os campos devem ser preenchidos" });
    return;
  }

  db.query(
    "SELECT * FROM folder WHERE titulo = ? and id_project= ?",
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
            res.status(404).send({ msg: "Registro nÃ£o encontrado" });
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
    "DELETE FROM project WHERE id_usuario = ? AND id = ?  ",
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

/*---------------------------GETDOCSBYFOLDERID-------------------*/
app.post("/getdocumentbyfolderid", (req, res) => {
  const folderId = req.body.folderId;

  db.query(
    "SELECT * FROM docs WHERE id_folder = ?",
    [folderId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETDOCSBYFOLDERID-------------------*/

/*---------------------------GETDOCS----------------------*/
app.post("/getdocs", (req, res) => {
  const projectId = req.body.id_project;

  db.query(
    "SELECT * FROM docs WHERE id_project = ? AND id_folder is null",
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

/*---------------------------GETFOLDERBYPROJECTID----------------------*/
app.post("/getfolders", (req, res) => {
  const projectId = req.body.id_project;

  db.query(
    "SELECT * FROM folder WHERE id_project= ?",
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

/*---------------------------GETFOLDERBYPROJECTID----------------------*/

/*---------------------------GETFOLDERBYID----------------------*/
app.post("/getfolderbyid", (req, res) => {
  const folderId = req.body.folderId;

  db.query(
    "SELECT titulo FROM folder WHERE id = ?",
    [folderId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETFOLDERBYID----------------------*/

/*---------------------------GETTEAMBYID----------------------*/
app.post("/getteam", (req, res) => {
  const id_usuario = req.body.id_usuario;

  db.query(
    "SELECT * FROM team WHERE id_usuario= ?",
    [id_usuario],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETTEAMBYID----------------------*/

/*---------------------------GETTEAMUSERBYID----------------------*/
app.post("/getteamuser", (req, res) => {
  const idteam = req.body.team;

  db.query(
    "SELECT * FROM team_usuario WHERE idteam= ?",
    [idteam],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------GETTEAMUSERBYID----------------------*/

/*-----------------------------GETCOMPARETIME---------------------------------*/
app.post("/getcompare_time", (req, res) => {
  const id = req.body.folderId;

  db.query(
    "SELECT * FROM docs WHERE id_folder = ? ORDER BY last_modified DESC LIMIT 3  ",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});
/*-------------------------------GETCOMPARETIME-------------------------------*/

/*---------------------------ADDDOCINTOFOLDER----------------------*/
app.post("/addtofolder", (req, res) => {
  const folderId = req.body.folderId;
  const documentId = req.body.documentId;

  db.query(
    "UPDATE docs SET id_folder = ? WHERE id = ?",
    [folderId, documentId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------ADDDOCINTOFOLDER----------------------*/

/*---------------------------REMOVEDOCFROMFOLDER----------------------*/
app.post("/removefromfolder", (req, res) => {
  const documentId = req.body.documentId;

  db.query(
    "UPDATE docs SET id_folder = null WHERE id = ?",
    [documentId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(result);
    }
  );
});

/*---------------------------REMOVEDOCFROMFOLDER----------------------*/

/*---------------------------ADDDOCINTOTEAM----------------------*/
app.post("/adduserintoteam", (req, res) => {
  const teamuserId = req.body.teamuserId;
  const teamId = req.body.teamId;
  const id_usuarioId = req.body.id_usuario;

  db.query(
    "SELECT * FROM team_usuario WHERE id_time = ?",
    [docsId, projectId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.length === 0) {
        db.query(
          "INSERT INTO team_usuario (teamId, id_usuarioId) VALUES ( ?, ?)",
          [teamId, id_usuarioId],
          (err, resultInsert) => {
            if (err) {
              res.status(200).send(err);
              return;
            }

            res.send({ msg: "Cadastrado com Ãªxito" });
          }
        );
      } else {
        db.query(
          "UPDATE team_usuario SET id_usuarioId = ? WHERE id = ?",
          [id_usuarioId, teamuserId],
          (err, resultUpdate) => {
            if (err) {
              res.status(201).send(err);
              return;
            }

            if (resultUpdate.affectedRows === 0) {
              res.status(404).send({ msg: "team nÃ£o encontrado" });
              return;
            }

            res.send({ msg: "team atualizado com sucesso" });
          }
        );
      }
    }
  );
});
/*---------------------------ADDDOCINTOTEAM----------------------*/

/*------------------------ICONUSER--------------------------------------*/
app.post("/sendicon_user", (req, res) => {
  const userId = req.body.id_usuario;
  const IconID = req.body.icone;

  db.query(
    "UPDATE usuarios SET icon_user = ? WHERE id = ?",
    [IconID, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send({ msg: "Usuário não encontrado" });
        return;
      }

      res.send({ msg: "Imagem inserida com sucesso" });
    }
  );
});

/*------------------------ICONUSER--------------------------------------*/

/*------------------------ICONPROJECT--------------------------------------*/
app.post("/sendicon_project", (req, res) => {
  const projectID = req.parbodyms.id;
  const IconID = req.body.icone;

  db.query(
    "UPDATE project SET icon_project = ? WHERE id = ?",
    [projectID, IconID],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send({ msg: "Usuário não encontrado" });
        return;
      }

      res.send({ msg: "Imagem inserida com sucesso" });
    }
  );
});

/*------------------------ICONPROJECT--------------------------------------*/

/*------------------------ICONTEAM--------------------------------------*/
app.post("/sendicon_team", (req, res) => {
  const TeamID = req.body.id;
  const Teamicon = req.body.icone;

  db.query(
    "UPDATE team SET team_icon = ? WHERE id = ?",
    [Teamicon, TeamID],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send({ msg: "Usuário não encontrado" });
        return;
      }

      res.send({ msg: "Imagem inserida com sucesso" });
    }
  );
});

/*------------------------ICONTEAM--------------------------------------*/
/**/
/*------------------------MAILSYSTEMS---------------------------------------*/
/*------------------------VALIDATIONSYSTEMS--------------------------------------*/
/*------------------------VALIDATIONSYSTEMS--------------------------------------*/
/*------------------------FOTGOTSYSTEMS--------------------------------------*/
/*------------------------FOTGOTSYSTEMS--------------------------------------*/
/*------------------------REPORTSYSTEMS--------------------------------------*/
/*------------------------REPORTSYSTEMS--------------------------------------*/
/*------------------------MAILSYSTEMS--------------------------------------*/
/**/
app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});

/*  CABO. *-*   */
