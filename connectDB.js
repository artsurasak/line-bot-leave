var sql = require('mssql');
//var sql = require("msnodesqlv8");
var config = {
    //driver: "msnodesqlv8",
    // server: 'LAPTOP-9RESSIQU\\SQLEXPRESS', 
    // database:'LEAVE',
    // user: 'sa',
    // password: 'P@ssw0rd',
    server: 'bi_test',
    database:'RIS',
    user: 'RIS',
    password: 'p@ssw0rd3'
    // options: {
    //             trustedConnection: true,
    //             useUTC: true
    //           }
    
}
//executesql();
// function executesql() {
//     var conn = new sql.Connection(config);
//     var req = new sql.Request(conn);
//     conn.connect(function (err){
//         if(err){
//             console.log(err);
//             return;
//         }
//         //req.query("select DEPARTMENT_NAME from [LEAVE].[dbo].[DEPARTMENT] where DEPARTMENT_ID = 1 ",function(err,recordset){
//         req.query("SELECT ENTITY FROM [RIS].[dbo].[RENT_GP] where id = '1' ",function(err,recordset){
//             if(err){
//                 console.log(err);
//             }else{
//                 //callback(recordset)
//                 console.log(recordset);
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
        req.query("SELECT ENTITY FROM [RIS].[dbo].[RENT_GP] where id = '1' ",function(err,recordset){
            if(err){
                console.log(err);
            }else{
                callback(recordset)
                //console.log(recordset);
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql
}
