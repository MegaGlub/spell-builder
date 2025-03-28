import { clearChildren } from "./elementHelpers.js";
import { logText } from "./logging.js";

export function assignToolTip(hoverableElement, descriptionElement) {
    hoverableElement.addEventListener('mouseover', function () {
        hoverableElement.classList.add("toolTipHoveringHighlight");
        updateToolTipContents(descriptionElement);
    });
    hoverableElement.addEventListener('mousemove', function (event) {
        updateToolTipPosition(event);
    });
    hoverableElement.addEventListener('mouseout', function () {
        hoverableElement.classList.remove("toolTipHoveringHighlight");
        clearToolTipContents();
    });
}

const toolTip = document.getElementById("toolTip");

function updateToolTipPosition(mouseEvent) {
    const clientX = mouseEvent.clientX;
    const clientY = mouseEvent.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const toolTipWidth = toolTip.offsetWidth;
    const toolTipHeight = toolTip.offsetHeight;

    if (clientX + toolTipWidth + 18 >= windowWidth) {
        toolTip.style.left = (windowWidth - (toolTipWidth)) + "px";
    } else {
        toolTip.style.left = (clientX) + 18 + "px";
    }

    if (clientY + toolTipHeight + 18 >= windowHeight) {
        toolTip.style.top = (windowHeight - (toolTipHeight)) + "px";
    } else {
        toolTip.style.top = (clientY) + 18 + "px";
    }
}

function updateToolTipContents(description){
    clearChildren(toolTip);
    toolTip.appendChild(description.cloneNode(true));
    toolTip.style.display = "block";
}

function clearToolTipContents(){
    toolTip.style.display = "none";
    clearChildren(toolTip);
}