/**
 * FMS - front-end management system
 * by tommyshao
 * 2016-04-18
 */

'use strict'

const koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')
const jsonp = require('koa-jsonp')
const serve = require('koa-static')
const session = require('koa-session')
const render = require('./lib/render')

// 实例化
const app = module.exports = koa()

// 用户配置
const YAML = require('yamljs')
let config = YAML.load('./config.yml')

// -----------
// 中间件
// -----------

// 日志控制台
app.use(logger())

// 启用jsonp支持
app.use(jsonp())

// 静态文件部署
app.use(serve(__dirname + '/public'))

// 启用session
app.key = ['frontui', 'FMS'];
app.use(session(app))

app.use(function *(next) {
    let user = this.cookies.get('user')
    // 未登录
    if(!user) {
        this.redirect('/')
    }

    yield next
})

// -------------
// 启用路由分发
let routes = require('./routes')(app, route)

// 错误404或者500
app.use(function *(next) {
    try {
        // 进入下一个路由
        yield next
    } catch (err) {
        // 定义错误信息
        this.status = 500
        this.body = err.message
        // 触发前台显示错误页面
        this.app.emit('error', err, this)
    }
})

app.use(function *(){
    var err = new Error()
    err.status = 404
    this.body = yield render('404.html', { errors: err })
})


// --------------
// 启动 http server
if (!module.parent) {
    // 获取端口,优先从命令再到配置文件
    let port = process.env.PORT || config.port || 3000;

    // 启动服务
    app.listen(port)

    console.log(`listening on port ${port}. open the url http://localhost:${port} in browser.`)
}


