const liveServer = require("live-server");

const liveCreator = require('../config/liveServer.config');
const config = require('../config/proxy.config');

const liveConfig = liveCreator(config.headerMiddleware, config.proxy);
setTimeout(function(){
  liveServer.start(liveConfig);
},30000)
