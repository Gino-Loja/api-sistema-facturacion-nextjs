import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import clientes from "./rutas/clientes.mjs";
import productos from "./rutas/productos.mjs";
import pedidos from "./rutas/pedidos.mjs";
const PORT = process.env.PORT || 8080 ;
const app = express();

app.use(cors());
app.use(express.json());

// carga las rutas
app.use("/clientes", clientes);
app.use('/productos', productos);
app.use('/pedidos', pedidos);
app.use((err, _req, res, next) => {
  console.log(err)
  res.status(500).send("Ha Ocurrido un error")
})

app.listen(PORT, () => {
  console.log(`servidor corriendo en el puerto: ${PORT}`);
});
