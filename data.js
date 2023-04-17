const moment = require("moment");
const fs = require("fs");

const rawdata = fs.readFileSync("data.json");
const invoiceData = JSON.parse(rawdata);

const data = {
  ...invoiceData,
  dateFormat: function () {
    return function (text, render) {
      return moment(render(text)).format("MM/DD/YYYY");
    };
  },
};

module.exports = {
  data,
};
