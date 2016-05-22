const posthtml = require('posthtml');
const transformJsClasses = require('./posthtml-js-classes');
const stripBootstrapClasses = require('./posthtml-strip-bootstrap');

const html = `
    <div class="h1 js-head">Header</div>
    <div class="col-xs-1 col-md-5 col-lg-12">First column</div>
    <div class="col-xs-4 col-md-3 col-lg-12">Second column</div>
    <div class="js-test js-hide"></div>
`;

console.log('HTML before');
console.log('==========');
console.log(html);

posthtml([transformJsClasses, stripBootstrapClasses])
    .process(html)
    .then((result) => {
        console.log('HTML after');
        console.log('==========');
        console.log(result.html);
    })
    .catch((err) => console.error(err));
