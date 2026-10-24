import Cookies from 'js-cookie';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import config from './config';
import { getCookieFromHeader } from './utils';

const issuer = `https://${config.auth0Domain}/`;
const jwks = createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`));

function baseUrl() {
  return typeof window === 'undefined' ? '' : window.location.origin;
}

let webAuth;
async function getWebAuth() {
  if (!webAuth) {
    const { default: auth0 } = await import('auth0-js');
    webAuth = new auth0.WebAuth({
      domain: config.auth0Domain,
      clientID: config.auth0ClientId,
      redirectUri: `${baseUrl()}/callback`,
      responseType: 'token id_token',
      scope: 'openid profile',
    });
  }
  return webAuth;
}

/** Verifies an Auth0 ID token (signature, issuer, audience, expiry). Returns its claims or undefined. */
export async function verifyToken(token) {
  if (!token) return undefined;
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: config.auth0ClientId });
    return payload;
  } catch {
    return undefined;
  }
}

export async function login() {
  (await getWebAuth()).authorize();
}

export async function logout() {
  Cookies.remove('jwt');
  (await getWebAuth()).logout({ returnTo: baseUrl(), clientID: config.auth0ClientId });
}

/** Called on /callback: reads the tokens from the URL hash and stores the ID token in a cookie. */
export async function handleAuthentication() {
  const auth = await getWebAuth();
  const result = await new Promise((resolve, reject) =>
    auth.parseHash((err, authResult) => (err ? reject(err) : resolve(authResult))),
  );
  if (!result || !result.idToken) throw new Error('Login failed');
  Cookies.set('jwt', result.idToken, {
    expires: new Date(Date.now() + (result.expiresIn || 3600) * 1000),
    sameSite: 'lax',
    secure: window.location.protocol === 'https:',
  });
}

export function clientAuth() {
  return verifyToken(Cookies.get('jwt'));
}

export function serverAuth(req) {
  return verifyToken(getCookieFromHeader(req && req.headers.cookie, 'jwt'));
}

export function isSiteOwner(user) {
  return !!user && user[`${config.namespace}/role`] === config.siteOwnerRole;
}
