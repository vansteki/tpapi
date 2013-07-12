var db = require('./db.util.js');

var plans = function(userName, res) {
    var con = db.read(); con.connect();
    var select = 'SELECT plan.id, plan.name, total_days, start_date, end_date '
    var from = 'FROM plan '
    var join = 'INNER JOIN user WHERE user.id = plan.user_id AND user.name = ?'
    var sql = select + from + join

    con.query(sql, [userName], function(err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            res.send({'page': 'no plan found :3'})
        } else {
            console.log(rows)
            res.send(rows)
        }
    })
    con.end()
}

//planItems -> checkPlanOwner -> listPlanItems
var planItems = function(userName, planid, res) {
    var con = db.read(); con.connect();
    con.query('SELECT id FROM user WHERE name = ?', [userName], function(err, rows, fields){
        if (err) throw err
        if (rows.length == 0)
            res.send({'page': 'no user found :3'})
        else{
            //console.log(rows)
            checkPlanOwner(rows[0].id, planid, res)
        }
    })
    con.end()
}

var checkPlanOwner = function(userid, planid, res){
    var con = db.read(); con.connect();
    con.query('SELECT * FROM plan WHERE plan.id = ? AND plan.user_id = ?', [planid, userid] ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            res.send({'page': 'not plan owner :3'})
        else
            //console.log(rows)
            listPlanItems(planid, res)
    })
    con.end()
}

var listPlanItems = function(planid, res){
    var con = db.read(); con.connect();
    var select = 'SELECT * '
    var from = 'FROM plan_item '
    var join = 'INNER JOIN item_info '
    //var where = 'WHERE plan_item.spotid = item_info.spotid AND plan_item.planid = ? '
    var where = 'WHERE plan_item.plan_id = ? AND plan_item.id = item_info.plan_item_id '
    var by = 'order by plan_item.queue'
    var sql = select + from + join + where + by

    con.query(sql, [planid] ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            res.send({'page': 'no item :3'})
        else{
            res.send(rows)
            console.log(rows)
            console.log({count : rows.length})
            console.log(planid)
        }
 })
    con.end()
}

module.exports = {
    plans:     plans,
    planItems: planItems
}