$(document).ready(function () {
    var mysql = require('mysql');
    $("#db_ok_btn_njgl").click(function () {

        if (isValidIp($("#db_ip_njgl").val())) {
            if ($("#abnormal_num_njgl").val()) {

                $("#loading_gif_abnormal").css("visibility", "visible");
                var connection = mysql.createConnection({
                    host: $("#db_ip_njgl").val(),
                    port: "3306",
                    user: 'root',
                    password: 'iraindb10241GB',
                    database: 'irain_park'
                });

                connection.connect();

                connection.query("update project_conf set value = " + "'" + $("#abnormal_num_njgl").val() + "'" +
                    " where name = 'abnormal_inout_display_num'",
                    function (error, rows, fields) {
                        if (error) {
                            bootbox.alert({
                                title: "警告！",
                                message: "数据库操作出现异常：" + error,
                                size: 'small'
                            });
                            $("#loading_gif_abnormal").css("visibility", "hidden");
                            throw error;
                        }
                        console.log("update project_conf set value = " + "'" + $("#abnormal_num_njgl").val() + "'" +
                            " where name = abnormal_inout_display_num");
                        console.log('The solution is: ', rows);

                        $("#loading_gif_abnormal").css("visibility", "hidden");
                        bootbox.alert({
                            title: "提示信息",
                            message: "修改成功！",
                            size: 'small'
                        })
                    });
                connection.end();

            } else {
                bootbox.alert({
                    title: "提示信息",
                    message: "异常进出车数量不可为空！",
                    size: 'small'
                })

            }
        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入正确的IP地址！",
                size: 'small'
            })
        }

    })
});

