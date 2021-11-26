module.exports = (secret) => {
    return async (ctx, next) => {
        const token = ctx.request.header.authorization;
        console.log(token, 'token')
        if (token !== 'null' && token) {
            try {
                const decode = await ctx.app.jwt.verify(token, secret);
                await next()
            } catch (error) {
                console.log(error, 'error');
                ctx.status = 200;
                ctx.body = {
                    code: 401,
                    msg: 'token已过期请重新登录'
                }
            }
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 401,
                msg: 'token不存在'
            }
        }
    }
}