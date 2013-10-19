var db = require('./lib/db.util.js')
    $ = require('jquery')
    _ = require('underscore')
    curl = require('node-curl')
    user = require('./lib/user')
    admin = require('./lib/admin')
    plan = require('./lib/plan')
    item = require('./lib/item')
    test = require('./lib/test')

var express = require('express')
    app = express()
    port = 409

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
}

app.configure(function() {
  app.use(allowCrossDomain)
  app.use(express.bodyParser());
})

//Test
app.put('/demo', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    res.send({msg: "demo PUT"})
})

app.put('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})/:updateId(\\d{1,4})', function(req, res) {
    console.log(req.params)
    console.log(req.body);
    console.log('PUT');
    res.send({msg: "put item"})
    var param = {
        username: req.params.userName,
        planid: req.params.planid,
        share: null,
        res: res
    }
    // item.planItems(param)
})

app.get('/:userName(\\w{3,20})/all', function(req, res) {
    item.all({ 
        'userName': req.params.userName,
        'res': res
    })    
})
//end of test


//Plan
app.get('/plans', function(req, res) {
    // res.header('Access-Control-Allow-Origin', '*')
    res.send({msg: "who's plan?"})
})

app.get('/:userName(\\w{3,20})/plans', function(req, res) {
    plan.plans(req.params.userName, res)
})

//Item
app.get('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})', function(req, res) {
    console.log(req.params)
    var param = {
        username: req.params.userName,
        planid: req.params.planid,
        share: null,
        res: res
    }
    item.planItems(param)
})

app.get('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})/share', function(req, res) {
    var param = {
        username: req.params.userName,
        planid: req.params.planid,
        share: null,
        res: res
    }
    item.findSharedInfo(param)
})

app.get('/:userName(\\w{3,20})/plans/:planid(\\d{1,4})/all', function(req, res) {
    var param = {
        username: req.params.userName,
        planid: req.params.planid,
        share: 1,
        res: res
    }
    item.planItems(param)
})

//:User
app.get('/:userName(\\w{3,20})', function(req, res) {
    user.intro(req.params.userName, res)
})

app.put('/:userName(\\w{2,20})/updateProfile/name/:newName', function(req, res) {
    user.updateName(req.params.userName, req.params.newName, res)
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

app.listen(port)
console.log('start express server at ' + port + '\n')