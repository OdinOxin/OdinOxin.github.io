// import * as re from 're';
import * as yaml from 'yaml';
import * as svg from 'svgutils/transform';

usrInput = document.getElementById("usrInput")
output = document.getElementById("output")

document.getElementById("btn").onclick = function () {
    var _pj;
    var columns, fig, lineGap, maxColumns, root, rows, signHeight, signWidth, stream;

    function _pj_snippets(container) {
    function in_es6(left, right) {
        if (right instanceof Array || typeof right === "string") {
        return right.indexOf(left) > -1;
        } else {
        if (right instanceof Map || right instanceof Set || right instanceof WeakMap || right instanceof WeakSet) {
            return right.has(left);
        } else {
            return left in right;
        }
        }
    }

    container["in_es6"] = in_es6;
    return container;
    }

    _pj = {};

    _pj_snippets(_pj);

    maxColumns = 7;
    signWidth = 256;
    signHeight = 256;
    lineGap = 50;

    function getSign(func, unit) {
    var data, filename;
    filename = "Shapes/" + func + ".svg";
    data = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\">\n   <defs>\n      <clipPath id=\"person\">\n         <path d=\"M64,128 L128,64 L192,128 L128,192 Z\" />\n      </clipPath>\n   </defs>\n   <path d=\"M64,128 L128,64 L192,128 L128,192 Z\" stroke-width=\"5\" stroke=\"#FFFFFF\" fill=\"#003399\" />\n   <path d=\"M64,128 L128,64 L192,128 L128,192 Z\" stroke-width=\"12\" stroke=\"#FFFFFF\" fill=\"#003399\" clip-path=\"url(#person)\" />\n   <path d=\"M64,128 L128,64 L192,128 L128,192 Z\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\" />\n   <text x=\"128\" y=\"128\" style=\"font-family: 'Roboto Slab'; font-weight: bold; dominant-baseline: central; text-anchor: middle; font-size: 300%;\" fill=\"#FFFFFF\">{{UNIT}}</text>\n</svg>";
    // data = re.sub("{{UNIT}}", unit, data);
    return svg.fromstring(data);
    }

    function buildRecursive(fig, root, layer, x, y) {
    var col, leafs, name, offset, row, rowLineEnd, sign, signSvg, subTrees, txt, unit;
    row = 0;

    if (_pj.in_es6("func", root)) {
        unit = "";

        if (_pj.in_es6("unit", root)) {
        unit = root["unit"];
        }

        sign = getSign(root["func"], unit);
        signSvg = sign.getroot();
        signSvg.moveto(x, y, 1, 1);
        fig.append(signSvg);

        if (_pj.in_es6("name", root)) {
        name = root["name"];
        offset = -32;

        for (var namePart, _pj_c = 0, _pj_a = name.split(", "), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
            namePart = _pj_a[_pj_c];
            txt = new svg.TextElement(x + signWidth / 2, y + signHeight + offset, namePart, {
            "size": 24,
            "anchor": "middle"
            });
            fig.append(txt);
            offset = offset + 24;
        }
        }
    }

    if (_pj.in_es6("sub", root) && root["sub"]) {
        col = 0;
        leafs = list(filter(item => {
        return !_pj.in_es6("sub", item) || !item["sub"];
        }, root["sub"]));

        for (var item, _pj_c = 0, _pj_a = leafs, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        item = _pj_a[_pj_c];

        if (!_pj.in_es6("sub", item) || !item["sub"]) {
            col = col + 1;

            if ((col + layer) % 7 === 0) {
            col = 1;
            row = row + 1;
            }

            buildRecursive(fig, item, layer + 1, x + col * signWidth, y + row * signHeight);
        }
        }

        if (leafs) {
        row = row + 1;
        }

        subTrees = list(filter(item => {
        return _pj.in_es6("sub", item) && item["sub"];
        }, root["sub"]));

        if (subTrees) {
        fig.append(new svg.LineElement([[x + signWidth - lineGap, y + signHeight / 2], [x + signWidth, y + signHeight / 2]]));
        rowLineEnd = row;

        for (var item, _pj_c = 0, _pj_a = subTrees, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
            item = _pj_a[_pj_c];
            fig.append(new svg.LineElement([[x + signWidth, y + row * signHeight + signHeight / 2], [x + signWidth + lineGap, y + row * signHeight + signHeight / 2]]));
            rowLineEnd = row;
            row = row + buildRecursive(fig, item, layer + 1, x + signWidth, y + row * signHeight);
        }

        fig.append(new svg.LineElement([[x + signWidth, y + signHeight / 2], [x + signWidth, y + rowLineEnd * signHeight + signHeight / 2]]));
        }
    }

    return row;
    }

    stream = "unit: TZ\nname: Der Zugf\u00fchrer\nfunc: ZF\u00fc\nsub:\n  - unit: TZ\n    name: Der Zugtruppf\u00fchrer\n    func: ZTrF\u00fc\n    sub:\n      - name: ZTr-Helfer 1\n        func: FaHe\n      - name: ZTr-Helfer 2\n        func: FaHe\n      - name: ZTr-Helfer 3\n        func: FaHe\n      - name: ZTr-Helfer 4\n        func: FaHe\n        unit: KF\n  - unit: B\n    name: Der Gruppenf\u00fchrer\n    func: GrF\u00fc\n    sub:\n      - name: Der Truppf\u00fchrer\n        func: TrF\u00fc\n        unit: B\n        sub:\n      - name: B-Helfer 1\n        func: FaHe\n      - name: B-Helfer 2\n        func: FaHe\n      - name: B-Helfer 3\n        func: FaHe\n\t  - name: B-Helfer 4\n        func: FaHe";
    root = yaml.safe_load(stream);
    fig = new svg.SVGFigure();
    rows = buildRecursive(fig, root, 0, 0, 0);
    columns = maxColumns;
    fig.append(new svg.LineElement([[0, 0], [columns * signWidth, 0]]));
    fig.append(new svg.LineElement([[columns * signWidth, 0], [columns * signWidth, rows * signHeight]]));
    fig.append(new svg.LineElement([[columns * signWidth, rows * signHeight], [0, rows * signHeight]]));
    fig.append(new svg.LineElement([[0, rows * signHeight], [0, 0]]));
    fig.set_size([(columns * signWidth).toString(), (rows * signHeight).toString()]);
    output.Text = fig.to_str();
}