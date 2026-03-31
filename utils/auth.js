const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, "secret");
        req.user = decoded; // có id
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};