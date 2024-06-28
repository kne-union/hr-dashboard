import { createWithRemoteLoader } from '@kne/remote-loader';
import { Space } from 'antd';
import Fetch from '@kne/react-fetch';

const EmployeeFormInner = createWithRemoteLoader({
  modules: ['Global@usePreset', 'FormInfo', 'File@FileLink', 'File@Download', 'Icon']
})(({ remoteModules }) => {
  const [usePreset, FormInfo, FileLink, Download, Icon] = remoteModules;
  const { Upload } = FormInfo.fields;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.project.getTenantSetting)}
      render={({ data }) => {
        return (
          <FormInfo
            title="员工数据"
            extra={
              <FileLink
                id={data.helpFileId}
                modalProps={{
                  title: '填写说明'
                }}
              >
                <Space>
                  <Icon colorful type="icon-color-warning-tianchong" style={{ display: 'block' }} />
                  <span>查看填写说明</span>
                </Space>
              </FileLink>
            }
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
                  <Download type="link" id={data.templateFileId} filename="数据模板.xlsx">
                    点击下载excel模板
                  </Download>
                }
              />
            ]}
          />
        );
      }}
    />
  );
});

export default EmployeeFormInner;
