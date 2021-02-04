const db = require("../services/Connection");

const controller = {
  createTag: async (req, res) => {
    const { tag_name } = req.body;
    try {
      const table = "tags";
      await db.query(
        "INSERT INTO ?? (tag_name) VALUES (?)",
        [table, tag_name],
        (err) => {
          if (err) {
            return res.status(500).send({ err, ok: false });
          }
          return res
            .status(200)
            .send({ message: "Tag creado correctamente", ok: true });
        }
      );
    } catch (error) {
      req.status(500).send({ error, ok: false });
    }
  },
  getTag: async (req, res) => {
    const tagID = req.params.id;
    const table = "tags";

    try {
      await db.query(
        "SELECT * FROM ?? WHERE id=?",
        [table, tagID],
        (err, tag) => {
          if (err) {
            res.status(500).send({
              message: "Ha ocurrido un error al intentar hacer la consulta!",
              err,
              ok: false,
            });
          }

          return res.status(200).send({ ...tag, ok: true });
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta",
        error,
        ok: false,
      });
    }
  },
  getAllTags: async (req, res) => {
    try {
      const table = "tags";

      await db.query("SELECT * FROM ??", [table], (err, tags, fields) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Ocurrio un error con la consulta", ok: false });
        }

        return res.status(200).send({ tags: tags, ok: true });
      });
    } catch (error) {
      return res.status(500).send({
        message: "Ha ocurrido un error al intentar hacer la consulta!",
        error,
        ok: false,
      });
    }
  },
};

module.exports = controller;
