import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class martialAction {
    constructor(name, requirements, statBlock, editBlock, skillBlock) {
        this.name = name;
        this.requirements = requirements;

        this.#discoverMap(this.statBlock, statBlock);
        this.#discoverMap(this.editBLock, editBlock);
        this.#discoverMap(this.skillBlock, skillBlock);
        this.#buildActionVisuals();
    }

    #discoverMap(holderVar, unformattedMap) {
        if (unformattedMap[Symbol.toStringTag] == "Map") {
            holderVar = unformattedMap;
        } else {
            holderVar = new Map(Object.entries(unformattedMap));
        }
    }

    #buildActionVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImages();
        this.#relateElements();
        this.#fillInnerHTML();
        this.#colorizeText();
    }

    #createEmptyElements() {
        this.descriptionElement = document.createElement("span");
        this.titleElement = document.createElement("div");
        this.requirementElement = document.createElement("div");
        this.damageElement = document.createElement("div");
        this.toHitElement = document.createElement("div");
        this.costElement = document.createElement("div");
        this.rangeElement = document.createElement("div");
        this.effectsElement = document.createElement("div");
        this.notesElement = document.createElement("div");
        this.revertButtonElement = document.createElement("img");
    }

    #assignElementClasses() {
        this.descriptionElement.className = "actionDescription";
        this.titleElement.className = "actionTitle";
        this.requirementElement.className = "actionStatRow";
        this.damageElement.className = "actionStatCell";
        this.toHitElement.className = "actionStatCell";
        this.costElement.className = "actionStatCell";
        this.rangeElement.className = "actionStatCell";
        this.effectsElement.className = "actionStatRow";
        this.notesElement.className = "actionStatRow";
        this.revertButtonElement.className = "actionRevertButton";
    }

    #assignElementIds() {
        this.descriptionElement.id = "martialAction" + this.name;
    }

    #assignImages() {
        this.revertButtonElement.src = "images/ui/revert.png"; //Placeholder, remember to replace
    }

    #relateElements() {
        this.descriptionElement.appendChild(this.titleElement);
        this.descriptionElement.appendChild(this.revertButtonElement);
        this.descriptionElement.appendChild(this.requirementElement);
        this.descriptionElement.appendChild(this.damageElement);
        this.descriptionElement.appendChild(this.toHitElement);
        this.descriptionElement.appendChild(this.costElement);
        this.descriptionElement.appendChild(this.rangeElement);
        this.descriptionElement.appendChild(this.effectsElement);
        this.descriptionElement.appendChild(this.notesElement);
    }

    #fillInnerHTML() {
        this.titleElement.innerHTML = this.name;
        this.#fillStatTable();
    }

    #fillStatTable(){

    }

    #colorizeText() {

    }
}