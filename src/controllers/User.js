const { getUsers } = require("../services/User");

const db = require("../services/Connection");
const controller = {
  getUsers: async (req, res) => {
    try {
      await db.query("SELECT * FROM users", (err, rows, fields) => {
        if (err) {
          res.status(500).send({ message: "Ocurrio un error con la consulta" });
        }

        return res.status(200).send({ users: rows });
      });
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta!",
        error,
      });
    }
  },

  getUser: async (req, res) => {
    const userID = req.params.id;
    console.log(req.params.id)

    try {
      await db.query(
        "SELECT * FROM users WHERE id=?",
        [userID],
        (err, user) => {
          if (err) {
            res.status(500).send({
              message: "Ha ocurrido un error al intentar hacer la consulta!",
              err,
            });
          }

          res.status(200).send({ user });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        error,
      });
    }
  },

  createUser: async (req, res) => {
    // Desestructuramos el objeto body
    const { name, last_name, email, password, phone, nickname } = req.body;

    try {
      await db.query(
        // Aqui hacemos esto para evitar una inyeccion SQL
        "INSERT INTO users (name, last_name, email, password, phone, nickname) VALUES(?, ?, ?, ?, ?, ?)",
        [name, last_name, email, password, phone, nickname],
        (err) => {
          if (err) throw err;
          res.status(200).send({ message: "Creado correctamente" });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        err,
      });
    }
  },
};

module.exports = controller;
