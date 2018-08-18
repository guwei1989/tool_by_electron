$(document).ready(function () {
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    var mysql = require('mysql');
    $('#datetimepicker').datetimepicker();

    $("#export_btn").click(function () {

        var inside_data = [
            {
                name: '场内记录',
                data: [
                    [
                        '进场时间',
                        '车牌号'
                    ]
                ]
            }
        ];
        var end_time = $("#datetimepicker").val();

        if (isValidIp($("#db_ip").val())) {
            $("#loading_gif_export").css("visibility", "visible");
            var connection = mysql.createConnection({
                host: $("#db_ip").val(),
                port: $("#db_port").val(),
                user: 'root',
                password: 'iraindb10241GB',
                database: 'irain_park'
            });

            connection.connect();

            connection.query('select in_time, vpr_plate from park_inside ' +
                'a left join park_in b on a.park_in_id = b.id where b.in_time <= ' + "'" + end_time + "'",
                function (error, rows, fields) {
                    if (error) {
                        bootbox.alert({
                            title: "警告！",
                            message: "数据库操作出现异常：" + error,
                            size: 'small'
                        });
                        $("#loading_gif_export").css("visibility", "hidden");
                        throw error
                    };
                    console.log('select in_time, vpr_plate from park_inside ' +
                        'a left join park_in b on a.park_in_id=b.id where b.in_time <= ' + "'" + end_time + "'");
                    console.log('The solution is: ', rows);
                    for (var i = 0; i < rows.length; i++) {
                        inside_data[0].data.push([rows[i].in_time.toLocaleString(), rows[i].vpr_plate])
                    }

                    var myDate = new Date()
                    console.log(inside_data)
                    var buffer = xlsx.build(inside_data);
                    fs.writeFile('./export_result/inside_cars_' + myDate.getSeconds() + '.xls', buffer, function (err) {
                        if (err) {
                            bootbox.alert({
                                title: "警告！",
                                message: "导出EXCEL出现异常：" + err,
                                size: 'small'
                            });
                            $("#loading_gif_export").css("visibility", "hidden");
                            throw err
                        };
                        console.log('Write to xls has finished');

                        $("#loading_gif_export").css("visibility", "hidden");
                        bootbox.alert({
                            title: "提示信息",
                            message: "导出成功,已保存至export_result目录下！",
                            size: "small"
                        })
                    }
                    );

                });
            connection.end();

        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入有效的IP！",
                size: "small"
            })
        }

    })


    $("#delete_btn").click(function () {

        var end_time = $("#datetimepicker").val();

        if (isValidIp($("#db_ip").val())) {
            $("#loading_gif_export").css("visibility", "visible");

            var Client = require('ssh2').Client;
            var conn = new Client();
            var myDate = new Date();

            conn.on('ready', function () {
                console.log('Client :: ready');
                conn.shell(function (err, stream) {
                    if (err) {
                        bootbox.alert({
                            title: "警告！",
                            message: "登陆arm板出现异常：" + err,
                            size: 'small'
                        });
                        $("#loading_gif_export").css("visibility", "hidden");
                        throw err
                    };
                    stream.on('close', function () {
                        console.log('Stream :: close');
                        conn.end();
                    }).on('data', function (data) {
                        console.log('STDOUT: ' + data);
                    }).stderr.on('data', function (data) {
                        console.log('STDERR: ' + data);
                    });
                    stream.end("mysqldump -h" + $("#db_ip").val() + " -uroot -piraindb10241GB irain_park park_in park_inside > " +
                        "/home/park/irain_parkin_inside_" + '"' + myDate.getSeconds() + '"' + ".sql\n");

                    var connection = mysql.createConnection({
                        host: $("#db_ip").val(),
                        port: $("#db_port").val(),
                        user: 'root',
                        password: 'iraindb10241GB',
                        database: 'irain_park'
                    });
                    connection.connect();
                    connection.query('delete from park_inside where park_in_id in (select id from park_in where ' +
                        'in_time <= ' + "'" + end_time + "'" + ")",
                        function (error, rows, fields) {
                            console.log('The solution is: ', rows);
                            if (error) {
                                bootbox.alert({
                                    title: "警告！",
                                    message: "数据库操作出现异常：" + error,
                                    size: 'small'
                                });
                                $("#loading_gif_export").css("visibility", "hidden");
                                throw error
                            };
                        })

                    connection.query('delete from park_in where in_time <= ' + "'" + end_time + "'",
                        function (error, rows, fieldse) {
                            console.log('The solution is: ', rows);
                            if (error) {
                                bootbox.alert({
                                    title: "警告！",
                                    message: "数据库操作出现异常：" + error,
                                    size: 'small'
                                });
                                $("#loading_gif_export").css("visibility", "hidden");
                                throw error;
                            };
                        })
                    connection.end();
                    $("#loading_gif_export").css("visibility", "hidden");
                    bootbox.alert({
                        title: "提示信息",
                        message: "删除场内记录成功，并备份表park_inside和park_in至目录/home/park下！",
                        size: 'small'
                    })

                });
            }).connect({
                host: $("#db_ip").val(),
                port: $("#db_arm_port").val(),
                username: 'root',
                password: 'iraindev10241GB',
            });

        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入有效的IP！",
                size: "small"
            })
        }

    })


})
