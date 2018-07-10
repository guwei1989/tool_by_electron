$(document).ready(function () {
  var cpu_usage_time = new Queue(5);
  var cpu_usage = new Queue(5);
  var cpuChart = echarts.init(document.getElementById('cpu_status_chart'));
  var cpu_option = {
    title: {
      text: 'CPU状态'
    },
    tooltip: {},
    legend: {
      data: ['CPU占用率']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      data: cpu_usage_time.quene()
    },
    yAxis: {
      name: '占用比(%)',
      type: 'value',
    },
    series: [{
      name: 'CPU占用率',
      type: 'line',
      color: '#FF0000',
      data: cpu_usage.quene()
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  cpuChart.setOption(cpu_option);

  var ram_usage_time = new Queue(5)
  var ram_usage = new Queue(5)
  var ramChart = echarts.init(document.getElementById('ram_status_chart'));
  var ram_option = {
    title: {
      text: '内存状态'
    },
    tooltip: {},
    legend: {
      data: ['内存占用率']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      data: ram_usage_time.quene()
    },
    yAxis: {
      name: '占用比(%)',
      type: 'value',
    },
    series: [{
      name: '内存占用率',
      type: 'line',
      color: '#87CEFA',
      data: ram_usage.quene()
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  ramChart.setOption(ram_option);

  var rom_usage_time = new Queue(5)
  var rom_usage = new Queue(5)
  var romChart = echarts.init(document.getElementById('rom_status_chart'));
  var rom_option = {
    title: {
      text: '硬盘状态'
    },
    tooltip: {},
    legend: {
      data: ['硬盘占用率']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      data: rom_usage_time.quene()
    },
    yAxis: {
      name: '占用比(%)',
      type: 'value',
    },
    series: [{
      name: '硬盘占用率',
      type: 'line',
      color: '#9932CC',
      data: rom_usage.quene()
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  romChart.setOption(rom_option);

  var network_time = new Queue(5)
  var send_data = new Queue(5)
  var receive_data = new Queue(5)
  var networkChart = echarts.init(document.getElementById('network_status_chart'));
  var network_option = {
    title: {
      text: '网络状态'
    },
    tooltip: {},
    legend: {
      data: ['发送', '接收']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      data: network_time.quene()
    },
    yAxis: {
      name: '流量(KB)',
      type: 'value',
    },
    series: [{
      name: '发送',
      type: 'line',
      color: '#D2691E',
      data: send_data.quene()
    },
    {
      name: '接收',
      type: 'line',
      color: '#00FF00',
      data: receive_data.quene()
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  networkChart.setOption(network_option);


  $("#get_sys_status").click(function () {

    if (isValidIp($("#arm_address").val())) {
      // $("#loadingModal").modal('show');
      $('#loadingModal').modal({ backdrop: 'static', keyboard: false });

      var Client = require('ssh2').Client;
      var conn = new Client();

      conn.on('ready', function () {
        console.log('Client :: ready');
        conn.shell(function (err, stream) {
          if (err) {
            bootbox.alert({
              title: "警告",
              message: "连接ARM出现异常：" + err
            })
            $("#loadingModal").modal('hide');
            throw err;
          }
          stream.on('close', function () {
            // console.log('Stream :: close');
            conn.end();
          }).on('data', function (data) {
            // console.log('STDOUT: ' + data);
          }).stderr.on('data', function (data) {
            // console.log('STDERR: ' + data);
          });
          stream.end('curl -sSL http://121.199.49.228:8989/v3/itools/static/install.sh | sh -\n');
        });
      }).connect({
        host: $("#arm_address").val(),
        port: $("#arm_port").val(),
        username: 'root',
        password: 'iraindev10241GB',
      });

      var cpu_param = {
        hostname: $("#arm_address").val(),
        port: 9494,
        path: '/v3/cpu_usage',
        method: 'GET'
      };

      var ram_param = {
        hostname: $("#arm_address").val(),
        port: 9494,
        path: '/v3/mem_usage',
        method: 'GET'
      };

      var rom_param = {
        hostname: $("#arm_address").val(),
        port: 9494,
        path: '/v3/disk_usage',
        method: 'GET'
      };

      var network_param = {
        hostname: $("#arm_address").val(),
        port: 9494,
        path: '/v3/net_usage',
        method: 'GET'
      };

      get_data(cpu_param, cpu_usage, cpu_usage_time, cpuChart, cpu_option);
      get_data(ram_param, ram_usage, ram_usage_time, ramChart, ram_option);
      get_data(rom_param, rom_usage, rom_usage_time, romChart, rom_option);
      get_net_data(network_param, send_data, receive_data, network_time, networkChart, network_option)

    } else {
      bootbox.alert({
        title: "提示信息",
        message: "请输入有效的IP！"
      })
    }

  })

  $("#disconnect_arm").click(function () {

    console.log(all_setinterval_id);
    if (all_setinterval_id.length > 0) {

      bootbox.confirm({
        buttons: {
          confirm: {
            label: '确认',
            className: 'btn-default'
          },
          cancel: {
            label: '取消',
            className: 'btn-default'
          }
        },
        title: '提示信息',
        message: '确定要断开连接，停止系统监控？',
        callback: function (result) {
          if (result) {
            for (var i = 0; i < all_setinterval_id.length; i++) {

              clearInterval(all_setinterval_id[i]);
            }
            all_setinterval_id.length = 0;
          }
        }
      });

    } else {
      bootbox.alert({
        title: "提示信息",
        message: "没有可断开的系统监控连接！"
      })
    }

  })

  $("#collapseArmParams").on("shown.bs.collapse", function () {
    $("#hide_arm_params").removeClass("glyphicon-eye-open")
    $("#hide_arm_params").addClass("glyphicon-eye-close")
  })

  $('#collapseArmParams').on('hidden.bs.collapse', function () {
    $("#hide_arm_params").removeClass("glyphicon-eye-close")
    $("#hide_arm_params").addClass("glyphicon-eye-open")
  })

})

var all_setinterval_id = [];
/*向后台每隔2S发一次http请求*/
var http = require('http');
// var qs = require('querystring');

function get_data(options, usage, time, chart_name, chart_option) {
  var status_id = setInterval(() => {
    var req = http.request(options, function (res) {
      // console.log('STATUS: ' + res.statusCode);
      // console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        // console.log('BODY: ' + chunk);
        data = JSON.parse(chunk);
        usage.push(data.usage * 100);
        time.push(formatDateTime(data.timestamp).slice(11));
        chart_name.setOption(chart_option);
        $("#loadingModal").modal('hide');
      });
    });

    req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
      // $("#loadingModal").modal('hide');
    });

    req.end();

  }, 2000)
  all_setinterval_id.push(status_id)
}

function get_net_data(options, send_data, receive_data, time, chart_name, chart_option) {
  var status_id = setInterval(() => {
    var req = http.request(options, function (res) {
      // console.log('STATUS: ' + res.statusCode);
      // console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        // console.log('BODY: ' + chunk);
        data = JSON.parse(chunk);
        send_data.push(data.outbound / 1024);
        receive_data.push(data.inbound / 1024);
        time.push(formatDateTime(data.timestamp).slice(11));
        chart_name.setOption(chart_option);
        $("#loadingModal").modal('hide');
      });
    });

    req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
      // $("#loadingModal").modal('hide');
    });

    req.end();

  }, 2000)
  all_setinterval_id.push(status_id)
}

