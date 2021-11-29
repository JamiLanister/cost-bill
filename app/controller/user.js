/* eslint-disable */
"use strict"

// strict mode



const Controller = require('egg').Controller;

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { name, password } = ctx.request.body; // 获取注册需要的参数
    if (!name || !password) {
        ctx.body = {
            code: 500,
            msg: '账号密码不能为空',
            data: null
        }
        return
    }
    const userInfo = await ctx.service.user.getUserName(name);
    if (userInfo) {
        ctx.body = {
            code: 500,
            msg: '账户名已被注册，请重新输入',
            data: null
        }
        return
    }
    const result = await ctx.service.user.register({
        name,
        password,
        signature: '吴亦凡，监狱很大你住着吧',
        avatar: defaultAvatar,
        ctime: +new Date(),
      });
      
      if (result) {
        ctx.body = {
          code: 200,
          msg: '注册成功',
          data: null
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '注册失败',
          data: null
        }
      }
  }
  async login() {
      const { ctx, app } = this;
      const { name, password } = ctx.request.body;
      const userInfo = await ctx.service.user.getUserName(name);
      if (!userInfo) {
        ctx.body = {
            code: 500,
            msg: '账户不存在',
            data: null
        }
        return
      }
      if (userInfo.password !== password) {
          ctx.body = {
              code: 500,
              msg: '密码错误',
              data: null
          }
          return
      }
      const token = app.jwt.sign({
          id: userInfo.id,
          name,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      }, app.config.jwt.secret)
      
      ctx.body = {
          code: 200,
          msg: '登录成功',
          data: {
              token
          }
      }
  }
  async test() {
      const { ctx, app } = this;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      ctx.body = {
          code: 200,
          msg: '获取成功',
          data: {
              ...decode
          }
      }
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    console.log(decode, 'decode---')
    const userInfo = await ctx.service.user.getUserName(decode.name)
    console.log(userInfo, 'userInfo---')
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.name,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar
      }
    }
  }
  async editUserInfo () {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body

    try {
      let user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return
      user_id = decode.id

      const userInfo = await ctx.service.user.getUserName(decode.name)
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          username: userInfo.name,
          avatar
        }
      }
    } catch (error) {
      
    }
  }
  async modifyPass () {
    const { ctx, app } = this;
    const { old_pass = '', new_pass = '', new_pass2 = '' } = ctx.request.body

    try {
      let user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return
      if (decode.username == 'admin') {
        ctx.body = {
          code: 400,
          msg: '管理员账户，不允许修改密码！',
          data: null
        }
        return
      }
      user_id = decode.id
      const userInfo = await ctx.service.user.getUserName(decode.username)

      if (old_pass != userInfo.password) {
        ctx.body = {
          code: 400,
          msg: '原密码错误',
          data: null
        }
        return
      }

      if (new_pass != new_pass2) {
        ctx.body = {
          code: 400,
          msg: '新密码不一致',
          data: null
        }
        return
      }

      const result = await ctx.service.user.modifyPass({
        ...userInfo,
        password: new_pass,
      })

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  async verify() {
    const { ctx, app } = this;
    const { token } = ctx.request.body
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = 'success gays'
  }
}

module.exports = UserController;