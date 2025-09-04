const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Auth0 configuration
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
};

// JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Verify Auth0 JWT token
function verifyAuth0Token(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, auth0Config, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: "1h",
  auth0Config,
  verifyAuth0Token
};