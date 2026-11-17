// Verifica se existe uma sessão autenticada.
function Auth(req, res, next) {
    if (req.session?.user) {
        return next();
    }

    return res.status(401).render("login", { loggedOut: true });
}

export default Auth;
