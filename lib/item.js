var db = require('./db.util.js')
	plan = require('./plan')

//planItems -> checkPlanOwner -> listPlanItems
var planItems = function(param) {
    var con = db.read(); con.connect();
    con.query('SELECT id FROM user WHERE name = ?', [param.username], function(err, rows, fields){
        if (err) throw err
        if (rows.length == 0)
            param.res.send({'page': 'no user found :3'})
        else{
            //console.log(rows)
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

    con.query(sql, [config.planid] ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            config.res.send({'page': 'no item :3'})
        else{
            if(config.share == null){
                console.log(rows)
                config.res.send(rows)
                console.log({planid: config.planid, count : rows.length })
            }else{
                rows[rows.length] = config.share				
                config.res.send(rows)
                console.log(rows)
                console.log({planid: config.planid, count : rows.length, msg: 'with share!' })
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
            config.res.send({'page': 'no item :3'})
        else{
            if(config.share == null){
                var obj = {}
                obj.status = {
                    plan_id: config.planid,
                    count : rows.length
                }
                obj.share = rows    
                config.res.send(obj)
                console.log(obj)
                console.log("\n-----\n")
                for (var i = 0; i < Object.keys(obj).length; i++){
                    console.log(
                        obj.share[i].user_name + ' 在 ' + obj.share[i].plan_name + ' 提到: ' + obj.share[i].item_name + ' 的 ' + obj.share[i].info_type + ': ' + obj.share[i].info_content
                    )
                }                
            }else{
                var obj = {}
                obj.status = {
                    plan_id: config.planid,
                    count : rows.length
                }
                obj.share = rows
                config.share = obj
                listPlanItems(config)                    
            }

        }
 })
    con.end()    
}

module.exports = {
    planItems: planItems,
	findSharedInfo: findSharedInfo
}