import { logText } from "./logging.js";
import { clearChildren, formatSize, getSign, timeFormat } from "./elementHelpers.js";
import { Dice, findDiceByString } from "./dice.js";

export class spellBlock {
    constructor(spellsByComponent, positionInWand, wandStatBlock, branchBox, textBox, statBox, errorBox) {
        this.spells = spellsByComponent;
        this.positionInWand = positionInWand;
        this.wandStatBlock = wandStatBlock;
        this.statBlock = new Map();

        this.branchBox = branchBox;
        this.textBox = textBox;
        this.statBox = statBox;
        this.errorBox = errorBox;

        this.voidComponent = this.#findComponentByType("Void");
        this.branchComponent = this.#findComponentByType("Branch");
        this.pathComponent = this.#findComponentByType("Path");
        this.enhancementComponents = this.#findAllComponentsByType("Enhancement");
        this.formComponent = this.#findComponentByType("Form");
        this.purposeComponents = this.#findAllComponentsByType("Purpose");
        this.triggerComponent = this.#findComponentByType("Trigger");
    }

    compileSpell() {
        this.statBox.style.display = "none";
        if (this.#errorTest()) {
            this.#addDescriptionText("Spell has one or more fatal errors and cannot be compiled!");
        } else {
            this.#discoverBasicStats();
            this.#discoverInversion();

            this.#fillPathText();
            this.#fillEnhancementText();
            this.#fillFormText();
            this.#fillPurposeText();
            this.#fillTriggerText();

            this.#generateStatTable();
        }
    }

