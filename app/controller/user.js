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
    console.log(userInfo, 'info----')
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
      console.log(userInfo.password, password, 'password---')
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
  async editUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const { signature } = ctx.request.body;
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const userInfo = await ctx.service.user.getUserName(decode.name);
    const result = await ctx.service.user.editUserInfo({
        ...decode,
        signature
    })
    ctx.body = {
        id: userInfo.id,
        signature,
        name: userInfo.name
    }
  }
}

module.exports = UserController;