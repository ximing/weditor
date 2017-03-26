/**
 * Created by hjava on 16/4/27.
 */

'use strict';
const ONEDAY = 24 * 60 * 60 * 1000;

export function formatMessageDate(time) {
    let messageTime = new Date(time);
    let now = new Date();
    let result;
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
export function formatDate(fmt, time) {

    let now;
    if (time) {
        now = new Date(time);
    } else {
        now = new Date();
    }
    let FMT = new Map([['M+', now.getMonth() + 1],//月份
        ['d+', now.getDate()],
        ['h+', now.getHours() % 12 === 0 ? 12 : now.getHours() % 12],//日
        ['H+', now.getHours()],//小时
        ['m+', now.getMinutes()], //小时
        ['s+', now.getSeconds()],//分//秒
        ['q+', Math.floor((now.getMonth() + 3) / 3)],//季度
        ['S', now.getMilliseconds()]]); //毫秒

    let week = {
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
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[now.getDay() + '']);
    }
    for(let [key, value] of FMT) {
        if (new RegExp(`(${key})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (value) : (('00' + value).substr(('' + value).length)));
        }
    }
    return fmt;
}

const weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getWeekDay(timestamp, needNumber = false) {
    let date = new Date(timestamp);
    if (needNumber) {
        return date.getDay();
    } else {
        return weekArray[date.getDay()];
    }
}

export function getZeroTime(timeStamp = Date.now()) {
    return Math.floor(timeStamp / ONEDAY) * ONEDAY;
}

export function compareDateTime(time1, time2 = Date.now()) {
    let firstTime = new Date(time1);
    let secondTime = new Date(time2);

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
export function getTimeByString(timeStr) {
    if(typeof timeStr !== 'string' || timeStr.length !== 10) {
        return new Date().getTime();
    }
    let year = timeStr.substring(0,4),
        month = timeStr.substring(5,7),
        day = timeStr.substring(8,10);
    return new Date(year,month - 1,day).getTime();
}

export function getWeekDay2(timestamp) {
    let date = new Date(timestamp);
    let arr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return arr[date.getDay()];
}

export function isToday(time) {
    let result = compareDateTime(time);
    return result.year && result.month && result.day;
}
