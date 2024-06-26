import { createWithRemoteLoader } from '@kne/remote-loader';
import { Typography } from 'antd';

const EmployeeFormInner = createWithRemoteLoader({
  modules: ['FormInfo']
})(({ remoteModules }) => {
  const [FormInfo] = remoteModules;
  const { Upload } = FormInfo.fields;
  return (
    <FormInfo
      title="员工数据"
      column={1}
      list={[
        <Upload
          name="file"
          label="文件"
          rule="REQ"
          interceptor="array-single"
          maxLength={1}
          accept={['.xls', '.xlsx']}
          description={
            <Typography.Link href={`${window.PUBLIC_URL}/template.xlsx`} download="数据模板.xlsx">
              点击下载excel模板
            </Typography.Link>
          }
        />
      ]}
    />
  );
});

export default EmployeeFormInner;
