import { spellComponent } from "./src/spellComponent.js";
import { formComponent } from "./src/formComponent.js";
import { pathComponent } from "./src/pathComponent.js";
import { triggerComponent } from "./src/triggerComponent.js";
import { purposeComponent } from "./src/purposeComponent.js";
import { enhancementComponent } from "./src/enhancementComponent.js";
import { readJSONDirectory } from "./src/json.js";

const mainMenuScreen = document.getElementById("mainMenuScreen");
const spellBox = document.getElementById("spellBox");
var componentList = []; //Components should use componentList.push(constructor); when being made

//finish purposeComponent.js
//sort the componentList by some attribute (add configuration for it?)
//find somewhere to call spellComponent's drawElement()
//work on the wand box
//work on the martial arts

const mainMenuSpellsButton = document.getElementById("mainMenuSpellsButton");
const mainMenuMartialsButton = document.getElementById("mainMenuMartialsButton");

assignClickableButtonByID("mainMenuSpellsButton", mainMenuSpellsButtonPress);
assignClickableButtonByID("mainMenuMartialsButton", mainMenuMartialsButtonPress);
assignClickableButtonByID("mainMenuButton", unhideMainMenu);

buildComponentsFromFiles();

function buildComponentsFromFiles(){
    const root = "data/components/";
    const leaves = ["enhancements", "forms", "misc", "paths", "purposes", "triggers"];
    leaves.forEach(leaf => {
        console.log(root + leaf);
        readJSONDirectory(root + leaf);
    });
}

function assignClickableButtonByID(elementId, funct){
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