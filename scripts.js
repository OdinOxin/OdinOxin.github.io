usrInput = document.getElementById("usrInput")
outputTxt = document.getElementById("outputTxt")
outputSvg = document.getElementById("outputSvg")

var getSign = function (sign, unit) {
    var req = new XMLHttpRequest();
    req.open('GET', `/signs/${sign}.svg`, false);
    req.send();
    return req.responseText.replace('{{UNIT}}', unit)
}

document.getElementById("btn").onclick = function () {
    // var newSvg = document.createElement('svg');
    var childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(0, 0) scale(1 1)')
    childSvg.innerHTML = getSign('GrFü', 'B')
    outputSvg.appendChild(childSvg);
    childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(256, 0) scale(1 1)')
    childSvg.innerHTML = getSign('TrFü', 'N');
    outputSvg.appendChild(childSvg);
    // outputSvg.innerHTML = newSvg.innerHTML;
}