"use strict"

var requestedRoute
var isPossible
var signalShouldBe
var checkedBlock
var endBlocks
var command
var currentlyDisplaying = "signalnumbers"
var signalReady
var markerBlinkState = true
var lastOpenedRoute = {}
var deleteTerminalCommand = false
var routeWaitingList = []
var readyForCommand = false
var signalsReady = true

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

function nextBlockForTrain(train) {
    var block = trains[train].position
    if (Array.from(block)[0] == "b") {
        if (trains[train].direction == "left") {
            return blocks[block].left
        } else {
            return blocks[block].right
        }
    } else if (Array.from(block)[0] == "p") {
        if (trains[train].direction  == "right") {
            if (points[block].position == "normal") {
                return points[block].normalright
            } else if (points[block].position == "diverging") {
                return points[block].divergingright
            }
        } else if (trains[train].direction == "left") {
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

function prevBlockForTrain(train) {
    var block = trains[train].position
    if (Array.from(block)[0] == "b") {
        if (trains[train].direction == "left") {
            return blocks[block].right
        } else if (trains[train].direction == "right") {
            return blocks[block].left
        } else {
            return ""
        }
    } else if (Array.from(block)[0] == "p") {
        if (trains[train].direction == "right") {
            if (points[block].position == "normal") {
                return points[block].normalleft
            } else if (points[block].position == "diverging") {
                return points[block].divergingleft
            }
        } else if (trains[train].direction == "left") {
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

function prevBlockOfSignal(signal) {
    if (!signals[signal].nextblock) {
        return signals[signal].prevblock
    }
    if (signals[signal].direction == "right") {
        return blocks[signals[signal].nextblock].left
    } else if (signals[signal].direction == "left") {
        return blocks[signals[signal].nextblock].right
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

function getLeftSignal(block) {
    var result = ""
    signalList.forEach(signal => {
        if (prevBlockOfSignal(signal) == block && signals[signal].direction == "left") {
            result = signal
            return
        }
    });
    return result
}

function getRightSignal(block) {
    var result = ""
    signalList.forEach(signal => {
        if (prevBlockOfSignal(signal) == block && signals[signal].direction == "right") {
            result = signal
            return
        }
    });
    return result
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
            if (block.slice(-1) == "n") {
                if (points[block.slice(0, -1)].flankprotection) {
                    points[points[block.slice(0, -1)].flankprotection].position = "normal"
                    points[points[block.slice(0, -1)].flankprotection].systemlock = true
                }
            }
        }
    });
    routeWaitingList = routeWaitingList.filter(v => v !== requestedRouteText)
    lastOpenedRoute.route = requestedRouteText
    lastOpenedRoute.seconds = 0
}

window.setInterval(updateSecondTime, 1000);

function updateSecondTime() {
    lastOpenedRoute.seconds += 1
}

function addRouteToWaitingList(requestedRouteText) {
    if (requestedRoute == "") {
        return false
    }
    if (signals["s" + requestedRouteText[1]] && signals["s" + requestedRouteText[2]]) {
        if (!isSignalReservedForRouteStart("s" + requestedRouteText[1]) && !isSignalReservedForRouteEnd("s" + requestedRouteText[2])) {
            routeWaitingList.push(requestedRouteText)
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

function findRoute(requestedRouteText) {
    if (signals["s" + requestedRouteText[1]].direction == signals["s" + requestedRouteText[2]].direction) {
        if (signals["s" + requestedRouteText[1]].direction == "right") {
            var route = findShortestPath(rightGraph, signals["s" + requestedRouteText[1]].nextblock, prevBlockOfSignal("s" + requestedRouteText[2]))
        } else {
            var route = findShortestPath(leftGraph, signals["s" + requestedRouteText[1]].nextblock, prevBlockOfSignal("s" + requestedRouteText[2]))
        }
        if (route.distance == "Infinity") {
            if (signals["s" + requestedRouteText[1]].nextblock != prevBlockOfSignal("s" + requestedRouteText[2])) {
                return ""
            }
        }
        var finalRoute = {blocks: [], direction: signals["s" + requestedRouteText[1]].direction}
        route.path.forEach(block => {
            if (Array.from(block)[0] == "b") {
                finalRoute.blocks.push(block)
            } else if (Array.from(block)[0] == "p") {
                if (points[block].divergingright != points[block].normalright) {
                    if (route.path.includes(points[block].divergingright)) {
                        finalRoute.blocks.push(block + "d")
                    } else if (route.path.includes(points[block].normalright)) {
                        finalRoute.blocks.push(block + "n")
                    }
                } else if (points[block].divergingleft != points[block].normalleft) {
                    if (route.path.includes(points[block].divergingleft)) {
                        finalRoute.blocks.push(block + "d")
                    } else if (route.path.includes(points[block].normalleft)) {
                        finalRoute.blocks.push(block + "n")
                    }
                }
            }
        });
        return finalRoute
    } else {
        return ""
    }
}


function checkRoutePossible(requestedRouteText) {
    isPossible = true
    requestedRoute = findRoute(requestedRouteText)
    if (requestedRoute == "") {
        return false
    }
    requestedRoute.blocks.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].status != "unset") {
                isPossible = false
            }
        } else if (Array.from(block)[0] == "p") {
            if (points[block.slice(0, -1)].status != "unset") {
                isPossible = false
            }
            if (points[block.slice(0, -1)].flankprotection) {
                if (points[points[block.slice(0, -1)].flankprotection].position == "diverging") {
                    if (points[points[block.slice(0, -1)].flankprotection].status != "unset") {
                        isPossible = false
                    }
                } 
            }
        }
    });
    return isPossible
}

function ytt(requestedRouteText) {
    if (requestedRouteText.length < 3) {
        output.value = "COMMAND MISSING"
    }
    for (let via = 1; via < requestedRouteText.length - 1; via++) {
        if (signals["s" + requestedRouteText[via]] && signals["s" + requestedRouteText[via + 1]]) {
            if (!isSignalReservedForRouteStart("s" + requestedRouteText[via]) && !isSignalReservedForRouteEnd("s" + requestedRouteText[via + 1])) {
                if (checkRoutePossible([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])) {
                    setRoute([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])
                } else {
                    addRouteToWaitingList([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])
                }
            }
        } else {
            if (checkRoutePossible([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])) {
                setRoute([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])
            } else {
                addRouteToWaitingList([requestedRouteText[via - 1], requestedRouteText[via], requestedRouteText[via + 1]])
            }
        }
    }
}

function yti(requestedRouteText) {
    if (requestedRouteText.length == 3) {
        for (let index = 0; index < routeWaitingList.length; index++) {
            if (routeWaitingList[index][1] == requestedRouteText[1] && routeWaitingList[index][2] == requestedRouteText[2]) {
                routeWaitingList.splice(index, 1)
                return
            }
        }
    } else if (requestedRouteText.length == 2) {
        for (let index = 0; index < routeWaitingList.length; index++) {
            if (routeWaitingList[index][1] == requestedRouteText[1]) {
                routeWaitingList.splice(index, 1)
                return
            }
        }
    }
}

function cti(requestedRouteText) {
    isPossible = true
    requestedRoute = findRoute(requestedRouteText)
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
            if (points[block.slice(0, -1)].flankprotection) {
                points[points[block.slice(0, -1)].flankprotection].systemlock = false
            }
        }
    });
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

function tyl() {
    var d = new Date()

    var html = "<p><span>Tren Yer Listesi </span> GEO. NODE 1 " + d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 8) + "</p><hr><table><thead><td><span>TREN NUMARASI</span></td><td><span>QUEUE POS.</span></td><td><span>TIME</span></td><td><span>POS.</span></td><td><span>SIG IN STOP</span></td></thead>"
    
    for (let [key, value] of Object.entries(trains)) {
        html += "<tr><td>" + key + "</td><td></td><td></td><td> IST " + findNextSignalOfBlock(value.position).substring(1) + "</td><td><span>IST " + findNextClosedSignalOfBlock(value.position).substring(1) + "</span></td></tr>"
    }

    document.getElementById("tyliframe").contentWindow.document.body.innerHTML = html

    document.getElementById("tyltitle").innerHTML = "Text picture nr: 1 " + d.toTimeString().slice(0, 8)

    document.getElementById("tyl").style.display = "flex"
}

