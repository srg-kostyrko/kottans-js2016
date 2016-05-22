const test = require('tape');

const posthtml = require('posthtml');
const stripBootstrap = require('../posthtml-strip-bootstrap');

const processor = posthtml()
    .use(stripBootstrap)

const testHelper = (t,  html,  expected, text = '') => {
    processor.process(html)
        .then((result) => {
            t.equal(result.html, expected, text);
        })
        .catch((err) => {
            t.fail(err);
        });
};

test('bootsrap grid classes are removed', (t) => {
    t.plan(4);

    const expected = '<div></div>';

    testHelper(t, '<div class="col-xs-1"></div>', expected, '.col-(size)-*');
    testHelper(t, '<div class="col-xs-offset-3"></div>', expected, '.col-(size)-offset-*');
    testHelper(t, '<div class="col-xs-pull-6"></div>', expected, '.col-(size)-pull-*');
    testHelper(t, '<div class="col-xs-push-6"></div>', expected, '.col-(size)-push-*');
});

test('bootstrap visibility classes are removed', (t) => {
    t.plan(3);

    const expected = `<div></div>`;

    testHelper(t, '<div class="hidden-xs"></div>', expected, '.hidden-*');
    testHelper(t, '<div class="visible-lg"></div>', expected, '.visible-*');
    testHelper(t, '<div class="clearfix"></div>', expected, '.clearfix');
});

test('bootstrap typography classes are removed', (t) => {
    t.plan(4);

    const expected = `<div></div>`;

    testHelper(t, '<div class="page-header"></div>', expected, '.page-header');
    testHelper(t, '<div class="h3"></div>', expected, '.h1-.h6');
    testHelper(t, '<div class="lead"></div>', expected, '.lead');
    testHelper(t, '<div class="text-right"></div>', expected, '.text-*');
});

test('bootstrap list classes are removed', (t) => {
    t.plan(4);

    const expected = `<div></div>`;

    testHelper(t, '<div class="list-inline"></div>', expected, '.list-inline');
    testHelper(t, '<div class="list-unstyled"></div>', expected, '.list-unstyled');
    testHelper(t, '<div class="list-group"></div>', expected, '.lead');
    testHelper(t, '<div class="list-group-item"></div>', expected, '.list-group-item');
});


