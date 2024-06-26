import { createWithRemoteLoader } from '@kne/remote-loader';

const BasicForInner = createWithRemoteLoader({
  modules: ['FormInfo', 'components-account:OrgTreeSelect@OrgTenantTreeSelect']
})(({ remoteModules }) => {
  const [FormInfo, OrgTenantTreeSelect] = remoteModules;
  const { DatePicker, Input, MoneyInput } = FormInfo.fields;
  const { List } = FormInfo;
  return (
    <>
      <FormInfo
        title="基本信息"
        column={1}
        list={[<DatePicker name="year" label="年份" rule="REQ" picker="year" interceptor="year-string" />, <OrgTenantTreeSelect name="tenantOrgId" label="所属公司" rule="REQ" single />, <Input name="tag" label="标签" />]}
      />
      <FormInfo
        title="公司信息"
        column={1}
        list={[
          <MoneyInput name="serviceFee" label="供应商服务费" rule="REQ" />,
          <MoneyInput name="recruitmentFee" label="招聘费用" rule="REQ" />,
          <MoneyInput name="trainingFee" label="培训费用" rule="REQ" />,
          <MoneyInput name="travelFee" label="差旅招待报销费用" rule="REQ" />,
          <List title="其他管理费用" name="others" list={[<Input name="name" label="费用名称" rule="REQ" />, <MoneyInput name="fee" label="费用" rule="REQ" />]} />
        ]}
      />
    </>
  );
});

export default BasicForInner;
