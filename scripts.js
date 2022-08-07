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
                var txt = document.createElement('text');
                txt.setAttribute('x', x + signWidth / 2);
                txt.setAttribute('y', y + signHeight + offset);
                txt.setAttribute('font-size', 24);
                txt.setAttribute('font-family', 'Verdana');
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', 'black');
                txt.Text = namePart;
                canvas.appendChild(txt);
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

    var newSvg = document.createElement('svg');
    buildRecursive(newSvg, root, 0, 0, 0);

    var childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(0, 0) scale(1 1)')
    childSvg.innerHTML = getSign('GrFü', 'B')
    newSvg.appendChild(childSvg);
    childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(256, 0) scale(1 1)')
    childSvg.innerHTML = getSign('TrFü', 'N');
    newSvg.appendChild(childSvg);
    outputSvg.innerHTML = newSvg.innerHTML;
    outputTxt.Text = outputSvg.outerHTML;
}