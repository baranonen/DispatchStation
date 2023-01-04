"use strict"

var requestedRoute
var isPossible
var signalShouldBe
var checkedBlock
var endBlocks
var terminal
var command
var currentlyDisplaying = "signalnumbers"
var signalReady
var markerBlinkState = true
var lastOpenedRoute = {}
var deleteTerminalCommand = false
var routeWaitingList = []
var readyForCommand = false

function nextBlock(block) {
    if (Array.from(block)[0] == "b") {
        if (blocks[block].direction == "left") {
            return blocks[block].left
        } else {
            return blocks[block].right
        }
    } else if (Array.from(block)[0] == "p") {
        if (points[block].direction == "right") {
            if (points[block].position == "normal") {
                return points[block].normalright
            } else if (points[block].position == "diverging") {
                return points[block].divergingright
            }
        } else if (points[block].direction == "left") {
            if (points[block].position == "normal") {
                return points[block].normalleft
            } else if (points[block].position == "diverging") {
                return points[block].divergingleft
            }
        } else {
            return ""
        }
    }
}

function leftBlock(block) {
    if (Array.from(block)[0] == "b") {
        return blocks[block].left
    } else if (Array.from(block)[0] == "p") {
        if (points[block].position == "normal") {
            return points[block].normalleft
        } else if (points[block].position == "diverging") {
            return points[block].divergingleft
        }
    }
}

function rightBlock(block) {
    if (Array.from(block)[0] == "b") {
        return blocks[block].right
    } else if (Array.from(block)[0] == "p") {
        if (points[block].position == "normal") {
            return points[block].normalright
        } else if (points[block].position == "diverging") {
            return points[block].divergingright
        }
    }
}

function prevBlock(block) {
    if (Array.from(block)[0] == "b") {
        if (blocks[block].direction == "left") {
            return blocks[block].right
        } else if (blocks[block].direction == "right") {
            return blocks[block].left
        } else {
            return ""
        }
    } else if (Array.from(block)[0] == "p") {
        if (points[block].direction == "right") {
            if (points[block].position == "normal") {
                return points[block].normalleft
            } else if (points[block].position == "diverging") {
                return points[block].divergingleft
            }
        } else if (points[block].direction == "left") {
            if (points[block].position == "normal") {
                return points[block].normalright
            } else if (points[block].position == "diverging") {
                return points[block].divergingright
            }
        } else {
            return ""
        }
    }
}

function prevSetBlock(block) {
    if (blockStatus(block) != "set") {
        return ""
    } else {
        return prevBlock(block)
    }
}

function setRoute(requestedRouteText) {
    requestedRoute.blocks.forEach(block => {
        if (Array.from(block)[0] == "b") {
            blocks[block].status = "set"
            blocks[block].direction = requestedRoute.direction
        } else if (Array.from(block)[0] == "p") {
            if (Array.from(block)[block.length - 1] == "d") {
                points[block.slice(0, -1)].position = "diverging"
            } else {
                points[block.slice(0, -1)].position = "normal"
            }
            points[block.slice(0, -1)].status = "set"
            points[block.slice(0, -1)].direction = requestedRoute.direction
        }
    });
    routes[requestedRouteText[1] + "-" + requestedRouteText[2]].status = true
    if (signals["s" + requestedRouteText[1]] && signals["s" + requestedRouteText[2]]) {
        signals["s" + requestedRouteText[1]].isReserved = "no"
        signals["s" + requestedRouteText[2]].isReserved = "no"
    }
    routeWaitingList = routeWaitingList.filter(v => v !== requestedRouteText)
    lastOpenedRoute.route = requestedRouteText
    lastOpenedRoute.seconds = 0
}

window.setInterval(updateSecondTime, 1000);

function updateSecondTime() {
    lastOpenedRoute.seconds += 1
}

