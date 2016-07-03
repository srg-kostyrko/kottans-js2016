module.exports = function userMiddleware(req, res) {
  if (req.url === '/users') {
    console.log('users middleware');
    res.end("Users endpoint");
  }
};
