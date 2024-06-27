module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
      }, tenantId: {
        type: DataTypes.STRING, allowNull: false
      }, fileId: {
        type: DataTypes.STRING, allowNull: false
      }, tenantOrgId: {
        type: DataTypes.INTEGER, allowNull: false
      }, createTenantUserId: {
        type: DataTypes.UUID, allowNull: false
      }
    }, associate: ({ dataFile, dataCompany }, fastify) => {
      const { tenantOrg } = fastify.account.models;
      dataFile.hasOne(dataCompany);
      dataFile.belongsTo(tenantOrg);
    }
  };
};
