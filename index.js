
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import MembrosController, {
    membros
} from "./controllers/MembrosController.js";

import BlogController, {
    posts
} from "./controllers/BlogController.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Disponibiliza variáveis para todas as páginas EJS
app.use((req, res, next) => {
    res.locals.usuario = null;
    res.locals.membros = membros;
    res.locals.posts = posts;

    next();
});

// Página inicial
app.get("/", (req, res) => {
    res.render("index", {
        title: "Nexus | Nossa Equipe",
        membros,
        posts
    });
});

// Rotas dos controllers
app.use("/membros", MembrosController);
app.use("/blog", BlogController);

// Rotas de autenticação desativadas nesta versão
app.get(["/login", "/cadastro", "/logout"], (req, res) => {
    res.redirect("/");
});

// Página não encontrada
app.use((req, res) => {
    res.status(404).send("Página não encontrada.");
});

// Execução local
// Na Vercel, a aplicação é exportada para o ambiente da plataforma.
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });
}

export default app;
