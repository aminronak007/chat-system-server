const success = (res, status, message, data, error) => {
  res.status(status).json({
    success: true,
    message,
    data,
    error,
  });
};

const error = (res, status, message, data, error) => {
  res.status(status).json({
    success: false,
    message,
    data,
    error,
  });
};

module.exports = { success, error };
