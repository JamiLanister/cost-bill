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
    list = ['321321'];
    async getDecode() {
        const { ctx, app } = this;
        const token = ctx.request.header.authorization;
        const res = await app.jwt.verify(token, app.config.jwt.secret);
        return res
    }
    async getList() {
        const { ctx, app } = this;
        const { date, type_id = 'all', page = 1, page_size = 5 } = ctx.query;
        const decode = await this.getDecode();
        const list = await ctx.service.bill.getList(decode.id);

        // 先根据date和type筛选出账单列表
        const _list = list.filter(item => {
            if (type_id !== 'all') {
                return item.type_id === type_id && moment(item.date).format('YYYY-MM') === date
            }
            const resDate = item.date.includes('-') ? item.date : Number(item.date);
            return moment(resDate).format('YYYY-MM') === date
        })
        // 找到当前项所在的位置（用id
        const reduceList = _list.reduce((prev, cur) => {
            const resDate = cur.date.includes('-') ? cur.date : Number(cur.date);
            const date = moment(resDate).format('YYYY-MM-DD');
            const index = prev.findIndex(ev => ev.date == date);
            if (index > -1) {
                prev[index].bills.push(cur)
            } else {
                prev.push({
                    date: cur.date,
                    bills: [cur]
                })
            }
            return prev
        }, []).sort((a,b) => moment(a.date) - moment(b.date))
        this.list = reduceList;
        // 分页处理
        const filterListMap = reduceList.slice((page - 1)*page_size, page * page_size)

        let totalExpense = 0;
        let totalIncome = 0;
        for(let item of reduceList) {
            totalExpense = totalExpense + item.bills.filter(ev => ev.pay_type == 1).reduce((a,b) => a + Number(b.amount), 0);
            totalIncome = totalIncome + item.bills.filter(ev => ev.pay_type == 2).reduce((a,b) => a + Number(b.amount), 0);
            // totalIncome = totalIncome + item.bills.filter(item => item.pay_type === 1).reduce((a,b) => a + b, 0);
        }
        ctx.body = {
            code: 200,
            msg: 'success!',
            data: {
                totalExpense,
                totalIncome,
                list: reduceList
            }
        }
        return reduceList
    }
    
    async add() {
        const { ctx, app } = this;
        const { pay_type, amount, date, type_id, type_name, user_id, remark } = ctx.request.body;
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
    async delete() {
        const { ctx, app } = this;
        const { id } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 400,
                msg: '参数错误，无id',
                data: null
            }
        }
        try {
            let user_id;
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return;
            user_id = decode.id;
            const result = await ctx.service.bill.delete(id, user_id);
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
    
    async data() {
        // 先拿到日期，筛选出当月的数据，reduce累加支出与收入的全部。 再累加品类类别的数额
        const { ctx, app } = this;
        const { date } = ctx.query;
        const decode = await this.getDecode();
        const list = await ctx.service.bill.getList(decode.id);
        const start = moment(date).startOf('month').unix()*1000;
        const end = moment(date).endOf('month').unix()*1000;
        const _list = list.filter(item => Number(item.date) >= start && Number(item.date) <= end)
        const total_expense = _list.reduce((prev, cur) => {
            if (cur.pay_type == 1) {
                prev += Number(cur.amount);
            }
            return prev
        }, 0)
        const total_income = _list.reduce((prev, cur) => {
            if (cur.pay_type === 2) {
                prev += Number(cur.amount);
            }
            return prev
        }, 0)
        const total_data = _list.reduce((prev, cur) => {
            let curIndex = prev.findIndex(e => e.type_id === cur.type_id);
            if (curIndex > -1) {
                prev[curIndex].number += cur.amount;
            } else {
                prev.push({
                    type_id: cur.type_id,
                    type_name: cur.type_name,
                    number: cur.amount,
                    pay_type: cur.pay_type
                })
            }
            return prev
        }, [])

        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
              total_expense: Number(total_expense).toFixed(2),
              total_income: Number(total_income).toFixed(2),
              total_data: total_data || [],
            }
        }
    }
    async getDetail() {
        const { ctx, app } = this;
        const { id = '' } = ctx.query
        // 获取用户 user_id
        let user_id
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return
        user_id = decode.id
        
        if (!id) {
            ctx.body = {
                code: 500,
                msg: '订单id不能为空',
                data: null
            }
            return
        }

        try {
            const detail = await ctx.service.bill.detail(id, user_id)
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: detail
            }
            } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }
    async getTypeList(params) {
        const { ctx, app } = this;
        const typeList = [
            {
                id: '1',
                name: '餐饮',
                type: '1',
            },
            {
                id: '2',
                name: '日用',
                type: '1',
            },
            {
                id: '3',
                name: '购物',
                type: '1',
            },
            {
                id: '4',
                name: '学习',
                type: '1',
            },
            {
                id: '5',
                name: '医疗',
                type: '1',
            },
            {
                id: '6',
                name: '人情',
                type: '1',
            },
            {
                id: '7',
                name: '其他',
                type: '1',
            },
            {
                id: '8',
                name: '工资',
                type: '2',
            },
            {
                id: '9',
                name: '理财',
                type: '2',
            },
            {
                id: '9',
                name: '转账',
                type: '2',
            },
        ]
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: typeList
        }
    }
    
}

module.exports = BillController