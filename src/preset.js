import React from 'react';
import { preset as fetchPreset } from '@kne/react-fetch';
import { Empty, message, Spin } from 'antd';
import axios from 'axios';
import { loadModule, preset as remoteLoaderPreset } from '@kne/remote-loader';
import omit from 'lodash/omit';
import dayjs from 'dayjs';
import { getCookies } from './common/cookies';
import * as apis from './apis';

window.PUBLIC_URL = window.runtimePublicUrl || process.env.PUBLIC_URL;

const registry = {
  url: 'https://uc.fatalent.cn',
  tpl: '{{url}}/packages/@kne-components/{{remote}}/{{version}}/build'
};

const componentsCoreRemote = {
  ...registry,
  remote: 'components-core',
  defaultVersion: '0.1.75'
};

export const globalInit = async () => {
  const ajax = (() => {
    const instance = axios.create({
      validateStatus: function () {
        return true;
      }
    });

    instance.interceptors.request.use(config => {
      const token = getCookies('X-User-Token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(response => {
      if (response.status === 401 || response.data.code === 401) {
        const searchParams = new URLSearchParams(window.location.search);
        const referer = encodeURIComponent(window.location.pathname + window.location.search);
        searchParams.append('referer', referer);
        window.location.href = '/account/login?' + searchParams.toString();
        response.showError = false;
      }
      return response;
    });

    instance.interceptors.response.use(
      response => {
        if (response.status !== 200) {
          response.showError !== false && response.config.showError !== false && message.error(response?.data?.msg || '请求发生错误');
        }
        return response;
      },
      error => {
        message.error(error.message || '请求发生错误');
        return Promise.reject(error);
      }
    );

    return params => {
      if (params.hasOwnProperty('loader') && typeof params.loader === 'function') {
        return Promise.resolve(params.loader(omit(params, ['loader'])))
          .then(data => ({
            data: {
              code: 0,
              data
            }
          }))
          .catch(err => {
            message.error(err.message || '请求发生错误');
            return { data: { code: 500, msg: err.message } };
          });
      }
      return instance(params);
    };
  })();

  fetchPreset({
    ajax,
    loading: (
      <Spin
        delay={500}
        style={{
          position: 'absolute',
          left: '50%',
          padding: '10px',
          transform: 'translateX(-50%)'
        }}
      />
    ),
    error: null,
    empty: <Empty />,
    transformResponse: response => {
      const { data } = response;
      response.data = {
        code: data.code === 0 ? 200 : data.code,
        msg: data.msg,
        results: data.data
      };
      return response;
    }
  });

  remoteLoaderPreset({
    remotes: {
      default: componentsCoreRemote,
      'components-core': componentsCoreRemote,
      'components-iconfont': {
        ...registry,
        remote: 'components-iconfont',
        defaultVersion: '0.1.6'
      },
      'components-view': {
        ...registry,
        remote: 'components-view',
        defaultVersion: '0.1.16'
      },
      'components-account': {
        ...registry,
        remote: 'components-account',
        defaultVersion: '0.2.6'
      },
      'hr-dashboard':
        process.env.NODE_ENV === 'development'
          ? {
              remote: 'hr-dashboard',
              url: '/',
              tpl: '{{url}}'
            }
          : {
              ...registry,
              remote: 'hr-dashboard',
              defaultVersion: process.env.DEFAULT_VERSION
            }
    }
  });

  const getApis = (await loadModule('components-account:Apis@getApis')).default;

  return {
    ajax,
    apis: Object.assign(
      {},
      {
        account: getApis(),
        oss: {
          url: '/api/static/file-url/{id}',
          paramsType: 'urlParams',
          ignoreSuccessState: true
        },
        ossUpload: async ({ file }) => {
          return await axios.postForm('/api/static/upload', { file });
        }
      },
      { project: apis }
    ),
    themeToken: {
      colorPrimary: '#4F185A',
      colorPrimaryHover: '#702280'
    },
    formInfo: ({ interceptors }) => {
      interceptors.input.use('year-string', value => {
        return value ? dayjs(value) : null;
      });

      interceptors.output.use('year-string', value => {
        return value ? dayjs(value.valueOf()).format('YYYY') : '';
      });
    }
  };
};
