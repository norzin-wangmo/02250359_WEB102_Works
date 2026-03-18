module.exports = (req, res, next) => {
  res.formatResponse = (data) => {
    if (req.headers.accept === "application/xml") {
      res.send(`<response>${JSON.stringify(data)}</response>`);
    } else {
      res.json(data);
    }
  };
  next();
};