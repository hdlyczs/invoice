const proxy = require('http-proxy-middleware')
module.exports = function (app) {
    app.use(proxy('/api', {
        target: 'http://10.30.2.61:30302',
        pathRewrite: {
            "^/api": "/"
        }
    }))
}