import { spellComponent } from "./spellComponent.js";
export class formComponent extends spellComponent {
    constructor(name, flavor, formDescription, image, primaryCost, secondaryCost, energyCost, statBlock) {
        super(name, "Form", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, statBlock);
        this.formDescription = formDescription;
        this.statBlock = statBlock;
        this.buildFormVisuals();
    }

    buildFormVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#relateElements();
        this.#fillInnerHTML();
    }
    #createEmptyElements() {
        this.sizeCellElement = document.createElement("span");
    }
    #assignElementClasses() {
        this.sizeCellElement.className = "componentStatCell";
    }
    #relateElements() {
        this.statTableElement.appendChild(this.sizeCellElement);
    }
    #fillInnerHTML() {
        this.sizeCellElement.innerHTML = "Size: " + this.statBlock["size"];
    }

    clone(){
        return new formComponent(
            this.name,
            this.flavor,
            this.formDescription,
            this.image,
            this.primaryCost,
            this.secondaryCost,
            this.energyCost,
            this.statBlock
        );
    }
}