const fastify = require('fastify')({
  logger: true, querystringParser: str => require('qs').parse(str)
});

const fastifyEnv = require('@fastify/env');

const path = require('path');

fastify.register(fastifyEnv, {
  dotenv: true, schema: {
    type: 'object', properties: {
      DB_DIALECT: { type: 'string', default: 'sqlite' },
      DB_HOST: { type: 'string' },
      DB_USERNAME: { type: 'string' },
      DB_PASSWORD: { type: 'string' },
      DB_DATABASE: { type: 'string' },
      ENV: { type: 'string', default: 'local' },
      PORT: { type: 'number', default: 8040 }
    }
  }
});

fastify.register(require('fastify-plugin')(async (fastify) => {
  fastify.register(require('@kne/fastify-sequelize'), {
    db: {
      dialect: fastify.config.DB_DIALECT,
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
}, {
  name: 'project', dependencies: ['fastify-account']
}));


fastify.register(require('@kne/fastify-response-data-format'));

fastify.then(() => {
  fastify.listen({ port: fastify.config.PORT }, (err, address) => {
    if (err) throw err;
    // Server is now listening on ${address}
  });
});



