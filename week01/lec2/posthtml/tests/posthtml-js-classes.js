const test = require('tape');

const posthtml = require('posthtml');
const transformJsClasses = require('../posthtml-js-classes');

const processor = posthtml()
    .use(transformJsClasses);

test('js-* class is transformed to data-js attr', (t) => {
    t.plan(1);

    const html = `<div class="js-smth"></div>`;
    const expected = `<div data-js="smth"></div>`;

    processor.process(html)
        .then((result) => {
            t.equal(result.html, expected);
        })
        .catch((err) => {
            t.fail(err);
        });
});

test('js-* class should be transformed if it is not first in class list', (t) => {
    t.plan(1);

    const html = `<div class="other-cls js-smth"></div>`;
    const expected = `<div class="other-cls" data-js="smth"></div>`;

    processor.process(html)
        .then((result) => {
            t.equal(result.html, expected);
        })
        .catch((err) => {
            t.fail(err);
        });
});

test('data-js attr not added if no js-* present', (t) => {
    t.plan(1);

    const html = `<div class="smth"></div>`;
    processor.process(html)
        .then((result) => {
            t.equal(result.html, html);
        })
        .catch((err) => {
            t.fail(err);
        });
});

test('several js-* classes are transformed to one data-js attr', (t) => {
    t.plan(1);

    const html = `<div class="js-smth js-other"></div>`;
    const expected = `<div data-js="smth other"></div>`;
    processor.process(html)
        .then((result) => {
            t.equal(result.html, expected);
        })
        .catch((err) => {
            t.fail(err);
        });
});
