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

var checkPlanOwner = function(config){
    var con = db.read(); con.connect();
    con.query('SELECT * FROM plan WHERE plan.id = ? AND plan.user_id = ?', [config.planid, config.userid] ,function(err, rows){
        if (err) throw err
        if (rows.length == 0)
            config.res.send({'page': 'not plan owner :3'})
        else
            config.next(config)
    })
    con.end()
}

module.exports = {
    plans:     plans,
    checkPlanOwner: checkPlanOwner
}