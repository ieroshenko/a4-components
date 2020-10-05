module.exports = {
    ensureAuth: function (req, res, next) {
        if (!req.user) {
            res.status(401).json({
                authenticated: false,
                message: "user has not been authenticated"
            });
        } else {
            next();
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/home");
        } else {
            return next();
        }
    }
}