function addRouteToWaitingList(requestedRouteText) {
    if (signals["s" + requestedRouteText[1]] && signals["s" + requestedRouteText[2]]) {
        if (signals["s" + requestedRouteText[1]].isReserved == "no" && signals["s" + requestedRouteText[2]].isReserved == "no") {
            routeWaitingList.push(requestedRouteText)
            signals["s" + requestedRouteText[1]].isReserved = "start"
            signals["s" + requestedRouteText[2]].isReserved = "end"
        }
    }
}

function checkWaitingList() {
    routeWaitingList.forEach(requestedRouteText => {
        if (checkRoutePossible(requestedRouteText)) {
            setRoute(requestedRouteText)
        }
    });
}

function checkRoutePossible(requestedRouteText) {
    isPossible = true
    requestedRoute = routes[requestedRouteText[1] + "-" + requestedRouteText[2]]
    requestedRoute.blocks.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].status != "unset") {
                isPossible = false
            }
        } else if (Array.from(block)[0] == "p") {
            if (points[block.slice(0, -1)].status != "unset") {
                isPossible = false
            }
        }
    });
    return isPossible
}

function ytt(requestedRouteText) {
    if (signals["s" + requestedRouteText[1]] && signals["s" + requestedRouteText[2]]) {
        if (signals["s" + requestedRouteText[1]].isReserved == "no" && signals["s" + requestedRouteText[2]].isReserved == "no") {
            if (checkRoutePossible(requestedRouteText)) {
                setRoute(requestedRouteText)
            } else {
                addRouteToWaitingList(requestedRouteText)
            }
        }
    } else {
        if (checkRoutePossible(requestedRouteText)) {
            setRoute(requestedRouteText)
        } else {
            addRouteToWaitingList(requestedRouteText)
        }
    }
}

function yti(requestedRouteText) {
    routeWaitingList = routeWaitingList.filter(v => v !== requestedRouteText)
    signals["s" + requestedRouteText[1]].isReserved = "no"
    signals["s" + requestedRouteText[2]].isReserved = "no"
}

function cti(requestedRouteText) {
    isPossible = true
    requestedRoute = routes[requestedRouteText[1] + "-" + requestedRouteText[2]]
    requestedRoute.blocks.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].status != "occupied") {
                blocks[block].status = "cancelled"
                setTimeout(function () { releaseBlock(block) }, 60000)
            }
        } else if (Array.from(block)[0] == "p") {
            if (points[block.slice(0, -1)].status != "occupied") {
                points[block.slice(0, -1)].status = "cancelled"
                setTimeout(function () { releaseBlock(block.slice(0, -1)) }, 60000)
            }
        }
    });
    routes[requestedRouteText[1] + "-" + requestedRouteText[2]].status = false
}

function tyi(requestedRouteText) {
    if (requestedRouteText.length == 2) {
        cti(["cti", requestedRouteText[1], findNextSignal("s" + requestedRouteText[1]).substr(1)])
    } else {
        if (lastOpenedRoute.seconds < 15) {
            cti(["cti", lastOpenedRoute.route[1], findNextSignal("s" + lastOpenedRoute.route[1]).substr(1)])
        }
    }
}

function drawPoints() {
    pointList.forEach(point => {
        if (points[point].status == "local") {
            document.getElementById("map").getElementById(point + "n").style.stroke = "#0000FF"
            document.getElementById("map").getElementById(point + "d").style.stroke = "#0000FF"
        } else {
            if (points[point].position == "normal") {
                document.getElementById("map").getElementById(point + "d").style.stroke = "#ffffff00"
                if (points[point].status == "set") {
                    document.getElementById("map").getElementById(point + "n").style.stroke = "#03FF00"
                } else if (points[point].status == "occupied") {
                    document.getElementById("map").getElementById(point + "n").style.stroke = "#FF0000"
                } else if (points[point].status == "unset") {
                    document.getElementById("map").getElementById(point + "n").style.stroke = "#C0C0C0"
                } else if (points[point].status == "cancelled") {
                    document.getElementById("map").getElementById(point + "n").style.stroke = "#FF00FF"
                }
            } else {
                document.getElementById("map").getElementById(point + "n").style.stroke = "#ffffff00"
                if (points[point].status == "set") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#03FF00"
                } else if (points[point].status == "occupied") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#FF0000"
                } else if (points[point].status == "unset") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#C0C0C0"
                } else if (points[point].status == "cancelled") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#FF00FF"
                }
            }
        }
    });
}

