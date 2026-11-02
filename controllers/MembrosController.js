
import express from "express";

const router = express.Router();

export const membros = [
    {
        id: 1,
        nome: "Laura Mathias",
        iniciais: "LM",
        cargo: "UX/UI Designer",
        descricao: "Contribui para o desenvolvimento das funcionalidades e integração das soluções da equipe.",
        imagem: "/images/membros/laura-mathias.jpg",
        github: "",
        linkedin: "",
        portfolio: ""
    },
    {
        id: 2,
        nome: "Luiz Henrique Cubas",
        iniciais: "LC",
        cargo: "Documentação e Design",
        descricao: "Responsável pela organização da documentação do projeto e pelo desenvolvimento dos elementos visuais, contribuindo para a clareza das informações e a identidade visual da equipe.",
        imagem: "/images/membros/luiz-cubas.jpg",
        github: "",
        linkedin: "",
        portfolio: ""
    },
    {
        id: 3,
        nome: "Mario Takahashi",
        iniciais: "MT",
        cargo: "Desenvolvedor Back-End",
        descricao: "Trabalha na lógica da aplicação, nas APIs e na integração dos dados.",
        imagem: "/images/membros/mario-takahashi.jpg",
        github: "",
        linkedin: "",
        portfolio: ""
    },
    {
        id: 4,
        nome: "Millie Morelli",
        iniciais: "MM",
        cargo: "Documentação e Desenvolver Front-End",
        descricao: "Responsável pela elaboração e organização da documentação do projeto, além do desenvolvimento das interfaces front-end, buscando garantir uma navegação intuitiva e uma boa experiência para os usuários.",
        imagem: "/images/membros/millie-morelli.jpg",
        github: "",
        linkedin: "",
        portfolio: ""
    },
    {
        id: 5,
        nome: "Victor Theodoro",
        iniciais: "VT",
        cargo: "Desenvolvedor Full-Stack",
        descricao: "Responsável pelo desenvolvimento e integração das funcionalidades do sistema, atuando tanto na construção das interfaces quanto na implementação da lógica e dos recursos do backend.",
        imagem: "/images/membros/victor-theodoro.jpg",
        github: "",
        linkedin: "",
        portfolio: ""
    }
];

router.use((req, res) => {
    res.redirect("/#equipe");
});

export default router;
