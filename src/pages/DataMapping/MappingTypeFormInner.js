import { createWithRemoteLoader } from '@kne/remote-loader';

const MappingTypeFormInner = createWithRemoteLoader({
  modules: ['FormInfo']
})(({ remoteModules }) => {
  const [FormInfo] = remoteModules;
  const { Input } = FormInfo.fields;
  return <FormInfo column={1} list={[<Input name="label" label="类型显示" rule="REQ" />, <Input name="value" label="类型值" rule="REQ" />]} />;
});

export default MappingTypeFormInner;
