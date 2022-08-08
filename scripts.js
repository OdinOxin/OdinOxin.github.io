const maxColumns = 7
const signWidth = 256
const signHeight = 256
const lineGap = 50

var config = {
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

usrInput = document.getElementById("usrInput");
outputSvg = document.getElementById("outputSvg");
iptConfig = document.getElementById('iptConfig');

function configSelected(evt) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var preamble = 'data:application/json;base64,';
        if(data.startsWith(preamble))
            data = data.substring(preamble.length);
        var result = JSON.parse(atob(data));
        var formatted = JSON.stringify(result, null, 2);
        /*
        Code für AJAX-Request hier einfügen
        */
    }
    reader.readAsDataURL(evt.target.files[0]);
}
document.addEventListener('DOMContentLoaded', function() {
    iptConfig.addEventListener('change', configSelected, false);
});

function download(content, type, filename) {
    var dataStr = `data:${type};charset=utf-8,` + encodeURIComponent(content);
    var downloadJsonAnchorNode = document.createElement('a');
    downloadJsonAnchorNode.setAttribute("href", dataStr);
    downloadJsonAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadJsonAnchorNode);
    downloadJsonAnchorNode.click();
    downloadJsonAnchorNode.remove();
}

document.getElementById('btnDownloadConfig').onclick = function () {
    download(JSON.stringify(config, null, 2), 'text/json', 'FüHarke.json');
}

document.getElementById('btnDownloadSvg').onclick = function () {
    download(outputSvg.outerHTML, 'image/svg', 'FüHarke.svg');
}

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
    txt.innerHTML = text;
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
            var nameParts = name.split(', ');
            for (let namePart in nameParts){
                canvas.appendChild(getText(nameParts[namePart], x + signWidth / 2, y + signHeight + offset));
                offset += 24;
            }
        }
    }
    if(root.hasOwnProperty('sub') && Array.isArray(root['sub'])){
        var col = 0;
        var leafs = root['sub'].filter(item => !item.hasOwnProperty('sub') || !Array.isArray(item["sub"]) || !item["sub"].length);
        for(let leaf in leafs){
            col += 1;
            if((col + layer) % 7 == 0) {
                col = 1;
                row += 1;
            }
            buildRecursive(canvas, leafs[leaf], layer + 1, x + col * signWidth, y + row * signHeight);
        }
        if(leafs.length > 0)
            row += 1;
        var subTrees = root["sub"].filter(item => item.hasOwnProperty('sub') && Array.isArray(item["sub"]) && item["sub"].length > 0);
        if(subTrees.length > 0) {
            canvas.appendChild(getLine(x + signWidth - lineGap, y + signHeight / 2, x + signWidth, y + signHeight / 2));
            var rowLineEnd = row;
            for(let subTree in subTrees) {
                canvas.appendChild(getLine(x + signWidth, y + row * signHeight + signHeight / 2, x + signWidth + lineGap, y + row * signHeight + signHeight / 2));
                rowLineEnd = row;
                row += buildRecursive(canvas, subTrees[subTree], layer + 1, x + signWidth, y + row * signHeight);
            }
            canvas.appendChild(getLine(x + signWidth, y + signHeight / 2, x + signWidth, y + rowLineEnd * signHeight + signHeight / 2));
        }
    }
    return row;
}

document.getElementById("btn").onclick = function () {
    var canvas = document.createElement('svg');
    var rows = buildRecursive(canvas, config, 0, 0, 0);
    var columns = maxColumns;

    // Draw Border
    canvas.appendChild(getLine(0, 0, columns * signWidth, 0));
    canvas.appendChild(getLine(columns * signWidth, 0, columns * signWidth, rows * signHeight));
    canvas.appendChild(getLine(columns * signWidth, rows * signHeight, 0, rows * signHeight));
    canvas.appendChild(getLine(0, rows * signHeight, 0, 0));

    // Output
    outputSvg.innerHTML = canvas.innerHTML;
    outputSvg.setAttribute('width', columns * signWidth);
    outputSvg.setAttribute('height', rows * signHeight);
}