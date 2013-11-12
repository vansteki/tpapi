var db = require('./db.util.js')
	plan = require('./plan')
    api = ''

//planItems -> checkPlanOwner -> listPlanItems or findSharedInfo
var planItems = function(param) {
    var con = db.read(); con.connect();
    con.query('SELECT id FROM user WHERE name = ?', [param.username], function(err, rows, fields){
        if (err) throw err
        if (rows.length == 0)
            param.res.send({'result': 'no user found :3'})
        else{
            var config = {
                'username': param.username,
                'userid': rows[0].id,
                'planid': param.planid,
                'share': param.share,
                'res': param.res
            }
            if (config.share == null) {
                config.next = listPlanItems
                plan.checkPlanOwner(config)                
            }else{
                config.next = findSharedInfo
                plan.checkPlanOwner(config)
            }
        }
    })
    con.end()
}

var listPlanItems = function(config){
    var con = db.read(); con.connect();
    var select = 'SELECT * '
    var from = 'FROM plan_item '
    var join = 'INNER JOIN item_info '
    var where = 'WHERE plan_item.plan_id = ? AND plan_item.id = item_info.plan_item_id '
    var by = 'order by plan_item.queue'
    var sql = select + from + join + where + by

    con.query(sql, config.planid ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            config.res.send({'result': 'no item :3', 'plan_id': config.planid})
        else{
            if(config.share == null){
                console.log(rows)
                config.res.send(rows)
                console.log({planid: config.planid, count : rows.length })
            }else{
                var result = {
                    'plan_id': config.planid,
                    'count':{
                        'items': rows.length,
                        'shareitems': config.shareItems.length
                    },
                    'items': rows,
                    'shareitems': config.shareItems
                }
                config.res.send(result)
                // console.log(result)
                // console.log({planid: config.planid, count : rows.length, msg: 'with share!' })
            }
 
        }
 })
    con.end()
}

var findSharedInfo = function(config){
    var con = db.read(); con.connect();
    var select = 'SELECT item_info.spot_id, user.name as user_name, plan_item.item_name, item_info.info_type , item_info.info_content, item_info.plan_id, plan.name as plan_name '
    var from = 'FROM item_info '
    var joinPublicItemInfo = 'INNER JOIN public_item_info ON item_info.id = public_item_info.item_info_id '
    var joinPlanItem = 'INNER JOIN plan_item ON plan_item.id = item_info.plan_item_id '
    var joinUser = 'INNER JOIN user ON item_info.user_id = user.id '
    var joinPlan = 'INNER JOIN plan ON item_info.plan_id = plan.id '
    var where = 'WHERE public_item_info.plan_id != ?'
    var sql = select + from + joinPublicItemInfo + joinPlanItem + joinUser + joinPlan + where

    con.query(sql, [config.planid], function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            config.res.send({'result': 'no item :3'})
        else{
            if(config.share == null){
                
                var obj = {
                    'count': rows.length,
                    'items': rows
                }

                config.res.send(obj)
                console.log(obj)
                console.log("\n-----\n")
                for (var i = 0; i < Object.keys(obj).length; i++){
                    console.log(
                        obj.items[i].user_name + ' 在 ' + obj.items[i].plan_name + ' 提到: ' + obj.items[i].item_name + ' 的 ' + obj.items[i].info_type + ': ' + obj.items[i].info_content
                    )
                }                
            }else{
                config.shareItems = rows
                listPlanItems(config)                    
            }
        }
 })
    con.end()    
}

var all = function(param){
    console.log('all')    
    var config = {
        'userName': param.userName,
        'res': param.res,
        'all': []
    }
   
    var getPlanNumber = function()
    {
        var promise = $.Deferred()
        var url = api + config.userName + '/plans'
        $.getJSON( url, function(data){
            var planArr = _.map(data, function(val,key ){ return val.id })
            promise.resolve(planArr);
        })
        // or u can loop plan all here then change promise as each plan data?
        return promise;
    }
    
    var getPlanItem = function()
    {        
        for (i=0; i < config.planArr.length; i++) {
            var url = api + config.userName +'/plans/' + config.planArr[i] + '/all'; 
            $.getJSON(url, function(data){
                config.all.push(data)
                if (_.size(config.all) == i) {
                    // console.log('<<<<<<<<<<<<<', _.size(config.all), i)
                    config.res.send(config.all)
                } 
            })
        }
    }

    $.when( 
        getPlanNumber()
    ).then(function(planRes){
        config.planArr = planRes
        getPlanItem()
    });
}

module.exports = {
    planItems: planItems,
	findSharedInfo: findSharedInfo,
    all: all
}