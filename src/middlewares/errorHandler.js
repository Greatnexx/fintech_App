const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    console.error(err.stack);
  }
  res.status(statusCode).json({
    status: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? err.stack : null,
  });
};

export { errorHandler, notFound };
