import express from 'express';
import connection from "../db/coneccion.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM PEDIDOS');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).send({ error: 'Error al obtener pedidos' });
  }
});

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);
  try {
    const [rows, fields] = await connection.query('SELECT * FROM PEDIDOS WHERE ID_PE = ?', [orderId]);
    if (rows.length > 0) {
      res.status(200).send(rows[0]);
    } else {
      res.status(404).send({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).send({ error: 'Error al obtener pedido' });
  }
});

router.post("/create", async (req, res) => {
  const { fecha, id_usu, total, estado } = req.body;
  try {
    const [result] = await connection.query('INSERT INTO PEDIDOS (Fecha, ID_USU, Total, Estado) VALUES (?, ?, ?, ?)', [fecha, id_usu, total, estado]);
    res.status(201).send({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).send({ error: 'Error al crear pedido' });
  }
});

router.put("/update/:id", async (req, res) => {
  const orderId = req.params.id;
  const { fecha, id_usu, total, estado } = req.body;
  try {
    const [result] = await connection.query('UPDATE PEDIDOS SET Fecha = ?, ID_USU = ?, Total = ?, Estado = ? WHERE ID_PE = ?', [fecha, id_usu, total, estado, orderId]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Pedido actualizado' });
    } else {
      res.status(404).send({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).send({ error: 'Error al actualizar pedido' });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);
  try {
    const [result] = await connection.query('DELETE FROM PEDIDOS WHERE ID_PE = ?', [orderId]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Pedido eliminado' });
    } else {
      res.status(404).send({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).send({ error: 'Error al eliminar pedido' });
  }
});

export default router;
