const fs = require('fs-extra');
const path = require('path');
const fileParse = require('./file-parse');

(async () => {
  const fileData = await fileParse(path.resolve(__dirname, './template.xlsx'), {
    enumValidate: async ({ type, value }) => {
      return {
        result: false, msg: '%s不合法'
      };
    }
  });
  if (!fileData.result) {
    fs.writeFile('./output.xlsx', fileData.errorFile);
  }
  console.log(fileData);
})();
