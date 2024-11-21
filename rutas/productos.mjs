import express from 'express';
import connection from "../db/coneccion.mjs";
import { upload } from '../libraries/multer.mjs';
import path from 'path';
import fs from 'fs';


const router = express.Router();
router.post("/create", upload.single('imagen'), async (req, res) => {
  const { codigo, nombre, estado, descripcion, categoria, stock, precio } = req.body;
  const imagen = req.file ? req.file.filename : null; // Guardar el nombre del archivo

  try {
    const result = await connection.query(
      "INSERT INTO productos (codigo, nombre, imagen, estado, precio_unidad, categoria, descripcion, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [codigo, nombre, imagen, estado, precio, categoria, descripcion, stock]
    );
    const productoId = result.insertId;
    res.status(201).send({ id: productoId, image: imagen, message: "Producto creado con éxito" });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send({ error: "Error al crear producto" });
  }
});


router.get("/", async (req, res) => {
  try {
    // Obtener todos los productos
    const result = (await connection.query("SELECT * FROM productos")).rows;
    // Mapear productos para agregar URL de imagen
    const productosConImagen = result.map(producto => {
      if (producto.imagen) {
        const filePath = path.join('./', "./uploads", producto.imagen);
        // Verifica si el archivo existe y lo convierte a base64
        if (fs.existsSync(filePath)) {
          const imagenBase64 = fs.readFileSync(filePath, "base64");
          return { ...producto, imagen: `data:image/jpeg;base64,${imagenBase64}` };
        }
      }

      // Si no hay imagen, devolver el producto con null en `imagen`
      return { ...producto, imagen: null };
    });

    // Enviar productos con URLs de imagen
    if (productosConImagen.length > 0) {
      res.status(200).send(productosConImagen);
    } else {
      res.status(404).send({ message: "No se encontraron productos" });
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

router.put("/editar/:id", upload.single("imagen"), async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, estado, descripcion, categoria, stock, precio } = req.body;
  const nuevaImagen = req.file ? req.file.filename : null; // Nueva imagen si se envía

  try {
    // Obtener la información actual del producto
    const productoExistente  = (await connection.query("SELECT imagen FROM productos WHERE id = $1", [id])).rows[0];
    if (!productoExistente.imagen) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    let imagenFinal = productoExistente.imagen;

    // Si hay una nueva imagen, reemplazar la anterior y eliminar el archivo antiguo
    if (nuevaImagen) {
      const rutaAntigua = path.join('./', "./uploads", productoExistente.imagen);
      if (fs.existsSync(rutaAntigua)) {
        fs.unlinkSync(rutaAntigua); // Eliminar la imagen anterior
      }
      imagenFinal = nuevaImagen;
    }

    //Actualizar el producto en la base de datos
    await connection.query(
      "UPDATE productos SET codigo = $1, nombre = $2, imagen = $3, estado = $4, precio_unidad = $5, categoria = $6, descripcion = $7, stock = $8 WHERE id = $9",
      [codigo, nombre, imagenFinal, estado, precio, categoria, descripcion, stock, id]
    );
    res.status(200).send({ message: "Producto actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send({ error: "Error al actualizar producto" });
  }
});


export default router;
