import { createWithRemoteLoader } from '@kne/remote-loader';
import { Button } from 'antd';
import MappingTypeFormInner from './MappingTypeFormInner';

const FormInner = createWithRemoteLoader({
  modules: ['FormInfo', 'Global@usePreset']
})(({ remoteModules }) => {
  const [FormInfo, usePreset] = remoteModules;
  const { apis, ajax } = usePreset();
  const { Input, AdvancedSelect } = FormInfo.fields;
  const formModel = FormInfo.useFormModal();
  return (
    <FormInfo
      column={1}
      list={[
        <AdvancedSelect
          name="type"
          label="字典类型"
          rule="REQ"
          single
          extra={({ context }) => {
            return (
              <Button
                type="link"
                onClick={() => {
                  const modalApi = formModel({
                    title: '添加字典类型',
                    size: 'small',
                    formProps: {
                      onSubmit: async data => {
                        const { data: resData } = await ajax(Object.assign({}, apis.project.addOrSaveMappingType, { data }));
                        if (resData.code !== 0) {
                          return;
                        }
                        context.fetchApi.reload();
                        modalApi.close();
                      }
                    },
                    children: <MappingTypeFormInner />
                  });
                }}
              >
                添加字典类型
              </Button>
            );
          }}
          api={Object.assign({}, apis.project.getMappingTypeList, {
            transformData: data => {
              return {
                pageData: data,
                totalCount: data.length
              };
            }
          })}
        />,
        <Input name="label" label="字典显示" rule="REQ" />,
        <Input name="value" label="字典值" rule="REQ" />
      ]}
    />
  );
});

export default FormInner;
