const getColumns = () => {
  return [
    {
      name: 'employeeName',
      title: '员工姓名',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'serialNumber',
      title: '工号',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'location',
      title: '工作所在地',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'employeeType',
      title: '员工类别',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'supplierName',
      title: '供应商名称',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'supplierServiceFee',
      title: '供应商服务费(含税)',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'positionName',
      title: '岗位名称',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'positionType',
      title: '岗位类别',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'rank',
      title: '职级',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'kpi',
      title: '绩效评定',
      groupHeader: [
        {
          name: 'basicInfo',
          title: '员工基础信息'
        }
      ],
      type: 'other'
    },
    {
      name: 'employmentStatus',
      title: '在职状态',
      groupHeader: [
        {
          name: 'inTheCaseOfLeaving',
          title: '在离职情况'
        }
      ],
      type: 'other'
    },
    {
      name: 'entryTime',
      title: '入职时间',
      groupHeader: [
        {
          name: 'inTheCaseOfLeaving',
          title: '在离职情况'
        }
      ],
      type: 'other'
    },
    {
      name: 'resignationTime',
      title: '离职时间',
      groupHeader: [
        {
          name: 'inTheCaseOfLeaving',
          title: '在离职情况'
        }
      ],
      type: 'other'
    },
    {
      name: 'monthsOfEmployment',
      title: '在职月份',
      groupHeader: [
        {
          name: 'inTheCaseOfLeaving',
          title: '在离职情况'
        }
      ],
      type: 'other'
    },
    {
      name: 'resignationCompensation',
      title: '离职补偿金',
      groupHeader: [
        {
          name: 'inTheCaseOfLeaving',
          title: '在离职情况'
        }
      ],
      type: 'other'
    },
    {
      name: 'basicSalary',
      title: '基本工资/月',
      groupHeader: [
        {
          name: 'salary',
          title: '薪资'
        }
      ],
      type: 'other'
    },
    {
      name: 'bonus',
      title: '(月度/季度)奖金/提成',
      groupHeader: [
        {
          name: 'salary',
          title: '薪资'
        }
      ],
      type: 'other'
    },
    {
      name: 'yearEndBonus',
      title: '年终奖',
      groupHeader: [
        {
          name: 'salary',
          title: '薪资'
        }
      ],
      type: 'other'
    },
    {
      name: 'mealAllowance',
      title: '饭补/月',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'transportationAllowance',
      title: '交通补贴/月',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'communicationAllowance',
      title: '通讯补贴/月',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'maternityAllowance',
      title: '生育津贴',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'festivalAllowance',
      title: '过节费/年',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'heatstrokePreventionAllowance',
      title: '防暑降温补贴',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'heatingAllowance',
      title: '供暖费',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'winterAllowance',
      title: '防寒补贴',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'otherAllowance',
      title: '其他补贴/年',
      groupHeader: [
        {
          name: 'allowance',
          title: '补贴补助'
        }
      ],
      type: 'other'
    },
    {
      name: 'socialSecurityBase',
      title: '社保基数',
      groupHeader: [
        {
          name: 'securityBase',
          title: '缴纳基数'
        }
      ],
      type: 'other'
    },
    {
      name: 'providentFundBase',
      title: '公积金基数',
      groupHeader: [
        {
          name: 'securityBase',
          title: '缴纳基数'
        }
      ],
      type: 'other'
    },
    {
      name: 'personalEndowmentInsurance',
      title: '养老(个人部分)',
      groupHeader: [
        {
          name: 'personalInsurance',
          title: '社保个人部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'personalMedicalInsurance',
      title: '医疗(个人部分)',
      groupHeader: [
        {
          name: 'personalInsurance',
          title: '社保个人部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'personalUnemploymentInsurance',
      title: '失业(个人部分)',
      groupHeader: [
        {
          name: 'personalInsurance',
          title: '社保个人部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'personalProvidentFund',
      title: '公积金(个人部分)',
      groupHeader: [
        {
          name: 'personalInsurance',
          title: '社保个人部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'personalIncomeTax',
      title: '个人所得税/年度',
      groupHeader: [
        {
          name: 'personalInsurance',
          title: '社保个人部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'enterpriseEndowmentInsurance',
      title: '养老(企业部分)',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'enterpriseMedicalInsurance',
      title: '医疗(企业部分)',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'enterpriseUnemploymentInsurance',
      title: '失业(企业部分)',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'injuryInsurance',
      title: '工伤保险',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'maternityInsurance',
      title: '生育保险',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'enterpriseProvidentFund',
      title: '公积金(企业部分)',
      groupHeader: [
        {
          name: 'enterpriseInsurance',
          title: '五险一金企业部分'
        }
      ],
      type: 'other'
    },
    {
      name: 'companyAnnuity',
      title: '企业年金/补充养老险',
      groupHeader: [
        {
          name: 'additionalInsurance',
          title: '额外保险细项'
        }
      ],
      type: 'other'
    },
    {
      name: 'supplementaryMedicalInsurance',
      title: '补充医疗险',
      groupHeader: [
        {
          name: 'additionalInsurance',
          title: '额外保险细项'
        }
      ],
      type: 'other'
    },
    {
      name: 'criticalIllnessInsurance',
      title: '重疾险',
      groupHeader: [
        {
          name: 'additionalInsurance',
          title: '额外保险细项'
        }
      ],
      type: 'other'
    },
    {
      name: 'accidentInsurance',
      title: '意外险',
      groupHeader: [
        {
          name: 'additionalInsurance',
          title: '额外保险细项'
        }
      ],
      type: 'other'
    },
    {
      name: 'otherInsurance',
      title: '其他保险',
      groupHeader: [
        {
          name: 'additionalInsurance',
          title: '额外保险细项'
        }
      ],
      type: 'other'
    },
    {
      name: 'disabilityBenefits',
      title: '残保金',
      type: 'other'
    },
    {
      name: 'unionFees',
      title: '工会费用',
      type: 'other'
    },
    {
      name: 'laborInsuranceFee',
      title: '劳保费',
      groupHeader: [
        {
          name: 'welfareExpenses',
          title: '福利支出'
        }
      ],
      type: 'other'
    },
    {
      name: 'annualPhysicalExamination',
      title: '年度体检',
      groupHeader: [
        {
          name: 'welfareExpenses',
          title: '福利支出'
        }
      ],
      type: 'other'
    },
    {
      name: 'otherBenefits',
      title: '其他福利',
      groupHeader: [
        {
          name: 'welfareExpenses',
          title: '福利支出'
        }
      ],
      type: 'other'
    },
    {
      name: 'otherCostDetails',
      title: '其他成本细项',
      groupHeader: [
        {
          name: 'otherCost',
          title: '其他成本'
        }
      ],
      type: 'other'
    },
    {
      name: 'otherCostAmounts',
      title: '其他成本总金额',
      groupHeader: [
        {
          name: 'otherCost',
          title: '其他成本'
        }
      ],
      type: 'other'
    }
  ];
};

export default getColumns;