function tnd(command) {
    if (command.length == 3) {
        if (!trains[command[2]] && trains[command[1]]) {
            trains[command[2]] = trains[command[1]]
            delete trains[command[1]]
        } else {
            output.value = "ILLEGAL STATUS"
        }
    } else {
        output.value = "ILLEGAL STATUS"
    }
}

function tns(command) {
    tnd(["TND", command[1], ""])
}

function stg(command) {
    tnd(["TND", labelForBlock(prevBlockOfSignal("s" + command[1])), command[2]])
}

function sts(command) {
    stg(["STG", command[1], ""])
}

function drawPoints() {
    pointList.forEach(point => {
        if (points[point].status == "local") {
            document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#0000FF"
            document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#0000FF"
        } else {
            if (points[point].position == "normal") {
                document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#ffffff00"
                if (points[point].status == "set") {
                    document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#03FF00"
                } else if (points[point].status == "occupied") {
                    document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#FF0000"
                } else if (points[point].status == "unset") {
                    if (points[point].systemlock == true) {
                        document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#F5E588"
                    } else {
                        document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#C0C0C0"
                    }
                } else if (points[point].status == "cancelled") {
                    document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#FF00FF"
                }
            } else {
                document.getElementById(points[point].screen).getElementById(point + "n").style.stroke = "#ffffff00"
                if (points[point].status == "set") {
                    document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#03FF00"
                } else if (points[point].status == "occupied") {
                    document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#FF0000"
                } else if (points[point].status == "unset") {
                    if (points[point].systemlock == true) {
                        document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#F5E588"
                    } else {
                        document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#C0C0C0"
                    }
                } else if (points[point].status == "cancelled") {
                    document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#FF00FF"
                } else if (points[point].systemlock == true) {
                    document.getElementById(points[point].screen).getElementById(point + "d").style.stroke = "#F5E588"
                }
            }
        }
    });
}

