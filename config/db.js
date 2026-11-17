import "dotenv/config";
import mysql from "mysql2/promise";

const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingEnv = requiredEnv.filter(name => !process.env[name]);

if (missingEnv.length) {
    throw new Error(`Variáveis de banco ausentes: ${missingEnv.join(", ")}`);
}

const sslEnabled = process.env.DB_SSL === "true";

// O pool fica no escopo do módulo para ser reutilizado entre requisições.
// Na Vercel, mantenha um limite pequeno para evitar abrir muitas conexões.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "nexus_team",
    waitForConnections: true,
    connectionLimit: process.env.VERCEL ? 2 : 5,
    maxIdle: process.env.VERCEL ? 2 : 5,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4",
    ssl: sslEnabled ? { minVersion: "TLSv1.2" } : undefined
});

export async function testarConexao() {
    const [rows] = await pool.query("SELECT 1 AS conectado");
    return rows[0];
}

export default pool;
