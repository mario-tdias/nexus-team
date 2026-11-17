
import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Verifica as variáveis obrigatórias
const required = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_SSL_CA"
];

const missing = required.filter(
    (key) => !process.env[key]
);

if (missing.length > 0) {
    console.error(
        `Variáveis ausentes no .env: ${missing.join(", ")}`
    );
    process.exit(1);
}

// Verifica o certificado SSL
const caPath = path.resolve(
    process.cwd(),
    process.env.DB_SSL_CA
);

if (!fs.existsSync(caPath)) {
    console.error(`Certificado CA não encontrado: ${caPath}`);
    console.error(
        "Confira o caminho definido em DB_SSL_CA no arquivo .env."
    );
    process.exit(1);
}

// Localiza os arquivos SQL
const currentDir = path.dirname(
    fileURLToPath(import.meta.url)
);

const sqlFiles = [
    "schema.sql",
    "seed.sql"
];

let connection;

try {
    // Conecta ao TiDB Cloud
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 4000),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,

        // O schema.sql cria e seleciona o banco nexus_team
        ssl: {
            ca: fs.readFileSync(caPath),
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },

        multipleStatements: true,
        connectTimeout: 20000
    });

    console.log(
        "Conexão segura com o TiDB estabelecida."
    );

    // Executa os arquivos SQL na ordem correta
    for (const fileName of sqlFiles) {
        const filePath = path.join(
            currentDir,
            fileName
        );

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `Arquivo SQL não encontrado: ${filePath}`
            );
        }

        const sql = fs.readFileSync(
            filePath,
            "utf8"
        );

        console.log(`Executando ${fileName}...`);

        await connection.query(sql);

        console.log(
            `${fileName} executado com sucesso.`
        );
    }

    // Verifica as tabelas criadas
    const [tables] = await connection.query(
        "SHOW TABLES FROM nexus_team"
    );

    console.log("\nTabelas encontradas em nexus_team:");

    for (const row of tables) {
        console.log(`- ${Object.values(row)[0]}`);
    }

    // Verifica os integrantes
    const [members] = await connection.query(
        "SELECT id, nome, cargo FROM nexus_team.membros ORDER BY id"
    );

    console.log(
        `\nIntegrantes cadastrados: ${members.length}`
    );

    for (const member of members) {
        console.log(
            `- ${member.nome} (${member.cargo})`
        );
    }

    // Verifica as publicações
    const [posts] = await connection.query(
        "SELECT id, titulo FROM nexus_team.posts ORDER BY id"
    );

    console.log(
        `\nPublicações cadastradas: ${posts.length}`
    );

    for (const post of posts) {
        console.log(`- ${post.titulo}`);
    }

    console.log("\nImportação concluída!");

} catch (error) {
    console.error(
        "\nFalha ao executar os arquivos SQL:"
    );

    console.error(error.message);

    process.exitCode = 1;

} finally {
    if (connection) {
        await connection.end();
        console.log("\nConexão encerrada.");
    }
}
