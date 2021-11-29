const Service = require('egg').Service;

class billService extends Service {
    async add(params) {
        try {
            const { ctx, app } = this;
            const result = await app.mysql.insert('bill',  params);
            return result;
            } catch (error) {
                console.log(error);
                return null;
            }
    }
    async delete(id, user_id) {
        try {
            const { ctx, app } = this;
            const result = await app.mysql.delete('bill', {
                id,
                user_id
            })
        } catch (error) {
            return null;
        }
    }
    async getList(id) {
        const { ctx, app } = this;
        try {
            const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
            let sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
            const res = await app.mysql.query(sql);
            return res;
        } catch (error) {
        }
        
    }
    async detail(id, user_id) {
        const { ctx, app } = this;
        try {
          const result = await app.mysql.get('bill', { id, user_id })
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    
}

module.exports = billService;