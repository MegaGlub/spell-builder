import { formatSize, getSign } from "./elementHelpers.js";
import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class martialAction {
    constructor(name, statBlock, editBlock, skillBlock) {
        this.name = name;
        this.statBlock = this.#discoverMap(statBlock);
        this.editBlock = this.#discoverMap(editBlock);
        this.skillBlock = this.#discoverMap(skillBlock);

        this.#buildActionVisuals();
    }

    #discoverMap(possibleMap) {
        if (possibleMap[Symbol.toStringTag] == "Map") {
            return possibleMap;
        } else {
            return new Map(Object.entries(possibleMap));
        }
    }

    #buildActionVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImages();
        this.#relateElements();
        this.#fillInnerHTML();
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
    }

    #fillInnerHTML() {
        this.titleElement.innerHTML = this.name;
        this.#fillStatTable();
    }

    #fillStatTable(){
        this.#generateDataCell(this.requirementElement, "Requirements", this.#formatStatList, this.getStat("requirements"));
        this.#generateDataCell(this.damageElement, "Damage", this.#formatBasicStat, this.getStat("damage"));
        this.#generateDataCell(this.toHitElement, "To-Hit", this.#formatBasicStat, this.getStat("toHit"));
        this.#generateDataCell(this.costElement, "Cost", this.#formatAP, this.getStat("cost"));
        this.#generateDataCell(this.rangeElement, "Range", this.#formatRange, this.getStat("range"));
        this.#generateDataCell(this.effectsElement, "Applied Effects", this.#formatStatList, this.getStat("effects"));
        this.#generateDataCell(this.notesElement, "Player Notes", this.#formatBasicStat, this.getStat("notes"));
    }

    #generateDataCell(element, label, formatFunct, rawData){
        this.descriptionElement.appendChild(element);
        const labelElement = document.createElement("div");
        labelElement.className = "actionStatLabel";
        labelElement.innerHTML = label;
        element.appendChild(labelElement);

        element.appendChild(formatFunct(rawData));
    }

    #formatStatList(statList) { // TODO: change to make a new element per line, then return a block of all those lines
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        let resultStr = "";
        for (const index in statList){
            resultStr += statList[index] + "\n";
        }
        resultStr = resultStr.trim();
        resultElement.innerHTML = resultStr;
        return resultElement;
    }

    #formatBasicStat(stat) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        resultElement.innerHTML = stat;
        return resultElement;
    }

    #formatAP(costs) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        let resultStr = "";
        for (let i = 0; i < costs["primary"]; i++){
            resultStr += "\u25c9";
        }
        for (let i = 0; i < costs["secondary"]; i++){
            resultStr += "\u25cb";
        }
        resultElement.innerHTML = resultStr;
        return resultElement;
    }

    #formatRange(stat) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        resultElement.innerHTML = formatSize(stat);
        return resultElement;
    }

    getStat(key){
        if (this.editBlock.has(key)){
            return this.editBlock.get(key);
        } if (this.statBlock.has(key)) {
            return this.statBlock.get(key);
        }
        return "-";
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.descriptionElement);
        this.addEventListeners();
    }

    addEventListeners(){
        logText("Event listeners not yet available.");
    }
}