function drawBlocks() {
    blockList.forEach(block => {
        if (blocks[block].status == "occupied") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById("map").getElementById(block).style.fill = "#FF0000"
            } else {
                document.getElementById("map").getElementById(block).style.stroke = "#FF0000"
            }
        } else if (blocks[block].status == "cancelled") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById("map").getElementById(block).style.fill = "#FF00FF"
            } else {
                document.getElementById("map").getElementById(block).style.stroke = "#FF00FF"
            }
        } else if (blocks[block].status == "set") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById("map").getElementById(block).style.fill = "#03FF00"
            } else {
                document.getElementById("map").getElementById(block).style.stroke = "#03FF00"
            }
        } else if (blocks[block].status == "unset") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById("map").getElementById(block).style.fill = "#C0C0C0"
            } else {
                document.getElementById("map").getElementById(block).style.stroke = "#C0C0C0"
            }
        }
    });
}

function blockStatus(block) {
    if (block == "") {
        return ""
    }
    if (Array.from(block)[0] == "b") {
        return blocks[block].status
    } else if (Array.from(block)[0] == "p") {
        return points[block].status
    } else {
        return ""
    }
}

function blockDirection(block) {
    if (Array.from(block)[0] == "b") {
        return blocks[block].direction
    } else {
        return points[block].direction
    }
}

function cancelBlock(block) {
    if (Array.from(block)[0] == "b") {
        blocks["b" + block].status = "cancelled"
        setTimeout(function () { releaseBlock("b" + block) }, 60000)
    } else {
        points["p" + block].status = "cancelled"
        setTimeout(function () { releaseBlock("p" + block) }, 60000)
    }
}

function releaseBlock(block) {
    if (blockStatus(block) == "cancelled") {
        if (Array.from(block)[0] == "b") {
            blocks[block].status = "unset"
        } else {
            points[block].status = "unset"
        }
    }
}

function updateSignals() {
    signalList.forEach(signal => {
        if (signals[signal].control == "closed") {
            signals[signal].status = "red"
        } else {
            if (blockStatus(signals[signal].prevblock) == "unset") {
                if (blockStatus(signals[signal].nextblock) == "unset" || signals[signal].direction != blocks[signals[signal].nextblock].direction) {
                    signals[signal].status = ""
                    return
                }
            } else if (signals[signal].direction != blocks[signals[signal].prevblock].direction) {
                signals[signal].status = ""
                return
            }
            signalShouldBe = "green"
            checkedBlock = signals[signal].nextblock
            while (signalShouldBe == "green") {
                if (blockStatus(checkedBlock) == "cancelled") {
                    signalShouldBe = "purple"
                    break
                }
                if (signals[signal].possibleends.includes(checkedBlock)) {
                    break
                }
                if (signals[signal].direction == "right") {
                    checkedBlock = rightBlock(checkedBlock)
                } else {
                    checkedBlock = leftBlock(checkedBlock)
                }
                if (!checkedBlock) {
                    break
                }
            }
            if (signalShouldBe == "purple") {
                signals[signal].status = signalShouldBe
                return
            } else {
                signalShouldBe = "green"
                checkedBlock = signals[signal].nextblock
            }
            while (signalShouldBe == "green") {
                if (blockStatus(checkedBlock) != "set") {
                    signalShouldBe = "red"
                    break
                }
                if (blockDirection(checkedBlock) != signals[signal].direction) {
                    signalShouldBe = "red"
                    break
                }
                if (signals[signal].possibleends.includes(checkedBlock)) {
                    break
                }
                checkedBlock = nextBlock(checkedBlock)
            }
            signals[signal].status = signalShouldBe
        }
    })
}

