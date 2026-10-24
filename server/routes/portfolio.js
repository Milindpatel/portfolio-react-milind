const express = require('express');
const ctrl = require('../controllers/portfolio');

module.exports = ({ checkJWT, checkRole }, ownerRole) => {
  const router = express.Router();
  const owner = [checkJWT, checkRole(ownerRole)];

  router.get('/', ctrl.getPortfolios);
  router.get('/:id', ctrl.getPortfolioById);
  router.post('/', owner, ctrl.savePortfolio);
  router.patch('/:id', owner, ctrl.updatePortfolio);
  router.delete('/:id', owner, ctrl.deletePortfolio);

  return router;
};
