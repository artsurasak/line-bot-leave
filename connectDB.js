var sql = require('mssql');
//var sql = require("msnodesqlv8");
var config = {
    //driver: "msnodesqlv8",
    server: 'LAPTOP-9RESSIQU\\SQLEXPRESS', 
    database:'LEAVE',
    user: 'sa',
    password: 'P@ssw0rd',
    options: {
                trustedConnection: true,
                useUTC: true
              }
    
}
//executesql();
const executesql = function(callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        req.query("select * from [LEAVE].[dbo].[DEPARTMENT] where DEPARTMENT_ID = 1 ",function(err,recordset){
            if(err){
                console.log(err);
            }else{
                callback(recordset)
                //callback(recordset)
                //console.log(recordset);
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql
}
