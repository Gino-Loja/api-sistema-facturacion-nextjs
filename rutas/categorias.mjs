import express from 'express';
import connection from "../db/coneccion.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM CATEGORIAS');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send({ error: 'Error al obtener productos' });
  }
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows, fields] = await connection.query('SELECT * FROM PRODUCTOS WHERE ID_PRO = ?', [productId]);
    if (rows.length > 0) {
      res.status(200).send(rows[0]);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).send({ error: 'Error al obtener producto' });
  }
});

router.post("/create", async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    const [result] = await connection.query('INSERT INTO PRODUCTOS (Nombre, Descripción, Precio, Stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock]);
    res.status(201).send({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).send({ error: 'Error al crear producto' });
  }
});

router.put("/update/:id", async (req, res) => {
  const productId = req.params.id;
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    const [result] = await connection.query('UPDATE PRODUCTOS SET Nombre = ?, Descripción = ?, Precio = ?, Stock = ? WHERE ID_PRO = ?', [nombre, descripcion, precio, stock, productId]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Producto actualizado' });
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send({ error: 'Error al actualizar producto' });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const [result] = await connection.query('DELETE FROM PRODUCTOS WHERE ID_PRO = ?', [productId]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Producto eliminado' });
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send({ error: 'Error al eliminar producto' });
  }
});

export default router;
