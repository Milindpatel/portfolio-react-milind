// Settings shared by the server and the browser. NEXT_PUBLIC_* values are
// inlined into the client bundle at build time, so never put secrets here.
const config = {
  auth0Domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'dev-j74a-lgr.auth0.com',
  auth0ClientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'BcWtmT44o3qekMok0eJPxkW581XJWLJH',
  // Custom claim namespace configured in the Auth0 rule that adds the user's role.
  namespace: process.env.NEXT_PUBLIC_AUTH0_NAMESPACE || 'https://milind-portfolio.herokuapp.com',
  siteOwnerRole: 'siteOwner',
  cvUrl: process.env.NEXT_PUBLIC_CV_URL || '',
};

module.exports = config;
