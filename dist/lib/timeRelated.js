/**
 * Created by hjava on 16/4/27.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.formatMessageDate = formatMessageDate;
exports.formatDate = formatDate;
exports.getWeekDay = getWeekDay;
exports.getZeroTime = getZeroTime;
exports.compareDateTime = compareDateTime;
exports.getTimeByString = getTimeByString;
exports.getWeekDay2 = getWeekDay2;
exports.isToday = isToday;
var ONEDAY = 24 * 60 * 60 * 1000;

function formatMessageDate(time) {
    var messageTime = new Date(time);
    var now = new Date();
    var result = void 0;
    if (messageTime.getFullYear() === now.getFullYear()) {
        result = formatDate('MM-dd HH:mm', messageTime);
    } else {
        result = formatDate('yyyy-MM-dd HH:mm', messageTime);
    }
    return result;
}

/**
 * 返回固定格式的时间
 * @param fmt 时间格式 yyyy-MM-dd hh:mm:ss
 * @param time 时间戳
 * @returns {*}
 */
function formatDate(fmt, time) {

    var now = void 0;
    if (time) {
        now = new Date(time);
    } else {
        now = new Date();
    }
    var FMT = new Map([['M+', now.getMonth() + 1], //月份
    ['d+', now.getDate()], ['h+', now.getHours() % 12 === 0 ? 12 : now.getHours() % 12], //日
    ['H+', now.getHours()], //小时
    ['m+', now.getMinutes()], //小时
    ['s+', now.getSeconds()], //分//秒
    ['q+', Math.floor((now.getMonth() + 3) / 3)], //季度
    ['S', now.getMilliseconds()]]); //毫秒

    var week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468' : '') + week[now.getDay() + '']);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = FMT[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if (new RegExp('(' + key + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? value : ('00' + value).substr(('' + value).length));
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return fmt;
}

var weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getWeekDay(timestamp) {
    var needNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var date = new Date(timestamp);
    if (needNumber) {
        return date.getDay();
    } else {
        return weekArray[date.getDay()];
    }
}

function getZeroTime() {
    var timeStamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();

    return Math.floor(timeStamp / ONEDAY) * ONEDAY;
}

function compareDateTime(time1) {
    var time2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();

    var firstTime = new Date(time1);
    var secondTime = new Date(time2);

    return {
        year: firstTime.getFullYear() === secondTime.getFullYear(),
        month: firstTime.getMonth() === secondTime.getMonth(),
        day: firstTime.getDate() === secondTime.getDate(),
        hour: firstTime.getHours() === secondTime.getHours(),
        minute: firstTime.getMinutes() === secondTime.getMinutes(),
        second: firstTime.getSeconds() === secondTime.getSeconds(),
        milliSecond: firstTime.getMilliseconds() === secondTime.getMilliseconds()
    };
}

//转化YYYYMMDD格式的日期字符串，返回时间戳
function getTimeByString(timeStr) {
    if (typeof timeStr !== 'string' || timeStr.length !== 10) {
        return new Date().getTime();
    }
    var year = timeStr.substring(0, 4),
        month = timeStr.substring(5, 7),
        day = timeStr.substring(8, 10);
    return new Date(year, month - 1, day).getTime();
}

function getWeekDay2(timestamp) {
    var date = new Date(timestamp);
    var arr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return arr[date.getDay()];
}

function isToday(time) {
    var result = compareDateTime(time);
    return result.year && result.month && result.day;
}