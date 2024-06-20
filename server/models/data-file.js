module.exports = (sequelize, DataTypes) => {
  const dataFile = sequelize.define('dataFile', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, fileId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantOrgId: {
      type: DataTypes.INTEGER, allowNull: false
    }, createTenantUserId: {
      type: DataTypes.UUID, allowNull: false
    }
  }, {
    paranoid: true
  });

  dataFile.associate = ({ dataFile, dataCompany }) => {
    dataFile.hasOne(dataCompany, { foreignKey: 'dataFileId' });
  };

  return dataFile;
};
