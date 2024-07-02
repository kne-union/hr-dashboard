const xlsx = require('node-xlsx').default;
const transform = require('lodash/transform');
const isPlainObject = require('lodash/isPlainObject');
const getValues = require('lodash/values');
const isArray = require('lodash/isArray');
const isNumber = require('lodash/isNumber');
const columns = require('../../public/columns.json');
const fs = require('fs-extra');
const ExcelJS = require('exceljs');

const isNotEmpty = value => {
  if (isPlainObject(value)) {
    const values = getValues(value);
    return values.length > 0 && values.some(item => !!item);
  } else if (isArray(value)) {
    return value.length > 0;
  } else if (typeof value === 'number') {
    return !isNaN(value);
  } else {
    return !(value === undefined || value === null || value === '' || value.length === 0);
  }
};

const writeErrorMessage = async (filePath, errors) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet1 = workbook.getWorksheet('A-员工维度');
  errors.forEach((item) => {
    const { index, colIndex, msg, value } = item;
    const row = sheet1.getRow(index + 3);
    const cell = row.getCell(colIndex + 1);
    cell.style = Object.assign({}, cell.style, {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }
    });
    cell.value = `${value || ''}[${msg}]`;
  });

  return await workbook.xlsx.writeBuffer();
};

const fileParse = async (filePath, options) => {
  options = Object.assign({}, options);
  const REQ = (value) => {
    return {
      result: isNotEmpty(value), msg: '%s不能为空'
    };
  };

  const DATE = (value) => {
    return {
      result: !isNaN(Date.parse(value)), msg: '%s必须为日期类型:YYYY/MM/DD'
    };
  };

  const ENUM = async (value, item, args) => {
    if (options.enumValidate) {
      return await options.enumValidate({ type: args[0], value, item });
    }
    return {
      result: true
    };
  };

  const EMPLOYEE_TYPE_REQ = (value, item) => {
    return {
      result: ['派遣', '外包'].indexOf(item['employeeType']) > -1 ? !!value : true, msg: '员工类型为派遣或外包时%s必填'
    };
  };

  const EMPLOYMENT_STATUS_REQ = (value, item) => {
    return {
      result: item['employmentStatus'] === '离职' ? !!value : true, msg: '在职状态为离职时%s必填'
    };
  };


  const MONEY = (value) => {
    return {
      result: isNumber(value), msg: '%s必须为数字类型'
    };
  };

  const MONTH = (value) => {
    return {
      result: isNumber(value) && value >= 1 && value <= 12, msg: '%s必须为1-12合法月份'
    };
  };

  const PERCENT = (value) => {
    return {
      result: isNumber(value) && value >= 0 && value <= 1, msg: '%s必须为0-100%的百分比'
    };
  };

  const ruleMapping = { REQ, DATE, EMPLOYEE_TYPE_REQ, EMPLOYMENT_STATUS_REQ, MONEY, MONTH, PERCENT, ENUM };

  const validateList = async (list) => {
    const errors = [];

    await Promise.all(list.map(async (item, index) => {
      await Promise.all(columns.map(async (column, colIndex) => {
        if (!column.rule) {
          return;
        }
        const rules = column.rule.split(' ');
        const hasREQ = rules[0] === 'REQ';
        for (let rule of rules) {
          const [current, ...args] = rule.split('-');
          if (!hasREQ && current !== 'REQ' && !ruleMapping['REQ'](item[column.name], item, args).result) {
            continue;
          }

          const { result, msg } = await ruleMapping[current](item[column.name], item, args);
          if (!result) {
            errors.push({
              index,
              colIndex,
              name: column.name,
              title: column.title,
              value: item[column.name],
              msg: msg.replace('%s', column.title)
            });
            break;
          }
        }
      }));
    }));

    return errors;
  };


  const file = await fs.readFile(filePath);
  const excelData = xlsx.parse(file, {
    cellDates: true
  });
  const { data, name } = excelData[0];
  if (name !== 'A-员工维度') {
    throw new Error('请按照模板对应位置填写数据，请勿修改文件的Sheet页名称和顺序');
  }
  const list = data.slice(2).filter((item) => {
    return !!item[0];
  }).map((item) => {
    return transform(item, (result, value, index) => {
      let targetValue = value;
      // 处理value空的情况
      if (targetValue === '/') {
        targetValue = '';
      }
      if (columns[index]?.name && isNotEmpty(targetValue)) {
        result[columns[index]?.name] = targetValue;
      }
    }, {});
  });

  const errors = await validateList(list);

  if (errors.length > 0) {
    const buffer = await writeErrorMessage(filePath, errors);
    return {
      result: false, errorFile: buffer
    };
  }

  //进行计算逻辑

  const computedList = list.map((item) => {
    //计算在职月份: 如果填写则取该值，如果没有填写则默认取 12
    const monthsOfEmployment = item.monthsOfEmployment || 12;
    //计算全年补助 annualAllowance = (mealAllowance+transportationAllowance+communicationAllowance)*monthsOfEmployment
    const annualAllowance = (Number(item.mealAllowance || 0) + Number(item.transportationAllowance || 0) + Number(item.communicationAllowance || 0)) * monthsOfEmployment;
    //计算全年应发工资 annualSalaryPayable = monthsOfEmployment * basicSalary + bonus + yearEndBonus + annualAllowance
    const annualSalaryPayable = monthsOfEmployment * Number(item.basicSalary || 0) + Number(item.bonus || 0) + Number(item.yearEndBonus || 0) + Number(item.overtimePay || 0);
    //计算个人年度缴纳 annualPaymentPerson = monthsOfEmployment * (socialSecurityBase * (personalEndowmentInsurance+personalMedicalInsurance+personalUnemploymentInsurance)+ providentFundBase * personalProvidentFund)+personalIncomeTax
    const annualPaymentPerson = monthsOfEmployment * (Number(item.socialSecurityBase || 0) * (Number(item.personalEndowmentInsurance || 0) + Number(item.personalMedicalInsurance || 0) + Number(item.personalUnemploymentInsurance || 0)) + Number(item.providentFundBase || 0) * Number(item.personalProvidentFund || 0)) + Number(item.personalIncomeTax || 0);
    //计算全年实发工资 annualPaidSalary = annualSalaryPayable - annualPaymentPerson
    const annualPaidSalary = annualSalaryPayable - annualPaymentPerson;
    //计算企业年度缴纳五险一金 annualPaymentByTheEnterprise = monthsOfEmployment * (socialSecurityBase * (enterpriseEndowmentInsurance + enterpriseMedicalInsurance + enterpriseUnemploymentInsurance + injuryInsurance + maternityInsurance) + providentFundBase * enterpriseProvidentFund)
    const annualPaymentByTheEnterprise = monthsOfEmployment * (Number(item.socialSecurityBase || 0) * (Number(item.enterpriseMedicalInsurance || 0) + Number(item.enterpriseMedicalInsurance || 0) + Number(item.enterpriseUnemploymentInsurance || 0) + Number(item.injuryInsurance || 0) + Number(item.maternityInsurance || 0)) + Number(item.providentFundBase || 0) * Number(item.enterpriseProvidentFund || 0));
    //计算额外保险小计 additionalInsuranceExpenses = companyAnnuity + supplementaryMedicalInsurance + criticalIllnessInsurance + accidentInsurance + otherInsurance
    const additionalInsuranceExpenses = Number(item.companyAnnuity || 0) + Number(item.supplementaryMedicalInsurance || 0) + Number(item.criticalIllnessInsurance || 0) + Number(item.accidentInsurance || 0) + Number(item.otherInsurance || 0);
    //计算薪资社保外成本小计 otherTotalCost = disabilityBenefits unionFees laborInsuranceFee annualPhysicalExamination otherBenefits otherCostAmounts
    const otherTotalCost = Number(item.disabilityBenefits || 0) + Number(item.unionFees || 0) + Number(item.laborInsuranceFee || 0) + Number(item.annualPhysicalExamination || 0) + Number(item.otherBenefits || 0) + Number(item.otherCostAmounts || 0);

    //计算 totalCost = supplierServiceFee + resignationCompensation + annualSalaryPayable + annualPaymentByTheEnterprise
    const totalCost = Number(item.supplierServiceFee || 0) + Number(item.resignationCompensation || 0) + annualSalaryPayable + annualPaymentByTheEnterprise + additionalInsuranceExpenses + otherTotalCost;
    return Object.assign({}, item, {
      monthsOfEmployment,
      annualAllowance,
      annualSalaryPayable,
      annualPaymentByTheEnterprise,
      annualPaymentPerson,
      annualPaidSalary,
      additionalInsuranceExpenses,
      otherTotalCost,
      totalCost
    });
  });

  return { result: true, output: computedList };
};

module.exports = fileParse;
