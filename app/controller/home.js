'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: '吴亦凡'
    })
  }
  async user() {
    const { ctx } = this;
    const res = await ctx.service.home.user();
    ctx.body = res
  }
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body

    const res = await ctx.service.home.addUser(name);
    try {
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null
      }
    }
  }
  async editUser() {
    const { ctx } = this;
    const { name, id } = ctx.request.body

    const res = await ctx.service.home.editUser(name, id);
    try {
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: null
      }
    }
  }
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body

    const res = await ctx.service.home.deleteUser(id);
    try {
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null
      }
    }
  }
  async getTitle() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    ctx.body = {
      title,
    };
  }
}

module.exports = HomeController;
