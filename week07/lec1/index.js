const App = require('./app');
const config = require('config').get('server');

var app = new App();

app.use(require('./users'));
app.use(require('./posts'));

app.use((req, res) => {
  console.log('catch all');
  res.end("Hello World");
});

app.start(config.host, config.port, () => console.log("listening on post " + config.port));
