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

  const getDataList = async ({ filter, perPage, currentPage }) => {
    const { count, rows } = await fastify.project.models.dataFile.findAndCountAll({
      include: [fastify.project.models.dataCompany], offset: currentPage * (currentPage - 1), limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const getDataDetail = async ({ id }) => {
    return await fastify.project.models.dataFile.findByPk(id, {
      include: [fastify.project.models.dataCompany]
    });
  };

  const addData = async ({ year, tag, serviceFee, recruitmentFee, trainingFee, travelFee, others, file }) => {
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
    const t = await fastify.sequelize.instance.transaction();
    try {
      const dataFile = await fastify.project.models.dataFile.create({
        fileId: file.id,
        createTenantUserId: '697601ee-fc3e-4943-9abd-4fdd09fa8b16',
        tenantOrgId: 2,
        tenantId: '878a3e14-750f-4594-87e0-0720f4c441cf'
      }, { transaction: t });

      await fastify.project.models.dataSource.bulkCreate(parseRes.output.map((item) => Object.assign({}, item, {
        dataFileId: dataFile.id, tenantId: '878a3e14-750f-4594-87e0-0720f4c441cf'
      })), { transaction: t });

      await fastify.project.models.dataCompany.create({
        year,
        tag,
        serviceFee,
        recruitmentFee,
        trainingFee,
        travelFee,
        others,
        dataFileId: dataFile.id,
        tenantId: '878a3e14-750f-4594-87e0-0720f4c441cf'
      }, { transaction: t });

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }

  };

  const getFileData = async ({ id, filter, perPage, currentPage }) => {
    const queryFilter = Object.assign({}, { dataFileId: id });
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
    deleteFileDataSource,
    deleteFileData
  };
});
