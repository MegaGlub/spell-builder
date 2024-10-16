import { logText } from "./logging.js";

export function assignToolTip(toolTipButton, elementDescription) {
    toolTipButton.addEventListener('mouseover', function () {
        updateToolTipContents(elementDescription);
    });
    toolTipButton.addEventListener('mousemove', function (event) {
        updateToolTipPosition(event);
    });
    toolTipButton.addEventListener('mouseout', clearToolTipContents);
}

const toolTip = document.getElementById("toolTip");

function updateToolTipPosition(mouseEvent) {
    const clientX = mouseEvent.clientX;
    const clientY = mouseEvent.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const toolTipWidth = toolTip.offsetWidth;
    const toolTipHeight = toolTip.offsetHeight;

    if (clientX + toolTipWidth + 18 > windowWidth) {
        toolTip.style.left = (windowWidth - (toolTipWidth)) + "px";
    } else {
        toolTip.style.left = (clientX) + 18 + "px";
    }

    if (clientY + toolTipHeight + 12 > windowHeight) {
        toolTip.style.top = (windowHeight - (toolTipHeight)) + "px";
    } else {
        toolTip.style.top = (clientY) + 12 + "px";
    }
}

function updateToolTipContents(description){
    toolTip.appendChild(description.cloneNode(true));
    toolTip.style.display = "block";
}

function clearToolTipContents(){
    toolTip.style.display = "none";
    while (toolTip.firstChild) { //clear old description
        toolTip.removeChild(toolTip.firstChild);
    }
}