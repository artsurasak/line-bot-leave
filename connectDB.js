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

// insertReqLeave();
// function insertReqLeave() {
//     var conn = new sql.Connection(config);
//     var req = new sql.Request(conn);
//     conn.connect(function (err){
//         if(err){
//             console.log(err);
//             return;
//         }
//         var query = "insert into [REQUEST_LEAVE] (LEAVETYPE_ID,FROM_LEAVE_DATE,FROM_LEAVE_TIME,TO_LEAVE_DATE,TO_LEAVE_TIME, "
//             query += "NOTE,CONTACT,CONTACT_TEL,STATUS,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY) "
//             query += "VALUES ( ";
//             // query += "'1',"
//             // query += "'2018-05-01',"
//             // query += "'08:00',"
//             // query += "'2018-05-02',"
//             // query += "'16:30',"
//             // query += "'ปวดหัว',"
//             // query += "'',"
//             // query += "'',"
//             query += "'" + LeaveType + "',"
//             query += "'" + FDate + "',"
//             query += "'" + FTime + "',"
//             query += "'" + TDate + "',"
//             query += "'" + TTime + "',"
//             query += "'" + Note  + "',"
//             query += "'" + ContactName + "',"
//             query += "'" + ContactTel + "',"
//             query += "'I',"
//             query += "sysdatetime(),"
//             query += "'580009',"
//             query += "sysdatetime(),"
//             query += "'580009'"
//             query += ")"
//             console.log(query);
//         req.query(query,function(err,recordset){
//             if(err){
//                 console.log(err)
//                 //callback(err)
//             }else{
//                 console.log("บันทึกข้อมูลเรยบร้อย")
//                 //callback("บันทึกข้อมูลเรยบร้อย")
//             }
//             conn.close();
//         });
//     });
// }

const executesql = function(LineUserID,callback){
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
            query += "and usr.LINE_ID = '" + LineUserID + "' ";
            query += ")as t1 ";
            query += "left join ";
            query += "(select LEAVETYPE_ID , SUM(NO_LEAVE) as NoLeave ";
            query += "from REQUEST_LEAVE  req , [USER] usr "; 
            query += "where usr.LINE_ID = '" + LineUserID + "' ";
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

const insertReqLeave = function(LeaveType,DepID,FDate,FTime,TDate,TTime,Note,ContactName,ContactTel,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "insert into [REQUEST_LEAVE] (LEAVETYPE_ID,FROM_LEAVE_DATE,FROM_LEAVE_TIME,TO_LEAVE_DATE,TO_LEAVE_TIME, "
            query += "NOTE,CONTACT,CONTACT_TEL,STATUS,APPROVE_BY,REQ_CONFIRM,CONFIRM_BY,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY) "
            query += "VALUES ( ";
            query += "'" + LeaveType + "',"
            query += "'" + FDate + "',"
            query += "'" + FTime + "',"
            query += "'" + TDate + "',"
            query += "'" + TTime + "',"
            query += "'" + Note  + "',"
            query += "'" + ContactName + "',"
            query += "'" + ContactTel + "',"
            query += "'I',"
            query += "'" + ApprConfirm('3',DepID) + ","
            if(LeaveType === '3'){
                query += "'FALSE',"
            }else{
                query += "'TRUE',"
            }
            query += "'" + ApprConfirm('4',DepID) + ","
            query += "sysdatetime(),"
            query += "'580009',"
            query += "sysdatetime(),"
            query += "'580009'"
            query += ")"
        req.query(query,function(err,recordset){
            if(err){
                callback(err)
                //console.log(err);
            }else{
                callback("บันทึกข้อมูลเรียบร้อย")
            }
            conn.close();
        });
    });
}

const DepartmentID = function(LineUserID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select DeptID "
            query += "from [USER] usr "
            query += "where usr.LINE_ID = '" + LineUserID + "'"
        req.query(query,function(err,recordset){
            if(err){
                return err
                //callback(err)
                //console.log(err);
            }else{
                return recordset[0].DeptID
                
            }
            conn.close();
        });
    });
}

const ApprConfirm = function(TypeGroupAppr,DepartmentID,callback){
     var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select EMP_CODE "
            query += "from [USER] usr "
            query += "where usr.DeptID = '" + DepartmentID + "'"
            query += "and usr.USER_GROUP = '" + TypeGroupAppr + "'"
        req.query(query,function(err,recordset){
            if(err){
                return err 
                //callback(err)
                //console.log(err);
            }else{
                return recordset[0].EMP_CODE
                //callback(recordset[0].EMP_CODE)
            }
            conn.close();
        });
    });
}

module.exports = {
    executesql , insertReqLeave
}
