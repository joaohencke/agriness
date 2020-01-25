const env = process.env.NODE_ENV || 'development';

const config = {
  port: process.env.PORT || 8888,
};

export default Object.freeze({
  ...config,
  ...{}[env],
});
