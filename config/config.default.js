/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */


module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1627957160595_4976';
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: [ '*' ],
  }
  config.view = {
    mapping: { '.html': 'ejs'}
  }
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    uploadDir: 'app/public/upload'
    // myAppName: 'egg',
  };

  // client: {
  //   host: 'localhost',
  //   port: '3306',
  //   user: 'root',
  //   password: 'Lqokok@37888',
  //   database: 'cost-bill'
  // },
  config.mysql = {
    // client: {
    //   host: 'localhost',
    //   port: '3306',
    //   user: 'root',
    //   password: 'lqokok111',
    //   database: 'cost'
    // },
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'Lqokok@37888',
      database: 'cost-bill'
    },
    app: true,
    agent: false
  }
  config.cluster = {
    listen: {
      path: '',
      port: 7009,
      hostname: '0.0.0.0'
    }
  }
  config.jwt = {
    secret: 'Wyf'
  }
  config.cors = {
    origin: 'http://182.92.105.28:5021',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  }
  config.multipart = {
    mode: 'file'
  }
  return {
    ...config,
    ...userConfig,
  };
};