function drawSignals() {
    signalList.forEach(signal => {
        if (signals[signal].control == "closed") {
            document.getElementById("map").getElementById(signal).style.fill = "#FF0000"
            document.getElementById("map").getElementById(signal).style.stroke = "#FF0000"
        } else {
            document.getElementById("map").getElementById(signal).style.fill = "#FF000000"
            if (signals[signal].status == "green") {
                document.getElementById("map").getElementById(signal).style.stroke = "#03FF00"
            } else if (signals[signal].status == "red") {
                document.getElementById("map").getElementById(signal).style.stroke = "#FF0000"
            } else if (signals[signal].status == "purple") {
                document.getElementById("map").getElementById(signal).style.stroke = "#FF00FF"
            } else if (signals[signal].status == "") {
                document.getElementById("map").getElementById(signal).style.stroke = "#C0C0C0"
            }
        }
    });
}

function drawSignalMarkers() {
    signalList.forEach(signal => {
        if (signals[signal].isReserved == "no") {
            document.getElementById("map").getElementById(signal + "m").style.fill = "#000000"
        } else if (signals[signal].isReserved == "start") {
            document.getElementById("map").getElementById(signal + "m").style.fill = "#03FF00"
        } else if (signals[signal].isReserved == "end") {
            document.getElementById("map").getElementById(signal + "m").style.fill = "#FF0000"
        }
    });
}

function blinkSignalMarkers() {
    command = terminal.value.toLocaleUpperCase('en-US').split(" ")
    signalList.forEach(signal => {
        if (markerBlinkState) {
            document.getElementById("map").getElementById(signal + "m").style.opacity = "0"
            if (command.includes(signal.substr(1)) && !deleteTerminalCommand) {
                document.getElementById("map").getElementById(signal).style.opacity = "0"
            }
        } else {
            document.getElementById("map").getElementById(signal + "m").style.opacity = "1"
            document.getElementById("map").getElementById(signal).style.opacity = "1"
        }
    });
    markerBlinkState = !markerBlinkState
}

window.setInterval(blinkSignalMarkers, 350);

function msa(command) {
    if (points["p" + command[1]].status == "unset") {
        points["p" + command[1]].position = "diverging"
    }
}

function mso(command) {
    if (points["p" + command[1]].status == "unset") {
        points["p" + command[1]].position = "normal"
    }
}

function mbl(command) {
    if (points["p" + command[1]].status == "unset") {
        points["p" + command[1]].status = "set"
    }
}

function mse(command) {
    if (points["p" + command[1]].status == "set") {
        cancelBlock(command[1])
    }
}

function mlk(command) {
    if (points["p" + command[1]].status == "unset") {
        points["p" + command[1]].status = "local"
    }
}

function mmk(command) {
    if (points["p" + command[1]].status == "local") {
        points["p" + command[1]].status = "unset"
    }
}

function updateCurrentlyDisplaying() {
    if (currentlyDisplaying == "switchnumbers") {
        document.getElementById("map").getElementById("switches").style.fill = "#FF00FF"
        document.getElementById("map").getElementById("signals").style.fill = "#000000"
    } else if (currentlyDisplaying == "signalnumbers") {
        document.getElementById("map").getElementById("switches").style.fill = "#000000"
        document.getElementById("map").getElementById("signals").style.fill = "#F5E588"
    } else if (currentlyDisplaying == "nothing") {
        document.getElementById("map").getElementById("switches").style.fill = "#000000"
        document.getElementById("map").getElementById("signals").style.fill = "#000000"
    }
}

function mng() {
    currentlyDisplaying = "switchnumbers"
    updateCurrentlyDisplaying()
}

