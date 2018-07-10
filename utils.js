function formatDateTime(timeStamp) {
    /*时间戳转换为时间*/
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};


/**
 * [Queue]
 * @param {[Int]} size [队列大小]
 */
function Queue(size) {
    var list = [];

    //向队列中添加数据
    this.push = function (data) {
        if (list.length >= size) {
            list.shift()
        }
        list.push(data)
    }

    //从队列中取出数据
    this.pop = function () {
        return list.pop();
    }

    //返回队列的大小
    this.size = function () {
        return list.length;
    }

    //返回队列的内容
    this.quene = function () {
        return list;
    }
}

/*IP正则表达式*/
var ip_pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

function isValidIp(ip_value) {
    return ip_pattern.test(ip_value);
}