    #discoverBasicStats() {
        this.#discoverEarlyStats();
        this.#discoverDamage();
        this.#discoverHealing();
        this.effects = "None!"; //effects are discovered in this.addPurposeToText() for convenience, maybe redo later
    }

    #discoverInversion() {
        this.inverted = false;
        if (this.voidComponent) {
            if (this.#areAllPurposesInvertible()) {
                this.inverted = true;
            } else {
                this.complexity++;
            }
        }
    }

    #discoverEarlyStats() {
        this.statBlock.set("potency", 0);
        this.statBlock.set("range", 0);
        this.statBlock.set("size", 0);
        this.statBlock.set("damageModifier", 0);
        this.statBlock.set("hitModifier", 0);
        this.statBlock.set("lifetime", 0);
        this.statBlock.set("primaryCost", 0);
        this.statBlock.set("secondaryCost", 0);
        this.statBlock.set("energyCost", 0);
        this.statBlock.set("projectileCount", 1);
        this.statBlock.set("hitSkill", "Uhoh, there's bugs in my code.");
        this.statBlock.set("complexity", 2);
        this.statBlock.set("healing", false);
        this.primaryTypes = [];
        this.secondaryTypes = [];
        this.targetTypes = [];
        this.primaryCost = 0;
        this.secondaryCost = 0;
        this.energyCost = 0;

        for (const statArr of this.wandStatBlock) {
            this.#mergeStat(statArr); //iterating over a map gives a [key, value] array
        }

        for (let component of this.spells) {
            for (const statArr of component.statBlock) {
                this.#mergeStat(statArr);
            }
            this.#mergeCosts(component);
            if (component.targetType) {
                this.targetTypes.push(component.targetType);
            }
        }

        if (this.spells.length > 7) {
            this.statBlock.set("complexity", parseInt(this.statBlock.get("complexity")) + 1);
        }
        if (parseInt(this.statBlock.get("complexity")) <= 0) { //just as error catching.
            this.statBlock.set("complexity", 1);
        }
    }

    #mergeStat(statArr) {
        const key = statArr[0];
        const val = statArr[1];

        if (this.statBlock.has(key)) {
            switch (typeof this.statBlock.get(key)){
                case "number":
                    this.statBlock.set(key, parseInt(val) + parseInt(this.statBlock.get(key)));
                    break;
                case "boolean":
                case "string":
                    this.statBlock.set(key, val);
                    break;
            }
        } else if (key.substring(key.length - 4) == "Mult" && this.statBlock.has(key.subString(key.length - 4))) {
            this.statBlock.set(key, parseInt(val) * parseInt(this.statBlock.get(key.subString(0, key.length - 4))));
        } else {
            logText("Warning: \"" + key + "\" is not a recognized spell block stat!");
        }
    }

    #mergeCosts(component) {
        this.primaryCost += component.costs["primary"];
        this.secondaryCost += component.costs["secondary"];
        this.energyCost += component.costs["energy"];
        if (component.primaryType != "Primary") {
            if (!this.primaryTypes.includes(component.primaryType)) {
                this.primaryTypes.push(component.primaryType);
            }
        }
        if (component.secondaryType != "Secondary") {
            if (!this.primaryTypes.includes(component.secondaryType) && !this.secondaryTypes.includes(component.secondaryType)) {
                this.secondaryTypes.push(component.secondaryType);
            }
        }
    }

    #discoverDamage() {
        this.statBlock.set("damageCount", 0);
        this.statBlock.set("damageDice", Dice.D0);
        for (let component of this.spells) {
            const newDmg = this.#getComponentDamageDice(component);
            if (newDmg.sides > this.statBlock.get("damageDice").sides) {
                this.statBlock.set("damageDice", newDmg);
            }
        }
        if (this.statBlock.get("damageDice") != Dice.D0) {
            for (let component of this.spells) {
                const newCnt = this.#getComponentDamageCount(component);
                const oldDmg = parseInt(this.statBlock.get("damageCount"));
                this.statBlock.set("damageCount", oldDmg + (newCnt * this.#getComponentDamageDice(component).sides / this.statBlock.get("damageDice").sides));
            }
        }
        this.statBlock.set("damageCount", Math.floor(this.statBlock.get("damageCount")));
        //damage modifier is found in the normal stat blocks.
    }

    #discoverHealing() {
        if (!this.statBlock.get("healing") && parseInt(this.statBlock.get("damageCount")) < 0) {
            this.statBlock.set("damageCount", 0);
        }
    }

    #getComponentDamageDice(component) {
        let result = "d0";
        if (component.statBlock.has("damageDice")) {
            if (component.type == "Purpose") {
                const potencyEnum = this.#getPurposeEnumFromPotency(component);
                result = component.statBlock.get("damageDice")[potencyEnum];
            } else {
                result = component.statBlock.get("damageDice");
            }
        }
        return findDiceByString(result);
    }

    #getComponentDamageCount(component) {
        let result = 0;
        if (component.statBlock.has("damageCount")) {
            if (component.type == "Purpose") {
                const potencyEnum = this.#getPurposeEnumFromPotency(component);
                result = component.statBlock.get("damageCount")[potencyEnum];
            } else {
                result = component.statBlock.get("damageCount");
            }
        }
        return result;
    }

    #getPurposeEnumFromPotency(purpose) {
        if (purpose.statBlock["invertible"] == true && this.inverted) {
            if (parseInt(this.statBlock["potency"]) <= -2) {
                return "invHigh";
            } else if (parseInt(this.statBlock["potency"]) <= 1) {
                return "invMid";
            } else {
                return "invLow";
            }
        } else {
            if (parseInt(this.statBlock["potency"]) >= 2) {
                return "high";
            } else if (parseInt(this.statBlock["potency"]) >= -1) {
                return "mid";
            } else {
                return "low";
            }
        }
    }

    #fillPathText() {
        this.#addDescriptionText(this.pathComponent.pathDescription, this.pathComponent.type);
    }

    #fillFormText() {
        if (this.projectileCount > 1) {
            this.#addDescriptionText(this.formComponent.formDescription["plural"], this.formComponent.type);
        } else {
            this.#addDescriptionText(this.formComponent.formDescription["singular"], this.formComponent.type);
        }
    }

    #fillEnhancementText() {
        if (this.enhancementComponents.length > 0) {
            for (let enhancement of this.enhancementComponents) {
                this.#addDescriptionText(enhancement.enhancementDescription, enhancement.type);
            }
        }
    }

    #fillPurposeText() {
        for (let i = 0; i < this.purposeComponents.length - 1; i++) {
            this.#addPurposeToText(this.purposeComponents[i]);
            this.#addDescriptionText(" and ");
        }
        this.#addPurposeToText(this.purposeComponents[this.purposeComponents.length - 1]);
        this.#addDescriptionText(". ");
    }

    #fillTriggerText() {
        if (this.triggerComponent) {
            this.#addDescriptionText(this.triggerComponent.triggerDescription, this.triggerComponent.type);
        }
    }

    #addPurposeToText(purpose) {
        const potencyEnum = this.#getPurposeEnumFromPotency(purpose);
        this.#addDescriptionText(purpose.purposeDescriptions[potencyEnum], purpose.type, purpose.costs["primaryType"]);
        this.#addNewEffect(purpose.statBlock.get("effects")[potencyEnum]);
    }

    #addDescriptionText(text, componentType, specifier) { //specifier is optional controlling the underlines, -1 when not in use
        const textElement = document.createElement("span");
        if (componentType) {
            textElement.style.color = this.#getDescriptionColor(componentType);
        }
        if (specifier) {
            const underlineColor = this.#getDescriptionUnderlineColor(specifier);
            textElement.style.textDecoration = "underline " + underlineColor;
        }
        textElement.innerHTML = text;
        //textElement.className = "";

        this.textBox.appendChild(textElement);
    }

    #getDescriptionColor(type) {
        switch (type) {
            case "Void":
                return "#8A2BE2";
            case "Form":
                return "#3CB371";
            case "Path":
                return "#DAA520";
            case "Purpose":
                return "#A0AECD";
            case "Enhancement":
                return "#6495ED";
            case "Refund":
                return "#BC8F8F";
            case "Trigger":
                return "#FA8072";
            default:
                return "#000000";
        }
    }

    #getDescriptionUnderlineColor(vis) {
        switch (vis) {
            case "Design":
                return "#DBA463";
            case "Nature":
                return "#3CB371";
            case "Eath":
                return "#5A4E44";
            case "Flesh":
                return "#E86A73";
            case "Heat":
                return "#B4202A";
            case "Flow":
                return "#588DBE";
            default:
                logText("Underline color for wand description failed, defaulting to black.");
                return "#000000";
        }
    }

    #addNewEffect(effect) {
        if (effect != "") {
            if (this.effects == "None!") {
                this.effects = "Apply " + effect;
            } else {
                this.effects += ", " + effect;
            }
        }
    }

    #generateStatTable() {
        clearChildren(this.statBox);
        this.statBox.style.display = "inline";
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#relateElements();
        this.#fillInnerHTML();
    }

    #createEmptyElements() {
        this.statTableElement = document.createElement("div");
        this.damageCellElement = document.createElement("span");
        this.hitCellElement = document.createElement("span");
        this.actionPointCellElement = document.createElement("span");
        this.effectsRowElement = document.createElement("span");
        this.rangeCellElement = document.createElement("span");
        this.sizeCellElement = document.createElement("span");
        this.lifetimeCellElement = document.createElement("span");
        this.costCellElements = [];
        for (let type of this.primaryTypes) {
            this.costCellElements.push(document.createElement("span"));
        }
        for (let type of this.secondaryTypes) {
            this.costCellElements.push(document.createElement("span"));
        }
        this.energyCostCellElement = document.createElement("span");
        this.targetRowElement = document.createElement("span");
    }

    #assignElementClasses() {
        this.statTableElement.className = "componentStatTable";
        this.damageCellElement.className = "componentStatCell";
        this.hitCellElement.className = "componentStatCell";
        this.actionPointCellElement.className = "componentStatCell";
        this.effectsRowElement.className = "componentStatRow";
        this.rangeCellElement.className = "componentStatCell";
        this.sizeCellElement.className = "componentStatCell";
        this.lifetimeCellElement.className = "componentStatCell";
        for (let costCellElement of this.costCellElements) {
            costCellElement.className = "componentStatCell";
        }
        this.energyCostCellElement.className = "componentStatCell";
        this.targetRowElement.className = "componentStatRow";
    }

    #assignElementIds() {
        //Nope!
    }

    #relateElements() {
        this.statBox.appendChild(this.statTableElement);
        this.statTableElement.appendChild(this.damageCellElement);
        this.statTableElement.appendChild(this.hitCellElement);
        this.statTableElement.appendChild(this.actionPointCellElement);
        this.statTableElement.appendChild(this.effectsRowElement);
        this.#skewZebraStripes(2);
        this.statTableElement.appendChild(this.rangeCellElement);
        this.statTableElement.appendChild(this.sizeCellElement);
        this.statTableElement.appendChild(this.lifetimeCellElement);
        let requiredSkew = 2;
        for (let costCellElement of this.costCellElements) {
            this.statTableElement.appendChild(costCellElement);
            requiredSkew--;
        }
        while (requiredSkew < 0) {
            requiredSkew += 3;
        }
        this.statTableElement.appendChild(this.energyCostCellElement);
        this.#skewZebraStripes(requiredSkew);
        this.statTableElement.appendChild(this.targetRowElement);
        this.#skewZebraStripes(2);
    }

    #skewZebraStripes(n) {
        for (let i = 0; i < n; i++) {
            const zebraSkewElement = document.createElement("span");
            zebraSkewElement.className = "componentStatCell";
            this.statTableElement.appendChild(zebraSkewElement);
            zebraSkewElement.style.display = "none";
        }
    }

    #fillInnerHTML() {
        this.damageCellElement.innerHTML = "Damage: " + this.#formatDamage(); //ex: 2d6 + 2
        this.hitCellElement.innerHTML = "To-Hit: " + this.statBlock.get("hitSkill") + " " + getSign(parseInt(this.statBlock.get("hitModifier")));
        this.actionPointCellElement.innerHTML = "AP cost: " + this.#formatAP();
        this.effectsRowElement.innerHTML = "Effects: " + this.effects;
        this.rangeCellElement.innerHTML = "Range: ~" + formatSize(parseInt(this.statBlock.get("range")));
        this.sizeCellElement.innerHTML = "Size: " + formatSize(parseInt(this.statBlock.get("size")));
        this.lifetimeCellElement.innerHTML = "Lifetime: " + timeFormat(parseInt(this.statBlock.get("lifetime")));
        let costIndex = 0;
        for (let type of this.primaryTypes) {
            this.costCellElements[costIndex].innerHTML = this.#formatCost("Primary", type);
            costIndex++;
        }
        for (let type of this.secondaryTypes) {
            this.costCellElements[costIndex].innerHTML = this.#formatCost("Secondary", type);
            costIndex++;
        }
        if (this.inverted) {
            this.energyCostCellElement.innerHTML = "Void: -1";
        } else {
            this.energyCostCellElement.innerHTML = "Energy: " + getSign(-this.energyCost);
        }
        if (this.branchBox) {
            this.branchBox.innerHTML = this.branchComponent.branchDescription;
        }
        this.targetRowElement.innerHTML = "Targets: " + this.#formatTargets();
    }

    #formatDamage() {
        if (this.statBlock.get("damageDice").val == 0) {
            return "-";
        }
        if (parseInt(this.statBlock.get("damageCount")) == 0) {
            if (parseInt(this.statBlock.get("damageModifier")) > 0) {
                return "" + this.statBlock.get("damageModifier");
            } else if (parseInt(this.statBlock.get("damageModifier")) < 0 && this.statBlock.get("healing")) {
                return "" + this.statBlock.get("damageModifier");
            } else {
                return "-";
            }
        }

        let result = "";
        result += this.statBlock.get("damageCount");
        result += this.statBlock.get("damageDice").val;
        if (parseInt(this.statBlock.get("damageModifier")) != 0) {
            result += " ";
            result += getSign(parseInt(this.statBlock.get("damageModifier")));
        }
        if (parseInt(this.statBlock.get("projectileCount")) != 1) {
            result = this.statBlock.get("projectileCount") + "x (" + result;
            result += ")";
        }
        return result;
    }

    #formatAP() {
        let remainingComplexity = parseInt(this.statBlock.get("complexity"));
        let primaryAP = 0;
        let secondaryAP = 0;
        let result = "";
        while (remainingComplexity > 0) {
            if (remainingComplexity >= 2 && primaryAP < 3) {
                primaryAP++;
                result = "\u25c9" + result;
                remainingComplexity -= 2;
            }
            if (remainingComplexity >= 1) {
                secondaryAP++;
                result += "\u25cb";
                remainingComplexity--;
            }
            if (secondaryAP == 2) {
                remainingComplexity = 0;
            }
        }
        return result;
    }

    #formatCost(costType, type) {
        switch (costType) {
            case "Primary":
                if (this.inverted) {
                    return type + ": " + getSign(this.primaryCost);
                } else {
                    return type + ": " + getSign(-this.primaryCost);
                }
            case "Secondary":
                if (this.inverted) {
                    return type + ": " + getSign(this.secondaryCost);
                } else {
                    return type + ": " + getSign(-this.secondaryCost);
                }
            default:
                logText("Table failed to get cost for costType: " + costType + " and type: " + type);
                return "Error!";
        }
    }

    #formatTargets() {
        let result = ""
        for (let i = 0; i < this.targetTypes.length - 1; i++) {
            result += this.targetTypes[i] + ", ";
        }
        result += this.targetTypes[this.targetTypes.length - 1];
        return result;
    }

    #errorTest() {
        clearChildren(this.errorBox);
        let fatalErrors = false;

        if (this.spells.length < 3) {
            this.#addError(true, "A spell block has less than 3 slots!")
            fatalErrors = true;
            return fatalErrors;
        }
        if (!this.pathComponent) {
            this.#addError(true, "A spell block requires a Path component!");
            fatalErrors = true;
        }
        if (!this.formComponent) {
            this.#addError(true, "A spell block requires a Form component!");
            fatalErrors = true;
        }
        if (this.purposeComponents.length == 0) {
            this.#addError(true, "A spell block requires at least one Purpose component!");
            fatalErrors = true;
        }
        if (!this.#areAllPurposesInvertible() && this.voidComponent && this.purposeComponents.length > 0) {
            this.#addError(false, "A spell block includes a \"Nothing\", but one or more of its Purposes are not invertible, cancelling the effect and increasing cast time.");
        }
        if (this.spells.length > 7) {
            this.#addError(false, "A spell block is quite long. This may result in goofy displays and high casting times.");
        }
        if (this.#findAllComponentsByType("Trigger").length > 1) {
            this.#addError(true, "A spell block may only contain up to one Trigger!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType("Path").length > 1) {
            this.#addError(true, "A spell block may only contain up to one Path!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType("Form").length > 1) {
            this.#addError(true, "A spell block may only contain up to one Form!");
            fatalErrors = true;
        }
        if (this.#areThereDuplicatesInList(this.purposeComponents)) {
            this.#addError(true, "A spell block may not contain two of the same Purpose!");
            fatalErrors = true;
        }
        if (this.#areThereDuplicatesInList(this.enhancementComponents)) {
            this.#addError(true, "A spell block may not contain two of the same Enhancement!");
            fatalErrors = true;
        }

        return fatalErrors;
    }

    #addError(fatal, text) {
        const error = document.createElement("div");
        const icon = document.createElement("img");
        const errorMsg = document.createElement("div");
        error.className = "modalFormError";
        icon.className = "errorIcon";
        errorMsg.className = "modalFormErrorMessage";
        if (fatal) {
            icon.src = "images/ui/red-error.png";
        } else {
            icon.src = "images/ui/yellow-error.png";
        }
        errorMsg.innerHTML = text;
        errorMsg.innerHTML += " (Block position: " + this.positionInWand + "-" + (this.positionInWand + this.spells.length - 1) + ")"
        error.appendChild(icon);
        error.appendChild(errorMsg);
        this.errorBox.appendChild(error);
    }

    #findComponentByType(type) {
        for (let component of this.spells) {
            if (component.type == type) {
                return component;
            }
        }
    }

    #findAllComponentsByType(type) {
        const result = [];
        for (let component of this.spells) {
            if (component.type == type) {
                result.push(component);
            }
        }
        return result;
    }

    #areAllPurposesInvertible() {
        let result = true;
        for (let purpose of this.purposeComponents) {
            if (!purpose.invertible) {
                result = false;
            }
        }
        return result;
    }

    #areThereDuplicatesInList(list) {
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                if (list[i].name == list[j].name) {
                    return true;
                }
            }
        }
        return false;
    }
}