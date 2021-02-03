const db = require("../services/Connection");

const controller = {
  createTag: async (req, res) => {
    const { tag_name } = req.body;
    try {
      await db.query(
        "INSERT INTO tags (tag_name) VALUES (?)",
        [tag_name],
        (err) => {
          if (err) {
            res.status(500).send({ err });
          }
          res.status(200).send({ message: "Tag creado correctamente" });
        }
      );
    } catch (error) {
      req.status(500).send({ error });
    }
  },

  getTag: async (req, res) => {
    const tagID = req.params.id;
    console.log(req.params.id);

    try {
      await db.query("SELECT * FROM tags WHERE id=?", [tagID], (err, tag) => {
        if (err) {
          res.status(500).send({
            message: "Ha ocurrido un error al intentar hacer la consulta!",
            err,
          });
        }

        res.status(200).send(...tag);
      });
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        error,
      });
    }
  },
};

module.exports = controller;
