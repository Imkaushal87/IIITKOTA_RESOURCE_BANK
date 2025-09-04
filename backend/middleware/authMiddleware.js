const jwt = require("jsonwebtoken");
const { verifyAuth0Token } = require("../config/auth");

function parseBearerToken(headerValue) {
  if (!headerValue) return null;
  if (headerValue.startsWith("Bearer ")) return headerValue.slice(7);
  return headerValue;
}

async function authMiddleware(req, res, next) {
  try {
    const raw = req.header("Authorization");
    const token = parseBearerToken(raw);
    
    if (!token) {
      return res.status(401).json({ message: "Access denied - No token provided" });
    }

    let decoded;
    
    // Try Auth0 verification first
    if (process.env.AUTH0_DOMAIN) {
      try {
        decoded = await verifyAuth0Token(token);
      } catch (auth0Error) {
        // Fall back to local JWT if Auth0 fails
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (localError) {
          return res.status(401).json({ message: "Invalid token" });
        }
      }
    } else {
      // Use local JWT verification
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    req.user = decoded || {};
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
}

function optionalAuthMiddleware(req, res, next) {
  const raw = req.header("Authorization");
  const token = parseBearerToken(raw);
  
  if (!token) {
    req.user = {};
    return next();
  }

  // Try Auth0 verification first
  if (process.env.AUTH0_DOMAIN) {
    verifyAuth0Token(token)
      .then(decoded => {
        req.user = decoded || {};
        next();
      })
      .catch(() => {
        // Fall back to local JWT
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded || {};
        } catch (err) {
          req.user = {};
        }
        next();
      });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded || {};
    } catch (err) {
      req.user = {};
    }
    next();
  }
}

module.exports = { authMiddleware, optionalAuthMiddleware };