import moment from 'moment';
import { readFile } from 'fs/promises';

export async function readData() {
    const rawData = await readFile(new URL('../data/invoice.json', import.meta.url));
    const invoiceData = JSON.parse(rawData.toString());

    return {
        ...invoiceData,
        dateFormat: function () {
            return function (text, render) {
                return moment(render(text)).format('MM/DD/YYYY');
            };
        },
    };

}

export async function readTemplate() {
    const rawData = await readFile(new URL('../data/template.html', import.meta.url));
    return rawData.toString();
}
