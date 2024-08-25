import { savedComponentNames } from "../main.js";
import { createArrayFromJSON, fetchRawJSON } from "./json.js";
import { logText } from "./logging.js";

export async function fetchCookies(){
    logText("Technically, these aren't cookies.\nDon't tell anyone that.");
    const cookieComponents = await fetchRawJSON("data/save/availableComponents.json", createArrayFromJSON);
    for (let componentName of cookieComponents){
        savedComponentNames.push(componentName);
    }
}