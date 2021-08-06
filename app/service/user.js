const Service = require('egg').Service;

class userService extends Service {
    async getUserName(name) {
        try {
            const { ctx, app } = this;
        const result = await app.mysql.get('user', { name });
        console.log(result, 'result-=--')
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
    async editUserInfo(params) {
        const { app } = this;
        const { signature } = params
        try {
            const result = await app.mysql.update('user', {
                id: params.id,
                signature
            })
            return result
        } catch (error) {
            console.log(error, 'mysql-error-userinfo')
        }
    }
}

module.exports = userService;