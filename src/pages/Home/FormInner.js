import { createWithRemoteLoader } from '@kne/remote-loader';
import { Typography } from 'antd';

const FormInner = createWithRemoteLoader({
  modules: ['FormInfo']
})(({ remoteModules }) => {
  const [FormInfo] = remoteModules;
  const { DatePicker, Input, MoneyInput, Upload } = FormInfo.fields;
  const { List } = FormInfo;
  return (
    <>
      <FormInfo title="基本信息" column={1} list={[<DatePicker name="year" label="年份" rule="REQ" picker="year" interceptor="year-string" />, <Input name="tag" label="标签" />]} />
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
    </>
  );
});

export default FormInner;
