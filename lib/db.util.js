var APP = require('../app_config/define.js')
	conf = require(APP.DB_CONF)
	mysql = require('mysql')

var read = function(){
    var connection = mysql.createConnection(
    	conf.viewer
    )
    return connection
}

var write = function(){
    var connection = mysql.createConnection(
    	conf.writer
    )
    return connection
}

module.exports = {
	read: read,
	write: write
}