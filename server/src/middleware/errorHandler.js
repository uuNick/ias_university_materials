export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!err.isOperational) {
    statusCode = 500;
    //message = '';                 TODO: Убрать вывод в консоль в конце разработки
  }

  res.status(statusCode || 500).json({
    status: err.status || 'error',
    message: message
  });
};