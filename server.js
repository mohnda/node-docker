var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();


var pool      =    mysql.createPool({
	connectionLimit : 10, 
	host     : process.env.DBHOST,
	user     : process.env.DBUSER,
	password : process.env.DBPW,
	database : process.env.DBNAME,
	debug    :  false
});

function pooledGet(req,res) {

	pool.getConnection(function(err,connection){
		if (err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}   


		connection.query("select * from user order by age limit 5",function(err,rows){
			connection.release();
			if(!err) {
				res.json(rows);
			}           
		});

		
	});
}

app.get("/",function(req,res){
	pooledGet(req,res);
});

app.listen(8080);
