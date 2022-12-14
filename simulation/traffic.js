"use strict"

var scheduleDate
var currentDate
var allBlocksOK
var terminal
var output

var trains = {}

var timetable = []

function checkAllFree(controlledBlocks) {
    allBlocksOK = true
    controlledBlocks.forEach(block => {
        if (blockStatus(block) != "set") {
            allBlocksOK = false
        }
    });
    if (allBlocksOK) {
        return true
    } else {
        return false
    }
}

function addTrainToMap(name) {
    if (name[0] + name[1] == "HL") {
        if (checkAllFree(["b29", "p417", "b30", "b31"])) {
            trains[name] = {"position": "b29", "stationWaitCount": "0"}
            blocks["b29"].status = "occupied"
        }
    } else if (name[0] + name[1] == "HY") {
        if (checkAllFree(["b10", "p509", "b57", "p508", "b56", "b9"])) {
            trains[name] = {"position": "b10", "stationWaitCount": "0"}
            blocks["b10"].status = "occupied"
        }
    } else if (name[0] + name[1] == "KY") {
        if (checkAllFree(["b49", "b48"])) {
            trains[name] = {"position": "b49", "stationWaitCount": "0"}
            blocks["b49"].status = "occupied"
        }
    } else if (name[0] + name[1] == "KR") {
        if (checkAllFree(["b29", "p417", "b30", "b31"])) {
            trains[name] = {"position": "b29", "stationWaitCount": "0"}
            blocks["b29"].status = "occupied"
        }
    }
}

function isBlockFree(block) {
    var isFree = true
    Object.entries(trains).forEach(([k, v]) => {
        if (v.position == block) {
            isFree = false
        }
    })
    return isFree
}

function setStatus(block, desiredStatus) {
    if (Array.from(block)[0] == "b") {
        blocks[block].status = desiredStatus
    } else if (Array.from(block)[0] == "p") {
        points[block].status = desiredStatus
    }
}

function updateTrain(name) {
    var canContinue = false
    var position = trains[name].position
    if (blockStatus(prevBlock(position)) == "occupied") {
        if (isBlockFree(prevBlock(position))) {
            setStatus(prevBlock(position), "unset")

            if (prevBlock(trains[name].position) == "b55" || prevBlock(trains[name].position) == "b54") {
                blocks["b1001"].status = "unset"
            }

            if (prevBlock(trains[name].position) == "b42" || prevBlock(trains[name].position) == "b43") {
                blocks["b1002"].status = "unset"
            }

            if (prevBlock(trains[name].position) == "b25" || prevBlock(trains[name].position) == "b33") {
                blocks["b1003"].status = "unset"
            }

            if (Array.from(trains[name].position)[0] != "p") {
                return
            }

        }
    }
    if (nextBlock(position) == "") {
        setStatus(position, "unset")
        delete trains[name]
        return
    }
    
    if (Array.from(trains[name].position)[0] == "p") {
        canContinue = true
    } else if (Array.from(trains[name].position)[0] == "b") {
        if (blockDirection(position) == "left") {
            if (blocks[position].leftsignal != "") {
                if (signals[blocks[position].leftsignal].status == "green") {
                    canContinue = true
                }
            } else {
                canContinue = true
            }
        } else if (blockDirection(position) == "right") {
            if (blocks[position].rightsignal != "") {
                if (signals[blocks[position].rightsignal].status == "green") {
                    canContinue = true
                }
            } else {
                canContinue = true
            }
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
        
        if (trains[name].position == "b25" || trains[name].position == "b33") {
            blocks["b1003"].status = "occupied"
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

function startSimulation() {
    terminal = document.getElementById("terminal")
    output = document.getElementById("output")

    terminal.addEventListener("keypress", ({ key }) => {
        if (deleteTerminalCommand) {
            terminal.value = ""
            deleteTerminalCommand = false
        }
        if (key === "Enter") {
            command = terminal.value.toLocaleUpperCase('en-US').split(" ")
            if (command[0] == "YTT") {
                ytt(command)
            } else if (command[0] == "YTI") {
                yti(command)
            } else if (command[0] == "CTI") {
                cti(command)
            } else if (command[0] == "TYI") {
                tyi(command)
            } else if (command[0] == "MSA") {
                msa(command)
            } else if (command[0] == "MSO") {
                mso(command)
            } else if (command[0] == "TSK") {
                tsk()
            } else if (command[0] == "MBL") {
                mbl(command)
            } else if (command[0] == "MSE") {
                mse(command)
            } else if (command[0] == "MLK") {
                mlk(command)
            } else if (command[0] == "MMK") {
                mmk(command)
            } else if (command[0] == "MNG") {
                mng()
            } else if (command[0] == "SSG") {
                ssg()
            } else if (command[0] == "SMG") {
                smg()
            } else if (command[0] == "OBL") {
                obl(command)
            } else if (command[0] == "OSE") {
                ose(command)
            } else if (command[0] == "BSK") {
                bsk(command)
            } else if (command[0] == "KSI") {
                ksi(command)
            } else {
                output.value = "COMMAND MISSING"
            }
            deleteTerminalCommand = true
        }
    })

    startTime()
    addHYTrain()
    addToSchedule(0, "H.Liman??", "Yenikap?? (OTG)")
    
    window.setTimeout(addHLTrain, 1000 * 60)
    addToSchedule(1000 * 60, "Yenikap??", "H.Liman?? (TDR)")
    
    window.setTimeout(addKYTrain, 1000 * 60 * 3)
    addToSchedule(1000 * 60 * 3, "Kirazl??", "Yenikap?? (OTG)")
    
    window.setTimeout(addKRTrain, 1000 * 60 * 4)
    addToSchedule(1000 * 60 * 4, "Yenikap??", "Kirazl?? (ESN)")
}

function addHLTrain() {
    addTrainToMap("HL" + (Math.floor(Math.random() * (599 - 501 + 1)) + 501))
    window.setTimeout(addHLTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Yenikap??", "H.Liman?? (TDR)")
}

function addHYTrain() {
    addTrainToMap("HY" + (Math.floor(Math.random() * (599 - 501 + 1)) + 501))
    window.setTimeout(addHYTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "H.Liman??", "Yenikap?? (OTG)")
}

function addKYTrain() {
    addTrainToMap("KY" + (Math.floor(Math.random() * (599 - 501 + 1)) + 501))
    window.setTimeout(addKYTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Kirazl??", "Yenikap?? (OTG)")
}

function addKRTrain() {
    addTrainToMap("KR" + (Math.floor(Math.random() * (599 - 501 + 1)) + 501))
    window.setTimeout(addKRTrain, 1000 * 60 * 6)
    addToSchedule(1000 * 60 * 6, "Yenikap??", "Kirazl?? (ESN)")
}

window.setInterval(updateTraffic, 5000);

function updateTraffic() {
    for (const[key] of Object.entries(trains)) {
        updateTrain(key)
    }
}