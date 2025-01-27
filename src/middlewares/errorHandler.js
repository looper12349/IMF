module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  };
  