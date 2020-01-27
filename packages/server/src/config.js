const env = process.env.NODE_ENV || 'development';

const config = {
  port: process.env.PORT || 8888,
  mongoUri: process.env.DB_PATH || 'mongodb://localhost:27017/agriness-test',
};

export default Object.freeze({
  ...config,
  ...{}[env],
});
