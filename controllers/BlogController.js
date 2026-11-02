
import express from "express";

const router = express.Router();

export const posts = [
    {
        id: 1,
        titulo: "Conheça a equipe Nexus",
        categoria: "Equipe",
        autor: "Equipe Nexus",
        data: "02/11/2026",
        imagem: "/images/nexus-hero-bg.png",
        resumo: "Conheça os integrantes da Nexus, suas áreas de atuação e como cada um contribui para os projetos da equipe."
    },
    {
        id: 2,
        titulo: "Tecnologia, inovação e colaboração",
        categoria: "Tecnologia",
        autor: "Equipe Nexus",
        data: "02/11/2026",
        imagem: "/images/nexus-hero-bg.png",
        resumo: "Acompanhe as iniciativas, ideias e soluções desenvolvidas pela equipe Nexus."
    }
];

router.use((req, res) => {
    res.redirect("/#blog");
});

export default router;
