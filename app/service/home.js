const Service = require('egg').Service;

class HomeService extends Service {
    async user() {
        const { ctx, app } = this;
        const QUERY_STR = 'id, name';
        const sql = 'select '+ QUERY_STR + ' from testlist';
        try {
            const result = app.mysql.query(sql);
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async addUser(name) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.insert('testlist', { name });
            return result
        } catch (error) {
            return null
        }
    }
    async editUser(name, id) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.update('testlist', { name }, {
                where: {
                    id,
                }
            });
            return result
        } catch (error) {
            return null
        }
    }
    async deleteUser(id) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.delete('testlist', { id });
            return result
        } catch (error) {
            return null
        }
    }
}

module.exports = HomeService