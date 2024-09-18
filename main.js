import { logText } from "./src/logging.js";
import { createComponentFromJSON, createWandFromJSON, readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";
import { clearChildren, emptyArray } from "./src/elementHelpers.js";

//importing and exporting via hash
//select what to share via export

//dev "god" code for import

//lock button for wands
//"empowered" status effect switch for +potency (force highest strength?)
    //"weakened" status effect too
//make voidable components glow purple when hovering/holding the void spell (css dropshadow)

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

const completeComponentList = []; //all components, built from json
export const componentList = []; //just the components available to the user
export const savedComponentNames = []; //names from availableComponents.json, used to build componentList
export const wandList = []; //all wands, built from json. No such availability filtering.
export const encryption_key = "ballfish_wuz_here"; //doesn't need to be secure.
export const valid_crypto_sign = "valid_crypto"; //used to confirm that it worked.

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

logText("Tring to build wands...");
await buildWands();

logText("Drawing wands...");
const addWandButton = document.getElementById("wandAddButton");
const wandSelector = document.getElementById("wandSelector");
drawAll(wandList, wandSelector);
wandSelector.appendChild(addWandButton);


logText("Complete!");
finishLoading();

async function buildComponentsFromFiles() {
    const root = "data/components/";
    const leaves = [
        "branches", 
        "enhancements", 
        "forms", 
        "misc", 
        "paths", 
        "purposes", 
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
    const dir = "data/wands";
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