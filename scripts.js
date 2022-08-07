const maxColumns = 7
const signWidth = 256
const signHeight = 256
const lineGap = 50

usrInput = document.getElementById("usrInput")
outputTxt = document.getElementById("outputTxt")
outputSvg = document.getElementById("outputSvg")

var getSign = function (sign, unit) {
    var req = new XMLHttpRequest();
    req.open('GET', `/signs/${sign}.svg`, false);
    req.send();
    return req.responseText.replace('{{UNIT}}', unit)
}

var getLine = function (ax, ay, bx, by) {
    var line = document.createElement('path');
    line.setAttribute('stroke-width', 1);
    line.setAttribute('stroke', 'black');
    line.setAttribute('d', `M${ax} ${ay} L${bx} ${by}`);
    return line;
}

var getText = function (text, x, y) {
    var txt = document.createElement('text');
    txt.setAttribute('x', x);
    txt.setAttribute('y', y);
    txt.setAttribute('font-size', 24);
    txt.setAttribute('font-family', 'Verdana');
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', 'black');
    txt.Text = text;
    return txt;
}

var buildRecursive = function (canvas, root, layer, x, y) {
    var row = 0;
    if (root.hasOwnProperty('func')){
        var unit = '';
        if (root.hasOwnProperty('unit'))
            unit = root['unit']
        var signSvg = document.createElement('g');
        signSvg.setAttribute('transform', `translate(${x}, ${y}) scale(1 1)`)
        signSvg.innerHTML = getSign(root['func'], unit);
        canvas.appendChild(signSvg);
        if(root.hasOwnProperty('name')){
            var name = root['name'];
            var offset = -32;
            for (let namePart in name.split(', ')){
                canvas.appendChild(getText(namePart, x + signWidth / 2, y + signHeight + offset));
                offset += 24;
            }
        }
    }
    if(root.hasOwnProperty('sub')){
        var col = 0;
        var leafs = list(filter(item => !item.hasOwnProperty('sub') || !Array.isArray(item["sub"]) || !item["sub"].length, root["sub"]));
        for(let item in leafs){
            col += 1;
            if((col + layer) % 7 == 0) {
                col = 1;
                row += 1;
            }
            buildRecursive(canvas, item, layer + 1, x + col * signWidth, y + row * signHeight);
        }
        if(leafs.length > 0)
            row += 1;
        var subTrees = list(filter(item => item.hasOwnProperty('sub') && Array.isArray(item["sub"]) && item["sub"].length > 0, root["sub"]));
        if(subTrees.length > 0) {
            canvas.appendChild(getLine(x + signWidth - lineGap, y + signHeight / 2, x + signWidth, y + signHeight / 2));
            var rowLineEnd = row;
            for(let item in subTrees) {
                canvas.appendChild(getLine(x + signWidth, y + row * signHeight + signHeight / 2, x + signWidth + lineGap, y + row * signHeight + signHeight / 2));
                rowLineEnd = row;
                row += buildRecursive(canvas, item, layer + 1, x + signWidth, y + row * signHeight);
            }
            canvas.appendChild(getLine(x + signWidth, y + signHeight / 2, x + signWidth, y + rowLineEnd * signHeight + signHeight / 2));
        }
    }
    return row;
}

document.getElementById("btn").onclick = function () {
    var root = {
        "unit": "TZ",
        "name": "Der Zugführer",
        "func": "ZFü",
        "sub": [
            {
                "unit": "TZ",
                "name": "Der Zugtruppführer",
                "func": "ZTrFü",
                "sub": [
                    {
                        "name": "ZTr-Helfer 1",
                        "func": "FaHe"
                    },
                    {
                        "name": "ZTr-Helfer 2",
                        "func": "FaHe"
                    },
                    {
                        "name": "ZTr-Helfer 3",
                        "func": "FaHe"
                    },
                    {
                        "name": "ZTr-Helfer 4",
                        "func": "FaHe",
                        "unit": "KF"
                    }
                ]
            },
            {
                "unit": "B",
                "name": "Der Gruppenführer",
                "func": "GrFü",
                "sub": [
                    {
                        "name": "Der Truppführer",
                        "func": "TrFü",
                        "unit": "B",
                        "sub": null
                    },
                    {
                        "name": "B-Helfer 1",
                        "func": "FaHe"
                    },
                    {
                        "name": "B-Helfer 2",
                        "func": "FaHe"
                    },
                    {
                        "name": "B-Helfer 3",
                        "func": "FaHe"
                    },
                    {
                        "name": "B-Helfer 4",
                        "func": "FaHe"
                    }
                ]
            }
        ]
    }

    var canvas = document.createElement('svg');
    var rows = buildRecursive(canvas, root, 0, 0, 0);

    // Draw Border
    canvas.appendChild(getLine(0, 0, columns * signWidth, 0));
    canvas.appendChild(getLine(columns * signWidth, 0, columns * signWidth, rows * signHeight));
    canvas.appendChild(getLine(columns * signWidth, rows * signHeight, 0, rows * signHeight));
    canvas.appendChild(getLine(0, rows * signHeight, 0, 0));

    // Output
    outputSvg.innerHTML = canvas.innerHTML;
    outputTxt.Text = outputSvg.outerHTML;
}