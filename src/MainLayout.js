import { createWithRemoteLoader } from '@kne/remote-loader';
import { Outlet } from 'react-router-dom';
import { SuperAdminInfo, UserInfo } from './Authenticate';

const Global = createWithRemoteLoader({
  modules: ['components-core:Global']
})(({ remoteModules, paths, preset, children, ...props }) => {
  const [Global] = remoteModules;

  return (
    <Global {...props} preset={preset}>
      {children}
    </Global>
  );
});

const GlobalLayout = createWithRemoteLoader({
  modules: ['components-core:Layout', 'components-core:Global']
})(({ remoteModules, navigation, title, preset, children, ...props }) => {
  const [Layout, Global] = remoteModules;
  return (
    <Global {...props} preset={preset}>
      <Layout
        navigation={{
          defaultTitle: title,
          ...navigation
        }}
      >
        {children}
      </Layout>
    </Global>
  );
});

const MainLayout = props => {
  return (
    <GlobalLayout {...props}>
      <Outlet />
    </GlobalLayout>
  );
};

export default MainLayout;

export const AfterUserLoginLayout = props => {
  console.log('AfterUserLoginLayout');
  return (
    <GlobalLayout {...props}>
      <UserInfo>
        <Outlet />
      </UserInfo>
    </GlobalLayout>
  );
};

export const AfterAdminUserLoginLayout = props => {
  console.log('AfterAdminUserLoginLayout');
  return (
    <GlobalLayout {...props}>
      <SuperAdminInfo>
        <Outlet />
      </SuperAdminInfo>
    </GlobalLayout>
  );
};

export const BeforeLoginLayout = props => {
  console.log('BeforeLoginLayout');
  return (
    <Global {...props}>
      <Outlet />
    </Global>
  );
};
