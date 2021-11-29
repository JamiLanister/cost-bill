'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  router.get('/api/user', controller.home.user);
  router.post('/api/getTitle', controller.home.getTitle);
  router.post('/api/addUser', controller.home.addUser);
  router.post('/api/editUser', controller.home.editUser);
  router.post('/api/deleteUser', controller.home.deleteUser);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/test', _jwt, controller.user.test);
  // router.post('/api/user/setAvatar', controller.upload.saveFile);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo); // 获取用户信息
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo); // 修改用户个性签名
  router.post('/api/user/modify_pass', _jwt, controller.user.modifyPass); // 修改用户密码
  router.get('/api/bill/list', _jwt, controller.bill.getList);
  router.get('/api/bill/detail', _jwt, controller.bill.getDetail);
  router.post('/api/bill/add', _jwt, controller.bill.add);
  router.post('/api/bill/delete', _jwt, controller.bill.delete);
  router.get('/api/bill/data', _jwt, controller.bill.data);
  router.get('/api/type/list', _jwt, controller.bill.getTypeList);
  router.get('/api/note/list', _jwt, controller.note.list); // 获取笔记列表
  router.post('/api/note/add', _jwt, controller.note.add); // 新增笔记
  router.post('/api/note/delete', _jwt, controller.note.delete); // 删除笔记
  router.post('/api/note/update', _jwt, controller.note.update); // 修改笔记
  router.post('/api/upload', _jwt, controller.upload.upload); // 上传图片
  router.post('/api/user/verify', controller.user.verify); // 验证token
};
