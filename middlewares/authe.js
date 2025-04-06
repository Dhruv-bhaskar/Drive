const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/user/unauthorized')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Corrected: attach to req.user, not res.user

        return next();
    } catch (err) {
        return res.redirect('/user/unauthorized')
    }
}


module.exports = auth