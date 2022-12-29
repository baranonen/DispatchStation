"use strict"

var blockList = []
var pointList = []
var signalList = []
var automaticBlockList = []

var blocks = {
    "b32": {"left": "b31", "right": "p421", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b33": {"left": "p421", "right": "p502", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b27": {"left": "p502", "right": "b20", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b20": {"left": "b27", "right": "b21", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s204", "rightsignal": "s201", "isOverlapBlock": false},
    "b21": {"left": "b20", "right": "b22", "status": "unset", "direction": "", "isStation": true, "leftsignal": "", "rightsignal": "s203", "isOverlapBlock": false},
    "b22": {"left": "b21", "right": "b23", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "s207", "isOverlapBlock": false},
    "b23": {"left": "b22", "right": "p507", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b40": {"left": "p421", "right": "p427", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b41": {"left": "p427", "right": "p428", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b44": {"left": "p428", "right": "b45", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b45": {"left": "b44", "right": "b46", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s150", "rightsignal": "s303", "isOverlapBlock": false},
    "b46": {"left": "b45", "right": "b47", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s306", "rightsignal": "s307", "isOverlapBlock": false},
    "b47": {"left": "b46", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b1": {"left": "", "right": "p419", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b2": {"left": "p419", "right": "b3", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "s151", "isOverlapBlock": false},
    "b3": {"left": "b2", "right": "b4", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s156", "rightsignal": "", "isOverlapBlock": false},
    "b4": {"left": "b3", "right": "p503", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b5": {"left": "p503", "right": "p504", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b6": {"left": "p504", "right": "b7", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b7": {"left": "b6", "right": "b8", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s202", "rightsignal": "", "isOverlapBlock": false},
    "b8": {"left": "b7", "right": "b9", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s206", "rightsignal": "", "isOverlapBlock": false},
    "b9": {"left": "b8", "right": "b56", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s200", "rightsignal": "s205", "isOverlapBlock": false},
    "b10": {"left": "p509", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b31": {"left": "b30", "right": "b32", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s152", "rightsignal": "s155", "isOverlapBlock": false},
    "b30": {"left": "p417", "right": "b31", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b29": {"left": "", "right": "p417", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b24": {"left": "p417", "right": "p418", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b12": {"left": "p418", "right": "b13", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b13": {"left": "b12", "right": "b14", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s154", "rightsignal": "s153", "isOverlapBlock": false},
    "b14": {"left": "b13", "right": "p423", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b15": {"left": "p423", "right": "p501", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b16": {"left": "p501", "right": "p505", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b17": {"left": "p505", "right": "p506", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b18": {"left": "p506", "right": "b19", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b19": {"left": "b18", "right": "b48", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s302", "rightsignal": "s301", "isOverlapBlock": false},
    "b48": {"left": "b19", "right": "b49", "status": "unset", "direction": "", "isStation": true, "leftsignal": "s304", "rightsignal": "s305", "isOverlapBlock": false},
    "b49": {"left": "b48", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b54": {"left": "p503", "right": "p506", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b55": {"left": "p505", "right": "p504", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b26": {"left": "p501", "right": "p502", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b25": {"left": "p423", "right": "b50", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b50": {"left": "b25", "right": "p425", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s166", "rightsignal": "", "isOverlapBlock": false},
    "b34": {"left": "p425", "right": "b51", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b35": {"left": "p425", "right": "p429", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b36": {"left": "p429", "right": "p422", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b42": {"left": "p429", "right": "p428", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b43": {"left": "p427", "right": "p422", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b37": {"left": "p422", "right": "b38", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b38": {"left": "b37", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s160", "rightsignal": "", "isOverlapBlock": false},
    "b51": {"left": "b34", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "s162", "rightsignal": "", "isOverlapBlock": false},
    "b11": {"left": "p419", "right": "p418", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b56": {"left": "b9", "right": "p508", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b57": {"left": "p508", "right": "p509", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b58": {"left": "p507", "right": "p510", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b59": {"left": "p510", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b52": {"left": "p507", "right": "p508", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b53": {"left": "p509", "right": "p510", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": false},
    "b1001": {"left": "", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": true},
    "b1002": {"left": "", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": true},
    "b1003": {"left": "", "right": "", "status": "unset", "direction": "", "isStation": false, "leftsignal": "", "rightsignal": "", "isOverlapBlock": true},
}

for (const[key] of Object.entries(blocks)) {
    blockList.push(key)
}

var points = {
    "p421": {"normalleft": "b32", "divergingleft": "b32", "normalright": "b33", "divergingright": "b40", "position": "normal", "status": "unset", "direction": "left"},
    "p502": {"normalleft": "b26", "divergingleft": "b33", "normalright": "b27", "divergingright": "b27", "position": "normal", "status": "unset", "direction": "left"},
    "p427": {"normalleft": "b40", "divergingleft": "b40", "normalright": "b41", "divergingright": "b43", "position": "normal", "status": "unset", "direction": "left"},
    "p428": {"normalleft": "b41", "divergingleft": "b42", "normalright": "b44", "divergingright": "b44", "position": "normal", "status": "unset", "direction": "left"},
    "p503": {"normalleft": "b4", "divergingleft": "b4", "normalright": "b5", "divergingright": "b54", "position": "normal", "status": "unset", "direction": "left"},
    "p504": {"normalleft": "b5", "divergingleft": "b55", "normalright": "b6", "divergingright": "b6", "position": "normal", "status": "unset", "direction": "left"},
    "p417": {"normalleft": "b29", "divergingleft": "b29", "normalright": "b30", "divergingright": "b30", "position": "normal", "status": "unset", "direction": "left"},
    "p418": {"normalleft": "b11", "divergingleft": "b24", "normalright": "b12", "divergingright": "b12", "position": "normal", "status": "unset", "direction": "left"},
    "p423": {"normalleft": "b14", "divergingleft": "b14", "normalright": "b15", "divergingright": "b25", "position": "normal", "status": "unset", "direction": "left"},
    "p501": {"normalleft": "b15", "divergingleft": "b15", "normalright": "b16", "divergingright": "b26", "position": "normal", "status": "unset", "direction": "left"},
    "p505": {"normalleft": "b16", "divergingleft": "b16", "normalright": "b17", "divergingright": "b55", "position": "normal", "status": "unset", "direction": "left"},
    "p506": {"normalleft": "b17", "divergingleft": "b54", "normalright": "b18", "divergingright": "b18", "position": "normal", "status": "unset", "direction": "left"},
    "p425": {"normalleft": "b50", "divergingleft": "b50", "normalright": "b35", "divergingright": "b34", "position": "normal", "status": "unset", "direction": "left"},
    "p429": {"normalleft": "b35", "divergingleft": "b35", "normalright": "b36", "divergingright": "b42", "position": "normal", "status": "unset", "direction": "left"},
    "p422": {"normalleft": "b36", "divergingleft": "b43", "normalright": "b37", "divergingright": "b37", "position": "normal", "status": "unset", "direction": "left"},
    "p419": {"normalleft": "b1", "divergingleft": "b1", "normalright": "b2", "divergingright": "b11", "position": "diverging", "status": "unset", "direction": "left"},
    "p507": {"normalleft": "b23", "divergingleft": "b23", "normalright": "b58", "divergingright": "b52", "position": "normal", "status": "unset", "direction": "left"},
    "p508": {"normalleft": "b56", "divergingleft": "b52", "normalright": "b57", "divergingright": "b57", "position": "normal", "status": "unset", "direction": "left"},
    "p509": {"normalleft": "b57", "divergingleft": "b57", "normalright": "b10", "divergingright": "b53", "position": "normal", "status": "unset", "direction": "left"},
    "p510": {"normalleft": "b58", "divergingleft": "b53", "normalright": "b59", "divergingright": "b59", "position": "normal", "status": "unset", "direction": "left"},
}

for (const[key] of Object.entries(points)) {
    pointList.push(key)
}

var routes = {
    // Airport/Kirazlı Direction
    "155-201": { "blocks": ["b32", "p421n", "b33", "b1003", "p502d", "b27", "b20"], "direction": "right", "status": false },
    "155-203": { "blocks": ["b32", "p421n", "b33", "b1003", "p502d", "b27", "b20", "b21"], "direction": "right", "status": false },
    "155-207": { "blocks": ["b32", "p421n", "b33", "b1003", "p502d", "b27", "b20", "b21", "b22"], "direction": "right", "status": false },
    "155-303": { "blocks": ["b32", "p421d", "b40", "p427n", "b41", "p428n", "b44", "b45"], "direction": "right", "status": false },
    "155-307": { "blocks": ["b32", "p421d", "b40", "p427n", "b41", "p428n", "b44", "b45", "b46"], "direction": "right", "status": false },
    "201-203": { "blocks": ["b21"], "direction": "right", "status": false },
    "201-207": { "blocks": ["b21", "b22"], "direction": "right", "status": false },
    "203-207": { "blocks": ["b22"], "direction": "right", "status": false },
    "151-205": { "blocks": ["b4", "p503n", "b5", "p504n", "b6", "b7", "b8", "b9"], "direction": "right", "status": false },
    "151-301": { "blocks": ["b4", "p503d", "b54", "b1001", "p506d", "b18", "b19"], "direction": "right", "status": false },
    "151-305": { "blocks": ["b4", "p503d", "b54", "b1001", "p506d", "b18", "b19", "b48"], "direction": "right", "status": false },
    "153-205": { "blocks": ["b14", "p423n", "b15", "p501n", "b16", "p505d", "b55", "b1001", "p504d", "b6", "b7", "b8", "b9"], "direction": "right", "status": false },
    "153-301": { "blocks": ["b14", "p423n", "b15", "p501n", "b16", "p505n", "b17", "p506n", "b18", "b19"], "direction": "right", "status": false },
    "153-305": { "blocks": ["b14", "p423n", "b15", "p501n", "b16", "p505n", "b17", "p506n", "b18", "b19", "b48"], "direction": "right", "status": false },
    "153-201": { "blocks": ["b14", "p423n", "b15", "p501d", "b26", "p502n", "b27", "b20"], "direction": "right", "status": false },
    "153-203": { "blocks": ["b14", "p423n", "b15", "p501d", "b26", "p502n", "b27", "b20", "b21"], "direction": "right", "status": false },
    "153-207": { "blocks": ["b14", "p423n", "b15", "p501d", "b26", "p502n", "b27", "b20", "b21", "b22"], "direction": "right", "status": false },
    "153-157": { "blocks": ["b14", "p423d", "b25", "b1003", "b50", "p425d", "b34", "b51"], "direction": "right", "status": false },
    "153-303": { "blocks": ["b14", "p423d", "b25", "b1003", "b50", "p425n", "b35", "p429d", "b42", "b1002", "p428d", "b44", "b45"], "direction": "right", "status": false },
    "153-307": { "blocks": ["b14", "p423d", "b25", "b1003", "b50", "p425n", "b35", "p429d", "b42", "b1002", "p428d", "b44", "b45", "b46"], "direction": "right", "status": false },
    "303-307": { "blocks": ["b46"], "direction": "right", "status": false },
    "301-305": { "blocks": ["b48"], "direction": "right", "status": false },
    // Yenikapı Direction
    "202-156": { "blocks": ["b6", "p504n", "b5", "p503n", "b4", "b3"], "direction": "left", "status": false },
    "202-154": { "blocks": ["b6", "p504d", "b55", "b1001", "p505d", "b16", "p501n", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "304-156": { "blocks": ["b19", "b18", "p506d", "b54", "b1001", "p503d", "b4", "b3"], "direction": "left", "status": false },
    "304-302": { "blocks": ["b19"], "direction": "left", "status": false },
    "304-154": { "blocks": ["b19", "b18", "p506n", "b17", "p505n", "b16", "p501n", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "302-156": { "blocks": ["b18", "p506d", "b54", "b1001", "p503d", "b4", "b3"], "direction": "left", "status": false },
    "302-154": { "blocks": ["b18", "p506n", "b17", "p505n", "b16", "p501n", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "206-202": { "blocks": ["b7"], "direction": "left", "status": false },
    "206-154": { "blocks": ["b7", "b6", "p504d", "b55", "b1001", "p505d", "b16", "p501n", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "206-156": { "blocks": ["b7", "b6", "p504n", "b5", "p503n", "b4", "b3"], "direction": "left", "status": false },
    "200-206": { "blocks": ["b8"], "direction": "left", "status": false },
    "200-202": { "blocks": ["b8", "b7"], "direction": "left", "status": false },
    "200-156": { "blocks": ["b8", "b7", "b6", "p504n", "b5", "p503n", "b4", "b3"], "direction": "left", "status": false },
    "200-154": { "blocks": ["b8", "b7", "b6", "p504d", "b55", "b1001", "p505d", "b16", "p501n", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "204-154": { "blocks": ["b27", "p502n", "b26", "p501d", "b15", "p423n", "b14", "b13"], "direction": "left", "status": false },
    "204-152": { "blocks": ["b27", "p502d", "b33", "b1003", "p421n", "b32", "b31"], "direction": "left", "status": false },
    "162-154": { "blocks": ["b34", "p425d", "b50", "b25", "b1003", "p423d", "b14", "b13"], "direction": "left", "status": false },
    "162-166": { "blocks": ["b34", "p425d", "b50"], "direction": "left", "status": false },
    "166-154": { "blocks": ["b25", "b1003", "p423d", "b14", "b13"], "direction": "left", "status": false },
    "160-154": { "blocks": ["b37", "p422n", "b36", "p429n", "b35", "p425n", "b50", "b25", "b1003", "p423d", "b14", "b13"], "direction": "left", "status": false },
    "160-166": { "blocks": ["b37", "p422n", "b36", "p429n", "b35", "p425n", "b50"], "direction": "left", "status": false },
    "160-152": { "blocks": ["b37", "p422d", "b43", "b1002", "p427d", "b40", "p421d", "b32", "b31"], "direction": "left", "status": false },
    "150-152": { "blocks": ["b44", "p428n", "b41", "p427n", "b40", "p421d", "b32", "b31"], "direction": "left", "status": false },
    "150-154": { "blocks": ["b44", "p428d", "b42", "b1002", "p429d", "b35", "p425n", "b50", "b25", "b1003", "p423d", "b14", "b13"], "direction": "left", "status": false },
    "150-166": { "blocks": ["b44", "p428d", "b42", "b1002", "p429d", "b35", "p425n", "b50"], "direction": "left", "status": false },
    "306-152": { "blocks": ["b45", "b44", "p428n", "b41", "p427n", "b40", "p421d", "b32", "b31"], "direction": "left", "status": false },
    "306-154": { "blocks": ["b45", "b44", "p428d", "b42", "b1002", "p429d", "b35", "p425n", "b50", "b25", "b1003", "p423d", "b14", "b13"], "direction": "left", "status": false },
    "306-166": { "blocks": ["b45", "b44", "p428d", "b42", "b1002", "p429d", "b35", "p425n", "b50"], "direction": "left", "status": false },
}

var signals = {
    "s155": {"nextblock": "b32", "prevblock": "b31", "direction": "right", "possibleends": ["b20", "b45"], "control": "auto", "status": "", "isReserved": "no"},
    "s201": {"nextblock": "b21", "prevblock": "b20", "direction": "right", "possibleends": ["b21"], "control": "auto", "status": "", "isReserved": "no"},
    "s203": {"nextblock": "b22", "prevblock": "b21", "direction": "right", "possibleends": ["b22"], "control": "auto", "status": "", "isReserved": "no"},
    "s207": {"nextblock": "b23", "prevblock": "b22", "direction": "right", "possibleends": ["b59"], "control": "auto", "status": "", "isReserved": "no"},
    "s151": {"nextblock": "b4", "prevblock": "b3", "direction": "right", "possibleends": ["b9", "b19"], "control": "auto", "status": "", "isReserved": "no"},
    "s205": {"nextblock": "b56", "prevblock": "b9", "direction": "right", "possibleends": ["b10"], "control": "auto", "status": "", "isReserved": "no"},
    "s301": {"nextblock": "b48", "prevblock": "b19", "direction": "right", "possibleends": ["b48"], "control": "auto", "status": "", "isReserved": "no"},
    "s305": {"nextblock": "b49", "prevblock": "b48", "direction": "right", "possibleends": ["b49"], "control": "auto", "status": "", "isReserved": "no"},
    "s303": {"nextblock": "b46", "prevblock": "b45", "direction": "right", "possibleends": ["b46"], "control": "auto", "status": "", "isReserved": "no"},
    "s307": {"nextblock": "b47", "prevblock": "b46", "direction": "right", "possibleends": ["b47"], "control": "auto", "status": "", "isReserved": "no"},
    "s153": {"nextblock": "b14", "prevblock": "b13", "direction": "right", "possibleends": ["b19", "b9", "b20", "b51", "b45"], "control": "auto", "status": "", "isReserved": "no"},
    "s204": {"nextblock": "b27", "prevblock": "b20", "direction": "left", "possibleends": ["b14", "b32"], "control": "auto", "status": "", "isReserved": "no"},
    "s304": {"nextblock": "b19", "prevblock": "b48", "direction": "left", "possibleends": ["b19"], "control": "auto", "status": "", "isReserved": "no"},
    "s156": {"nextblock": "b2", "prevblock": "b3", "direction": "left", "possibleends": ["b1"], "control": "auto", "status": "", "isReserved": "no"},
    "s202": {"nextblock": "b6", "prevblock": "b7", "direction": "left", "possibleends": ["b13", "b3"], "control": "auto", "status": "", "isReserved": "no"},
    "s206": {"nextblock": "b7", "prevblock": "b8", "direction": "left", "possibleends": ["b7"], "control": "auto", "status": "", "isReserved": "no"},
    "s200": {"nextblock": "b8", "prevblock": "b9", "direction": "left", "possibleends": ["b8"], "control": "auto", "status": "", "isReserved": "no"},
    "s154": {"nextblock": "b12", "prevblock": "b13", "direction": "left", "possibleends": ["b1", "b29"], "control": "auto", "status": "", "isReserved": "no"},
    "s302": {"nextblock": "b18", "prevblock": "b19", "direction": "left", "possibleends": ["b13", "b3"], "control": "auto", "status": "", "isReserved": "no"},
    "s152": {"nextblock": "b30", "prevblock": "b31", "direction": "left", "possibleends": ["b29"], "control": "auto", "status": "", "isReserved": "no"},
    "s162": {"nextblock": "b34", "prevblock": "b51", "direction": "left", "possibleends": ["b50"], "control": "auto", "status": "", "isReserved": "no"},
    "s166": {"nextblock": "b25", "prevblock": "b50", "direction": "left", "possibleends": ["b13"], "control": "auto", "status": "", "isReserved": "no"},
    "s160": {"nextblock": "b37", "prevblock": "b38", "direction": "left", "possibleends": ["b50", "b31"], "control": "auto", "status": "", "isReserved": "no"},
    "s150": {"nextblock": "b44", "prevblock": "b45", "direction": "left", "possibleends": ["b31", "b13"], "control": "auto", "status": "", "isReserved": "no"},
    "s306": {"nextblock": "b45", "prevblock": "b46", "direction": "left", "possibleends": ["b31", "b13"], "control": "auto", "status": "", "isReserved": "no"},
}

for (const[key] of Object.entries(signals)) {
    signalList.push(key)
}

var automaticBlocks = {
    "b29": {"direction": "right"},
    "b30": {"direction": "right"},
    "b31": {"direction": "right"},
    "p417n": {"direction": "right"},
    "b49": {"direction": "left"},
    "b48": {"direction": "left"},
    "b48": {"direction": "left"},
    "b10": {"direction": "left"},
    "b9": {"direction": "left"},
    "p509n": {"direction": "left"},
    "b57": {"direction": "left"},
    "p508n": {"direction": "left"},
    "b56": {"direction": "left"},
}

for (const[key] of Object.entries(automaticBlocks)) {
    automaticBlockList.push(key)
}

var labels = ["b48l", "b46l", "b45l", "b3l", "b19l", "b13l", "b31l", "b3l", "b7l", "b9l", "b22l", "b20l", "b21l", "b8l"]