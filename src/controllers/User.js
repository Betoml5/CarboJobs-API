const bcrypt = require("bcrypt");
const db = require("../services/Connection");

let table = "users";

const controller = {
  getUsers: async (req, res) => {
    try {
      db.query("SELECT * FROM ??", [table], (err, users, fields) => {
        if (err) {
          return res.status(500).send({ message: "Error with SQL query" });
        }

        return res.status(200).send({ users: users });
      });
    } catch (error) {
      return res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  getUser: async (req, res) => {
    const userID = req.params.id;
    try {
      db.query("SELECT * FROM ?? WHERE id=?", [table, userID], (err, user) => {
        if (err) {
          return res.status(500).send({
            message: "Error with SQL query",
            err,
          });
        }

        return res.status(200).send({ user });
      });
    } catch (error) {
      return res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  createUser: async (req, res) => {
    // Desestructuramos el objeto body
    const { name, last_name, email, password, phone, nickname } = req.body;
    try {
      // Here is the password encrypt
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            throw err;
          }

          db.query(
            // Here i use ? to avoid SQL injection.
            // For tables use  ?? and for data use ?, and pass it as an array
            "INSERT INTO ?? (name, last_name, email, password, phone, nickname) VALUES (?, ?, ?, ?, ?, ?)",
            [table, name, last_name, email, hash, phone, nickname], // Array with values ?
            (err) => {
              if (err) throw err;
              res.status(200).send({ message: "Created Correctly", ok: true });
            }
          );
        });
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        err,
        ok: false,
      });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      db.query(
        "SELECT * FROM ?? WHERE email = ?",
        [table, email],
        (err, user) => {
          if (err) {
            res.status(500).send({
              message: "Error with SQL query",
              err,
            });
          }
          if (user.length === 0) {
            return res.status(404).send({ message: "User not found" });
          }

          bcrypt.compare(password, user[0].password, function (err, result) {
            if (err)
              res.status(500).send({
                message: "Password or Email not correct",
                err,
                ok: false,
              });
            return res.status(200).send({ result, ok: true, ...user });
          });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        ok: false,
        error,
      });
    }
  },

  updateUser: async (req, res) => {
    const userID = req.params.id;
    const { name, last_name, email, password, phone, nickname } = req.body;
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
            "UPDATE ?? SET name = ? , last_name = ? , email = ?, password = ?, phone = ?, nickname = ? WHERE id = ?",
            [table, name, last_name, email, hash, phone, nickname, userID],
            (err) => {
              if (err) throw err;
              return res.status(200).send({
                message: "User updated correctly",
                ok: true,
                userID,
              });
            }
          );
        });
      });
    } catch (error) {
      return res.status(500).send({ message: "Server Error", error });
    }
  },
};

module.exports = controller;
