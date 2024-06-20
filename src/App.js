import { Routes, Route, Navigate } from 'react-router-dom';
import pages from './pages';
import MainLayout, { BeforeLoginLayout, AfterUserLoginLayout, AfterAdminUserLoginLayout } from './MainLayout';
import './index.scss';

const { Home, Detail, Account, Admin, DataMapping, InitAdmin, Error, NotFound } = pages;

const App = ({ globalPreset }) => {
  return (
    <Routes>
      <Route path="account" element={<BeforeLoginLayout preset={globalPreset} themeToken={globalPreset.themeToken} />}>
        <Route path="*" element={<Account baseUrl="/account" />} />
      </Route>
      <Route path="admin/initAdmin" element={<AfterUserLoginLayout preset={globalPreset} themeToken={globalPreset.themeToken} paths={[]} />}>
        <Route index element={<InitAdmin baseUrl="/admin" />} />
      </Route>
      <Route
        path="admin"
        element={
          <AfterAdminUserLoginLayout
            preset={globalPreset}
            themeToken={globalPreset.themeToken}
            navigation={{
              showIndex: false,
              base: '/admin',
              list: [
                {
                  key: 'home',
                  title: '首页',
                  path: '/admin'
                },
                {
                  key: 'tenant',
                  title: '租户管理',
                  path: '/admin/tenant'
                },
                {
                  key: 'user',
                  title: '用户管理',
                  path: '/admin/user'
                },
                {
                  key: 'permission',
                  title: '应用权限管理',
                  path: '/admin/permission'
                },
                {
                  key: 'mapping',
                  title: '数据字典管理',
                  path: '/admin/mapping'
                }
              ]
            }}
          />
        }
      >
        <Route index element={<Admin baseUrl="/admin" />} />
        <Route path="/admin/mapping" element={<DataMapping />} />
        <Route path="*" element={<Admin baseUrl="/admin" />} />
      </Route>
      <Route element={<AfterUserLoginLayout preset={globalPreset} themeToken={globalPreset.themeToken} paths={[]} />}>
        <Route index element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="admin/*" element={<InitAdmin baseUrl="/admin" />} />
      </Route>
      <Route element={<MainLayout preset={globalPreset} themeToken={globalPreset.themeToken} paths={[]} />}>
        <Route path="error" element={<Error />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  );
};

export default App;
