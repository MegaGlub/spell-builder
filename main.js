import { logText, showLog } from "./src/logging.js";
import { readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";

//work on the wand box
//figure out how to make new wands
//how to fill wands
//build descriptions
//show errors with the wand
//bake some cookies (or json files)
//work on the martial arts
//add more spellComponents

logText("--Starting...");

logText("--Retrieving element IDs...");

const loadingScreen = document.getElementById("loadingScreen");
const mainMenuScreen = document.getElementById("mainMenuScreen");
const spellBox = document.getElementById("spellBox");
const mainMenuSpellsButton = document.getElementById("mainMenuSpellsButton");
const mainMenuMartialsButton = document.getElementById("mainMenuMartialsButton");
const modalBackground = document.getElementById("modalBackground");

const componentList = [];

logText("--Assigning buttons...");

assignClickableButtonByID("mainMenuSpellsButton", mainMenuSpellsButtonPress);
assignClickableButtonByID("mainMenuMartialsButton", mainMenuMartialsButtonPress);
assignClickableButtonByID("mainMenuButton", unhideMainMenu);
assignClickableButtonByID("logButton", showLog);
assignClickableButtonByID("modalBackground", hideModal);
assignClickableButtonByID("modalCloser", hideModal);

logText("--Fetching cookies...");

logText("--Trying to read spell components...");
await buildComponentsFromFiles();

logText("--Sorting spell components...");
quickSort(componentList);

logText("--Drawing spell components...");
drawAll(componentList);

logText("--Complete!");
finishLoading();

async function buildComponentsFromFiles() {
    const root = "data/components/";
    const leaves = ["enhancements", "forms", "misc", "paths", "purposes", "triggers"];
    for (const leaf of leaves) {
        logText("Exploring: " + root + leaf);
        const freshComponents = await readJSONDirectory(root + leaf);
        for (const component of freshComponents) {
            componentList.push(component);
        };
    };
}

function drawAll(components) {
    for (const component of components) {
        logText("Drawing " + component.name + "...");
        component.drawElement(spellBox);
    }
}

function assignClickableButtonByID(elementId, funct) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", funct);
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

function finishLoading() {
    loadingScreen.style.display = "none";
}

function hideModal() {
    modalBackground.style.display = "none";
}