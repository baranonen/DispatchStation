"use strict"

var requestedRoute
var isPossible
var signalCanBeClear
var checkedBlock
var endBlocks
var terminal
var command
var switchNumbers = true
var signalNumbers = true
var signalReady
var markerBlinkState = true

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
}

var routeWaitingList = []

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

function tyi(requestedRouteText) {
    isPossible = true
    requestedRoute = routes[requestedRouteText[1] + "-" + requestedRouteText[2]]
    requestedRoute.blocks.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].status != "occupied") {
                blocks[block].status = "unset"
            }
        } else if (Array.from(block)[0] == "p") {
            if (points[block.slice(0, -1)].status != "occupied") {
                points[block.slice(0, -1)].status = "unset"
            }
        }
    });
    routes[requestedRouteText[1] + "-" + requestedRouteText[2]].status = false
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
                }
            } else {
                document.getElementById("map").getElementById(point + "n").style.stroke = "#ffffff00"
                if (points[point].status == "set") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#03FF00"
                } else if (points[point].status == "occupied") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#FF0000"
                } else if (points[point].status == "unset") {
                    document.getElementById("map").getElementById(point + "d").style.stroke = "#C0C0C0"
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

function updateSignals() {
    signalList.forEach(signal => {
        if (signals[signal].control == "closed") {
            signals[signal].status = "red"
        } else {
            if (blockStatus(signals[signal].nextblock) == blockStatus(signals[signal].prevblock)) {
                signals[signal].status = ""
            } else {
                signalCanBeClear = true
                checkedBlock = signals[signal].nextblock
                while (signalCanBeClear == true) {
                    if (blockStatus(checkedBlock) != "set") {
                        signalCanBeClear = false
                        break
                    }
                    if (blockDirection(checkedBlock) != signals[signal].direction) {
                        signalCanBeClear = false
                        break
                    }
                    if (signals[signal].possibleends.includes(checkedBlock)) {
                        break
                    }
                    checkedBlock = nextBlock(checkedBlock)
                }
                if (signalCanBeClear) {
                    signals[signal].status = "green"
                } else {
                    signals[signal].status = "red"
                }
            }
        }
    })
}

function drawSignals() {
    signalList.forEach(signal => {
        if (signals[signal].control == "closed") {
            document.getElementById("map").getElementById(signal + "r").style.opacity = "1"
        } else {
            document.getElementById("map").getElementById(signal + "r").style.opacity = "0"
            if (signals[signal].status == "green") {
                document.getElementById("map").getElementById(signal).style.fill = "#03FF00"
            } else if (signals[signal].status == "red") {
                document.getElementById("map").getElementById(signal).style.fill = "#FF0000"
            } else if (signals[signal].status == "") {
                document.getElementById("map").getElementById(signal).style.fill = "#C0C0C0"
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
    signalList.forEach(signal => {
        if (markerBlinkState) {
            document.getElementById("map").getElementById(signal + "m").style.opacity = "0"
        } else {
            document.getElementById("map").getElementById(signal + "m").style.opacity = "1"
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
    if (points["p" + command[1]].status != "occupied") {
        if (points["p" + command[1]].status == "set") {
            points["p" + command[1]].status = "unset"
        } else {
            points["p" + command[1]].status = "set"
        }
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

function mng() {
    if (switchNumbers) {
        document.getElementById("map").getElementById("switches").style.fill = "#000000"
        switchNumbers = false
    } else {
        document.getElementById("map").getElementById("switches").style.fill = "#FF00FF"
        switchNumbers = true
    }
}

function ssg() {
    if (signalNumbers) {
        document.getElementById("map").getElementById("signals").style.fill = "#000000"
        signalNumbers = false
    } else {
        document.getElementById("map").getElementById("signals").style.fill = "#F5E588"
        signalNumbers = true
    }
}

function smg() {
    document.getElementById("map").getElementById("signals").style.fill = "#000000"
    signalNumbers = false
    document.getElementById("map").getElementById("switches").style.fill = "#000000"
    switchNumbers = false
}

function tsk() {
    routeWaitingList = []
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

function omb(command) {
    if (!automaticSignalList.includes("s" + command[1])) {
        automaticSignalList.push("s" + command[1])
    }
}

function osi(command) {
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

function forceKeyPressUppercase(e)
  {
    var charInput = e.keyCode;
    if((charInput >= 97) && (charInput <= 122)) {
      if(!e.ctrlKey && !e.metaKey && !e.altKey) {
        var newChar = charInput - 32;
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        e.target.setSelectionRange(start+1, start+1);
        e.preventDefault();
      }
    }
  }

  terminal = document.getElementById("terminal")

  terminal.addEventListener("keypress", forceKeyPressUppercase, false);

  terminal.addEventListener("keypress", ({key}) => {
    if (key === "Enter") {
        command = terminal.value.split(" ")
        if (command[0] == "YTT") {
            ytt(command)
        } else if (command[0] == "YTI") {
            yti(command)
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
        } else if (command[0] == "OMB") {
            omb(command)
        } else if (command[0] == "OSI") {
            osi(command)
        } else if (command[0] == "BSK") {
            bsk(command)
        } else if (command[0] == "KSI") {
            ksi(command)
        }
        terminal.value = ""
    }
})