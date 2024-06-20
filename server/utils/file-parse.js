const xlsx = require('node-xlsx').default;
const transform = require('lodash/transform');
const isNil = require('lodash/isNil');
const isDate = require('lodash/isDate');
const isNumber = require('lodash/isNumber');
const columns = require('../../public/columns.json');
const fs = require('fs-extra');
const ExcelJS = require('exceljs');

const writeErrorMessage = async (filePath, errors) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet1 = workbook.getWorksheet('A-员工维度');
  errors.forEach((item) => {
    const { index, colIndex, msg } = item;
    const row = sheet1.getRow(index + 3);
    const cell = row.getCell(colIndex + 1);
    cell.style = Object.assign({}, cell.style, {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }
    });
    cell.value = `${cell.value || ''}[${msg}]`;
  });

  return await workbook.xlsx.writeBuffer();
};

const fileParse = async (filePath, options) => {
  options = Object.assign({}, options);
  const REQ = (value) => {
    return {
      result: !isNil(value), msg: '%s不能为空'
    };
  };

  const DATE = (value) => {
    return {
      result: isDate(new Date(value)), msg: '%s必须为日期类型:YYYY/MM/DD'
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

  const ruleMapping = { REQ, DATE, EMPLOYEE_TYPE_REQ, EMPLOYMENT_STATUS_REQ, MONEY, ENUM };

  const validateList = async (list) => {
    const errors = [];

    await Promise.all(list.map(async (item, index) => {
      await Promise.all(columns.map(async (column, colIndex) => {
        if (!column.rule) {
          return;
        }
        const rules = column.rule.split(' ');
        for (let rule of rules) {
          const [current, ...args] = rule.split('-');
          if (current !== 'REQ' && rules.indexOf('REQ') === -1 && !ruleMapping['REQ'](item[column.name], item, args).result) {
            continue;
          }

          const { result, msg } = await ruleMapping[current](item[column.name], item, args);
          if (!result) {
            errors.push({
              index, colIndex, name: column.name, title: column.title, msg: msg.replace('%s', column.title)
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
      if (columns[index]?.name) {
        result[columns[index]?.name] = value;
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
  return { result: true, output: list };
};

module.exports = fileParse;
