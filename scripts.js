usrInput = document.getElementById("usrInput")
outputTxt = document.getElementById("outputTxt")
outputSvg = document.getElementById("outputSvg")

var getSign = function (sign) {
    var req = new XMLHttpRequest();
    req.open('GET', `/signs/${sign}.svg`, false);
    req.send();
    return req.responseText
}

document.getElementById("btn").onclick = function () {
    var newSvg = document.createElement('svg');
    var childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(0, 0) scale(1 1)')
    childSvg.innerHTML = `<defs>
        <clipPath id="person">
            <path d="M64,128 L128,64 L192,128 L128,192 Z" />
        </clipPath>
    </defs>
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="5" stroke="#FFFFFF" fill="#003399"></path>
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="12" stroke="#FFFFFF" fill="#003399" clip-path="url(#person)"></path>
    <rect x="64" y="64" width="128" height="24" fill="#FFFFFF" clip-path="url(#person)"></rect>
    <ellipse cx="100" cy="44" rx="10" ry="10" fill="#000000"></ellipse>
    <ellipse cx="156" cy="44" rx="10" ry="10" fill="#000000"></ellipse>
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="2" stroke="#000000" fill="none"></path>
    <text x="128" y="128" style="font-family: 'Roboto Slab'; font-weight: bold; dominant-baseline: central; text-anchor: middle; font-size: 300%;" fill="#FFFFFF">{{UNIT}}</text>`;
    newSvg.appendChild(childSvg);
    childSvg = document.createElement('g');
    childSvg.setAttribute('transform', 'translate(256, 0) scale(1 1)')
    childSvg.innerHTML = `<defs>
        <clipPath id="person">
            <path d="M64,128 L128,64 L192,128 L128,192 Z" />
        </clipPath>
    </defs>
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="5" stroke="#FFFFFF" fill="#003399" />
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="12" stroke="#FFFFFF" fill="#003399" clip-path="url(#person)" />
    <rect x="64" y="64" width="128" height="24" fill="#FFFFFF" clip-path="url(#person)" />
    <ellipse cx="128" cy="44" rx="10" ry="10" fill="#000000" />
    <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="2" stroke="#000000" fill="none" />
    <text x="128" y="128" style="font-family: 'Roboto Slab'; font-weight: bold; dominant-baseline: central; text-anchor: middle; font-size: 300%;" fill="#FFFFFF">{{UNIT}}</text>`;
    newSvg.appendChild(childSvg);
    outputSvg.innerHTML = newSvg.innerHTML
//     outputSvg.innerHTML = `<g transform="translate(0, 0) scale(1 1) ">
//     <defs>
//         <clipPath id="person">
//             <path d="M64,128 L128,64 L192,128 L128,192 Z" />
//         </clipPath>
//     </defs>
//     <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="5" stroke="#FFFFFF" fill="#003399" />
//     <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="12" stroke="#FFFFFF" fill="#003399" clip-path="url(#person)" />
//     <rect x="64" y="64" width="128" height="24" fill="#FFFFFF" clip-path="url(#person)" />
//     <ellipse cx="100" cy="44" rx="10" ry="10" fill="#000000" />
//     <ellipse cx="156" cy="44" rx="10" ry="10" fill="#000000" />
//     <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="2" stroke="#000000" fill="none" />
//     <text x="128" y="128" style="font-family: 'Roboto Slab'; font-weight: bold; dominant-baseline: central; text-anchor: middle; font-size: 300%;" fill="#FFFFFF">{{UNIT}}</text>
// </g>`
}