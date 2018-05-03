var sql = require('mssql');
var config = {
        // server: 'LAPTOP-9RESSIQU\\SQLEXPRESS', 
        // database:'LEAVE',
        // user: 'sa',
        //password: 'P@ssw0rd'
        server: 'mssql.smartmedia.co.th',
        database:'smartmedia_leave',
        user: 'smartmedia_sp',
        password: 'P@ssw0rd'
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
//         req.query("SELECT * FROM [smartmedia_leave].[smartmedia_sp].[DEPARTMENT] ",function(err,recordset){
//         //req.query("SELECT * FROM [surasak_SampleDB].[dbo].[People] ",function(err,recordset){
//             if(err){
//                 console.log(err);
//             }else{
//                 //callback(recordset)
//                 console.log(recordset[0].DEPARTMENT_NAME);
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
        req.query("SELECT * FROM [smartmedia_leave].[smartmedia_sp].[DEPARTMENT] ",function(err,recordset){
            if(err){
                callback(err)
                //console.log(err);
            }else{
                callback(recordset[0].DEPARTMENT_NAME)
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql
}
