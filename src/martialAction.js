import { projectPath } from "../main.js";
import { assignClickableButtonByElement, assignEditableTextByElement } from "./buttons.js";
import { clearChildren, filterStringForJSON, formatSize, getSign } from "./elementHelpers.js";
import { formatFileName, saveJSONFile } from "./json.js";
import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class martialAction {
    constructor(name, category, statBlock, editBlock, skillBlock) {
        this.name = name;
        this.category = category;
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
        this.descriptionElement.spellcheck = "false";
        this.#fillStatTable();
    }

    #fillStatTable() {
        this.#generateDataCell(this.requirementElement, "Requirements", this.#formatBasicStat, "requirements", this.assignBasicStatEditable.bind(this), "Required status, stance, or secondary costs to use this ability.");
        this.#generateDataCell(this.damageElement, "Damage", this.#formatBasicStat, "damage", this.assignBasicStatEditable.bind(this), "Formula for the Damage Roll of the attack.");
        this.#generateDataCell(this.toHitElement, "To-Hit", this.#formatBasicStat, "toHit", this.assignBasicStatEditable.bind(this), "Formula for the To-Hit Roll of the attack.");
        this.#generateDataCell(this.costElement, "Cost", this.#formatAP, "cost", this.assignCostStatEditable.bind(this), "Action point cost to use the attack.<br>(\u25c9: Primary, \u25cb: Secondary)");
        this.#generateDataCell(this.rangeElement, "Range", this.#formatRange, "range", this.assignBasicStatEditable.bind(this), "Range of the attack.<br>(Note that anything less than 3m will generally be considered adjacent only.)");
        this.#generateDataCell(this.effectsElement, "Applied Effects", this.#formatBasicStat, "effects", this.assignBasicStatEditable.bind(this), "Effects applied to yourself, enemies, or nearby allies on use.");
        this.#generateDataCell(this.notesElement, "Player Notes", this.#formatBasicStat, "notes", this.assignBasicStatEditable.bind(this), "Write notes for yourself on use-cases or clarifications.");
    }

    #generateDataCell(element, label, formatFunct, key, editFunct, toolTipText) {
        clearChildren(element);
        const rawData = this.getStat(key);
        this.descriptionElement.appendChild(element);
        const labelElement = document.createElement("div");
        labelElement.className = "actionStatLabel";
        labelElement.innerHTML = label;
        element.appendChild(labelElement);

        const valueElement = formatFunct(rawData);
        element.appendChild(valueElement);
        editFunct(valueElement, key);

        const toolTip = document.createElement("span");
        toolTip.innerHTML = toolTipText;
        assignToolTip(element, toolTip);
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
        for (let i = 0; i < costs["primary"]; i++) {
            resultStr += "\u25c9";
        }
        for (let i = 0; i < costs["secondary"]; i++) {
            resultStr += "\u25cb";
        }

        if (resultStr == "") {
            resultStr = "-";
        }

        resultElement.innerHTML = resultStr;
        return resultElement;
    }

    #formatRange(stat) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        if (typeof stat == "string") {
            resultElement.innerHTML = stat;
        } else {
            resultElement.innerHTML = formatSize(stat);
        }
        return resultElement;
    }

    assignBasicStatEditable(element, key) {
        const editFunct = this.#handleBasicStatEdit.bind(this);
        assignEditableTextByElement(element, () => {
            editFunct(element, key);
        });
    }

    #handleBasicStatEdit(element, statKey) {
        let newText = filterStringForJSON(element.innerHTML);
        if (newText == "") {
            newText = "-";
        }
        this.editBlock.set(statKey, newText);
        this.saveToFile();
    }

    assignCostStatEditable(element, key) {
        const plusPrimaryButton = document.createElement("img");
        const minusPrimaryButton = document.createElement("img");
        const plusSecondaryButton = document.createElement("img");
        const minusSecondaryButton = document.createElement("img");

        const buttons = [plusPrimaryButton, minusPrimaryButton, plusSecondaryButton, minusSecondaryButton];
        const params = [["primary", 1], ["primary", -1], ["secondary", 1], ["secondary", -1]];
        const images = ["plus-primary.png", "minus-primary.png", "plus-secondary.png", "minus-secondary.png"];
        const className = "actionCostButton";

        for (let i = 3; i >= 0; i--) {
            buttons[i].src = "images/ui/" + images[i];
            buttons[i].className = className;
            this.costElement.appendChild(buttons[i]);
            const funct = this.#handleCostPress.bind(this);
            assignClickableButtonByElement(buttons[i], () => { funct(params[i][0], params[i][1]) });
        }
    }

    #handleCostPress(stat, num) {
        const costs = { ...this.getStat("cost") }; //creates a shallow copy (to not fuck with this.statBlock)
        let newVal = costs[stat] + num;
        if (newVal > 2) {
            newVal = 2;
        } else if (newVal < 0) {
            newVal = 0;
        }
        costs[stat] = newVal;
        this.editBlock.set("cost", costs);

        this.costElement.replaceChild(
            this.#formatAP(this.getStat("cost")),
            this.costElement.childNodes[1] //the HTML content of costElement is in index 1;
        );
        this.saveToFile();
    }

    getStat(key) {
        if (this.editBlock.has(key)) {
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

    addEventListeners() {
        const revertToolTip = document.createElement("span");
        revertToolTip.innerHTML = "Revert edits to default.<br>(Does not revert notes)";
        assignToolTip(this.revertButtonElement, revertToolTip);
        assignClickableButtonByElement(this.revertButtonElement, this.#handleRevertPress.bind(this));
    }

    #handleRevertPress() {
        const previousNotes = this.editBlock.get("notes");
        this.editBlock = new Map();
        if (previousNotes){
            this.editBlock.set("notes", previousNotes);
        }
        this.saveToFile();
        this.#fillStatTable();
    }

    saveToFile() {
        let martialJSON = (
            "{\n\t\"type\": \"Martial\","
            + "\n\t\"category\": \"" + this.category + "\","
            + "\n\t\"name\": \"" + this.name + "\","
            + "\n\t\"statBlock\": " + this.#packageMapForSave(this.statBlock) + ","
            + "\n\t\"editBlock\": " + this.#packageMapForSave(this.editBlock) + ","
            + "\n\t\"skillBlock\": " + this.#packageMapForSave(this.skillBlock)
            + "\n}"
        );

        const fileName = formatFileName(this.name);
        saveJSONFile(projectPath + "data/weapons/" + this.category + "/" + fileName + ".json", martialJSON, () => { logText("\tMartial " + fileName + " saved!") });
    }

    #packageMapForSave(map) {
        let result = "{ ";
        for (const [key, value] of map.entries()) {
            if (typeof value == "string") {
                result += "\n\t\t\"" + key + "\": \"" + filterStringForJSON(value) + "\",";
            } else if (typeof value == "object") { //aka a map within a map, such as for cost
                result += "\n\t\t\"" + key + "\": {";
                for (const [key2, value2] of Object.entries(value)) { //double order key values
                    result += "\n\t\t\t\"" + key2 + "\": " + value2 + ",";
                }
                result = result.substring(0, result.length - 1); //comma trim
                result += "\n\t\t},";
            } else {
                result += "\n\t\t\"" + key + "\": " + value + ",";
            }
        }
        result = result.substring(0, result.length - 1); //trim final comma
        result += "\n\t}";
        return result;
    }
}