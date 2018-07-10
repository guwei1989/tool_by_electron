$(document).ready(function () {
    $("[data-toggle='tooltip']").tooltip();
    var mysql = require('mysql');

    $("#modify_btn_auth_bug").click(function () {

        if (isValidIp($("#db_ip_auth_bug").val())) {

            $("#loading_gif_auth_bug").css("visibility", "visible");
            var connection = mysql.createConnection({
                host: $("#db_ip_auth_bug").val(),
                port: '3306',
                user: 'root',
                password: 'iraindb10241GB',
                database: 'irain_park'
            });

            connection.connect();

            connection.query("update new_auth_group set eday = DATE_SUB(eday, INTERVAL 1 DAY)" +
                " where time_range = '00:00:00,23:59:59' and week='1,2,3,4,5,6,7' and auth_no" +
                " in (select auth_no from new_auth_charge where DATE(eday) != DATE(validity_end))",
                function (error, rows, fields) {
                    if (error) {
                        bootbox.alert({
                            title: "警告！",
                            message: "数据库操作出现异常：" + error,
                            size: "small"
                        })
                        $("#loading_gif_auth_bug").css("visibility", "hidden");
                        throw error;
                    };
                    console.log("update new_auth_group set eday = DATE_SUB(eday, INTERVAL 1 DAY)" +
                        " where time_range = '00:00:00,23:59:59' and week='1,2,3,4,5,6,7' and auth_no" +
                        " in (select auth_no from new_auth_charge where DATE(eday) != DATE(validity_end))");
                    console.log('The solution is: ', rows);
                });

            connection.query("update new_auth_charge set eday = DATE_SUB(eday, INTERVAL 1 DAY)" +
                " where auth_no in (select auth_no from new_auth_group where time_range = '00:00:00,23:59:59' and week='1,2,3,4,5,6,7')" +
                " and DATE(eday) != DATE(validity_end)",
                function (error, rows, fields) {
                    if (error) {
                        bootbox.alert({
                            title: "警告！",
                            message: "数据库操作出现异常：" + error,
                            size: "small"
                        })
                        $("#loading_gif_auth_bug").css("visibility", "hidden");
                        throw error;
                    };
                    console.log("update new_auth_charge set eday = DATE_SUB(eday, INTERVAL 1 DAY)" +
                        " where auth_no in (select auth_no from new_auth_group where time_range = '00:00:00,23:59:59' and week='1,2,3,4,5,6,7')");
                    console.log('The solution is: ', rows);

                    $("#loading_gif_auth_bug").css("visibility", "hidden");
                    bootbox.alert({
                        title: "提示信息",
                        message: "修改成功！",
                        size: "small"
                    })
                });

            connection.end();

        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入正确的IP地址！",
                size: "small"
            })
        }
    })



    $("#extend_btn_auth_bug").click(function () {

        if (isValidIp($("#db_ip_auth_bug").val())) {

            $("#loading_gif_auth_bug").css("visibility", "visible");
            var Client = require('ssh2').Client;
            var conn = new Client();

            conn.on('ready', function () {
                console.log('Client :: ready');

                conn.sftp(function (err, sftp) {
                    if (err) {
                        bootbox.alert({
                            title: "警告",
                            message: "连接ARM出现异常：" + err,
                            size: "small"
                        })
                        $("#loading_gif_auth_bug").css("visibility", "hidden");
                        throw err;
                    } else {
                        sftp.fastPut("./set_more_validity_time.py", "/home/park/set_more_validity_time.py", function (err, result) {
                            console.log("fastPut complete!")

                            conn.shell(function (err, stream) {
                                if (err) {
                                    bootbox.alert({
                                        title: "警告",
                                        message: "连接ARM出现异常：" + err
                                    })
                                    $("#loading_gif_auth_bug").css("visibility", "hidden");
                                    throw err;
                                }
                                stream.on('close', function () {
                                    console.log('Stream :: close');
                                    conn.end();
                                }).on('data', function (data) {
                                    console.log('STDOUT: ' + data);
                                }).stderr.on('data', function (data) {
                                    console.log('STDERR: ' + data);
                                });
                                stream.end('cd /home/park\npython set_more_validity_time.py ' + "'" + $("#db_ip_auth_bug").val() + "'" + ' ' + "'" + $("#db_arm_port_auth_bug").val() + "'" + '\n');
                                setTimeout(function () {
                                    bootbox.alert({
                                        title: "提示",
                                        message: "操作成功！",
                                        size: "small"
                                    }), $("#loading_gif_auth_bug").css("visibility", "hidden")
                                }, 5000)
                            });

                        });
                    }
                });

            }).connect({
                host: $("#db_ip_auth_bug").val(),
                port: $("db_arm_port_auth_bug").val(),
                username: 'root',
                password: 'iraindev10241GB',
            });

        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入正确的IP地址！",
                size: "small"
            })
        }
    })

})