const Mock = require('mockjs');
const express = require('express');

const app = express();

// 根据传入的参数num、生成num条模拟的数据列表
function generatorList(num) {
    return Mock.mock({
        [`list|${num}`]: [{
            // 模拟ID、自增的方式追加
            'id|+1':1,
            // 模拟标题
            title: '@ctitle(15,25)',
            // 模拟图片索引
            image: '@natural(0,14)',
            // 模拟访问人数
            reads: '@natural(0,9999)',
            // 模拟新闻来源。中文字符
            from: '@ctitle(3,7)',
            // 模拟发布时间
            date: '@date("yyyy-MM-dd")'
        }]
    });
}
// 设置允许跨域请求返回数据
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
  
// 截取路由并返回数据
app.get('/data', function(req, res) {
    // 获取get请求数据参数 num
    const { num = 10 } = req.query;
    return res.send(generatorList(num))
});

const server = app.listen(5058, function() {
    console.log("本地服务启动成功", server.address());

})