import { logText, showLog } from "./logging.js";

const mainMenuScreen = document.getElementById("mainMenuScreen");
const mainMenuSpellsButton = document.getElementById("mainMenuSpellsButton");
const mainMenuMartialsButton = document.getElementById("mainMenuMartialsButton");
const modalBackground = document.getElementById("modalBackground");

export function assignClickableButtonByID(elementId, funct) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", funct);
}

export function assignDraggableElementByID(elementId){
    const element = document.getElementById(elementId);
    element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", elementId);
    });
}

export function assignDroppableAreaByElement(element, dragOverFunct, dropFunct) {
    console.log(element);
    element.addEventListener("dragover", (event) => {
        event.preventDefault;
        dragOverFunct;
    });
    element.addEventListener("drop", (event) => {
        event.preventDefault;
        dropFunct(event);
    });
}

export function assignStaticButtons() {
    assignClickableButtonByID("mainMenuSpellsButton", mainMenuSpellsButtonPress);
    assignClickableButtonByID("mainMenuMartialsButton", mainMenuMartialsButtonPress);
    assignClickableButtonByID("mainMenuButton", unhideMainMenu);
    assignClickableButtonByID("logButton", showLog);
    assignClickableButtonByID("modalBackground", hideModal);
    assignClickableButtonByID("modalCloser", hideModal);
}

function mainMenuSpellsButtonPress() {
    hideMainMenu();
}

function mainMenuMartialsButtonPress() {
    hideMainMenu();
}

function hideMainMenu() {
    mainMenuSpellsButton.disabled = true;
    mainMenuMartialsButton.disabled = true;
    mainMenuScreen.style.display = "none";
}

function unhideMainMenu() {
    mainMenuScreen.style.display = "flex";
    mainMenuSpellsButton.disabled = false;
    mainMenuMartialsButton.disabled = false;
}

function hideModal() {
    modalBackground.style.display = "none";
}