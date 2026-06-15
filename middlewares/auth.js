const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token;
    if (authHeader) {
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }
    }

    if (!token) return res.status(401).json({ error: "Missing token" });

    jwt.verify(token, 'wolt-secret', (err, user) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

function isManager(req, res, next) {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Managers only" });
    }
}

function optionalAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token;
    if (authHeader) {
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }
    }

    if (!token) return next();

    jwt.verify(token, 'wolt-secret', (err, user) => {
        if (!err) {
            req.user = user;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    optionalAuthenticateToken,
    isManager
};
