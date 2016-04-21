/**
 * 路由控制
 */
'use strict'

const path = require('path')
const fs   = require('fs')

/**
 * 列出所有路由文件
 * @param  {app} koa实例
 * @param  {route} koa-route中间件
 * @return 路由定义
 */
let routeLists =  (app, route)=> {
    // 当前目录
    let p = path.join(__dirname);
    // 读取文件
    fs.readdirSync(p).forEach((file) => {
        // 排除根目录或者index.js
        if(file[0] === '.' || file === 'index.js') return;

        // 启动路由
        require('./' + file)(app, route)
    })
}

module.exports = routeLists
