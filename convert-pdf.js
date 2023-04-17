const path = require("path");
const pdf = require("html-pdf");
const Mustache = require("mustache");
const { data } = require("./data");
const moment = require("moment");

function getPeriod() {
  const halfOfMonth = Math.ceil(moment().daysInMonth() / 2);
  const currentDayOfMonth = moment().date();
  const isFirstOfMonth = currentDayOfMonth < halfOfMonth;

  if (isFirstOfMonth) {
    const lastMonth = moment().subtract(1, "months");
    const halfOfLastMonth = Math.ceil(lastMonth.daysInMonth() / 2);

    console.log("last month", lastMonth.format());
    console.log("halfOfLastMonth", halfOfLastMonth);

    const start = lastMonth.startOf("month").add(halfOfLastMonth - 1, "d");
    const end = moment(lastMonth).endOf("month");
    return {
      start,
      end,
    };
  }

  const start = moment().startOf("month");
  const daysInMonth = moment().daysInMonth();
  const toSubtract = daysInMonth > 30 ? 2 : 1;
  const end = start.clone().add(halfOfMonth - toSubtract, "days");
  return {
    start,
    end,
  };
}

function convertToPdf(htmlContent, invoiceNumber) {
  if (!invoiceNumber) {
    throw new Error("Invoice number is required");
  }
  const period = getPeriod();
  const invoice_total = data.invoice_hour_rate * data.invoice_hour_amount;
  const view = {
    ...data,
    invoice_total,
    invoice_number: invoiceNumber,
    issue_date: moment().toISOString(),
    date_from: period.start.toISOString(),
    date_to: period.end.toISOString(),
  };
  const output = Mustache.render(htmlContent, view);
  const options = {
    format: "A4",
  };
  pdf
    .create(output, options)
    .toFile(
      path.resolve(
        __dirname,
        `Invoice-${view.invoice_number}-${view.recipient_name}.pdf`
      ),
      function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      }
    );
}

module.exports = {
  convertToPdf,
};
