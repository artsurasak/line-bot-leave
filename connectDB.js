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
                callback(err)
            }else{
                callback(recordset[0].EMP_CODE)
            }
            conn.close();
        });
    });
}

const LeaveType = function(LeaveID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
            var query = "SELECT TYPE "
            query += "FROM [LEAVE_TYPE] "
            query += "where ID = '" + LeaveID + "' "
            req.query(query,function(err,recordset){
                if(err){
                    callback(err)
                }else{
                    callback(recordset[0].TYPE)
                }
                conn.close();
            });
    });
}

const dateHoliday = function(fDate,tDate,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "SELECT count(DATE_HOLIDAY) as cHoliday "
            query += "FROM [HOLIDAY] "
            query += "where DATE_HOLIDAY between '" + fDate + "' and '" + tDate + "' "
            req.query(query,function(err,recordset){
                if(err){
                    callback(err)
                    //console.log(err);
                }else{
                    callback(recordset[0].cHoliday)
                }
                conn.close();
            });
    });
}

const executesql = function(LineUserID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select t1.noLeaveValid / 8 as ValidDate , t1.TYPE , "
            query += "CONVERT(varchar(10), iif(t2.NoLeave is null,0,(t2.NoLeave/8))) + ' วัน ' + CONVERT(varchar(10), iif(t2.NoLeave is null,0,(t2.NoLeave % 8)))  + ' ชั่วโมง ' as NoLeave,  " 
            query += "CONVERT(varchar(10), iif(t2.NoLeave is null,t1.noLeaveValid,(t1.noLeaveValid - t2.NoLeave)) / 8) + ' วัน ' + CONVERT(varchar(10), iif(t2.NoLeave is null,0,((t1.noLeaveValid- t2.NoLeave) %8)))  + ' ชั่วโมง ' as remain ";
            query += "from ( select  (noLeave.NO_LEAVE * 8) as noLeaveValid , leave.TYPE , leave.ID ";
            query += "from [USER] usr , [ROLE_NO_LEAVE] noLeave ";
            query += "right join [LEAVE_TYPE] leave ";
            query += "on noLeave.LEAVE_TYPE = leave.ID ";
            query += "where usr.ROLE_ID = noLeave.ROLE_ID ";
            query += "and usr.LINE_ID = '" + LineUserID + "' ";
            query += ")as t1 ";
            query += "left join ";
            query += "(select LEAVETYPE_ID , ((SUM(NO_LEAVE) * 8) + sum(NO_LEAVE_HOUR)) as NoLeave ";
            query += "from REQUEST_LEAVE  req , [USER] usr "; 
            query += "where usr.LINE_ID = '" + LineUserID + "' ";
            query += "and REQ_CONFIRM = 'true' ";
            query += "and STATUS = 'A' ";
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

const insertReqLeave = function(LeaveType,DepID,EmpID,FDate,FTime,TDate,TTime,NoLeave,NoHours,Note,ContactName,ContactTel,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
         ApprConfirm('3',DepID,function(confirm1){
            ApprConfirm('4',DepID,function(confirm2){
                    var query = "insert into [REQUEST_LEAVE] (LEAVETYPE_ID,FROM_LEAVE_DATE,FROM_LEAVE_TIME,TO_LEAVE_DATE,TO_LEAVE_TIME,NO_LEAVE,NO_LEAVE_HOUR, "
                        query += "NOTE,CONTACT,CONTACT_TEL,STATUS,APPROVE_BY,REQ_CONFIRM,CONFIRM_BY,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY) "
                        query += "VALUES ( ";
                        query += "'" + LeaveType + "',"
                        query += "'" + FDate + "',"
                        query += "'" + FTime + "',"
                        query += "'" + TDate + "',"
                        query += "'" + TTime + "',"
                        query += "'" + NoLeave + "',"
                        query += "'" + NoHours + "',"
                        query += "'" + Note  + "',"
                        query += "'" + ContactName + "',"
                        query += "'" + ContactTel + "',"
                        query += "'I',"
                        query += "'" + confirm1 + "',"
                        if(LeaveType === '3'){
                            query += "'FALSE',"
                        }else{
                            query += "'TRUE',"
                        }
                        query += "'" + confirm2 + "',"
                        query += "sysdatetime(),"
                        query += "'" + EmpID + "',"
                        query += "sysdatetime(),"
                        query += "'" + EmpID + "'"
                        query += ")"
                        //callback(query)
                        req.query(query,function(err,recordset){
                        if(err){
                            callback(err)
                            //console.log(err);
                        }else{
                            callback("บันทึกข้อมูลเรียบร้อย")
                        }
                            conn.close();
                        });
            })
        })
    });
}

