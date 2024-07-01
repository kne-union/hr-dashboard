import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { Space } from 'antd';

const BasicForInner = createWithRemoteLoader({
  modules: ['Global@usePreset', 'FormInfo', 'FormInfo@useFormContext', 'components-account:OrgTreeSelect@OrgTenantTreeSelect', 'File@FileLink', 'Icon']
})(({ remoteModules, children }) => {
  const [usePreset, FormInfo, useFormContext, OrgTenantTreeSelect, FileLink, Icon] = remoteModules;
  const { DatePicker, Input, MoneyInput, Switch } = FormInfo.fields;
  const { List } = FormInfo;
  const { apis } = usePreset();
  const { formData } = useFormContext();
  return (
    <>
      <FormInfo
        title="基本信息"
        column={1}
        list={[<DatePicker name="year" label="年份" rule="REQ" picker="year" interceptor="year-string" />, <OrgTenantTreeSelect name="tenantOrgId" label="所属公司" rule="REQ" single />, <Input name="tag" label="标签" />]}
      />
      {children}
      <Fetch
        {...Object.assign({}, apis.project.getTenantSetting, { cache: 'tenant-setting' })}
        render={({ data }) => {
          return (
            <FormInfo
              title="公司信息"
              extra={
                <FileLink
                  id={data.companyHelperFileId}
                  modalProps={{
                    title: '公司信息填写说明'
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
                <Switch name="notHasCompanyInfo" label="是否稍后填写公司信息" />,
                ...(formData.notHasCompanyInfo
                  ? []
                  : [
                      <MoneyInput name="serviceFee" label="供应商服务费" rule="REQ" />,
                      <MoneyInput name="recruitmentFee" label="招聘费用" rule="REQ" />,
                      <MoneyInput name="trainingFee" label="培训费用" rule="REQ" />,
                      <MoneyInput name="travelFee" label="差旅招待报销费用" rule="REQ" />,
                      <List title="其他管理费用" name="dataOthers" list={[<Input name="name" label="费用名称" rule="REQ" />, <MoneyInput name="fee" label="费用" rule="REQ" />]} />
                    ])
              ]}
            />
          );
        }}
      />
    </>
  );
});

export default BasicForInner;
