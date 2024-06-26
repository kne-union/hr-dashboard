const fp = require('fastify-plugin');
const path = require('path');
const fileParse = require('../utils/file-parse');
const { InternalServerError } = require('http-errors');

module.exports = fp(async (fastify) => {
  const getMappingList = async () => {
    return await fastify.project.models.dataMapping.findAll({
      include: fastify.project.models.dataMappingType, order: [['type', 'DESC']]
    });
  };

  const getMappingTypeList = async () => {
    return await fastify.project.models.dataMappingType.findAll();
  };

  const addOrSaveMappingType = async ({ value, label }) => {
    const current = await fastify.project.models.dataMappingType.findOne({
      where: {
        value
      }
    });
    if (!current) {
      await fastify.project.models.dataMappingType.create({ value, label });
      return;
    }
    current.label = label;
    await current.save();
  };

  const addOrSaveMapping = async (mapping) => {
    const { type, value, label } = mapping;
    if (!await fastify.project.models.dataMappingType.findOne({
      value: type
    })) {
      throw new Error('字典类型不存在');
    }
    const current = await fastify.project.models.dataMapping.findOne({
      where: {
        type, value
      }
    });
    if (!current) {
      await fastify.project.models.dataMapping.create({
        value, type, label
      });
      return;
    }
    ['type', 'label'].forEach(key => {
      if (mapping[key]) {
        current[key] = mapping[key];
      }
    });

    await current.save();
  };

  const deleteMapping = async ({ id }) => {
    const current = await fastify.project.models.dataMapping.findByPk(id);
    if (!current) {
      throw new Error('字典值已不存在');
    }

    await current.destroy();
  };

  const getDataList = async ({ filter, perPage, currentPage, createTenantUserId }) => {
    const queryFilter = {
      createTenantUserId
    };

    const dataCompanyQuery = {};

    if (filter['year']) {
      dataCompanyQuery['year'] = filter['year'];
    }

    if (filter['tag']) {
      dataCompanyQuery['tag'] = {
        [fastify.sequelize.Sequelize.Op.like]: `%${filter['tag']}%`
      };
    }

    const { count, rows } = await fastify.project.models.dataFile.findAndCountAll({
      include: [{
        model: fastify.project.models.dataCompany, where: Object.assign({}, dataCompanyQuery)
      }, fastify.account.models.tenantOrg],
      where: Object.assign({}, queryFilter),
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const getDataDetail = async ({ id, createTenantUserId }) => {
    return await fastify.project.models.dataFile.findByPk(id, {
      include: [fastify.project.models.dataCompany, fastify.account.models.tenantOrg], where: {
        createTenantUserId
      }
    });
  };

  const excelFileParse = async ({ file }) => {
    const fileInfo = await fastify.fileManager.services.fileRecord.getFileInfo({ id: file.id });
    const parseRes = await fileParse(path.resolve(fastify.fileManager.options.root, fileInfo.targetFileName));
    if (!parseRes.result) {
      const output = await fastify.fileManager.services.fileRecord.uploadToFileSystem({
        file: {
          toBuffer: () => parseRes.errorFile,
          mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          encoding: '7bit',
          filename: 'output.xlsx'
        }
      });
      const error = new InternalServerError(output.id);
      error.code = 561;
      throw error;
    }

    if (!(parseRes.output && parseRes.output.length > 0)) {
      throw new Error('员工数据不能为空');
    }

    return parseRes;
  };

  const addData = async ({
                           year,
                           tag,
                           tenantOrgId,
                           serviceFee,
                           recruitmentFee,
                           trainingFee,
                           travelFee,
                           others,
                           file,
                           createTenantUserId,
                           tenantId
                         }) => {
    const parseRes = await excelFileParse({ file });
    const t = await fastify.sequelize.instance.transaction();
    try {
      const dataFile = await fastify.project.models.dataFile.create({
        fileId: file.id, createTenantUserId: createTenantUserId, tenantOrgId, tenantId
      }, { transaction: t });

      await fastify.project.models.dataSource.bulkCreate(parseRes.output.map((item) => Object.assign({}, item, {
        dataFileId: dataFile.id, tenantId
      })), { transaction: t });

      await fastify.project.models.dataCompany.create({
        year, tag, serviceFee, recruitmentFee, trainingFee, travelFee, others, dataFileId: dataFile.id, tenantId
      }, { transaction: t });

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const saveCompanyData = async ({ id, ...targetData }) => {
    const dataFile = await fastify.project.models.dataFile.findByPk(id);
    if (!dataFile) {
      throw new Error('数据集已不存在');
    }
    const dataCompany = await fastify.project.models.dataCompany.findOne({
      where: {
        dataFileId: dataFile.id
      }
    });

    if (!dataCompany) {
      throw new Error('关联的公司信息已不存在');
    }
    ['year', 'tag', 'tenantOrgId', 'serviceFee', 'recruitmentFee', 'trainingFee', 'travelFee', 'others'].forEach((name) => {
      if (targetData[name]) {
        dataCompany[name] = targetData[name];
      }
    });

    await dataCompany.save();
  };

  const reuploadData = async ({ id, tenantId, file }) => {
    const parseRes = await excelFileParse({ file });
    const dataFile = await fastify.project.models.dataFile.findByPk(id);
    if (!dataFile) {
      throw new Error('数据集已不存在');
    }
    const t = await fastify.sequelize.instance.transaction();
    try {
      await fastify.project.models.dataSource.destroy({
        where: {
          dataFileId: dataFile.id
        }, transaction: t
      });
      await fastify.project.models.dataSource.bulkCreate(parseRes.output.map((item) => Object.assign({}, item, {
        dataFileId: dataFile.id, tenantId
      })), { transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getFileData = async ({ id, filter, perPage, currentPage, createTenantUserId }) => {
    const queryFilter = Object.assign({}, { dataFileId: id });

    if (!await getDataDetail({ id, createTenantUserId })) {
      throw new Error('数据未找到');
    }


    const { count, rows } = await fastify.project.models.dataSource.findAndCountAll({
      where: queryFilter, offset: currentPage * (currentPage - 1), limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const deleteFileDataSource = async ({ id }) => {
    const dataSource = await fastify.project.models.dataSource.findByPk(id);
    if (!dataSource) {
      throw new Error('数据不存在');
    }

    await dataSource.destroy();
  };

  const deleteFileData = async ({ id }) => {
    const dataFile = await fastify.project.models.dataFile.findByPk(id);
    if (!dataFile) {
      throw new Error('数据不存在');
    }
    const t = await fastify.sequelize.instance.transaction();
    try {
      await fastify.project.models.dataSource.destroy({
        where: {
          dataFileId: dataFile.id
        }, transaction: t
      });

      await fastify.project.models.dataCompany.destroy({
        where: {
          dataFileId: dataFile.id
        }, transaction: t
      });

      await dataFile.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.project.services.main = {
    getMappingList,
    addOrSaveMapping,
    addOrSaveMappingType,
    getMappingTypeList,
    deleteMapping,
    getDataList,
    getDataDetail,
    getFileData,
    addData,
    reuploadData,
    saveCompanyData,
    deleteFileDataSource,
    deleteFileData
  };
});
