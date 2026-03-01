const test = require('node:test');
const assert = require('node:assert/strict');

const {
    csvEscape,
    buildVinReportCsvLines,
    parseVinReportCsv
} = require('../modules/reports.js');

test('csvEscape wraps commas, quotes, and newlines', () => {
    assert.equal(csvEscape('simple'), 'simple');
    assert.equal(csvEscape('a,b'), '"a,b"');
    assert.equal(csvEscape('a"b'), '"a""b"');
    assert.equal(csvEscape('line\nbreak'), '"line\nbreak"');
});

test('buildVinReportCsvLines + parseVinReportCsv round trip', () => {
    const payload = {
        vinData: {
            vin: '1HGBH41JXMN109186',
            year: '2021',
            make: 'Honda',
            model: 'Civic',
            trim: 'EX',
            body: 'Sedan',
            engine: '2.0L'
        },
        recalls: [{ Component: 'Airbags', Summary: 'Inflator issue' }],
        complaints: [{ Component: 'Brakes', Summary: 'Squeal at low speed' }],
        tsbs: [{ Component: 'Electrical', Summary: 'Software update' }],
        tsbFallbacks: [{ link: 'https://example.com/tsb', fileName: 'tsb.pdf' }]
    };

    const lines = buildVinReportCsvLines(payload);
    const parsed = parseVinReportCsv(lines.join('\n'));

    assert.equal(parsed.meta.VIN, '1HGBH41JXMN109186');
    assert.equal(parsed.meta.Vehicle, '2021 Honda Civic (EX)');
    assert.equal(parsed.meta.Body, 'Sedan');
    assert.equal(parsed.meta.Engine, '2.0L');

    const types = parsed.rows.map(row => row.Type);
    assert.deepEqual(types, ['Recall', 'Complaint', 'TSB', 'Manual TSB']);

    const manualRow = parsed.rows.find(row => row.Type === 'Manual TSB');
    assert.equal(manualRow.Component, 'tsb.pdf');
    assert.equal(manualRow.Summary, 'https://example.com/tsb | tsb.pdf');
});
