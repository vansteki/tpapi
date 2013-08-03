var db = require('./db.util.js')
var bcrypt = require('bcrypt')

var listUser = function(res){
	var con = db.read(); con.connect();
	var sql = 'SELECT id, name, mail, birth, sex, type, is_active, api_key FROM user'
	
	con.query(sql, function(err, rows, col){
		if (err) throw err
		if (rows.length == 0) res.send({'msg': 'find no user'})
		res.send(rows)
	})
	con.end()
}

var enableUser = function(userName, res){
	var con = db.write(); con.connect();
	var sql = 'UPDATE user SET is_active = 1 WHERE name = ?';
	
	con.query(sql, [userName], function(err, rows, col){
		if (err) throw err
		if (rows.changedRows == 0)
			res.send('0')
		else
			res.send('1')
	})
	con.end()
}

var disableUser = function(userName, res){
	var con = db.write(); con.connect();
	var sql = 'UPDATE user SET is_active = 0 WHERE name = ?';
	
	con.query(sql, [userName], function(err, rows, col){
		if (err) throw err
		if (rows.changedRows == 0)
			res.send('0')
		else
			res.send('1')
	})
	con.end()
}

var updateUserStats = function(userName, isActive, res){
	if(isActive == 1)
		enableUser(userName, res)
	if(isActive == 0)
		disableUser(userName, res)
}

var genHash = function(alias, rounds, res){
	bcrypt.hash(alias, 8, function(err, hash) {
		console.log(hash)
		hash = hash.slice(0,rounds)
		console.log(hash)
		res.send({ 'result': '{' + alias + ' : ' + hash + '}' })
	});
}

module.exports = {
	listUser: listUser,
	enableUser: enableUser,
	disableUser: disableUser,
	updateUserStats: updateUserStats,
	genHash: genHash
}