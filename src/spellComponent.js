import {assignToolTip} from "./toolTips.js";
export class spellComponent {
    constructor(name, type, description, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, potencyModifier) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.image = image;
        this.primaryCost = primaryCost;
        this.primaryType = primaryType;
        this.secondaryCost = secondaryCost;
        this.secondaryType = secondaryType;
        this.energyCost = energyCost;
        this.potencyModifier = potencyModifier;

        this.buildComponentVisuals();
        assignToolTip(this.toolTipButtonElement);
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
        this.toolTipElement = document.createElement("div");
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellDescriptionElement = document.createElement("div");
        this.componentElement = document.createElement("span");
        this.imageElement = document.createElement("img");
        this.statTableElement = document.createElement("table");
        this.visRowElement = document.createElement("tr");
        this.primaryCellElement = document.createElement("td");
        this.secondaryCellElement = document.createElement("td");
        this.energyCellElement = document.createElement("td");
        this.modifierRowElement = document.createElement("tr");
        this.potencyCellElement = document.createElement("td");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.toolTipElement.className = "toolTip";
        this.spellTitleElement.className = "spellTitle";
        this.spellTypeElement.className = "spellType";
        this.spellDescriptionElement.className = "spellDescription";
        this.componentElement.className = "spellComponent";
        this.statTableElement.className = "componentStatTable";
        this.visRowElement.className = "componentStatRow";
        this.primaryCellElement.className = "componentStatCell";
        this.secondaryCellElement.className = "componentStatCell";
        this.energyCellElement.className = "componentStatCell";
        this.modifierRowElement.className = "componentStatRow";
        this.potencyCellElement.className = "componentStatCell";
    }

    #assignElementIds() {
        this.toolTipButtonElement.id = "spellComponent" + this.name;
    }

    #relateElements() {
        this.toolTipButtonElement.appendChild(this.componentElement);
        this.toolTipButtonElement.appendChild(this.toolTipElement);
        this.toolTipElement.appendChild(this.spellTitleElement);
        this.toolTipElement.appendChild(this.spellTypeElement);
        this.toolTipElement.appendChild(this.spellDescriptionElement);
        this.toolTipElement.appendChild(this.statTableElement);
        this.statTableElement.appendChild(this.visRowElement);
        this.visRowElement.appendChild(this.primaryCellElement);
        this.visRowElement.appendChild(this.secondaryCellElement);
        this.visRowElement.appendChild(this.energyCellElement);
        this.statTableElement.appendChild(this.modifierRowElement);
        this.modifierRowElement.appendChild(this.potencyCellElement);
        this.componentElement.appendChild(this.imageElement);
    }

    #assignImage() {
        this.imageElement.src = this.image;
    }

    fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellTypeElement.innerHTML = this.type;
        this.spellDescriptionElement.innerHTML = this.description;

        this.#fillStatTable();
    }

    #fillStatTable() {
        this.primaryCellElement.innerHTML = this.formattedDataCell(this.primaryCost, this.primaryType);
        this.secondaryCellElement.innerHTML = this.formattedDataCell(this.secondaryCost, this.secondaryType);
        this.energyCellElement.innerHTML = this.formattedDataCell(this.energyCost, "Energy");

        this.potencyCellElement.innerHTML = this.formattedDataCell(this.potencyModifier, "Potency");
    }

    #colorizeText() {
        this.spellTypeElement.style.color = this.getTypeColor();
    }

    drawElement(parentElement) {
        console.log("Drawn!");
        parentElement.appendChild(this.toolTipButtonElement);
    }

    assignToolTip(toolTipButton) {
        toolTipButton.addEventListener('mousemove', function (event) {
            updateToolTipPosition(event, toolTipButton)
        }
        );
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

    valueOf() {
        return this.primaryCost + this.secondaryCost + (2 * this.energyCost);
    }
}