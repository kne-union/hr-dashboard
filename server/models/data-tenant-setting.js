module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.STRING, allowNull: false
      },
      templateFileId: DataTypes.STRING, helpFileId: DataTypes.STRING
    }
  };
};
