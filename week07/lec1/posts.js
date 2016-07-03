module.exports = function postMiddleware(req, res) {
  if (req.url === '/posts') {
    console.log('posts middleware');
    res.end("Posts endpoint");
  }
};
