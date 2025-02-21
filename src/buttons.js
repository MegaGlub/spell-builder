import { logText, showLog } from "./logging.js";
import { createWandAddButton } from "./addNewWand.js";
import { createImportButton } from "./importing.js";
import { createExportButton } from "./exporting.js";

const mainMenuScreen = document.getElementById("mainMenuScreen");
const mainMenuSpellsButton = document.getElementById("mainMenuSpellsButton");
const mainMenuMartialsButton = document.getElementById("mainMenuMartialsButton");
const spellScreen = document.getElementById("spellScreen");
const martialScreen = document.getElementById("martialScreen");
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

export function assignDraggableElementByElement(element){
    // const element = document.getElementById(elementID);
    element.draggable = true;
    element.style.cursor = "grab";
    element.addEventListener("dragstart", (event) => {
        // event.dataTransfer.dropEffect = "move";
        // event.dataTransfer.effectAllowed = "move";
        // element.style.cursor = "grabbing";
        element.style.opacity = "0.5";
        event.dataTransfer.setData("text/plain", element.id);
    });
    element.addEventListener("dragend", () => {
        // element.style.cursor = "grab";
        element.style.opacity = "1.0";
    });
}

export function assignDroppableAreaByElement(element, dragOverFunct, dropFunct) {
    const controller = new AbortController();
    element.addEventListener("dragover", (event) => {
        event.preventDefault();
        dragOverFunct;
    }, {signal: controller.signal});
    element.addEventListener("drop", (event) => {
        event.preventDefault();
        dropFunct(event);
    }, {signal: controller.signal});
    return controller;
}

export function assignEditableTextByElement(element, funct){
    element.contentEditable = "plaintext-only";
    element.addEventListener("keyup", funct);
}

export function assignMouseOverVFX(element, overFunct, outFunct){
    element.addEventListener("mouseover", (event) => {
        overFunct(event);
    });
    element.addEventListener("mouseout", (event) => {
        outFunct(event);
    });
}


export function assignStaticButtons() {
    assignClickableButtonByID("mainMenuSpellsButton", mainMenuSpellsButtonPress);
    assignClickableButtonByID("mainMenuMartialsButton", mainMenuMartialsButtonPress);
    assignClickableButtonByID("mainMenuButton", unhideMainMenu);
    assignClickableButtonByID("logButton", showLog);
    assignClickableButtonByElement(window, clickOutOfModal);
    assignClickableButtonByID("modalCloser", hideModal);
    
    createWandAddButton();
    createImportButton();
    createExportButton();
}

function mainMenuSpellsButtonPress() {
    martialScreen.style.display = "none";
    hideMainMenu();
}

function mainMenuMartialsButtonPress() {
    spellScreen.style.display = "none";
    hideMainMenu();
}

function hideMainMenu() {
    mainMenuSpellsButton.disabled = true;
    mainMenuMartialsButton.disabled = true;
    mainMenuScreen.style.display = "none";
}

function unhideMainMenu() {
    mainMenuScreen.style.display = "flex";
    spellScreen.style.display = "block";
    martialScreen.style.display = "block";
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