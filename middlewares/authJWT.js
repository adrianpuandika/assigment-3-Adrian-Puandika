const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const headers = req.headers;

  if (!headers.authorization) {
    res.sendStatus(401);
    return;
  }

  if (headers.authorization.split(" ")[0] !== "Bearer") {
    res.sendStatus(401);
    return;
  }

  const token = headers.authorization.split(" ")[1];
  jwt.verify(token, "A2_AP", async (err, decoded) => {
    if (err) {
      res.sendStatus(401);
      return;
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateJWT;
