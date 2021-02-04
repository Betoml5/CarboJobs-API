const bcrypt = require("bcrypt");

const db = require("../services/Connection");
const controller = {
  getWorkers: async (req, res) => {
    try {
      const table = "workers";
      await db.query("SELECT * FROM ??", [table], (err, workers, fields) => {
        if (err) {
          res.status(500).send({ message: "Ocurrio un error con la consulta" });
        }

        return res.status(200).send({ workers: workers });
      });
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta!",
        error,
      });
    }
  },

  getWorker: async (req, res) => {
    const workerID = req.params.id;
    try {
      const table = "workers";
      await db.query(
        "SELECT * FROM ?? WHERE id=?",
        [table, workerID],
        (err, worker) => {
          if (err) {
            res.status(500).send({
              message: "Ha ocurrido un error al intentar hacer la consulta!",
              err,
            });
          }

          res.status(200).send({ worker });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        error,
      });
    }
  },

  createWorker: async (req, res) => {
    // Desestructuramos el objeto body
    const { name, last_name, email, password, phone } = req.body;
    try {
      const table = "workers";
      // Aqui haremos la encriptacion de la contrasena
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            throw err;
          }

          db.query(
            // Aqui hacemos esto para evitar una inyeccion SQL
            "INSERT INTO ?? (name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)",
            [table, name, last_name, email, hash, phone],
            (err) => {
              if (err) throw err;
              res
                .status(200)
                .send({ message: "Creado correctamente", ok: true });
            }
          );
        });
      });
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        err,
        ok: false,
      });
    }
  },

  loginWorker: async (req, res) => {
    const { email, password } = req.body;
    const table = "workers";
    try {
      db.query(
        "SELECT * FROM ?? WHERE email = ?",
        [table, email],
        (err, worker) => {
          if (err) {
            res.status(500).send({
              message: "Ha ocurrido un error al intentar realizar la consulta",
              err,
            });
          }
          if (worker.length === 0) {
            return res.status(404).send({ message: "worker not found" });
          }

          bcrypt.compare(password, worker[0].password, function (err, result) {
            if (err)
              res.status(500).send({
                message: "Password or Email not correct",
                err,
                ok: false,
              });
            return res.status(200).send({ result, ok: true, ...worker });
          });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error en el servidor",
        ok: false,
        error,
      });
    }
  },
};

module.exports = controller;
