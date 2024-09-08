import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignDraggableElementByID } from "./buttons.js";
import { findDiceByString } from "./dice.js";
export class spellComponent {
    constructor(name, type, flavor, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, statBlock) {
        this.name = name;
        this.type = type;
        this.flavor = flavor;
        this.image = image;
        this.primaryCost = primaryCost;
        this.primaryType = primaryType;
        this.secondaryCost = secondaryCost;
        this.secondaryType = secondaryType;
        this.energyCost = energyCost;
        this.statBlock = statBlock;

        this.#discoverStats();
        this.buildComponentVisuals();
    }

    buildComponentVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
        this.fillInnerHTML();
        this.#colorizeText();
    }

    #createEmptyElements() {
        this.toolTipButtonElement = document.createElement("div");
        this.descriptionElement = document.createElement("span");
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.componentElement = document.createElement("span");
        this.imageElement = document.createElement("img");
        this.statTableElement = document.createElement("div");
        this.primaryCellElement = document.createElement("span");
        this.secondaryCellElement = document.createElement("span");
        this.energyCellElement = document.createElement("span");
        this.potencyCellElement = document.createElement("span");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.spellTitleElement.className = "spellTitle";
        this.spellTypeElement.className = "spellType";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentElement.className = "spellComponent";
        this.statTableElement.className = "componentStatTable";
        this.primaryCellElement.className = "componentStatCell";
        this.secondaryCellElement.className = "componentStatCell";
        this.energyCellElement.className = "componentStatCell";
        this.potencyCellElement.className = "componentStatCell";
    }

    #assignElementIds() {
        this.toolTipButtonElement.id = "spellComponent" + this.name;
    }

    #relateElements() {
        this.toolTipButtonElement.appendChild(this.componentElement);
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellTypeElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.statTableElement);
        this.statTableElement.appendChild(this.primaryCellElement);
        this.statTableElement.appendChild(this.secondaryCellElement);
        this.statTableElement.appendChild(this.energyCellElement);
        this.statTableElement.appendChild(this.potencyCellElement);
        this.componentElement.appendChild(this.imageElement);
    }

    #assignImage() {
        this.imageElement.src = this.image;
    }

    fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellTypeElement.innerHTML = this.type;
        this.spellFlavorElement.innerHTML = this.flavor;

        this.#fillStatTable();
    }

    #fillStatTable() {
        this.primaryCellElement.innerHTML = this.formattedDataCell(this.primaryCost, this.primaryType);
        this.secondaryCellElement.innerHTML = this.formattedDataCell(this.secondaryCost, this.secondaryType);
        this.energyCellElement.innerHTML = this.formattedDataCell(this.energyCost, "Energy");
        this.potencyCellElement.innerHTML = this.formattedDataCell(this.potency, "Potency");
    }

    #discoverStats(){
        this.damageDice = findDiceByString(this.statBlock["damageDice"]);
        this.damageCount = this.statBlock["damageCount"];
        this.hitModifier = this.statBlock["hitModifier"];
        this.hitSkill = this.statBlock["hitSkill"];
        this.lifetime = this.statBlock["lifetime"];
        this.potency = this.statBlock["potency"];
        this.range = this.statBlock["range"];
        this.size = this.statBlock["size"];
    }

    #colorizeText() {
        this.spellTypeElement.style.color = this.getTypeColor();
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.toolTipButtonElement);
        this.addEventListeners(); //drag and drop doesn't like being applied to elements without parents
    }

    addEventListeners() {
        assignToolTip(this.toolTipButtonElement, this.descriptionElement);
        assignDraggableElementByID("spellComponent" + this.name);
    }

    formattedDataCell(num, descriptor) {
        if (this.type == "Void") {
            if (descriptor == "Energy") {
                return "Nullified " + descriptor;
            } else {
                return "Inverted " + descriptor;
            }
        } else {
            return this.getSign(num) + " " + descriptor;
        }
    }

    getSign(num) {
        if (num < 0) {
            return num; // negative numbers already have the "-" character
        } else {
            return "+" + num;
        }
    }

    getTypeColor() {
        switch (this.type) {
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
                return "#FFFFF0";
        }
    }

    getTypeValue() {
        switch (this.type) {
            case "Void":
                return 0;
            case "Form":
                return 100;
            case "Path":
                return 200;
            case "Purpose":
                return 300;
            case "Enhancement":
                return 400;
            case "Refund":
                return 500;
            case "Trigger":
                return 600;
            default:
                return 700;
        }
    }

    costOf() {
        return this.primaryCost + this.secondaryCost + (2 * this.energyCost);
    }

    compareTo(component) {
        var result = 0;

        if (this.getTypeValue() > component.getTypeValue()) {
            result += 100;
        } else if (this.getTypeValue() < component.getTypeValue()) {
            result -= 100;
        }

        if (this.costOf() > component.costOf()) {
            result += 10;
        } else if (this.costOf() < component.costOf()) {
            result -= 10;
        }

        if (this.name > component.name) {
            result += 1;
        } else if (this.name < component.name) {
            result -= 1;
        }

        return result;
    }

    clone(){
        return new spellComponent(
            this.name,
            this.type,
            this.flavor,
            this.image,
            this.primaryCost,
            this.primaryType,
            this.secondaryCost,
            this.secondaryType,
            this.energyCost,
            this.statBlock
        );
    }
}