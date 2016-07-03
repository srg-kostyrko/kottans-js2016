const http = require('http')

module.exports = class App {
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  start(host, port, callback) {
    const server = http.createServer();
    server.on('request', (req,  res) => {
      this.middlewares.forEach((middleware) => {
        middleware.call(this, req, res);
      });
    });
    server.listen(port,  host);
    callback();
  }
};