// userDTL()
// function userDTL(){
//     var conn = new sql.Connection(config);
//     var req = new sql.Request(conn);
//     conn.connect(function (err){
//         if(err){
//             console.log(err);
//             return;
//         }
//         var query = "select DeptID , EMP_CODE , ROLE_ID "
//             query += "from [USER] usr "
//             query += "where usr.LINE_ID = 'U0d589cbccf8f08124f85a5e2e86b8ce4'"
//             //callback(query)
//             req.query(query,function(err,recordset){
//                 if(err){
//                     callback(err)
//                     //callback(err)
//                     //console.log(err);
//                 }else{
//                     console.log(recordset[0].ROLE_ID)
//                     //callback(recordset[0].ROLE_ID)
//                 }
//                 conn.close();
//             });
//         });
// }

const userDTL = function(LineUserID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select DeptID , EMP_CODE , ROLE_ID "
            query += "from [USER] usr "
            query += "where usr.LINE_ID = '" + LineUserID + "'"
            //callback(query)
            req.query(query,function(err,recordset){
                if(err){
                    callback(err)
                    //callback(err)
                    //console.log(err);
                }else{
                    //console.log(recordset[0].ROLE_ID)
                    callback(recordset)
                }
                conn.close();
            });
        });
}

const getValidNoDate = function(LeaveTypeID,RoleID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select (NO_LEAVE * 8) as NO_LEAVE ";
            query += "from [ROLE_NO_LEAVE] ";
            query += "where ROLE_ID = '" + RoleID + "'";
            query += "and LEAVE_TYPE = '" + LeaveTypeID + "'";
            req.query(query,function(err,recordset){
            if(err){
                callback(err)
                //callback(err)
                //console.log(err);
            }else{
                callback(recordset[0].NO_LEAVE)
            }
            conn.close();
        });
    });
}

const userReqNoLeave = function(empCode,LeaveTypeID,callback){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if(err){
            console.log(err);
            return;
        }
        var query = "select sum(NO_LEAVE) * 8 + sum(NO_LEAVE_HOUR) as noLeaveDate ";
            query += "from [REQUEST_LEAVE] ";
            query += "where CREATE_BY = '" + empCode + "'"; 
            query += "and LEAVETYPE_ID = '" + LeaveTypeID + "'";
            query += "and STATUS not in ('R','C') "
            query += "group by LEAVETYPE_ID "
            req.query(query,function(err,recordset){
            if(err){
                callback(err)
            }else{
                 if (recordset == ''){callback(0)}
                    else{ callback(recordset[0].noLeaveDate)}
            }
            conn.close();
        });
    });
} 


// AllowDateAppr();
// function AllowDateAppr(){
//         LeaveTypeID = '1'
//         RoleID = '3'
//         empCode = '580009'
//         noLeave = '15'
//         getValidNoDate(LeaveTypeID,RoleID,function(validNoDate){
//             userReqNoLeave(empCode,LeaveTypeID,function(userReqNoLeave){
//                 console.log(validNoDate)
//                 console.log(userReqNoLeave)
//                 resultLeave = parseInt(noLeave) + parseInt(userReqNoLeave)
//                 console.log(resultLeave)
//                 if(validNoDate >= resultLeave){
//                     //callback(true)
//                     console.log(true)
//                 }
//                 else{
//                     console.log(false)
//                     //callback(false)
//                 }
//             })
//         })
// }

const AllowDateAppr = function(LeaveTypeID,RoleID,empCode,noLeave,hourLeave,callback){
            // LeaveTypeID = '1'
            // RoleID = '3'
            // empCode = '580009'
            // noLeave = '2'
            getValidNoDate(LeaveTypeID,RoleID,function(validNoDate){
                userReqNoLeave(empCode,LeaveTypeID,function(userReqNoLeave){
                    resultLeave = ((parseInt(noLeave) * 8) + parseInt(hourLeave)) + parseInt(userReqNoLeave)
                    //callback(resultLeave)
                    if(validNoDate >= resultLeave){callback(true)}
                    else{callback(false)}
                })
            })
}

module.exports = {
    executesql , insertReqLeave , userDTL , dateHoliday , LeaveType , AllowDateAppr
}
