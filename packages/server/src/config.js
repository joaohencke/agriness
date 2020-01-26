const env = process.env.NODE_ENV || 'development';

const config = {
  port: process.env.PORT || 8888,
  mongoUri: process.env.DB_PATH || 'mongodb://localhost:27017/agriness-test',
  auth: {
    clientId: '@agriness',
    clientSecret: '5b65583a513923cc5db5e283cfa565ba',
    grants: ['password', 'refresh_token'],
  },
};

export default Object.freeze({
  ...config,
  ...{}[env],
});
