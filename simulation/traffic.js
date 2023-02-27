"use strict"

var currentDate
var allBlocksOK
var terminal
var output

var trains = {}

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

function addTrainToMap(trainName, block, direction) {
    trains[trainName] = {"position": block, "stationWaitCount": 0, "direction": direction}
    blocks[block].status = "occupied"
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

            if (Array.from(prevBlock(position))[0] == "p") { 
                if (points[prevBlock(position)].flankprotection) {
                    points[points[prevBlock(position)].flankprotection].systemlock = false
                }
            }
            
            if (Array.from(prevBlock(trains[name].position))[0] == "b") {
                if (blocks[prevBlock(trains[name].position)].overlap) {
                    blocks[blocks[prevBlock(trains[name].position)].overlap].status = "unset"
                }
            }

            if (Array.from(trains[name].position)[0] != "p") {
                return
            }

        }
    }
    if (nextBlockForTrain(name) == "") {
        setStatus(position, "unset")
        delete trains[name]
        return
    }
    if (nextBlockForTrain(name) == "end") {
        if (trains[name].direction == "right") {
            trains[name].direction = "left"
        } else if (trains[name].direction == "left") {
            trains[name].direction = "right"
        }
        return
    }
    
    if (Array.from(trains[name].position)[0] == "p") {
        canContinue = true
    } else if (Array.from(trains[name].position)[0] == "b") {
        if (trains[name].direction == "left") {
            if (getLeftSignal(position) != "") {
                if (signals[getLeftSignal(position)].aspect == "green") {
                    canContinue = true
                }
            } else {
                canContinue = true
            }
        } else if (trains[name].direction == "right") {
            if (getRightSignal(position) != "") {
                if (signals[getRightSignal(position)].aspect == "green") {
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
        trains[name].position = nextBlockForTrain(name)

        if (Array.from(trains[name].position)[0] == "b") {
            blocks[trains[name].position].status = "occupied"
        } else {
            points[trains[name].position].status = "occupied"
        }

        if (Array.from(trains[name].position)[0] == "b") {
            if (blocks[trains[name].position].overlap) {
                blocks[blocks[trains[name].position].overlap].status = "occupied"
            }
        }

    }
}

function startSimulation() {
    terminal = document.getElementById("terminal")
    output = document.getElementById("output")

    terminal.addEventListener("keypress", ({ key }) => {
        if (deleteTerminalCommand) {
            terminal.value = ""
            deleteTerminalCommand = false
        }
        if (key == "Escape") {
            terminal.value = ""
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
            } else if (command[0] == "RDG") {
                rdg()
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
            } else if (command[0] == "TYL") {
                tyl()
            } else if (command[0] == "TND") {
                tnd(command)
            } else if (command[0] == "TNS") {
                tns(command)
            } else if (command[0] == "STG") {
                stg(command)
            } else if (command[0] == "STS") {
                sts(command)
            } else if (command[0] == "STH") {
                sth()
            } else {
                output.value = "COMMAND MISSING"
            }
            deleteTerminalCommand = true
        }
    })

    startTime()
    window.setTimeout(addTrainToMap("KR549", "b181", "right"), 1000)
    window.setTimeout(addTrainToMap("HL522", "b195", "right"), 1000)
    window.setTimeout(addTrainToMap("HY521", "b186", "left"), 1000)
    window.setTimeout(addTrainToMap("KR551", "b216", "right"), 1000)
    window.setTimeout(addTrainToMap("KY560", "b206", "left"), 1000)
    window.setTimeout(addTrainToMap("HY512", "b212", "left"), 1000)
    window.setTimeout(addTrainToMap("HL516", "b222", "right"), 1000)
    window.setTimeout(addTrainToMap("KR542", "b236", "right"), 1000)
    window.setTimeout(addTrainToMap("KY514", "b231", "left"), 1000)
    window.setTimeout(addTrainToMap("HL509", "b241", "right"), 1000)
    window.setTimeout(addTrainToMap("HY550", "b233", "left"), 1000)
    window.setTimeout(addTrainToMap("KY519", "b13", "left"), 1000)
    window.setTimeout(addTrainToMap("KR505", "b31", "right"), 1000)
    window.setTimeout(addTrainToMap("HY538", "b9", "left"), 1000)
    window.setTimeout(addTrainToMap("HL541", "b22", "right"), 1000)
    window.setTimeout(addTrainToMap("HY532", "b65", "left"), 1000)
    window.setTimeout(addTrainToMap("HL540", "b75", "right"), 1000)
    window.setTimeout(addTrainToMap("HY553", "b138", "left"), 1000)
    window.setTimeout(addTrainToMap("HL545", "b165", "right"), 1000)
    window.setTimeout(addTrainToMap("HY557", "b164", "left"), 1000)
    window.setTimeout(addTrainToMap("KY558", "b112", "left"), 1000)
    window.setTimeout(addTrainToMap("KR536", "b121", "right"), 1000)
    window.setTimeout(addTrainToMap("KY570", "b119", "left"), 1000)
}

window.setInterval(updateTraffic, 7000);

function updateTraffic() {
    for (const[key] of Object.entries(trains)) {
        updateTrain(key)
    }
}