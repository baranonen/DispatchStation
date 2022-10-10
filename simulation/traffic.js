"use strict"

var lastTrainNumber = 0
var canContinue
var scheduleDate
var currentDate

var trains = {}

var timetable = []

function addTrainToMap(name) {
    if (name[0] + name[1] == "HL") {
        trains[name] = {"position": "b29", "stationWaitCount": "0"}
        blocks["b29"].status = "occupied"
    }
    if (name[0] + name[1] == "HY") {
        trains[name] = {"position": "b10", "stationWaitCount": "0"}
        blocks["b10"].status = "occupied"
    }
    if (name[0] + name[1] == "KY") {
        trains[name] = {"position": "b49", "stationWaitCount": "0"}
        blocks["b49"].status = "occupied"
    }
    if (name[0] + name[1] == "KR") {
        trains[name] = {"position": "b29", "stationWaitCount": "0"}
        blocks["b29"].status = "occupied"
    }
}

function updateTrain(name) {
    canContinue = false
    if (trains[name].position == "out") {
        return
    }
    if (nextBlock(trains[name].position) == "") {
        if (Array.from(prevBlock(trains[name].position))[0] == "b") {
            if (blocks[prevBlock(trains[name].position)].status == "occupied") {
                blocks[prevBlock(trains[name].position)].status = "unset"
            } else {
                if (Array.from(trains[name].position)[0] == "b") {
                    blocks[trains[name].position].status = "unset"
                    delete trains[name]
                } else {
                    points[trains[name].position].status = "unset"
                    delete trains[name]
                }
            }
        } else {
            if (points[prevBlock(trains[name].position)].status == "occupied") {
                points[prevBlock(trains[name].position)].status = "unset"
            } else {
                if (Array.from(trains[name].position)[0] == "b") {
                    blocks[trains[name].position].status = "unset"
                    delete trains[name]
                } else {
                    points[trains[name].position].status = "unset"
                    delete trains[name]
                }
            }
        }
        return
    }

    if (prevBlock(trains[name].position) && prevBlock(trains[name]) != "") {
        if (Array.from(trains[name].position)[0] == "b") {
            if (Array.from(prevBlock(trains[name].position))[0] == "b") {
                if (blocks[prevBlock(trains[name].position)].status == "occupied") {
                    blocks[prevBlock(trains[name].position)].status = "unset"
                    return
                }
            } else {
                if (points[prevBlock(trains[name].position)].status == "occupied") {
                    points[prevBlock(trains[name].position)].status = "unset"
                    return
                }
            }
        }

        if (Array.from(prevBlock(trains[name].position))[0] == "b") {
            blocks[prevBlock(trains[name].position)].status = "unset"
        } else {
            points[prevBlock(trains[name].position)].status = "unset"
        }

        if (prevBlock(trains[name].position) == "b55" || prevBlock(trains[name].position) == "b54") {
            blocks["b1001"].status = "unset"
        }
        if (prevBlock(trains[name].position) == "b42" || prevBlock(trains[name].position) == "b43") {
            blocks["b1002"].status = "unset"
        }
        
    }

    if (Array.from(trains[name].position)[0] == "b") {
        if (blocks[trains[name].position].isStation) {
            if (trains[name].stationWaitCount != 5) {
                trains[name].stationWaitCount += 1
                return
            }
        }
    }

    if (Array.from(nextBlock(trains[name].position))[0] == "b") {
        if (blocks[nextBlock(trains[name].position)].status == "set") {
            canContinue = true
        }
    } else {
        if (points[nextBlock(trains[name].position)].status == "set") {
            canContinue = true
        }
    }

    if (canContinue) {
        trains[name].stationWaitCount = 0
        trains[name].position = nextBlock(trains[name].position)
        if (Array.from(trains[name].position)[0] == "b") {
            blocks[trains[name].position].status = "occupied"
        } else {
            points[trains[name].position].status = "occupied"
        }
        if (trains[name].position == "b55" || trains[name].position == "b54") {
            blocks["b1001"].status = "occupied"
        }
        if (trains[name].position == "b42" || trains[name].position == "b43") {
            blocks["b1002"].status = "occupied"
        }
    } else {
        if (blocks[prevBlock(trains[name].position)].status == "occupied") {
            blocks[prevBlock(trains[name].position)].status = "unset"
        }
    }
}

function addToSchedule(ms, from, dest) {
    currentDate = new Date()
    scheduleDate = new Date(currentDate.getTime() + ms)
    var train = {"from": from, "dest": dest, "time": scheduleDate}
    train.from = from
    train.dest = dest
    train.time = scheduleDate
    timetable.push(train)
    timetable.sort( function ( a, b ) { return b.time - a.time; } );
    var html = "<tr><th>Entry Time</th><th>From</th><th>To</th></tr>"
    timetable.forEach(train => {
        html += "<tr><td>" + train.time.toLocaleTimeString("tr-TR").slice(0, -3) + "</td><td>" + train.from + "</td><td>" + train.dest + "</td></tr>"
    });
    html += "</tr>"
    document.getElementById("timetable").contentWindow.document.getElementById("table").innerHTML = html
}

function addHLTrain() {
    addTrainToMap("HL" + (Math.floor(Math.random() * (999 - 100 + 1)) + 100))
    window.setTimeout(addHLTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Yenikapı", "H.Limanı (TDR)")
}

function addHYTrain() {
    addTrainToMap("HY" + (Math.floor(Math.random() * (999 - 100 + 1)) + 100))
    window.setTimeout(addHYTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "H.Limanı", "Yenikapı (OTO)")
}

function addKYTrain() {
    addTrainToMap("KY" + (Math.floor(Math.random() * (999 - 100 + 1)) + 100))
    window.setTimeout(addKYTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Kirazlı", "Yenikapı (OTO)")
}

function addKRTrain() {
    addTrainToMap("KR" + (Math.floor(Math.random() * (999 - 100 + 1)) + 100))
    window.setTimeout(addKRTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Yenikapı", "Kirazlı (ESN)")
}

addHYTrain()
addToSchedule(0, "H.Limanı", "Yenikapı (OTO)")

window.setTimeout(addHLTrain, 1000 * 60)
addToSchedule(1000 * 60, "Yenikapı", "H.Limanı (TDR)")

window.setTimeout(addKYTrain, 1000 * 60 * 3)
addToSchedule(1000 * 60 * 3, "Kirazlı", "Yenikapı (OTO)")

window.setTimeout(addKRTrain, 1000 * 60 * 4)
addToSchedule(1000 * 60 * 4, "Yenikapı", "Kirazlı (ESN)")


window.setInterval(updateTraffic, 5000);

function updateTraffic() {
    for (const[key] of Object.entries(trains)) {
        updateTrain(key)
    }
}