const { expressjwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/**
 * Creates the JWT middlewares. In production tokens are Auth0 ID tokens
 * verified against the tenant's JWKS. Tests pass `secret` + `algorithms`
 * to verify locally signed tokens instead.
 */
function createAuth({ auth0Domain, auth0ClientId, namespace, secret, algorithms }) {
  const checkJWT = expressjwt({
    secret:
      secret ||
      jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
      }),
    audience: auth0ClientId,
    issuer: `https://${auth0Domain}/`,
    algorithms: algorithms || ['RS256'],
  });

  const checkRole = (role) => (req, res, next) => {
    if (req.auth && req.auth[`${namespace}/role`] === role) {
      return next();
    }
    return res.status(403).json({ title: 'Not Authorized', detail: 'You are not authorized to access this data' });
  };

  return { checkJWT, checkRole };
}

module.exports = { createAuth };
