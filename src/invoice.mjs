import path from 'path';
import pdf from 'html-pdf';
import Mustache from 'mustache';
import moment from 'moment';

function getPeriod() {
    const halfOfMonth = Math.ceil(moment().daysInMonth() / 2);
    const currentDayOfMonth = moment().date();
    const isFirstOfMonth = currentDayOfMonth < halfOfMonth;

    if (isFirstOfMonth) {
        const lastMonth = moment().subtract(1, 'months');
        const halfOfLastMonth = Math.ceil(lastMonth.daysInMonth() / 2);

        console.log('last month', lastMonth.format());
        console.log('halfOfLastMonth', halfOfLastMonth);

        const toSubtract = moment(lastMonth).daysInMonth() > 30 ? 1 : 0;
        const start = lastMonth
            .startOf('month')
            .add(halfOfLastMonth - toSubtract, 'd');
        const end = moment(lastMonth).endOf('month');
        return {
            start,
            end,
        };
    }

    const start = moment().startOf('month');
    const daysInMonth = moment().daysInMonth();
    const toSubtract = daysInMonth > 30 ? 2 : 1;
    const end = start.clone().add(halfOfMonth - toSubtract, 'days');
    return {
        start,
        end,
    };
}

export async function generate(htmlContent, data, invoiceNumber) {
    if (!invoiceNumber) {
        throw new Error('Invoice number is required');
    }
    const period = getPeriod();
    const invoice_total = data['invoice_hour_rate'] * data['invoice_hour_amount'];
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
        format: 'A4',
    };
    pdf
        .create(output, options)
        .toFile(
            path.resolve(
                `./Invoice-${view.invoice_number}-${view.recipient_name}.pdf`
            ),
            function (err, res) {
                if (err) return console.log(err);
                console.log(res);
            }
        );
}

