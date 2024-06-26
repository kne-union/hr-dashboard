const getColumns = ({ downloadFile }) => {
  return [
    {
      name: 'year',
      title: '年度',
      type: 'other',
      valueOf: item => item.dataCompany?.year
    },
    {
      name: 'company',
      title: '所属公司',
      type: 'other',
      valueOf: item => item.tenantOrg?.name
    },
    {
      name: 'tag',
      title: '标签',
      type: 'other',
      valueOf: item => item.dataCompany?.tag
    },
    {
      name: 'file',
      title: '文件',
      type: 'other',
      valueOf: item => downloadFile(item)
    },
    {
      name: 'createdAt',
      title: '创建时间',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      title: '修改时间',
      type: 'datetime'
    }
  ];
};

export default getColumns;
