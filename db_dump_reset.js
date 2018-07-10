$(document).ready(function () {

    $("#db_copy_btn").click(function () {

        if (isValidIp($("#arm_ip_dump").val())) {

            $("#loading_gif_dump").css("visibility", "visible");
            console.log($("#version_type").val())

            var contents = querystring.stringify({
                arm_ip: $("#arm_ip_dump").val(),
                arm_port: $("#arm_port_dump").val(),
            });

            var options = {
                host: $("#arm_ip_dump").val(),
                port: $("#arm_port_dump").val(),
                path: '',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': contents.length
                }
            }

            post_to_arm(options);

        } else {
            bootbox.alert({
                title: "提示信息",
                message: "请输入有效的IP！",
                size: "small"
            })
        }

    })

})


var http = require('http');
var querystring = require('querystring');

function post_to_arm(options) {
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            console.log("data:", data);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        $("#loading_gif_dump").css("visibility", "hidden");
        bootbox.alert({
            title: "提示信息",
            message: "备份数据库出现异常：" + e.message,
            size: "small"
        })
    });

    req.end;
}
