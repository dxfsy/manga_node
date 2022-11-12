const jwt = require("jsonwebtoken");

const secretKey = "secretKey";

// 生成token
const generateToken = function (payload) { 
  const token =
    jwt.sign(payload, secretKey, {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
  return token;
};

// 验证token
const verifyToken = function (req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: "404", msg: "token无效" });
    }
    console.log("verify decoded", decoded);
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken
}