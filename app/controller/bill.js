// id：每张表都需要一个主键，我们照旧，用 id 作为「账单表」的属性。

// pay_type：账单类型，账单无非就是两种类型，支出和收入，我们用 pay_type 作为类型字段，这里约定好 1 为支出，2 为收入。

// amount：账单价格，每个账单都需有一个价格属性，表示该笔账单你消费或收入了多少钱。

// date：账单日期，日期可自由选择，以时间戳的形式存储。

// type_id：账单标签 id，如餐饮、交通、日用、学习、购物等。

// type_name：账单标签名称，如餐饮、交通、日用、学习、购物等。

// user_id：账单归属的用户 id，本小册制作的是多用户项目，相当于可以有多个用户来注册使用，所以存储账单的时候，需要将用户的 id 带上，便于后面查询账单列表之时，过滤出该用户的账单。

// remark：账单备注。

const Controller = require('egg').Controller;
const moment = require('moment');

class BillController extends Controller {
    async getDecode() {
        const { ctx, app } = this;
        const token = ctx.request.header.authorization;
        const res = await app.jwt.verify(token, app.config.jwt.secret);
        return res
    }
    async getList() {
        const { ctx, app } = this;
        const { date, type_id = 'all' } = ctx.request.body;
        const decode = await this.getDecode();
        const list = await ctx.service.bill.getList(decode.id);

        // 先根据date和type筛选出账单列表

        const _list = list.filter(item => {
            if (type_id !== 'all') {
                return item.type_id === type_id && moment(item.date).format('YYYY-MM') === date
            }
            return moment(item.date).format('YYYY-MM') === date
        })
        // 找到当前项所在的位置（用id
        const reduceList = _list.reduce((prev, cur) => {
            // const date = 
        })
    }
    
    async add() {
        const { ctx, app } = this;
        const { pay_type, amount, date, type_id, type_name, user_id, remark } = ctx.request.body;
        console.log(pay_type, amount, date, type_id, type_name, user_id, remark)
        if ( !pay_type || !amount || !date || !type_id) {
            ctx.body = {
                code: 400,
                msg: '缺少参数',
                data: null
            }
            return;
        }
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return;
        try {
            await ctx.service.bill.add({ 
                user_id: decode.id,
                pay_type,
                amount,
                date,
                type_id,
                type_name,
                remark 
            });
            ctx.body = {
                code: 200,
                msg: '添加成功',
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
}

module.exports = BillController