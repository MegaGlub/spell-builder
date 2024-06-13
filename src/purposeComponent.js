import { spellComponent } from "./spellComponent.js";
export class purposeComponent extends spellComponent { //This feels incomplete, but I'm pretty sure it's done.
    constructor(name, description, purposeDescriptions, effects, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, targetType, invertible){
        super(name, "Purpose", description, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, 0);
        this.purposeDescriptions = purposeDescriptions;
        this.effects = effects;
        this.targetType = targetType;
        this.invertible = invertible;
        this.buildPurposeVisuals();
    }

    buildPurposeVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#relateElements();
        this.#fillInnerHTML();
      }
      #createEmptyElements() {
        this.targetCellElement = document.createElement("span");
        this.estimatedEffectsRowElement = document.createElement("span");
      }
      #assignElementClasses() {
        this.targetCellElement.className = "componentStatCell";
        this.estimatedEffectsRowElement.className = "componentStatRow";
      }
      #relateElements() {
        this.statTableElement.appendChild(this.targetCellElement);
        this.statTableElement.appendChild(this.estimatedEffectsRowElement);
      }
      #fillInnerHTML() {
        this.#fillStatTable();
      }
      #fillStatTable() {
        this.targetCellElement.innerHTML = "Targets: " + this.targetType;
        this.estimatedEffectsRowElement = "Estimated Effects: " + this.effects[1];
      }
}