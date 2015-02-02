var env = process.env.NODE_ENV || 'development';
var configs = require('./' + env);

// then make client config
for (var key in configs.common) {
  if (configs.common.hasOwnProperty(key)) {
    configs.client[key] = configs.common[key];
    configs.server[key] = configs.common[key];
  }
}

module.exports = {
  client: configs.client,
  server: configs.server
};