function drawBlocks() {
    blockList.forEach(block => {
        if (blocks[block].status == "occupied") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById(blocks[block].screen).getElementById(block).style.fill = "#FF0000"
            } else {
                document.getElementById(blocks[block].screen).getElementById(block).style.stroke = "#FF0000"
            }
        } else if (blocks[block].status == "cancelled") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById(blocks[block].screen).getElementById(block).style.fill = "#FF00FF"
            } else {
                document.getElementById(blocks[block].screen).getElementById(block).style.stroke = "#FF00FF"
            }
        } else if (blocks[block].status == "set") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById(blocks[block].screen).getElementById(block).style.fill = "#03FF00"
            } else {
                document.getElementById(blocks[block].screen).getElementById(block).style.stroke = "#03FF00"
            }
        } else if (blocks[block].status == "unset") {
            if (blocks[block].isOverlapBlock) {
                document.getElementById(blocks[block].screen).getElementById(block).style.fill = "#C0C0C0"
            } else {
                document.getElementById(blocks[block].screen).getElementById(block).style.stroke = "#C0C0C0"
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

function updateSignalAspects() {
    signalList.forEach(signal => {
        if (signals[signal].control == "closed") {
            signals[signal].aspect = "red"
            return
        }
        var currentControlledBlock = signals[signal].nextblock
        while (true) {
            if (blockStatus(currentControlledBlock) == "set" && blockDirection(currentControlledBlock) == signals[signal].direction) {
                if (Array.from(currentControlledBlock)[0] == "b") {
                    if (blockDirection(currentControlledBlock) == "left") {
                        if (getLeftSignal(currentControlledBlock) != "") {
                            signals[signal].aspect = "green"
                            return
                        }
                    } else if (blockDirection(currentControlledBlock) == "right") {
                        if (getRightSignal(currentControlledBlock) && getRightSignal(currentControlledBlock) != "") {
                            signals[signal].aspect = "green"
                            return
                        }
                    }
                }
                currentControlledBlock = nextBlock(currentControlledBlock)
            } else {
                signals[signal].aspect = "red"
                return
            }
        }
    });
}

function updateSignals() {
    signalList.forEach(signal => {
        if (signals[signal].notinscreen == true) {
            if (signals[signal].endsignal) {
                return
            }
            if (blocks[signals[signal].nextblock].status == "set") {
                signals[signal].status = "green"
            } else {
                signals[signal].status = "red"
            }
            return
        }
        if (signals[signal].endsignal) {
            if (blocks[prevBlockOfSignal(signal)].status != "unset") {
                signals[signal].status = "red"
            } else {
                signals[signal].status = ""
            }
            return
        }
        if (signals[signal].control == "closed") {
            signals[signal].status = "red"
        } else {
            if (blockStatus(prevBlockOfSignal(signal)) == "unset") {
                if (blockStatus(signals[signal].nextblock) == "unset" || signals[signal].direction != blocks[signals[signal].nextblock].direction) {
                    signals[signal].status = ""
                    return
                }
            } else if (signals[signal].direction != blocks[prevBlockOfSignal(signal)].direction) {
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
                if (Array.from(checkedBlock)[0] == "b") {
                    if (signals[signal].direction == "right") {
                        if (getRightSignal(checkedBlock) != "") {
                            break
                        }
                    } else if (signals[signal].direction == "left") {
                        if (getLeftSignal(checkedBlock) != "") {
                            break
                        }
                    }
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
                if (Array.from(checkedBlock)[0] == "b") {
                    if (signals[signal].direction == "right") {
                        if (getRightSignal(checkedBlock) != "") {
                            break
                        }
                    } else if (signals[signal].direction == "left") {
                        if (getLeftSignal(checkedBlock) != "") {
                            break
                        }
                    }
                }
                checkedBlock = nextBlock(checkedBlock)
            }
            signals[signal].status = signalShouldBe
        }
    })
}

function drawSignals() {
    signalList.forEach(signal => {
        if (signals[signal].notinscreen == true) {
            return
        }
        if (signals[signal].endsignal) {
            if (signals[signal].status == "red") {
                document.getElementById(signals[signal].screen).getElementById(signal).style.fill = "#FF0000"
            } else {
                document.getElementById(signals[signal].screen).getElementById(signal).style.fill = "#C0C0C0"
            }
            return
        }
        if (signals[signal].control == "closed") {
            document.getElementById(signals[signal].screen).getElementById(signal).style.fill = "#FF0000"
            document.getElementById(signals[signal].screen).getElementById(signal).style.stroke = "#FF0000"
        } else {
            document.getElementById(signals[signal].screen).getElementById(signal).style.fill = "#FF000000"
            if (signals[signal].status == "green") {
                document.getElementById(signals[signal].screen).getElementById(signal).style.stroke = "#03FF00"
            } else if (signals[signal].status == "red") {
                document.getElementById(signals[signal].screen).getElementById(signal).style.stroke = "#FF0000"
            } else if (signals[signal].status == "purple") {
                document.getElementById(signals[signal].screen).getElementById(signal).style.stroke = "#FF00FF"
            } else if (signals[signal].status == "") {
                document.getElementById(signals[signal].screen).getElementById(signal).style.stroke = "#C0C0C0"
            }
        }
    });
}

function drawSignalMarkers() {
    signalList.forEach(signal => {
        if (signals[signal].notinscreen == true) {
            return
        }
        if (document.getElementById(signals[signal].screen).getElementById(signal + "m")) {
            if (isSignalReservedForRouteStart(signal)) {
                document.getElementById(signals[signal].screen).getElementById(signal + "m").style.fill = "#03FF00"
            } else if (isSignalReservedForRouteEnd(signal)) {
                document.getElementById(signals[signal].screen).getElementById(signal + "m").style.fill = "#FF0000"
            } else {
                document.getElementById(signals[signal].screen).getElementById(signal + "m").style.fill = "#000000"
            }
        }
    });
}

function isSignalReservedForRouteStart(signal) {
    for (let index = 0; index < routeWaitingList.length; index++) {
        if (routeWaitingList[index][1] == signal.substr(1)) {
            return true
        }
    }
}

function isSignalReservedForRouteEnd(signal) {
    for (let index = 0; index < routeWaitingList.length; index++) {
        if (routeWaitingList[index][2] == signal.substr(1)) {
            return true
        }
    }
}

function blinkSignalMarkers() {
    command = terminal.value.toLocaleUpperCase('en-US').split(" ")
    signalList.forEach(signal => {
        if (signals[signal].notinscreen == true) {
            return
        }
        if (document.getElementById(signals[signal].screen).getElementById(signal + "m")) {
            if (markerBlinkState) {
                document.getElementById(signals[signal].screen).getElementById(signal + "m").style.opacity = "0"
                if (command.includes(signal.substr(1)) && !deleteTerminalCommand) {
                    document.getElementById(signals[signal].screen).getElementById(signal).style.opacity = "0"
                }
            } else {
                document.getElementById(signals[signal].screen).getElementById(signal + "m").style.opacity = "1"
                document.getElementById(signals[signal].screen).getElementById(signal).style.opacity = "1"
            }
        }
    });
    markerBlinkState = !markerBlinkState
}

window.setInterval(blinkSignalMarkers, 350);

function msa(command) {
    if (points["p" + command[1]].status == "unset" && points["p" + command[1]].systemlock == false) {
        points["p" + command[1]].position = "diverging"
    }
}

function mso(command) {
    if (points["p" + command[1]].status == "unset" && points["p" + command[1]].systemlock == false) {
        points["p" + command[1]].position = "normal"
    }
}

function mbl(command) {
    if (points["p" + command[1]].position == "normal" && points["p" + command[1]].flankprotection) {
        if (points[points["p" + command[1]].flankprotection].position == "diverging") {
            if (points[points["p" + command[1]].flankprotection].status != "unset") {
                return
            } else {
            points[points["p" + command[1]].flankprotection].position = "normal"
            points[points["p" + command[1]].flankprotection].systemlock = true
            }
        } else {
            points[points["p" + command[1]].flankprotection].position = "normal"
            points[points["p" + command[1]].flankprotection].systemlock = true
        }
    }
    if (points["p" + command[1]].status == "unset") {
        points["p" + command[1]].status = "set"
    }
}

function mse(command) {
    if (points["p" + command[1]].status == "set") {
        cancelBlock(command[1])
        if (points["p" + command[1]].flankprotection) {
            points[points["p" + command[1]].flankprotection].systemlock = false
        }
    }
}

function mlk(command) {
    if (points["p" + command[1]].status == "unset" && points["p" + command[1]].systemlock == false) {
        points["p" + command[1]].status = "local"
    }
}

function mmk(command) {
    if (points["p" + command[1]].status == "local") {
        points["p" + command[1]].status = "unset"
    }
}

function updateCurrentlyDisplaying() {
    screenList.forEach(screen => {
        try {
            if (currentlyDisplaying == "switchnumbers") {
                document.getElementById(screen).getElementById("switches").style.fill = "#FF00FF"
                document.getElementById(screen).getElementById("signals").style.fill = "#00000000"
                document.getElementById(screen).getElementById("trackcircuits").style.fill = "#00000000"
            } else if (currentlyDisplaying == "signalnumbers") {
                document.getElementById(screen).getElementById("switches").style.fill = "#00000000"
                document.getElementById(screen).getElementById("signals").style.fill = "#F5E588"
                document.getElementById(screen).getElementById("trackcircuits").style.fill = "#00000000"
            } else if (currentlyDisplaying == "trackcircuits") {
                document.getElementById(screen).getElementById("switches").style.fill = "#00000000"
                document.getElementById(screen).getElementById("signals").style.fill = "#00000000"
                document.getElementById(screen).getElementById("trackcircuits").style.fill = "#D8D8D8"
            } else if (currentlyDisplaying == "nothing") {
                document.getElementById(screen).getElementById("switches").style.fill = "#00000000"
                document.getElementById(screen).getElementById("signals").style.fill = "#00000000"
                document.getElementById(screen).getElementById("trackcircuits").style.fill = "#00000000"
            }    
        } catch (error) {
            
        }
    });
}

updateCurrentlyDisplaying()

function mng() {
    currentlyDisplaying = "switchnumbers"
    updateCurrentlyDisplaying()
}

function ssg() {
    currentlyDisplaying = "signalnumbers"
    updateCurrentlyDisplaying()
}

function rdg() {
    currentlyDisplaying = "trackcircuits"
    updateCurrentlyDisplaying()
}

function smg() {
    currentlyDisplaying = "nothing"
    updateCurrentlyDisplaying()
}

function tsk() {
    routeWaitingList = []
    blockList.forEach(block => {
        if (blockStatus(block) != "occupied") {
            blocks[block].status = "cancelled"
            setTimeout(function () { releaseBlock(block) }, 60000)
        }
    });
    pointList.forEach(point => {
        if (blockStatus(point) != "occupied") {
            points[point].status = "cancelled"
            setTimeout(function () { releaseBlock(point) }, 60000)
            if (points[point].flankprotection) {
                points[points[point].flankprotection].systemlock = false
            }
        }
    });
}

function ose(command) {
    if (!automaticSignalList.includes("s" + command[1])) {
        if (signals["s" + command[1]].automaticto) {
            automaticSignalList.push("s" + command[1])
        } else {
            output.value = "ILLEGAL STATUS"
        }
    }
}

function obl(command) {
    automaticSignalList = automaticSignalList.filter(x => x != "s" + command[1])
}

function sth() {
    signalsReady = true
}

function bsk(command) {
    signals["s" + command[1]].control = "closed"
}

function ksi(command) {
    signals["s" + command[1]].control = "auto"
}

function findNextSignal(signal) {
    checkedBlock = signals[signal].nextblock
    while (true) {
        if (signals[signal].direction == "right") {
            if (Array.from(checkedBlock)[0] == "b") {
                if (getRightSignal(checkedBlock)) {
                    return getRightSignal(checkedBlock)
                }
            }
            checkedBlock = rightBlock(checkedBlock)
        } else {
            if (Array.from(checkedBlock)[0] == "b") {
                if (getLeftSignal(checkedBlock)) {
                    return getLeftSignal(checkedBlock)
                }
            }
            checkedBlock = leftBlock(checkedBlock)
        }
    }
}

function findNextSignalOfBlock(checkedBlock) {
    while (true) {
        if (Array.from(checkedBlock)[0] == "b") {
            if (blocks[checkedBlock].direction == "right") {
                if (getRightSignal(checkedBlock)) {
                    return getRightSignal(checkedBlock)
                }
            } else if (blocks[checkedBlock].direction == "left") {
                if (getLeftSignal(checkedBlock)) {
                    return getLeftSignal(checkedBlock)
                }
            } else {
                return ""
            }
        } else if (Array.from(checkedBlock)[0] == "p") {
            if (points[checkedBlock].direction == "right") {
                if (getRightSignal(checkedBlock)) {
                    return getRightSignal(checkedBlock)
                }
            } else if (points[checkedBlock].direction == "left") {
                if (getLeftSignal(checkedBlock)) {
                    return getLeftSignal(checkedBlock)
                }
            } else {
                return ""
            }
        }
        checkedBlock = nextBlock(checkedBlock)
    }
}

function findNextClosedSignalOfBlock(checkedBlock) {
    while (true) {
        if (Array.from(checkedBlock)[0] == "b") {
            if (blocks[checkedBlock].direction == "right") {
                if (getRightSignal(checkedBlock) && signals[getRightSignal(checkedBlock)].status == "red") {
                    return getRightSignal(checkedBlock)
                }
            } else if (blocks[checkedBlock].direction == "left") {
                if (getLeftSignal(checkedBlock) && signals[getLeftSignal(checkedBlock)].status == "red") {
                    return getLeftSignal(checkedBlock)
                }
            } else {
                return ""
            }
        } else if (Array.from(checkedBlock)[0] == "p") {
            if (points[checkedBlock].direction == "right") {
                if (getRightSignal(checkedBlock) && signals[getRightSignal(checkedBlock)].status == "red") {
                    return getRightSignal(checkedBlock)
                }
            } else if (points[checkedBlock].direction == "left") {
                if (getLeftSignal(checkedBlock) && signals[getLeftSignal(checkedBlock)].status == "red") {
                    return getLeftSignal(checkedBlock)
                }
            } else {
                return ""
            }
        }
        if (nextBlock(checkedBlock) != "") {
            checkedBlock = nextBlock(checkedBlock)
        } else {
            return " ---"
        }
    }
}

const shortestDistanceNode = (distances, visited) => {
	let shortest = null;

	for (let node in distances) {
		let currentIsShortest =
			shortest === null || distances[node] < distances[shortest];
		if (currentIsShortest && !visited.includes(node)) {
			shortest = node;
		}
	}
	return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {
	let distances = {};
	distances[endNode] = "Infinity";
	distances = Object.assign(distances, graph[startNode]);

	let parents = { endNode: null };
	for (let child in graph[startNode]) {
		parents[child] = startNode;
	}

	let visited = [];

	let node = shortestDistanceNode(distances, visited);

	while (node) {
		let distance = distances[node];
		let children = graph[node];
		for (let child in children) {
			if (String(child) === String(startNode)) {
				continue;
			} else {
				let newdistance = distance + children[child];
				if (!distances[child] || distances[child] > newdistance) {
					distances[child] = newdistance;
					parents[child] = node;
				}
			}
		}
		visited.push(node);
		node = shortestDistanceNode(distances, visited);
	}

	let shortestPath = [endNode];
	let parent = parents[endNode];
	while (parent) {
		shortestPath.push(parent);
		parent = parents[parent];
	}
	shortestPath.reverse();

    shortestPath.forEach(block => {
        if (Array.from(block)[0] == "b") {
            if (blocks[block].overlap) {
                shortestPath.push(blocks[block].overlap)
            }
        }
    });

	let results = {
		distance: distances[endNode],
		path: shortestPath,
	};

	return results;
};

var rightGraph = {}
var leftGraph = {}

function makeGraph() {
    blockList.forEach(block => {
        if (blocks[block].right != "") {
            rightGraph[block] = {[blocks[block].right]: 1}
        }
    })
    pointList.forEach(point => {
        if (points[point].normalright == points[point].divergingright) {
            rightGraph[point] = {[points[point].normalright]: 1}
        } else {
            rightGraph[point] = {[points[point].normalright]: 1, [points[point].divergingright]: 100}
        }
    })
    blockList.forEach(block => {
        if (blocks[block].right != "") {
            leftGraph[block] = {[blocks[block].left]: 1}
        }
    })
    pointList.forEach(point => {
        if (points[point].normalleft == points[point].divergingleft) {
            leftGraph[point] = {[points[point].normalleft]: 1}
        } else {
            leftGraph[point] = {[points[point].normalleft]: 1, [points[point].divergingleft]: 100}
        }
    })
}

makeGraph()

function updateAutomaticSignals() {
    if (signalsReady) {
        signalsReady = false
        automaticSignalList.forEach(signal => {
            ytt(["YTT", signal.substring(1), signals[signal].automaticto.substring(1)])
        })
    } else {
        automaticSignalList.forEach(signal => {
            if (blocks[signals[signal].nextblock].status == "occupied") {
                ytt(["YTT", signal.substring(1), signals[signal].automaticto.substring(1)])
            }
        })
    }
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
    blockList.forEach(label => {
        if (document.getElementById(blocks[label].screen).getElementById(label + "l")) {
            if (blockStatus(label) == "occupied") {
                document.getElementById(blocks[label].screen).getElementById(label + "l").style.fill = "#FF0000"
            } else if (blockStatus(label) == "set") {
                document.getElementById(blocks[label].screen).getElementById(label + "l").style.fill = "#03FF00"
            }
            document.getElementById(blocks[label].screen).getElementById(label + "l").getElementsByTagName("tspan")[0].innerHTML = labelForBlock(label)
        }
    });
}

window.setInterval(updateScreen, 100);

function updateScreen() {
    updateAutomaticSignals()
    drawBlocks()
    drawPoints()
    updateSignals()
    drawSignals()
    updateSignalAspects()
    updateLabels()
    checkWaitingList()
    drawSignalMarkers()
}

document.onkeydown = function() {
    if (readyForCommand) {
        terminal.focus()
        output.value = ""
    }
}