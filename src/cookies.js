import { savedComponentNames, wandList } from "../main.js";
import { createArrayFromJSON, fetchRawJSON, saveJSONFile } from "./json.js";
import { logText } from "./logging.js";

export async function fetchCookies(){
    logText("Technically, these aren't cookies.\nDon't tell anyone that.");
    const cookieComponents = await fetchRawJSON("data/save/availableComponents.json", createArrayFromJSON);
    for (let componentName of cookieComponents){
        savedComponentNames.push(componentName);
    }
}

export async function saveCookies(){
    logText("--Saving...");
    const components = packageComponentsForSave();
    saveJSONFile("data/save/availableComponents.json", components, () => {logText("Components saved!")});
    for (let wand of wandList){
        wand.saveToFile();
    }
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