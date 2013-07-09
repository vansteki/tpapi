var db = require('./db.util.js');

var plans = function(userName, res) {
    var con = db.read(); con.connect();
    // var sql = "SELECT planid, planname, total_days, plan_start_date, plan_end_date FROM plan INNER JOIN user WHERE user.userid = plan.userid AND user.name = '" + userName + "'";
    var select = 'SELECT planid, planname, total_days, plan_start_date, plan_end_date '
    var from = 'FROM plan '
    var join = 'INNER JOIN user WHERE user.userid = plan.userid AND user.name = ?'
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
    con.query('SELECT userid FROM user WHERE name = ?', [userName], function(err, rows, fields){
        if (err) throw err
        if (rows.length == 0)
            res.send({'page': 'no user found :3'})
        else{
            //console.log(rows)
            checkPlanOwner(rows[0].userid, planid, res)
        }
    })
    con.end()
}

var checkPlanOwner = function(userid, planid, res){
    var con = db.read(); con.connect();
    con.query('SELECT * FROM plan WHERE planid =? AND userid = ?', [planid, userid] ,function(err, rows){
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
    var where = 'WHERE plan_item.spotid = item_info.spotid AND plan_item.planid = ? '
    var by = 'order by queue'
    var sql = select + from + join + where + by
    //"select * from plan_item inner join item_info where plan_item.spotid = item_info.spotid AND plan_item.planid ='" + planid + "' order by queue"
    con.query(sql, [planid] ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            res.send({'page': 'no item :3'})
        else{
            res.send(rows)
            console.log(rows);
            console.log({count : rows.length})
        }
 })
    con.end()
}

module.exports = {
    plans:     plans,
    planItems: planItems
}