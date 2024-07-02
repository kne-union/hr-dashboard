import { createWithRemoteLoader } from '@kne/remote-loader';
import { useNavigate, useParams } from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import dayjs from 'dayjs';
import { App } from 'antd';
import { useRef } from 'react';
import { BasicForInner, EmployeeFormInner } from '@components/DataSetFormInner';

const Detail = createWithRemoteLoader({
  modules: ['Layout@TablePage', 'Descriptions', 'InfoPage', 'Global@usePreset', 'components-view:PageHeader@PageHeaderInner', 'File@Download', 'FormInfo@useFormModal']
})(({ remoteModules }) => {
  const [TablePage, Descriptions, InfoPage, usePreset, PageHeader, Download, useFormModal] = remoteModules;
  const { id } = useParams();
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const formModal = useFormModal();
  const ref = useRef();
  return (
    <Fetch
      {...Object.assign({}, apis.project.getDataDetail, {
        params: { id }
      })}
      render={({ data, reload }) => {
        const dataOthers = [];
        (data.dataCompany?.dataOthers || []).forEach((item, index) => {
          const targetIndex = Math.floor(index / 2);
          if (!dataOthers[targetIndex]) {
            dataOthers[targetIndex] = [];
          }
          dataOthers[targetIndex].push({ label: item.name, content: `${Number(item.fee || 0).toLocaleString()}元` });
        });

        return (
          <Fetch
            url={`${window.PUBLIC_URL}/columns.json`}
            ignoreSuccessState
            render={({ data: columns }) => {
              return (
                <TablePage
                  {...Object.assign({}, apis.project.getFileData, { params: { id: data.id } })}
                  ref={ref}
                  columns={[
                    ...columns.map(item => {
                      if ((item.rule || '').indexOf('PERCENT') > -1) {
                        return Object.assign({}, item, {
                          valueOf: (item, { name }) => `${parseInt(item[name] * 100)}%`
                        });
                      }
                      if ((item.rule || '').indexOf('MONEY') > -1) {
                        return Object.assign({}, item, {
                          valueOf: (item, { name }) => `${Number(item[name] || 0).toLocaleString()}元`
                        });
                      }
                      return item;
                    }),
                    {
                      name: 'options',
                      title: '操作',
                      fixed: 'right',
                      type: 'options',
                      valueOf: item => {
                        return [
                          {
                            children: '删除',
                            confirm: true,
                            onClick: async () => {
                              const { data: resData } = await ajax(
                                Object.assign({}, apis.project.deleteFileDataSource, {
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
                  topArea={
                    <>
                      <InfoPage>
                        <InfoPage.Part title="所属公司">{data.tenantOrg?.name}</InfoPage.Part>
                        <InfoPage.Part title="公司数据">
                          <InfoPage.Part>
                            <Descriptions
                              dataSource={[
                                [
                                  {
                                    label: '供应商服务费',
                                    content: `${Number(data.dataCompany?.serviceFee || 0).toLocaleString()}元`
                                  },
                                  {
                                    label: '招聘费用',
                                    content: `${Number(data.dataCompany?.recruitmentFee || 0).toLocaleString()}元`
                                  }
                                ],
                                [
                                  {
                                    label: '培训费用',
                                    content: `${Number(data.dataCompany?.trainingFee || 0).toLocaleString()}元`
                                  },
                                  {
                                    label: '差旅招待报销费用',
                                    content: `${Number(data.dataCompany?.travelFee || 0).toLocaleString()}元`
                                  }
                                ]
                              ]}
                            />
                          </InfoPage.Part>
                          {data.dataCompany?.dataOthers && data.dataCompany?.dataOthers.length > 0 && (
                            <InfoPage.Part title="其他管理费用">
                              <Descriptions dataSource={dataOthers} />
                            </InfoPage.Part>
                          )}
                        </InfoPage.Part>
                        <InfoPage.Part title="员工数据" />
                      </InfoPage>
                    </>
                  }
                  page={{
                    header: (
                      <PageHeader
                        info={`更新时间:${dayjs(data.updatedAt).format('YYYY-MM-DD hh:mm:ss')}`}
                        title={`${data.dataCompany?.year}年度${data.dataCompany?.tag ? `-${data.dataCompany?.tag}` : ''}`}
                        buttonOptions={{
                          list: [
                            {
                              type: 'primary',
                              children: '编辑',
                              onClick: () => {
                                const formApi = formModal({
                                  title: '编辑',
                                  formProps: {
                                    data: Object.assign({}, data.dataCompany, {
                                      tenantOrgId: data.tenantOrgId
                                    }),
                                    onSubmit: async formData => {
                                      const { data: resData } = await ajax(
                                        Object.assign({}, apis.project.saveCompanyData, {
                                          data: Object.assign({}, formData, { id: data.id })
                                        })
                                      );
                                      if (resData.code !== 0) {
                                        return;
                                      }
                                      message.success('公司信息修改成功');
                                      formApi.close();
                                      reload();
                                    }
                                  },
                                  children: <BasicForInner />
                                });
                              }
                            },
                            {
                              children: '重新上传',
                              onClick: () => {
                                const formApi = formModal({
                                  title: '重新上传数据集',
                                  formProps: {
                                    onSubmit: async formData => {
                                      const { data: resData } = await ajax(
                                        Object.assign({}, apis.project.reuploadData, {
                                          data: Object.assign({}, formData, { id: data.id })
                                        })
                                      );
                                      if (resData.code !== 0) {
                                        return;
                                      }
                                      message.success('重新上传数据集成功');
                                      formApi.close();
                                      ref.current.reload();
                                    }
                                  },
                                  children: <EmployeeFormInner />
                                });
                              }
                            },
                            {
                              buttonComponent: Download,
                              id: data.fileId,
                              icon: null,
                              filename: `文件${data.dataCompany?.year || ''}${data.dataCompany?.tag || ''}`,
                              children: '下载源文件'
                            },
                            {
                              children: '删除',
                              confirm: true,
                              onClick: async () => {
                                const { data: resData } = await ajax(
                                  Object.assign({}, apis.project.deleteFileData, {
                                    data: { id: data.id }
                                  })
                                );
                                if (resData.code !== 0) {
                                  return;
                                }
                                message.success('删除成功');
                                navigate('/', { replace: true });
                              }
                            }
                          ]
                        }}
                      />
                    )
                  }}
                />
              );
            }}
          />
        );
      }}
    />
  );
});

export default Detail;
