"use strict"

var shownScreen = "all"

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
    readyForCommand = true
}

function closetyl() {
    document.getElementById("tyl").style.display = "none"
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
        y + " " + mo + " " + d;
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

function displayScreen(requestedScreen) {
    if (requestedScreen == "horizontal") {
        screenList.forEach(screen => {
            document.getElementById(screen).style.display = "flex"
        });
        document.getElementById("tracks").classList = "tracks horizontal"
        return
    }
    if (requestedScreen == "wrap") {
        screenList.forEach(screen => {
            document.getElementById(screen).style.display = "flex"
        });
        document.getElementById("tracks").classList = "tracks wrap"
        return
    }
    screenList.forEach(screen => {
        if (screen == requestedScreen) {
            document.getElementById(screen).style.display = "flex"
        } else {
            document.getElementById(screen).style.display = "none"
        } 
    });
    document.getElementById("tracks").classList = "tracks"
}

if (screenList.length > 1) {
    document.getElementById("screenswitch").innerHTML += `<button onclick="displayScreen('horizontal')">H</button><button onclick="displayScreen('wrap')">W</button>`
} else {
    document.getElementById("tracks").classList = "tracks"
}

screenList.forEach(screen => {
    document.getElementById("tracks").innerHTML += screens[screen]
    document.getElementById("screenswitch").innerHTML += `<svg id="${screen}btn" viewBox="0 0 1000 445" onclick="displayScreen('${screen}')">${document.getElementById(screen).innerHTML}</svg>`
});

checkRouteIntegrity()