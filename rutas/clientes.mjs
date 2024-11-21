import express from "express";
import connection from "../db/coneccion.mjs";

const router = express.Router();

// Listar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const respuesta = await connection.query("SELECT * FROM Clientes");
    res.status(200).send(respuesta.rows);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener los usuarios" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const respuesta = await connection.query("SELECT * FROM Clientes WHERE id = $1", [id]);
    if (respuesta.rows.length === 0) {
      res.status(404).send({ message: "Cliente no encontrado" });
    } else {
      res.status(200).send(respuesta.rows[0]);
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener el cliente" });
  }
});

// Crear un nuevo cliente
router.post("/crear/", async (req, res) => {
  const { nombre, apellido, cedula, nro_tel_princ, email, ruc, direccion, tipo, estado } = req.body;
  try {
    const respuesta = await connection.query(
      `INSERT INTO Clientes (nombre, apellido, cedula, nro_tel_princ, email, ruc, direccion, tipo, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [nombre, apellido, cedula, nro_tel_princ, email, ruc, direccion, tipo, estado]
    );
    res.status(201).send({ id: respuesta.rows[0].id });
  } catch (error) {
    res.status(500).send({ error: "Error al crear el cliente" });
  }
});

// Actualizar un cliente por ID
router.put("/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, cedula, nro_tel_princ, email, ruc, direccion, tipo, estado } = req.body;
  try {
    const respuesta = await connection.query(
      `UPDATE Clientes 
       SET nombre = $1, apellido = $2, cedula = $3, nro_tel_princ = $4, email = $5, ruc = $6, direccion = $7, tipo = $8, estado = $9 
       WHERE id = $10`,
      [nombre, apellido, cedula, nro_tel_princ, email, ruc, direccion, tipo, estado, id]
    );
    if (respuesta.rowCount === 0) {
      res.status(404).send({ message: "Cliente no encontrado" });
    } else {
      res.status(200).send({ message: "Cliente actualizado correctamente" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al actualizar el cliente" });
  }
});

// Eliminar un cliente por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const respuesta = await connection.query("DELETE FROM Clientes WHERE id = $1", [id]);
    if (respuesta.rowCount === 0) {
      res.status(404).send({ message: "Cliente no encontrado" });
    } else {
      res.status(200).send({ message: "Cliente eliminado correctamente" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar el cliente" });
  }
});


export default router;
