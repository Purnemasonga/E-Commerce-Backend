const jwt=require("jsonwebtoken");
const isAdmin = async(req, res, next) => {

  console.log("Is Admin");
  try {
    const Authentication = req.headers["authorization"];
    const token = Authentication.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRETE_KEY);
    console.log("token Verified");
    console.log(decoded);

    if (decoded.role != "admin") {
      return res.status(403).json({ message: "Access Denied , Admin only" });
    }

    return next();
  } catch (err) {
    if (err instanceof jwt.NotBeforeError) {
      return res.status(401).json({ message: "Token still not active" });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token Expired" });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "invalid token" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = isAdmin;