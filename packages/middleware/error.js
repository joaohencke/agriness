import boom from 'boom';

export default function errorHandler(res, err) {
  let error = boom.boomify(err, { statusCode: 400 });
  if (error.name === 'ValidationError') {
    error = boom.boomify(error, {
      statusCode: 400,
    });
  }
  if (process.env.NODE_ENV !== 'test') console.trace(error);
  return res.status(error.output.statusCode).json({
    error: error.output.payload.error,
    message: error.message,
  });
}
