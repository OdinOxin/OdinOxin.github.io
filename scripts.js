usrInput = document.getElementById("usrInput")
outputTxt = document.getElementById("outputTxt")
outputSvg = document.getElementById("outputSvg")

document.getElementById("btn").onclick = function () {
    outputSvg.innerHTML = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="256" height="256">
        <defs>
            <clipPath id="person">
                <path d="M64,128 L128,64 L192,128 L128,192 Z" />
            </clipPath>
        </defs>
        <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="5" stroke="#FFFFFF" fill="#003399" />
        <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="12" stroke="#FFFFFF" fill="#003399" clip-path="url(#person)" />
        <rect x="64" y="64" width="128" height="24" fill="#FFFFFF" clip-path="url(#person)" />
        <ellipse cx="100" cy="44" rx="10" ry="10" fill="#000000" />
        <ellipse cx="156" cy="44" rx="10" ry="10" fill="#000000" />
        <path d="M64,128 L128,64 L192,128 L128,192 Z" stroke-width="2" stroke="#000000" fill="none" />
        <text x="128" y="128" style="font-family: 'Roboto Slab'; font-weight: bold; dominant-baseline: central; text-anchor: middle; font-size: 300%;" fill="#FFFFFF">{{UNIT}}</text>
    </svg>`
}