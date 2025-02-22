import { logText } from "./src/logging.js";
import { createComponentFromJSON, createWandFromJSON, createMartialFromJSON, readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";
import { clearChildren, emptyArray } from "./src/elementHelpers.js";
import { getRootDir } from "./src/fileMods.js";

//you could totally invert extrude if you weren't a pussy

//work on the martial arts
    //construct basic display screen
    //import skills via json

//add more spellComponents
//add more martials (those still need to be written down!!!!)
//css sweep for readability

//playtest
//bug hunt

logText("Starting...");

logText("Retrieving element IDs...");

export const completeComponentList = []; //all components, built from json
export const componentList = []; //just the components available to the user
export const martialList = [];
export const savedComponentNames = []; //names from availableComponents.json, used to build componentList
export const wandList = []; //all wands, built from json. No such availability filtering.
export const encryption_key = "ballfish_wuz_here"; //doesn't need to be secure.
export const valid_crypto_sign = "valid_crypto"; //used to confirm that it worked.
export let selectedWand; //mostly just used for vfx purposes, should use this to clean up the wand selection code later probably
export const projectPath = getRootDir();

logText("Assigning buttons...");
assignStaticButtons();

logText("Fetching cookies...");
await fetchCookies();

logText("Trying to read spell components...");
await buildComponentsFromFiles();
separateChaffComponents();

logText("Sorting spell components...");
quickSort(componentList);

logText("Drawing spell components...");
drawAll(componentList, document.getElementById("spellBox"));

logText("Trying to build wands...");
await buildWands();

logText("Drawing wands...");
const addWandButton = document.getElementById("wandAddButton");
const wandSelector = document.getElementById("wandSelector");
drawAll(wandList, wandSelector);
wandSelector.appendChild(addWandButton);

logText("Creating martial actions...");
await buildMartialsFromFiles();
drawAll(martialList, document.getElementById("martialBox"));

logText("Complete!");
finishLoading();

async function buildComponentsFromFiles() {
    const root = projectPath + "data/components/";
    const leaves = [
        "branches", 
        "enhancements", 
        "forms", 
        "misc", 
        "paths", 
        "purposes/design",
        "purposes/earth",
        "purposes/flesh",
        "purposes/flow",
        "purposes/heat",
        "purposes/nature", 
        "triggers"];
    for (const leaf of leaves) {
        logText("\tExploring: " + root + leaf);
        const freshComponents = await readJSONDirectory(root + leaf, createComponentFromJSON);
        for (const component of freshComponents) {
            completeComponentList.push(component);
        }
    }
}

export async function reloadComponents(){
    logText("Reloading components...");
    emptyArray(completeComponentList);
    await buildComponentsFromFiles();
    emptyArray(componentList);
    separateChaffComponents();
    quickSort(componentList);
    const spellBox = document.getElementById("spellBox");
    clearChildren(spellBox);
    drawAll(componentList, spellBox);
    logText("Rebuild complete!");
}

function separateChaffComponents(){
    for (const component of completeComponentList){
        if (savedComponentNames.includes(component.name)){
            componentList.push(component);
        }
    }
}

async function buildWands(){
    const dir = projectPath + "data/wands";
    logText("\tExploring: " + dir);
    const freshWands = await readJSONDirectory(dir, createWandFromJSON);
    for (const wand of freshWands) {
        wandList.push(wand);
    }
}

function drawAll(drawableElements, destination) {
    clearChildren(destination);
    for (const drawable of drawableElements) {
        // logText("\tDrawing " + drawable.name + ".");
        drawable.drawElement(destination);
    }
}

async function buildMartialsFromFiles() {
    const root = projectPath + "data/weapons/";
    const leaves = [
        "bows", 
        "clubs", 
        "daggers", 
        "firearms", 
        "greatblades", 
        "handaxes",
        "polearms",
        "shields",
        "shortswords",
        "spears",
        "unarmed", 
        "uncategorized"];
    for (const leaf of leaves) {
        logText("\tExploring: " + root + leaf);
        const freshMartials = await readJSONDirectory(root + leaf, createMartialFromJSON);
        for (const martialAction of freshMartials) {
            martialList.push(martialAction);
        }
    }
}

function finishLoading() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "none";
}

export function findComponentByName(name){
    let i = 0;
    for (let component of componentList){
        if (component.name == name){
            return i;
        }
        i++;
    }
    return -1; //return -1 if not in the list
}

export function setSelectedWand(wand){
    selectedWand = wand;
}