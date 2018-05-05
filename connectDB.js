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

const executesql = function(LineName,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select t1.NO_LEAVE , t1.TYPE , iif(t2.NoLeave is null,0,t2.NoLeave) as NoLeave , (t1.NO_LEAVE- iif(t2.NoLeave is null,0,t2.NoLeave) ) as remain ";
            query += "from ( select  noLeave.NO_LEAVE , leave.TYPE , leave.ID ";
            query += "from [USER] usr , [ROLE_NO_LEAVE] noLeave ";
            query += "right join [LEAVE_TYPE] leave ";
            query += "on noLeave.LEAVE_TYPE = leave.ID ";
            query += "where usr.ROLE_ID = noLeave.ROLE_ID ";
            query += "and usr.LINE_ID = '" + LineName + "' ";
            query += ")as t1 ";
            query += "left join ";
            query += "(select LEAVETYPE_ID , SUM(NO_LEAVE) as NoLeave ";
            query += "from REQUEST_LEAVE  req , [USER] usr "; 
            query += "where usr.LINE_ID = '" + LineName + "' ";
            query += "and REQ_CONFIRM = 'true' ";
            query += "and req.CREATE_BY = usr.EMP_CODE "
            query += "group by LEAVETYPE_ID ";
            query += ")as t2 ";
            query += "on t1.ID = t2.LEAVETYPE_ID";

        req.query(query,function(err,recordset){
            if(err){
                callback(err)
                //console.log(err);
            }else{
                callback(recordset)
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql
}
