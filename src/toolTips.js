export function assignToolTip(toolTipButton) {
    toolTipButton.addEventListener('mousemove', function (event) {
        updateToolTipPosition(event, toolTipButton)
    }
    );
}

function updateToolTipPosition(mouseEvent, toolTipButton) {
    const toolTip = toolTipButton.getElementsByClassName("toolTip")[0];
    const clientX = mouseEvent.clientX;
    const clientY = mouseEvent.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const toolTipWidth = toolTip.offsetWidth;
    const toolTipHeight = toolTip.offsetHeight;

    if (clientX + toolTipWidth + 18 > windowWidth) {
        toolTip.style.left = (windowWidth - toolTipWidth) + "px";
    } else {
        toolTip.style.left = clientX + 18 + "px";
    }

    if (clientY + toolTipHeight + 12 > windowHeight) {
        toolTip.style.top = (windowHeight - toolTipHeight) + "px";
    } else {
        toolTip.style.top = clientY + 12 + "px";
    }
}