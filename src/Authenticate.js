import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';

export const UserInfo = createWithRemoteLoader({
  modules: ['components-core:Global@SetGlobal', 'components-core:Global@usePreset']
})(({ remoteModules, children }) => {
  const [SetGlobal, usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.account.getUserInfo)}
      render={({ data }) => {
        return (
          <SetGlobal globalKey="userInfo" value={data} needReady>
            {children}
          </SetGlobal>
        );
      }}
    />
  );
});

export const SuperAdminInfo = createWithRemoteLoader({
  modules: ['components-core:Global@SetGlobal', 'components-core:Global@usePreset']
})(({ remoteModules, children }) => {
  const [SetGlobal, usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.account.getSuperAdminInfo)}
      render={({ data }) => {
        return (
          <SetGlobal globalKey="userInfo" value={data} needReady>
            {children}
          </SetGlobal>
        );
      }}
    />
  );
});