function ssg() {
    currentlyDisplaying = "signalnumbers"
    updateCurrentlyDisplaying()
}

function smg() {
    currentlyDisplaying = "nothing"
    updateCurrentlyDisplaying()
}

function tsk() {
    routeWaitingList = []
    automaticSignalList.forEach(signal => {
        ose(["ose", signal.substr(1)])
    });
    signalList.forEach(signal => {
        signals[signal].isReserved = "no"
    });
    blockList.forEach(block => {
        if (blocks[block].status != "occupied") {
            blocks[block].status = "unset"
        }
    });
    pointList.forEach(point => {
        if (points[point].status != "occupied") {
            points[point].status = "unset"
        }
    });
}

function obl(command) {
    if (!automaticSignalList.includes("s" + command[1])) {
        automaticSignalList.push("s" + command[1])
    }
}

function ose(command) {
    automaticSignalList = automaticSignalList.filter(x => x != "s" + command[1])
    checkedBlock = signals["s" + command[1]].nextblock
    while (true) {
        if (Array.from(checkedBlock)[0] == "b") {
            if (blockStatus(checkedBlock) != "occupied") {
                blocks[checkedBlock].direction = signals["s" + command[1]].direction
                blocks[checkedBlock].status = "unset"
                if (checkedBlock == "b55" || checkedBlock == "b54") {
                    blocks["b1001"].status = "unset"
                }
                if (checkedBlock == "b42" || checkedBlock == "b43") {
                    blocks["b1002"].status = "unset"
                }
            }
        } else {
            if (blockStatus(checkedBlock) != "occupied") {
                points[checkedBlock].direction = signals["s" + command[1]].direction
                points[checkedBlock].status = "unset"
            }
        }
        if (signals["s" + command[1]].possibleends.includes(checkedBlock)) {
            break
        }
        checkedBlock = nextBlock(checkedBlock)
    }
}

function bsk(command) {
    signals["s" + command[1]].control = "closed"
}

function ksi(command) {
    signals["s" + command[1]].control = "auto"
}

function updateAutomaticBlocks() {
    automaticBlockList.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].status == "unset") {
                blocks[block].direction = automaticBlocks[block].direction
                blocks[block].status = "set"
            }
        } else {
            if (points[block.slice(0, -1)].status == "unset") {
                points[block.slice(0, -1)].direction = automaticBlocks[block].direction
                if (block.slice(-1) == "n") {
                    points[block.slice(0, -1)].position = "normal"
                } else {
                    points[block.slice(0, -1)].position = "diverging"
                }
                points[block.slice(0, -1)].status = "set"
            }
        }
    });
}

function findNextSignal(signal) {
    checkedBlock = signals[signal].nextblock
    while (true) {
        if (signals[signal].direction == "right") {
            if (Array.from(checkedBlock)[0] == "b") {
                if (blocks[checkedBlock].rightsignal) {
                    return blocks[checkedBlock].rightsignal
                }
            }
            checkedBlock = rightBlock(checkedBlock)
        } else {
            if (Array.from(checkedBlock)[0] == "b") {
                if (blocks[checkedBlock].leftsignal) {
                    return blocks[checkedBlock].leftsignal
                }
            }
            checkedBlock = leftBlock(checkedBlock)
        }
    }
}

var automaticSignalList = ["s154", "s303", "s307", "s201", "s203", "s207", "s200", "s206"]

