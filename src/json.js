var fs = module.require('fs');
import { spellComponent } from "./spellComponent.js";
import { formComponent } from "./formComponent.js";
import { pathComponent } from "./pathComponent.js";
import { triggerComponent } from "./triggerComponent.js";
import { purposeComponent } from "./purposeComponent.js";
import { enhancementComponent } from "./enhancementComponent.js";
import { logText } from "./logging.js";

export async function readJSONDirectory(dirPath) {
    const freshComponents = [];
    const files = fs.readdirSync(dirPath);
    for (const file of files){
        logText("Found " + file + "...");
        const component = await fetchRawJSON(dirPath + "/" + file);
        // logText("Constructed " + component.name + "!");
        freshComponents.push(component);
    };
    return freshComponents;
}

async function fetchRawJSON(fileName) { //Thanks Josh194 for helping me with async!
    return fetch(fileName) //asynchronous bastard, ruining my perfectly synchronous code
        .then(response => response.json())
        .then(jsonResponse => {
            return convertJSONToSpellComponent(jsonResponse);
        });
}

function convertJSONToSpellComponent(json) {
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
        json.description,
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
        json.description,
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
        json.description,
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
        json.description,
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
        json.description,
        json.purposeDescription,
        json.image,
        json.costs.primary,
        json.types.primary,
        json.costs.secondary,
        json.types.secondary,
        json.costs.energy,
        json.purpose.target
    );
}

function createMiscComponentFromJSON(json) {
    return new spellComponent(
        json.name,
        json.type,
        json.description,
        json.image,
        json.costs.primary,
        json.vis.primary,
        json.costs.secondary,
        json.vis.secondary,
        json.costs.energy,
        json.potency
    );
}