
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// Create the connection to database
  // Create the connection to database
const connection =  new pg.Pool({
  host:  process.env.DB_HOST,
  user:  process.env.DB_USER,
  database:  process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:  process.env.DB_PORT,
});

const testConnection = async () => {
  try {
    await connection.query('SELECT 1');
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

testConnection();
 
export default connection;