function updateAutomaticSignals() {
    automaticSignalList.forEach(signal => {
        signalReady = true
        checkedBlock = signals[signal].nextblock
        while (signalReady == true) {
            if (blockStatus(checkedBlock) != "unset") {
                signalReady = false
                break
            }
            if (signals[signal].possibleends.includes(checkedBlock)) {
                break
            }
            if (checkedBlock == "b55" || checkedBlock == "b54") {
                if (blockStatus("b1001") != "unset" && blockStatus("b1001") != "set") {
                    signalReady = false
                    break
                }
            }
            if (checkedBlock == "b42" || checkedBlock == "b43") {
                if (blockStatus("b1002") != "unset" && blockStatus("b1002") != "set") {
                    signalReady = false
                    break
                }
            }
            if (signals[signal].direction == "right") {
                if (Array.from(checkedBlock)[0] == "b") {
                    checkedBlock = blocks[checkedBlock].right
                } else {
                    if (points[checkedBlock].position == "diverging") {
                        checkedBlock = points[checkedBlock].divergingright
                    } else {
                        checkedBlock = points[checkedBlock].normalright
                    }
                }
            } else {
                if (Array.from(checkedBlock)[0] == "b") {
                    checkedBlock = blocks[checkedBlock].left
                } else {
                    if (points[checkedBlock].position == "diverging") {
                        checkedBlock = points[checkedBlock].divergingleft
                    } else {
                        checkedBlock = points[checkedBlock].normalleft
                    }
                }
            }
        }
        checkedBlock = signals[signal].nextblock
        if (signalReady) {
            while (true) {
                if (Array.from(checkedBlock)[0] == "b") {
                    blocks[checkedBlock].direction = signals[signal].direction
                    blocks[checkedBlock].status = "set"
                    if (checkedBlock == "b55" || checkedBlock == "b54") {
                        blocks["b1001"].status = "set"
                    }
                    if (checkedBlock == "b42" || checkedBlock == "b43") {
                        blocks["b1002"].status = "set"
                    }
                } else {
                    points[checkedBlock].direction = signals[signal].direction
                    if (blockStatus(prevBlock(checkedBlock)) != "set") {
                        if (points[checkedBlock].position == "diverging") {
                            points[checkedBlock].position = "normal"
                        } else if (points[checkedBlock].position == "normal") {
                            points[checkedBlock].position = "diverging"
                        }
                    }
                    points[checkedBlock].status = "set"
                }
                if (signals[signal].possibleends.includes(checkedBlock)) {
                    break
                }
                checkedBlock = nextBlock(checkedBlock)
            }
        }
    });
}

function getTrainInBlock(block) {
    var trainName = ""
    Object.entries(trains).forEach(([k, v]) => {
        if (v.position == block) {
            trainName = k
        }
    })
    return trainName
}

function labelForBlock(block) {
    var label = ""
    var currentControlledBlock = block
    while (true) {
        if (blockStatus(currentControlledBlock) == "occupied") {
            label = getTrainInBlock(currentControlledBlock)
            break
        } else {
            if (prevSetBlock(currentControlledBlock) && prevSetBlock(currentControlledBlock) != "") {
                currentControlledBlock = prevSetBlock(currentControlledBlock)
            } else {
                label = getTrainInBlock(currentControlledBlock)
                break
            }
        }
    }
    return label
}

function updateLabels() {
    labels.forEach(label => {
        if (blockStatus(label.slice(0, -1)) == "occupied") {
            document.getElementById("map").getElementById(label).style.fill = "#FF0000"
        } else if (blockStatus(label.slice(0, -1)) == "set") {
            document.getElementById("map").getElementById(label).style.fill = "#03FF00"
        }
        document.getElementById("map").getElementById(label).getElementsByTagName("tspan")[0].innerHTML = labelForBlock(label.slice(0, -1))
    });
}

updateAutomaticBlocks()

window.setInterval(updateScreen, 100);

function updateScreen() {
    drawBlocks()
    drawPoints()
    updateSignals()
    drawSignals()
    updateAutomaticBlocks()
    updateAutomaticSignals()
    updateLabels()
    checkWaitingList()
    drawSignalMarkers()
}

terminal = document.getElementById("terminal")

document.onkeydown = function() {
    if (readyForCommand) {
        terminal.focus()
    }
}

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
        }
        deleteTerminalCommand = true
    }
})