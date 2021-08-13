'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  router.get('/user', controller.home.user);
  router.post('/getTitle', controller.home.getTitle);
  router.post('/addUser', controller.home.addUser);
  router.post('/editUser', controller.home.editUser);
  router.post('/deleteUser', controller.home.deleteUser);
  router.post('/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/test', _jwt, controller.user.test);
  router.post('/api/user/setAvatar', controller.upload.saveFile);
  router.post('/api/user/editUserInfo', _jwt, controller.user.editUserInfo);
  router.get('/api/bill/get', _jwt, controller.bill.getList);
  router.post('/api/bill/add', _jwt, controller.bill.add);
};
