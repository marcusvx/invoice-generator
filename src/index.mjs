import { generate } from './invoice.mjs';
import { readData, readTemplate } from './data-loader.mjs';

const htmlTemplate = await readTemplate();
const data = await readData();
await generate(htmlTemplate, data, process.argv[2]);
