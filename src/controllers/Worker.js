const bcrypt = require("bcrypt");
let table = "workers";

const db = require("../services/Connection");
const controller = {
  getWorkers: async (req, res) => {
    try {
      db.query("SELECT * FROM ??", [table], (err, workers, fields) => {
        if (err) {
          res.status(500).send({ message: "Error with SQL query" });
        }

        return res.status(200).send({ workers: workers });
      });
    } catch (error) {
      return res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  getWorker: async (req, res) => {
    const workerID = req.params.id;

    try {
      db.query(
        "SELECT * FROM ?? WHERE id=?",
        [table, workerID],
        (err, worker) => {
          if (err) {
            return res.status(500).send({
              message: "Error with SQL query",
              err,
            });
          }

          return res.status(200).send({ worker });
        }
      );
    } catch (error) {
      return res.status(500).send({
        message: "Sever Error",
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
              if (err) {
                return res
                  .status(500)
                  .send({ message: "Error with SQL query" });
              }
              return res
                .status(201)
                .send({ message: "Created Correctly", ok: true });
            }
          );
        });
      });
    } catch (error) {
      return res.status(500).send({
        message: "Server Error",
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
            return res.status(500).send({
              message: "Error with SQL query",
              err,
            });
          }
          if (worker.length === 0) {
            return res
              .status(404)
              .send({ message: "Worker not found", ok: false });
          }

          bcrypt.compare(password, worker[0].password, function (err, result) {
            if (err)
              return res.status(500).send({
                message: "Password or Email not correct",
                err,
                ok: false,
              });
            return res.status(200).send({ result, ok: true, ...worker });
          });
        }
      );
    } catch (error) {
      return res.status(500).send({
        message: "Server Error",
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
          return res
            .status(500)
            .send({ message: "Error trying to update data", err });
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
                message: "Worker updated correctly",
                ok: true,
                workerID,
              });
            }
          );
        });
      });
    } catch (error) {
      return res.status(500).send({ message: "Server Error", error });
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
            return res.status(500).send({
              message: "Error with SQL query",
              err,
            });
          }
          return res
            .status(200)
            .send({ message: "Updated Correctly", workerID });
        }
      );
    } catch (error) {
      return res.status(500).send({ message: "Server error", error });
    }
  },

  getWorkerByName: async (req, res) => {
    // We get the worker name by the request param.
    const workerName = req.params.name; // Check routes file for get more info. /name:? <- this

    if (workerName === undefined || "") {
      return res.status(501).send({ message: "Not valid method" });
    }

    try {
      db.query(
        "SELECT * FROM ?? WHERE name = ?",
        [table, workerName],
        (err, worker, fields) => {
          if (err) {
            return res.status(500).send({
              message: "Error with SQL query",
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
      return res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  setTag: async (req, res) => {
    try {
      db.query("UPDATE ?? SET tags");
    } catch (error) {
      return res.status(500).send({ message: "Server Error", error });
    }
  },

  getBestWorkers: async (req, res) => {
    // I had to parse the request to number. Because i was getting it as a string, and that caused a SQL error.
    const limit = parseInt(req.params.limit);

    try {
      db.query(
        "SELECT name, last_name, rating FROM ?? ORDER BY rating DESC LIMIT ?",
        [table, limit],
        (err, workers) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ message: "Error with SQL query", err });
          }

          return res.status(200).send({ workers });
        }
      );
    } catch (error) {
      return res.status(500).send({ message: "Server Error", error });
    }
  },

  getBestWorkersWithTags: async (req, res) => {
    // Si esto falla, cambiar por workers.name, y workers.last_name
    const sql = `
      SELECT name, last_name, group_concat(tag_name) as 'Tags'
      FROM tags
      INNER JOIN workers_tags
      ON tags.id = workers_tags.tag_id
      INNER JOIN workers
      ON workers_tags.worker_id = workers.id
      GROUP BY worker_id`;
    try {
      db.query(
        {
          sql,
          timeout: 40000,
        },
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "Error with SQL query", err });
          }
          return res.status(200).send({ results });
        }
      );
    } catch (error) {
      return res.status(500).send({ message: "Server error" });
    }
  },
};

module.exports = controller;
