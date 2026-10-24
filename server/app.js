const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const portfolioRoutes = require('./routes/portfolio');
const blogRoutes = require('./routes/blog');

/** Builds the Express app with the JSON API. The Next.js handler is added by server/index.js. */
function createApp({ auth, ownerRole = 'siteOwner' }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/v1/portfolios', portfolioRoutes(auth, ownerRole));
  app.use('/api/v1/blogs', blogRoutes(auth, ownerRole));
  app.use('/api', (req, res) => res.status(404).json({ title: 'Not found' }));

  // Express 5 forwards errors thrown in async handlers here.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ title: 'Unauthorized', detail: 'Unauthorized Access!' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(404).json({ title: 'Not found' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).json({ title: 'Invalid data', message: err.message });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ title: 'Invalid JSON' });
    }
    console.error(err);
    return res.status(500).json({ title: 'Server error' });
  });

  return app;
}

module.exports = { createApp };
