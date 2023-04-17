const { convertToPdf } = require("./convert-pdf");
const fs = require("fs");
const path = require("path");

const htmlTemplate = fs.readFileSync(
  path.resolve(__dirname, "template.html"),
  "utf8"
);
convertToPdf(htmlTemplate, process.argv[2]);
