import { spellComponent } from "./spellComponent.js";
export class formComponent extends spellComponent {
    constructor(name, description, formDescription, image, primaryCost, secondaryCost, energyCost, potencyModifier, size) {
        super(name, "Form", description, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, potencyModifier);
        this.formDescription = formDescription;
        this.size = size;
        this.buildFormVisuals();
    }

    buildFormVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#relateElements();
        this.#fillInnerHTML();
    }
    #createEmptyElements() {
        this.sizeCellElement = document.createElement("td");
    }
    #assignElementClasses() {
        this.sizeCellElement.className = "componentStatCell";
    }
    #relateElements() {
        this.modifierRowElement.appendChild(this.sizeCellElement);
    }
    #fillInnerHTML() {
        this.sizeCellElement.innerHTML = "Size: " + this.size;
    }
}