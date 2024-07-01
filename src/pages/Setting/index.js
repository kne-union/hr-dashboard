import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import get from 'lodash/get';
import { App, Space } from 'antd';

const Setting = createWithRemoteLoader({
  modules: ['Layout@Page', 'InfoPage', 'Global@usePreset', 'FormInfo', 'File@Download']
})(({ remoteModules }) => {
  const [Page, InfoPage, usePreset, FormInfo, Download] = remoteModules;
  const { ajax, apis } = usePreset();
  const { Upload } = FormInfo.fields;
  const { message } = App.useApp();
  return (
    <Page name="setting" title="设置">
      <Fetch
        {...Object.assign({}, apis.project.getTenantSetting)}
        render={({ data, reload }) => {
          return (
            <InfoPage>
              <InfoPage.Part title="员工信息模板">
                <Space direction={'vertical'}>
                  {data.templateFileId ? (
                    <Download type="link" id={data.templateFileId} filename="员工信息模板.xlsx">
                      员工信息模板.xlsx
                    </Download>
                  ) : (
                    '暂未设置'
                  )}
                  <Upload.Field
                    value={null}
                    accept={['.xls', '.xlsx']}
                    maxLength={1}
                    onChange={async file => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.project.saveTenantSetting, {
                          data: {
                            templateFileId: get(file, '[0].id')
                          }
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('保存成功');
                      reload();
                    }}
                  >
                    上传文件
                  </Upload.Field>
                </Space>
              </InfoPage.Part>
              <InfoPage.Part title="员工信息填写说明">
                <Space direction={'vertical'}>
                  {data.employeeHelperFileId ? (
                    <Download type="link" id={data.employeeHelperFileId} filename="员工信息填写说明.pdf">
                      员工信息填写说明.pdf
                    </Download>
                  ) : (
                    '暂未设置'
                  )}
                  <Upload.Field
                    value={null}
                    accept={['.pdf']}
                    maxLength={1}
                    onChange={async file => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.project.saveTenantSetting, {
                          data: {
                            employeeHelperFileId: get(file, '[0].id')
                          }
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('保存成功');
                      reload();
                    }}
                  >
                    上传文件
                  </Upload.Field>
                </Space>
              </InfoPage.Part>
              <InfoPage.Part title="公司信息填写说明">
                <Space direction={'vertical'}>
                  {data.companyHelperFileId ? (
                    <Download type="link" id={data.companyHelperFileId} filename="公司信息填写说明.pdf">
                      公司信息填写说明.pdf
                    </Download>
                  ) : (
                    '暂未设置'
                  )}
                  <Upload.Field
                    value={null}
                    accept={['.pdf']}
                    maxLength={1}
                    onChange={async file => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.project.saveTenantSetting, {
                          data: {
                            companyHelperFileId: get(file, '[0].id')
                          }
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('保存成功');
                      reload();
                    }}
                  >
                    上传文件
                  </Upload.Field>
                </Space>
              </InfoPage.Part>
            </InfoPage>
          );
        }}
      />
    </Page>
  );
});

export default Setting;
