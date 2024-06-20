const getColumns = () => {
  return [
    {
      name: 'type',
      title: '类型',
      type: 'other',
      valueOf({ dataMappingType }) {
        return dataMappingType?.label;
      }
    },
    {
      name: 'label',
      title: '字典显示',
      type: 'other'
    },
    {
      name: 'value',
      title: '字典值',
      type: 'other'
    }
  ];
};

export default getColumns;
