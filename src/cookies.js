import { savedComponentNames, wandList } from "../main.js";
import { createArrayFromJSON, destroyFile, fetchRawJSON, formatFileName, saveJSONFile } from "./json.js";
import { logText } from "./logging.js";

export async function fetchCookies(){
    logText("\tTechnically, these aren't cookies.\n\tDon't tell anyone that.");
    const cookieComponents = await fetchRawJSON("data/save/availableComponents.json", createArrayFromJSON);
    for (let componentName of cookieComponents){
        savedComponentNames.push(componentName);
    }
}

export async function saveCookies(){
    logText("Saving...");
    const components = packageComponentsForSave();
    saveJSONFile("data/save/availableComponents.json", components, () => {logText("\tComponents saved!")});
    for (let wand of wandList){
        wand.saveToFile();
    }
}

export async function deleteWandCookie(wandName){
    const fileName = formatFileName(wandName);
    destroyFile("data/wands/" + fileName + ".json", () => {});
}

function packageComponentsForSave(){
    let result = "{ \n";
    result += "\t\"arr\" : [";
    for (let i = 0; i < savedComponentNames.length - 1; i++){
        result += "\n\t\t\"" + savedComponentNames[i] + "\",";
    }
    result += "\n\t\t\"" + savedComponentNames[savedComponentNames.length - 1] + "\"";
    result += "\n\t]\n}";
    return result;
}