const fastify = require('fastify')({
  logger: true, querystringParser: str => require('qs').parse(str)
});

const fastifyEnv = require('@fastify/env');

const path = require('path');

fastify.register(fastifyEnv, {
  dotenv: true, schema: {
    type: 'object', required: ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'], properties: {
      DB_HOST: { type: 'string' },
      DB_USERNAME: { type: 'string' },
      DB_PASSWORD: { type: 'string' },
      DB_DATABASE: { type: 'string' },
      ENV: { type: 'string' }
    }
  }
});

fastify.register(require('fastify-plugin')(async (fastify) => {
  fastify.register(require('@kne/fastify-sequelize'), {
    db: {
      dialect: 'mysql',
      host: fastify.config.DB_HOST,
      database: fastify.config.DB_DATABASE,
      username: fastify.config.DB_USERNAME,
      password: fastify.config.DB_PASSWORD
    }, modelsGlobOptions: {
      syncOptions: {}
    }
  });
}));

fastify.register(require('@kne/fastify-file-manager'), {
  root: path.resolve('./static')
});

fastify.register(require('@kne/fastify-account'), { isTest: true });

fastify.register(require('fastify-plugin')(async (fastify) => {
  fastify.register(require('@kne/fastify-namespace'), {
    options: {
      prefix: '/api'
    },
    name: 'project',
    modules: [['models', await fastify.sequelize.addModels(path.resolve(__dirname, './models'))], ['services', path.resolve(__dirname, './services')], ['controllers', path.resolve(__dirname, './controllers')]]
  });
  await fastify.sequelize.sync();
}));


fastify.register(require('@kne/fastify-response-data-format'));

fastify.listen({ port: 8040 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});

