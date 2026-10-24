import axios from 'axios';
import Cookies from 'js-cookie';
import { getCookieFromHeader } from './utils';

const isServer = typeof window === 'undefined';

const api = axios.create({
  // On the server, getInitialProps calls the API on the same Node process.
  baseURL: isServer ? `http://127.0.0.1:${process.env.PORT || 3000}/api/v1` : '/api/v1',
  timeout: 5000,
});

/** Builds the Authorization header from the jwt cookie (browser) or the incoming request (server). */
function authConfig(req) {
  const token = req ? getCookieFromHeader(req.headers.cookie, 'jwt') : Cookies.get('jwt');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

async function call(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    const data = error.response && error.response.data;
    throw new Error((data && (data.message || data.detail || data.title)) || error.message || 'Server error');
  }
}

// ------------ PORTFOLIOS --------------
export const getPortfolios = () => call(api.get('/portfolios'));
export const getPortfolioById = (id) => call(api.get(`/portfolios/${id}`));
export const createPortfolio = (data) => call(api.post('/portfolios', data, authConfig()));
export const updatePortfolio = (data) => call(api.patch(`/portfolios/${data._id}`, data, authConfig()));
export const deletePortfolio = (id) => call(api.delete(`/portfolios/${id}`, authConfig()));

// ------------ BLOGS --------------
export const getBlogs = () => call(api.get('/blogs'));
export const getBlogBySlug = (slug) => call(api.get(`/blogs/s/${encodeURIComponent(slug)}`));
export const getBlogById = (id, req) => call(api.get(`/blogs/${id}`, authConfig(req)));
export const getUserBlogs = (req) => call(api.get('/blogs/me', authConfig(req)));
export const createBlog = (data, lockId) => call(api.post(`/blogs?lockId=${lockId}`, data, authConfig()));
export const updateBlog = (data, id) => call(api.patch(`/blogs/${id}`, data, authConfig()));
export const deleteBlog = (id) => call(api.delete(`/blogs/${id}`, authConfig()));
