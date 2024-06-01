import { spellComponent } from "./spellComponent.js";
export class enhancementComponent extends spellComponent { //This feels incomplete, but I'm pretty sure it's done.
    constructor(name, description, purposeDescription, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, targetType){
        super(name, "Purpose", description, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, 0);
        this.purposeDescription = purposeDescription;
        this.targetType = targetType;
        this.buildEnhancementVisuals();
    }

    buildEnhancementVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#relateElements();
        this.#fillInnerHTML();
      }
      #createEmptyElements() {
        this.targetCellElement = document.createElement("td");
      }
      #assignElementClasses() {
        this.targetCellElement.className = "componentStatCell";
      }
      #relateElements() {
        this.modifierRowElement.appendChild(this.targetCellElement);
      }
      #fillInnerHTML() {
        this.targetCellElement.innerHTML = "Targets: " + this.targetType;
      }
}