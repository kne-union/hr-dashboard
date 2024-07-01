const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate } = fastify.account;
  const { services } = fastify.project;
  fastify.get(`${options.prefix}/getMappingList`, {
    onRequest: [authenticate.user, authenticate.admin]
  }, async () => {
    return await services.main.getMappingList();
  });

  fastify.get(`${options.prefix}/getMappingTypeList`, {
    onRequest: [authenticate.user, authenticate.admin]
  }, async () => {
    return await services.main.getMappingTypeList();
  });

  fastify.post(`${options.prefix}/addOrSaveMappingType`, {
    onRequest: [authenticate.user, authenticate.admin], schema: {
      body: {
        type: 'object', required: ['value', 'label'], properties: {
          value: { type: 'string' }, label: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await services.main.addOrSaveMappingType(request.body);
    return {};
  });


  fastify.post(`${options.prefix}/addOrSaveMapping`, {
    onRequest: [authenticate.user, authenticate.admin], schema: {
      body: {
        type: 'object', required: ['value', 'type', 'label'], properties: {
          value: { type: 'string' }, type: { type: 'string' }, label: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    await services.main.addOrSaveMapping(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/deleteMapping`, {
    onRequest: [authenticate.user, authenticate.admin], schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'number' }
        }
      }
    }
  }, async (request) => {
    const { id } = request.body;
    await services.main.deleteMapping({ id });
    return {};
  });

  fastify.get(`${options.prefix}/getDataList`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      query: {
        type: 'object', properties: {
          filter: {
            type: 'object', properties: {
              year: { type: 'string' }, tag: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request) => {
    const { filter, perPage, currentPage } = Object.assign({
      perPage: 20, currentPage: 1, filter: {}
    }, request.query);

    return await services.main.getDataList({
      filter, perPage, currentPage, createTenantUserId: request.tenantInfo.tenantUser.id
    });
  });

  fastify.get(`${options.prefix}/getDataDetail`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      query: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { id } = request.query;
    return await services.main.getDataDetail({ id, createTenantUserId: request.tenantInfo.tenantUser.id });
  });

  fastify.get(`${options.prefix}/getFileData`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
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
    return await services.main.getFileData({
      id, filter, perPage, currentPage, createTenantUserId: request.tenantInfo.tenantUser.id
    });
  });

  fastify.post(`${options.prefix}/addData`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object', required: ['year', 'file'], properties: {
          year: { type: 'string' },
          tenantOrgId: { type: 'number' },
          tag: { type: 'string' },
          serviceFee: { type: 'number' },
          recruitmentFee: { type: 'number' },
          trainingFee: { type: 'number' },
          travelFee: { type: 'number' },
          dataOthers: {
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
    const tenantId = request.tenantInfo.tenant.id, createTenantUserId = request.tenantInfo.tenantUser.id;
    await services.main.addData(Object.assign({}, request.body, { tenantId, createTenantUserId }));
    return {};
  });

  fastify.post(`${options.prefix}/reuploadData`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object', required: ['id', 'file'], properties: {
          id: { type: 'number' }, file: {
            type: 'object', required: ['id'], properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request) => {
    const tenantId = request.tenantInfo.tenant.id;
    await services.main.reuploadData(Object.assign({}, request.body, { tenantId }));
    return {};
  });

  fastify.post(`${options.prefix}/saveCompanyData`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object',
        required: ['id', 'year', 'serviceFee', 'recruitmentFee', 'trainingFee', 'travelFee'],
        properties: {
          id: { type: 'string' },
          year: { type: 'string' },
          tenantOrgId: { type: 'number' },
          tag: { type: 'string' },
          serviceFee: { type: 'number' },
          recruitmentFee: { type: 'number' },
          trainingFee: { type: 'number' },
          travelFee: { type: 'number' },
          dataOthers: {
            type: 'array', items: {
              type: 'object', required: ['name', 'fee'], properties: {
                name: { type: 'string' }, fee: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async (request) => {
    await services.main.saveCompanyData(Object.assign({}, request.body));
    return {};
  });

  fastify.post(`${options.prefix}/deleteFileDataSource`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const createTenantUserId = request.tenantInfo.tenantUser.id;
    await services.main.deleteFileDataSource(Object.assign({}, request.body, { createTenantUserId }));
    return {};
  });

  fastify.post(`${options.prefix}/deleteFileData`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object', required: ['id'], properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const createTenantUserId = request.tenantInfo.tenantUser.id;
    await services.main.deleteFileData(Object.assign({}, request.body, { createTenantUserId }));
    return {};
  });

  // getTenantSetting
  fastify.get(`${options.prefix}/getTenantSetting`, {
    onRequest: [authenticate.user, authenticate.tenant]
  }, async (request) => {
    const tenantId = request.tenantInfo.tenant.id;
    return await services.main.getTenantSetting({ tenantId });
  });

  fastify.post(`${options.prefix}/saveTenantSetting`, {
    onRequest: [authenticate.user, authenticate.tenant], schema: {
      body: {
        type: 'object', properties: {
          templateFileId: { type: 'string' },
          employeeHelperFileId: { type: 'string' },
          companyHelperFileId: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const tenantId = request.tenantInfo.tenant.id;
    await services.main.saveTenantSetting(Object.assign({}, request.body, { tenantId }));
    return {};
  });
});
