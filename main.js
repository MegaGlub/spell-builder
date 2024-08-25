import { logText } from "./src/logging.js";
import { createComponentFromJSON, createWandFromJSON, readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { wand } from "./src/wand.js";
import { assignClickableButtonByElement, assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";

//allow wands to be saved as json files
//allow spell components to be saved and loaded
    //let componentList fetch them all, then only draw the ones in the saved list??
        //or make a completeComponentList, then fill componentList with the saved ones. Then sort and draw componentList

//construct a stat block for complete spells

//make voidable components glow purple when hovering/holding the void spell (css dropshadow)

//bake some cookies (or json files)
//work on the martial arts
//add more spellComponents

logText("--Starting...");

logText("--Retrieving element IDs...");

const completeComponentList = [];
export const componentList = [];
const savedComponentNames = [];
export const wandList = [];

logText("--Assigning buttons...");
assignStaticButtons();

logText("--Fetching cookies...");
fetchCookies(savedComponentNames);

logText("--Trying to read spell components...");
await buildComponentsFromFiles();
separateChaffComponents();

logText("--Sorting spell components...");
quickSort(componentList);

logText("--Drawing spell components...");
drawAll(componentList, document.getElementById("spellBox"));

logText("--Tring to build wands...");
await buildWands();

logText("--Drawing wands...");
drawAll(wandList, document.getElementById("wandSelector"));

logText("--Complete!");
finishLoading();

async function buildComponentsFromFiles() {
    const root = "data/components/";
    const leaves = ["enhancements", 
        "forms", 
        "misc", 
        "paths", 
        "purposes", 
        "triggers"];
    for (const leaf of leaves) {
        logText("Exploring: " + root + leaf);
        const freshComponents = await readJSONDirectory(root + leaf, createComponentFromJSON);
        for (const component of freshComponents) {
            completeComponentList.push(component);
        }
    }
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
    logText("Exploring: " + dir);
    const freshWands = await readJSONDirectory(dir, createWandFromJSON);
    for (const wand of freshWands) {
        wandList.push(wand);
    }
}

function drawAll(drawableElements, destination) {
    for (const drawable of drawableElements) {
        logText("Drawing " + drawable.name + "...");
        drawable.drawElement(destination);
    }
}

function finishLoading() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "none";
}

export function findComponentByName(name){
    let i = 0;
    for (let component of completeComponentList){
        if (component.name == name){
            return i;
        }
        i++;
    }
    return -1; //return -1 if not in the list
}