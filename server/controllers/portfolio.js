const Portfolio = require('../models/portfolio');
const { pick } = require('../services/sanitize');

exports.getPortfolios = async (req, res) => {
  const portfolios = await Portfolio.find({}).sort({ startDate: -1 }).select('-__v');
  res.json(portfolios);
};

exports.getPortfolioById = async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).select('-__v');
  if (!portfolio) return res.status(404).json({ title: 'Not found' });
  res.json(portfolio);
};

exports.savePortfolio = async (req, res) => {
  const portfolio = new Portfolio(pick(req.body, Portfolio.editableFields));
  portfolio.userId = req.auth.sub;
  await portfolio.save();
  res.status(201).json(portfolio);
};

exports.updatePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) return res.status(404).json({ title: 'Not found' });

  const updates = pick(req.body, Portfolio.editableFields);
  // An explicit null end date means "still working here".
  if (req.body && req.body.endDate === null) updates.endDate = undefined;
  portfolio.set(updates);
  await portfolio.save();
  res.json(portfolio);
};

exports.deletePortfolio = async (req, res) => {
  const deleted = await Portfolio.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ title: 'Not found' });
  res.json({ status: 'DELETED' });
};
