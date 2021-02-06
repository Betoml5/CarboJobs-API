const bcrypt = require("bcrypt");

let table = "workers";

const db = require("../services/Connection");
const controller = {
  getWorkers: async (req, res) => {
    try {
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
    console.log(req.params);
    try {
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
            (err, rows) => {
              if (err) throw err;
              res
                .status(201)
                .send({ message: "Creado correctamente", ok: true, rows });
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

  updateWorker: async (req, res) => {
    const workerID = req.params.id;
    const { name, last_name, email, password, phone } = req.body;
    const saltRounds = 10;

    try {
      // Generate the salt for the new password

      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err)
          res.status(500).send({ message: "Error trying to update data", err });
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            return res
              .status(500)
              .send({ message: "Error trying to update data", err });
          }

          db.query(
            // Aqui hacemos esto para evitar una inyeccion SQL
            "UPDATE ?? SET name = ? , last_name = ? , email = ?, password = ?, phone = ? WHERE id = ?",
            [table, name, last_name, email, hash, phone, workerID],
            (err) => {
              if (err) throw err;
              return res.status(200).send({
                message: "Actualizado correctamente correctamente",
                ok: true,
                workerID,
              });
            }
          );
        });
      });
    } catch (error) {
      console.log(error.name);
      return res
        .status(500)
        .send({ message: "Ha ocurrido un error en el servidor", error });
    }
  },

  setRating: async (req, res) => {
    const workerID = req.params.id;
    const { rating } = req.body;

    try {
      db.query(
        "UPDATE ?? SET rating = ? WHERE id = ?",
        [table, rating, workerID],
        (err) => {
          if (err) {
            return res
              .status(500)
              .send({
                message: "Ha ocurrido un error al intentar hacer la consulta!",
                err,
              });
          }
          return res
            .status(200)
            .send({ message: "Actualizado correctamente", workerID });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Ocurrio un error en el servidor", error });
    }
  },

  getWorkerByName: async (req, res) => {
    // We get the worker name by the request param.
    const workerName = req.params.name; // Check routes file for get more info. /name:? <- this

    if (workerName === undefined) {
      return res.status(501).send({ message: "Not valid method" });
    }

    try {
      await db.query(
        "SELECT * FROM ?? WHERE name = ?",
        [table, workerName],
        (err, worker, fields) => {
          if (err) {
            return res.status(500).send({
              message: "Ha ocurrido un error al realizar la consulta",
              err,
            });
          }

          if (worker.length === 0) {
            return res.status(500).send({ message: "User not found" });
          }

          return res.status(200).send({ worker });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al realizar la consulta",
        error,
      });
    }
  },
};

module.exports = controller;
