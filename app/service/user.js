const Service = require('egg').Service;

class userService extends Service {
    async getUserName(name) {
        try {
            const { ctx, app } = this;
        const result = await app.mysql.get('user', { name });
        return result;
        } catch (error) {
            console.log(error, 'dd');
            return null;
        }
        
    }
    async editUserInfo(params) {
        const { ctx, app } = this;
        try {
          let result = await app.mysql.update('user', {
              ...params
          }, {
              id: params.id
          });
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    // 注册
    async register(params) {
        const { app } = this;
        try {
        const result = await app.mysql.insert('user', params);
        return result;
        } catch (error) {
        console.log(error);
        return null;
        }
    }
    async modifyPass (params) {
        const { ctx, app } = this;
        try {
          let result = await app.mysql.update('user', {
              ...params
          }, {
              id: params.id
          });
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
}

module.exports = userService;