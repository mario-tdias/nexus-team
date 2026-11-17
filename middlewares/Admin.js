// Verifica se o usuário autenticado possui permissão administrativa.
function Admin(req, res, next) {
    if (Number(req.session?.user?.ADM) === 1) {
        return next();
    }

    return res.status(403).send(
        "Acesso negado! Apenas administradores podem realizar esta ação."
    );
}

export default Admin;
