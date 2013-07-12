var db = require('./lib/db.util.js')
    user = require('./lib/user')    
    admin = require('./lib/admin')
    plan = require('./lib/plan')
    test = require('./lib/test')

var express = require('express')
    app = express()
    port = 409
    qs = require ('querystring')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    res.header('Access-Control-Allow-Methods', 'POST')
    res.header('Access-Control-Allow-Methods', 'PUT')
    res.header('Access-Control-Allow-Methods', 'DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

app.configure(function() {
  app.use(allowCrossDomain)
})

//Test


//:User
app.get('/:userName(\\w{3,20})', function(req, res) {
    user.intro(req.params.userName, res)
})

app.put('/:userName(\\w{2,20})/updateProfile/name/:newName', function(req, res) {
    user.updateName(req.params.userName, req.params.newName, res)
})

app.get('/:userName(\\w{3,20})/plans', function(req, res) {
    plan.plans(req.params.userName, res)
})

app.get('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})', function(req, res) {
    plan.planItems(req.params.userName, req.params.planid, res)
})


//Plan
app.get('/plans', function(req, res) {
    res.send({msg: "who's plan?"})
})

app.get('/plans/:userName(\\w{3,20})', function(req, res) {
    plan.plans(req.params.userName, res)
})

app.get('/plans/:userName(\\w{3,20})/:planid(\\d{1,4})', function(req, res) {
    plan.planItems(req.params.userName, res)
})

app.get('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})', function(req, res) {
    plan.planItems(req.params.userName, req.params.planid, res)
})


//Admin
app.get('/admin/listUser', function(req, res) {
    admin.listUser(res)
})

app.put('/admin/updateUserStats/:userName(\\w{3,20})/:isActive([0-1])', function(req, res) {
    admin.updateUserStats(req.params.userName, req.params.isActive, res)
})

app.put('/admin/enableUser/:userName(\\w{3,20})', function(req, res) {
    admin.enableUser(req.params.userName, res)
})

app.put('/admin/disableUser/:userName(\\w{3,20})', function(req, res) {
    admin.disableUser(req.params.userName, res)
})


//
app.get('/maildrop/:alias', function(req, res) {
    admin.genHash(req.params.alias, res)
})

app.listen(port)
console.log('start express server at ' + port + '\n')