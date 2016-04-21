/**
 * 主页
 */
'use strict'

const render = require('../lib/render')
const YAML = require('yamljs')
const path = require('path')
const config = YAML.load(path.join(__dirname, '../', 'config.yml'))
const parse = require('co-body')

let bootstrap = (app, route) =>  {

    // 登录
    app.use(route.get('/', function *() {
        let user = this.cookies.get('user')
        // 已登录
        if(!!user) {
            this.redirect('/home');
            return;
        }

        // 显示登录页面
        this.body = yield render('login.html')
    }))

    // 表单登录
    app.use(route.post('/login', function *() {
        // 只接收 post 方法
        if('POST' != this.method) return yield next;

        // 输入信息request
        var input = yield parse(this);

        // 判断用户名和密码是否正确
        if(input.user != config.user && input.password != config.password) {
            this.redirect('/')
        } else {
            // 设置两小时候自动注销
            let exp = new Date()
            exp.setHours(exp.getHours() + 2)
            // 设置 cookies
            this.cookies.set('user', input.user, { expires: exp })
            this.redirect('/home')
        }
    }))

    // 注销
    app.use(route.get('/logout', function *() {
        // cookies 立即清空
        this.cookies.set('user', '', { expires: null })
        this.redirect('/')
    }))

    // 首页
    app.use(route.get('/home', function *() {
        this.body = yield render('home.html', { content: 'homepage'});
    }))
}


module.exports = bootstrap
