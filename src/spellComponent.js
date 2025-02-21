import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignDraggableElementByElement, assignMouseOverVFX } from "./buttons.js";
import { getSign } from "./elementHelpers.js";
import { voidMouseOut, voidMouseOver } from "./voidVFX.js";
export class spellComponent {
    constructor(name, type, flavor, image, costs, statBlock, locked) {
        this.name = name;
        this.type = type;
        this.flavor = flavor;
        this.image = image;
        this.costs = costs;
        this.locked = locked;

        this.#discoverStats(statBlock);
        this.#buildComponentVisuals();
    }

    #discoverStats(statBlock) {
        if (statBlock[Symbol.toStringTag] == "Map"){
            this.statBlock = statBlock;
        } else{
            this.statBlock = new Map(Object.entries(statBlock));
        }

        this.primaryType = "Primary";
        if (this.costs["primaryType"]) {
            this.primaryType = this.costs["primaryType"];
        }
        this.secondaryType = "Secondary";
        if (this.costs["secondaryType"]) {
            this.secondaryType = this.costs["secondaryType"];
        }
    }

    #buildComponentVisuals() {
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
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.componentElement = document.createElement("span");
        this.imageElement = document.createElement("img");
        this.lockIconElement = document.createElement("img");
        this.statTableElement = document.createElement("div");
        this.primaryCellElement = document.createElement("span");
        this.secondaryCellElement = document.createElement("span");
        this.energyCellElement = document.createElement("span");
        this.potencyCellElement = document.createElement("span");
        this.complexityCellElement = document.createElement("span");
    }

    #assignElementClasses() {
        this.spellTitleElement.className = "spellTitle";
        this.spellTypeElement.className = "spellType";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentElement.className = "spellComponent";
        this.lockIconElement.className = "spellLockIcon";
        this.statTableElement.className = "componentStatTable";
        this.primaryCellElement.className = "componentStatCell";
        this.secondaryCellElement.className = "componentStatCell";
        this.energyCellElement.className = "componentStatCell";
        this.potencyCellElement.className = "componentStatCell";
        this.complexityCellElement.className = "componentStatCell";
    }

    #assignElementIds() {
        this.componentElement.id = "spellComponent" + this.name;
    }

    #assignImages() {
        this.imageElement.src = this.image;
        this.lockIconElement.src = "images/ui/locked.png";
    }

    #relateElements() {
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellTypeElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.statTableElement);
        this.statTableElement.appendChild(this.primaryCellElement);
        this.statTableElement.appendChild(this.secondaryCellElement);
        this.statTableElement.appendChild(this.energyCellElement);
        this.statTableElement.appendChild(this.potencyCellElement);
        this.statTableElement.appendChild(this.complexityCellElement);
        this.componentElement.appendChild(this.imageElement);
        this.componentElement.appendChild(this.lockIconElement);
    }

    #fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellTypeElement.innerHTML = this.type;
        this.spellFlavorElement.innerHTML = this.flavor;

        this.#fillStatTable();
    }

    #fillStatTable() {
        this.primaryCellElement.innerHTML = this.formattedDataCell(this.costs["primary"], this.primaryType);
        this.secondaryCellElement.innerHTML = this.formattedDataCell(this.costs["secondary"], this.secondaryType);
        this.energyCellElement.innerHTML = this.formattedDataCell(this.costs["energy"], "Energy");
        this.potencyCellElement.innerHTML = this.formattedDataCell(this.statBlock.get("potency"), "Potency");
        this.complexityCellElement.innerHTML = this.formattedDataCell(this.statBlock.get("complexity"), "Complexity")
    }

    #colorizeText() {
        this.spellTypeElement.style.color = this.getTypeColor();
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.componentElement);
        if (this.locked){
            this.showLock();
        }
        this.addEventListeners(); //drag and drop doesn't like being applied to elements without parents
    }

    addEventListeners() {
        assignToolTip(this.componentElement, this.descriptionElement);
        if (!this.locked){
            // assignDraggableElementByID("spellComponent" + this.name);
            assignDraggableElementByElement(this.componentElement);
        }
        if (this.type == "Void"){
            assignMouseOverVFX(this.componentElement, voidMouseOver, voidMouseOut);
        }
    }

    formattedDataCell(num, descriptor) {
        if (num == undefined){
            num = 0;
        }
        if (this.type == "Void") {
            if (descriptor == "Energy") {
                return "Nullified " + descriptor;
            } else {
                return "Inverted " + descriptor;
            }
        } else {
            return getSign(num) + " " + descriptor;
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
            case "Branch":
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
            case "Trigger":
                return 500;
            case "Branch":
                return 600;
            default:
                return 700;
        }
    }

    showLock() {
        this.lockIconElement.style.display = "block";
        this.locked = true;
    }

    hideLock() {
        this.lockIconElement.style.display = "none";
        this.locked = false;
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

    clone() {
        return new spellComponent(
            this.name,
            this.type,
            this.flavor,
            this.image,
            this.costs,
            this.statBlock,
            this.locked
        );
    }
}