var sql = require('mssql');
//var sql = require("msnodesqlv8");
var config = {
    //driver: "msnodesqlv8",
    // server: 'LAPTOP-9RESSIQU\\SQLEXPRESS', 
    // database:'LEAVE',
    // user: 'sa',
    // password: 'P@ssw0rd',
    server: 'sql.freeasphost.net\\MSSQL2016',
    database:'surasak_SampleDB',
    user: 'surasak_SampleDB',
    password: 'DBSamplePW'
    // options: {
    //             trustedConnection: true,
    //             useUTC: true
    //           }
    
}
// executesql();
// function executesql() {
//     var conn = new sql.Connection(config);
//     var req = new sql.Request(conn);
//     conn.connect(function (err){
//         if(err){
//             console.log(err);
//             return;
//         }
//         //req.query("select DEPARTMENT_NAME from [LEAVE].[dbo].[DEPARTMENT] where DEPARTMENT_ID = 1 ",function(err,recordset){
//         req.query("SELECT * FROM [surasak_SampleDB].[dbo].[People] ",function(err,recordset){
//             if(err){
//                 console.log(err);
//             }else{
//                 //callback(recordset)
//                 console.log(recordset[1].Department);
//             }
//             conn.close();
//         });
//     });
// }
const executesql = function(callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        //req.query("select DEPARTMENT_NAME from [LEAVE].[dbo].[DEPARTMENT] where DEPARTMENT_ID = 1 ",function(err,recordset){
        req.query("SELECT * FROM [surasak_SampleDB].[dbo].[People] ",function(err,recordset){
            if(err){
                callback(err)
                //console.log(err);
            }else{
                callback(recordset[0].Department)
                //console.log(recordset[1].Department);
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql
}
