const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/getMappingList`, {
    onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin]
  }, async () => {
    return await fastify.project.services.main.getMappingList();
  });

  fastify.get(`${options.prefix}/getMappingTypeList`, {
    onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin]
  }, async () => {
    return await fastify.project.services.main.getMappingTypeList();
  });

  fastify.post(`${options.prefix}/addOrSaveMappingType`, {
    onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin], schema: {
      body: {
        type: 'object', required: ['value', 'label'], properties: {
          value: { type: 'string' }, label: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await fastify.project.services.main.addOrSaveMappingType(request.body);
    return {};
  });


  fastify.post(`${options.prefix}/addOrSaveMapping`, {
    onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin], schema: {
      body: {
        type: 'object', required: ['value', 'type', 'label'], properties: {
          value: { type: 'string' }, type: { type: 'string' }, label: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await fastify.project.services.main.addOrSaveMapping(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/deleteMapping`, {
    onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin], schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'number' }
        }
      }
    }
  }, async (request) => {
    const { id } = request.body;
    await fastify.project.services.main.deleteMapping({ id });
    return {};
  });

  fastify.get(`${options.prefix}/getDataList`, {
    schema: {
      query: {
        type: 'object', properties: {
          filter: {
            type: 'object', properties: {
              type: { type: 'number' }
            }
          }
        }
      }
    }
  }, async (request) => {
    const { filter, perPage, currentPage } = Object.assign({
      perPage: 20, currentPage: 1, filter: {}
    }, request.query);
    return await fastify.project.services.main.getDataList({ filter, perPage, currentPage });
  });

  fastify.get(`${options.prefix}/getDataDetail`, {
    schema: {
      query: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { id } = request.query;
    return await fastify.project.services.main.getDataDetail({ id });
  });

  fastify.get(`${options.prefix}/getFileData`, {
    schema: {
      query: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { filter, perPage, currentPage, id } = Object.assign({
      perPage: 20, currentPage: 1, filter: {}
    }, request.query);
    return await fastify.project.services.main.getFileData({ id, filter, perPage, currentPage });
  });

  fastify.post(`${options.prefix}/addData`, {
    schema: {
      body: {
        type: 'object',
        required: ['year', 'file', 'serviceFee', 'recruitmentFee', 'trainingFee', 'travelFee'],
        properties: {
          year: { type: 'string' },
          tag: { type: 'string' },
          serviceFee: { type: 'number' },
          recruitmentFee: { type: 'number' },
          trainingFee: { type: 'number' },
          travelFee: { type: 'number' },
          others: {
            type: 'array', items: {
              type: 'object', required: ['name', 'fee'], properties: {
                name: { type: 'string' }, fee: { type: 'number' }
              }
            }
          },
          file: {
            type: 'object', required: ['id'], properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request) => {
    await fastify.project.services.main.addData(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/deleteFileDataSource`, {
    schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await fastify.project.services.main.deleteFileDataSource(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/deleteFileData`, {
    schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await fastify.project.services.main.deleteFileData(request.body);
    return {};
  });
});
