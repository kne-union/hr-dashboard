import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { Space, Button, App } from 'antd';
import FormInner from './FormInner';
import { useRef } from 'react';

const DataMapping = createWithRemoteLoader({
  modules: ['Layout@TablePage', 'Global@usePreset', 'FormInfo@useFormModal']
})(({ remoteModules }) => {
  const [TablePage, usePreset, useFormModal] = remoteModules;
  const { apis, ajax } = usePreset();
  const formModal = useFormModal();
  const { message } = App.useApp();
  const ref = useRef();
  return (
    <TablePage
      {...Object.assign({}, apis.project.getMappingList, {
        transformData: data => {
          return {
            pageData: data,
            totalCount: data.length
          };
        }
      })}
      pagination={{ open: false }}
      columns={[
        ...getColumns(),
        {
          name: 'options',
          type: 'options',
          valueOf: item => {
            return [
              {
                children: '编辑',
                onClick: () => {
                  const formModalApi = formModal({
                    title: '编辑数据字典',
                    size: 'small',
                    formProps: {
                      data: Object.assign({}, item),
                      onSubmit: async data => {
                        const { data: resData } = await ajax(
                          Object.assign({}, apis.project.addOrSaveMapping, {
                            data
                          })
                        );
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('添加成功');
                        formModalApi.close();
                        ref.current.reload();
                      }
                    },
                    children: <FormInner />
                  });
                }
              },
              {
                children: '删除',
                confirm: true,
                onClick: async () => {
                  const { data: resData } = await ajax(Object.assign({}, apis.project.deleteMapping, { data: { id: item.id } }));
                  if (resData.code !== 0) {
                    return;
                  }
                  message.success('删除成功');
                  ref.current.reload();
                }
              }
            ];
          }
        }
      ]}
      ref={ref}
      page={{
        titleExtra: (
          <Space align="center">
            <Button
              type="primary"
              onClick={() => {
                const formModalApi = formModal({
                  title: '添加数据字典',
                  size: 'small',
                  formProps: {
                    onSubmit: async data => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.project.addOrSaveMapping, {
                          data
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('添加成功');
                      formModalApi.close();
                      ref.current.reload();
                    }
                  },
                  children: <FormInner />
                });
              }}
            >
              添加数据字典
            </Button>
          </Space>
        )
      }}
    />
  );
});

export default DataMapping;
