import { logText, showLog } from "./logging.js";
import { createWandAddButton } from "./addNewWand.js";
import { createImportButton } from "./importing.js";

const mainMenuScreen = document.getElementById("mainMenuScreen");
const mainMenuSpellsButton = document.getElementById("mainMenuSpellsButton");
const mainMenuMartialsButton = document.getElementById("mainMenuMartialsButton");
const modalBackground = document.getElementById("modalBackground");

export function assignClickableButtonByID(elementId, funct) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", (event) => {
        funct(event);
    });
}

export function assignClickableButtonByElement(element, funct) {
    element.addEventListener("click", (event) => {
        funct(event);
    });
}

export function assignDraggableElementByID(elementId){
    const element = document.getElementById(elementId);
    element.draggable = true;
    element.style.cursor = "grab";
    element.addEventListener("dragstart", (event) => {
        // event.dataTransfer.dropEffect = "move";
        // event.dataTransfer.effectAllowed = "move";
        // element.style.cursor = "grabbing";
        element.style.opacity = "0.5";
        event.dataTransfer.setData("text/plain", elementId);
    });
    element.addEventListener("dragend", () => {
        // element.style.cursor = "grab";
        element.style.opacity = "1.0";
    })
}

export function assignDroppableAreaByElement(element, dragOverFunct, dropFunct) {
    element.addEventListener("dragover", (event) => {
        event.preventDefault();
        dragOverFunct;
    });
    element.addEventListener("drop", (event) => {
        event.preventDefault();
        dropFunct(event);
    });
}

export function assignEditableTextByElement(element, funct){
    element.contentEditable = "plaintext-only";
    element.addEventListener("keyup", funct);
}

// export function assignFormSubmitButtonByElement(element, funct){
//     element.addEventListener("submit", (event) => {
//         event.preventDefault();
//         funct(event);
//     });
// }

export function assignStaticButtons() {
    assignClickableButtonByID("mainMenuSpellsButton", mainMenuSpellsButtonPress);
    assignClickableButtonByID("mainMenuMartialsButton", mainMenuMartialsButtonPress);
    assignClickableButtonByID("mainMenuButton", unhideMainMenu);
    assignClickableButtonByID("logButton", showLog);
    assignClickableButtonByElement(window, clickOutOfModal);
    assignClickableButtonByID("modalCloser", hideModal);
    
    createWandAddButton();
    createImportButton();
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

function clickOutOfModal(event) {
    if (event.target == modalBackground){
        hideModal();
    }
}

export function hideModal() {
    modalBackground.style.display = "none";
}