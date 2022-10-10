"use strict"

function firstScreen() {
    document.getElementById("firstscreen").style.display = ""
    document.getElementById("secondscreen").style.display = "none"
}

function secondScreen() {
    document.getElementById("firstscreen").style.display = "none"
    document.getElementById("secondscreen").style.display = ""
}

function mainScreen() {
    document.getElementById("secondscreen").style.display = "none"
}

function hideTimetable() {
    document.getElementById("timetable").style.display = "none"
}

function showTimetable() {
    document.getElementById("timetable").style.display = ""
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var y = today.getFullYear();
    var d = today.getDate();
    var mo = today.getMonth() + 1;
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    y = y.toString().slice(-2)
    d = checkTime(d);
    mo = checkTime(mo);
    document.getElementById('clock').innerHTML =
        h + " " + m + " " + s;
    document.getElementById('date').innerHTML =
        y + " " + d + " " + mo;
    document.getElementById('day').innerHTML = ['SA SU MO', 'SU MO TU', 'MO TU WE', 'TU WE TH', 'WE TH FR', 'TH FR SA', 'FR SA SU'][today.getDay()]
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}
