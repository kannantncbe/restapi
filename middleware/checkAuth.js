function checkAuth(req, res, next) {
    console.log(req.headers['authorization']);
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    next();
}

module.exports = checkAuth;