import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { Space, Button, App, Alert, Flex } from 'antd';
import { useRef, useState } from 'react';
import FormInner from './FormInner';
import { useNavigate } from 'react-router-dom';

const Home = createWithRemoteLoader({
  modules: ['Layout@TablePage', 'Global@usePreset', 'FormInfo@useFormModal', 'Modal@useModal', 'File@Download', 'Filter']
})(({ remoteModules }) => {
  const [TablePage, usePreset, useFormModal, useModal, Download, Filter] = remoteModules;
  const { fields: filterFields, getFilterValue } = Filter;
  const { InputFilterItem, DatePickerFilterItem } = filterFields;
  const { apis, ajax } = usePreset();
  const formModal = useFormModal();
  const modal = useModal();
  const { message } = App.useApp();
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();
  const ref = useRef();
  return (
    <TablePage
      {...Object.assign({}, apis.project.getDataList, {})}
      columns={[
        ...getColumns({
          downloadFile: ({ fileId, dataCompany }) => {
            return (
              <Download type="link" id={fileId} filename={`文件${dataCompany?.year || ''}${dataCompany?.tag || ''}`}>
                下载源文件
              </Download>
            );
          }
        }),
        {
          name: 'options',
          title: '操作',
          type: 'options',
          fixed: 'right',
          valueOf: item => {
            return [
              {
                children: '查看数据',
                onClick: () => {
                  navigate(`/detail/${item.id}`);
                }
              },
              {
                children: '重新上传'
              },
              {
                children: '删除',
                confirm: true,
                onClick: async () => {
                  const { data: resData } = await ajax(
                    Object.assign({}, apis.project.deleteFileData, {
                      data: { id: item.id }
                    })
                  );
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
        filter: {
          value: filter,
          onChange: setFilter,
          list: [
            [
              <DatePickerFilterItem
                label="年度"
                name="year"
                picker="year"
                interceptor={value => {
                  console.log(value);
                  return value;
                }}
              />,
              <InputFilterItem label="标签" name="tag" />
            ]
          ]
        },
        titleExtra: (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const formModalApi = formModal({
                  title: '添加数据',
                  formProps: {
                    onSubmit: async data => {
                      const response = await ajax(
                        Object.assign({}, apis.project.addData, {
                          data: Object.assign({}, data),
                          showError: false
                        })
                      );
                      const { data: resData } = response;
                      if (resData.code === 561) {
                        const modalApi = modal({
                          title: '数据校验失败',
                          size: 'small',
                          footer: null,
                          children: (
                            <Flex vertical gap={8} justify="center">
                              <Alert type="error" message="您上传的数据不符合验证规则，请点击文件下载按钮补充或更改数据后重新上传" />
                              <Download
                                type="primary"
                                className="btn-no-padding"
                                id={resData.msg}
                                filename="数据核对"
                                onSuccess={() => {
                                  modalApi.close();
                                }}
                              >
                                文件下载
                              </Download>
                            </Flex>
                          )
                        });
                        return;
                      }
                      if (resData.code !== 0) {
                        message.error(resData.msg);
                        return;
                      }
                      message.success('添加成功');
                      ref.current.reload();
                      formModalApi.close();
                    }
                  },
                  children: <FormInner />
                });
              }}
            >
              添加数据
            </Button>
          </Space>
        )
      }}
    >
      我是首页
    </TablePage>
  );
});

export default Home;
