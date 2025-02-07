import { formatSize } from "./elementHelpers.js";
import { spellComponent } from "./spellComponent.js";
export class formComponent extends spellComponent {
    constructor(name, flavor, formDescription, image, costs, statBlock, locked) {
        super(name, "Form", flavor, image, costs, statBlock, locked);
        this.formDescription = formDescription;
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
        this.sizeCellElement.innerHTML = "Size: " + formatSize(this.statBlock.get("size"));
    }

    clone() {
        return new formComponent(
            this.name,
            this.flavor,
            this.formDescription,
            this.image,
            this.costs,
            this.statBlock,
            this.locked
        );
    }
}