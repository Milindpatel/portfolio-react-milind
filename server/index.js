const next = require('next');
const mongoose = require('mongoose');
const config = require('./config');
const { createApp } = require('./app');
const { createAuth } = require('./services/auth');

const dev = process.env.NODE_ENV !== 'production';

async function main() {
  await mongoose.connect(config.dbUri);
  console.log('Database connected');

  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  const app = createApp({ auth: createAuth(config), ownerRole: config.siteOwnerRole });
  app.use((req, res) => handle(req, res));

  app.listen(config.port, () => console.log(`> Ready on http://localhost:${config.port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
