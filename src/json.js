var fs = module.require('fs');
import { spellComponent } from "./spellComponent.js";
import { formComponent } from "./formComponent.js";
import { pathComponent } from "./pathComponent.js";
import { triggerComponent } from "./triggerComponent.js";
import { purposeComponent } from "./purposeComponent.js";
import { enhancementComponent } from "./enhancementComponent.js";
import { wand } from "./wand.js";
import { logText } from "./logging.js";

export async function readJSONDirectory(dirPath, processingFunct) {
    const result = [];
    const files = fs.readdirSync(dirPath);
    for (const file of files){
        logText("Found " + file + "...");
        result.push(await fetchRawJSON(dirPath + "/" + file, processingFunct));
    }
    return result;
}

export async function fetchRawJSON(fileName, processingFunct) { //Thanks Josh194 for helping me with async!
    return fetch(fileName) //asynchronous bastard, ruining my perfectly synchronous code
        .then(response => response.json())
        .then(jsonResponse => {
            return processingFunct(jsonResponse);
        });
}

export function createComponentFromJSON(json) {
    switch (json.type) {
        case "Form":
            return createFormComponentFromJSON(json);
        case "Path":
            return createPathComponentFromJSON(json);
        case "Trigger":
            return createTriggerComponentFromJSON(json);
        case "Enhancement":
            return createEnhancementComponentFromJSON(json);
        case "Purpose":
            return createPurposeComponentFromJSON(json);
        default:
            return createMiscComponentFromJSON(json);
    }
}

function createFormComponentFromJSON(json) {
    return new formComponent(
        json.name,
        json.flavor,
        json.formDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency,
        json.size
    );
}

function createPathComponentFromJSON(json) {
    return new pathComponent(
        json.name,
        json.flavor,
        json.pathDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency,
        json.range,
        json.lifetime
    );
}

function createTriggerComponentFromJSON(json) {
    return new triggerComponent(
        json.name,
        json.flavor,
        json.triggerDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency
    );
}

function createEnhancementComponentFromJSON(json) {
    return new enhancementComponent(
        json.name,
        json.flavor,
        json.enhancementDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.enhancement.type,
        json.enhancement.modifier,
        json.enhancement.multiplier,
        json.enhancement.showStats
    );
}

function createPurposeComponentFromJSON(json) {
    return new purposeComponent(
        json.name,
        json.flavor,
        json.purposeDescriptions,
        json.effects,
        json.image,
        json.costs.primary,
        json.types.primary,
        json.costs.secondary,
        json.types.secondary,
        json.costs.energy,
        json.purpose.target,
        json.purpose.invertible
    );
}

function createMiscComponentFromJSON(json) {
    return new spellComponent(
        json.name,
        json.type,
        json.flavor,
        json.image,
        json.costs.primary,
        json.vis.primary,
        json.costs.secondary,
        json.vis.secondary,
        json.costs.energy,
        json.potency
    );
}

export function createWandFromJSON(json){
    return new wand(
        json.name,
        json.flavor,
        json.image,
        json.slots
    );
}

export function createArrayFromJSON(json){
    return json.arr;
}

export async function saveJSONFile(fileName, stringJSON, returnCallback){
    fs.writeFile(fileName, stringJSON, {}, returnCallback);
}