const express = require('express');
const ctrl = require('../controllers/blog');

module.exports = ({ checkJWT, checkRole }, ownerRole) => {
  const router = express.Router();
  const owner = [checkJWT, checkRole(ownerRole)];

  router.get('/', ctrl.getBlogs);
  router.get('/me', owner, ctrl.getUserBlogs);
  router.get('/s/:slug', ctrl.getBlogBySlug);
  // Drafts are only visible to the owner.
  router.get('/:id', owner, ctrl.getBlogById);
  router.post('/', owner, ctrl.createBlog);
  router.patch('/:id', owner, ctrl.updateBlog);
  router.delete('/:id', owner, ctrl.deleteBlog);

  return router;
};
