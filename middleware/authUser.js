const jwt=require("jsonwebtoken");
const isUser = async(req, res, next) => {

  console.log("Is User");
  try {
    const Authentication = req.headers["authorization"];
    const token = Authentication.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRETE_KEY);
    console.log("token Verified");
    console.log(decoded);

    if (decoded.role!= "user" ) {
      return res.status(403).json({ message: "Access Denied , User only" });
    }

    return next();
  } catch (err) {
    if (err instanceof jwt.NotBeforeError) {
      return res.status(401).json({ message: "Token is not active" });
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

module.exports = isUser;