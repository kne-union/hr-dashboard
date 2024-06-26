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
        const others = [];
        (data.dataCompany?.others || []).forEach((item, index) => {
          const targetIndex = index % 2;
          if (!others[targetIndex]) {
            others[targetIndex] = [];
          }
          others[targetIndex].push({ label: item.name, content: `${item.fee}元` });
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
                    ...columns,
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
                                  { label: '供应商服务费', content: `${data.dataCompany?.serviceFee}元` },
                                  {
                                    label: '招聘费用',
                                    content: `${data.dataCompany?.recruitmentFee}元`
                                  }
                                ],
                                [
                                  {
                                    label: '培训费用',
                                    content: `${data.dataCompany?.trainingFee}元`
                                  },
                                  { label: '差旅招待报销费用', content: `${data.dataCompany?.travelFee}元` }
                                ]
                              ]}
                            />
                          </InfoPage.Part>
                          {data.dataCompany?.others && data.dataCompany?.others.length > 0 && (
                            <InfoPage.Part title="其他管理费用">
                              <Descriptions dataSource={others} />
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
                              children: '修改公司信息',
                              onClick: () => {
                                const formApi = formModal({
                                  title: '修改公司信息',
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
