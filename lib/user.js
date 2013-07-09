var db = require('./db.util.js');

var intro = function(userName, res){
	var con = db.read(); con.connect();
	var sql = 'SELECT userid, name, mail, birth, sex FROM user WHERE name = ?';
	con.query(sql, userName, function(err, rows){
		if (err) throw err
		res.send(rows)
		console.log(rows)
	})
}

var updateName = function(oldUserName, newName, res){
	var con = db.write(); con.connect();
	var sql = 'UPDATE user SET name = ? WHERE name = ?';
	con.query(sql, [newName, oldUserName], function(err, rows){
		if (err) throw err
		if (rows.changedRows == 0) res.send('0')
		if (rows.changedRows == 1) res.send('1')
		console.log(rows)
	})
	con.end()
}

module.exports = {
	intro: intro,
	updateName: updateName
}
