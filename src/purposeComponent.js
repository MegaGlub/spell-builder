import { logText } from "./logging.js";
import { spellComponent } from "./spellComponent.js";
export class purposeComponent extends spellComponent { //This feels incomplete, but I'm pretty sure it's done.
  constructor(name, flavor, purposeDescriptions, effects, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, targetType, invertible) {
    super(name, "Purpose", flavor, image, primaryCost, primaryType, secondaryCost, secondaryType, energyCost, 0);
    this.purposeDescriptions = purposeDescriptions;
    this.#formatEffects(effects);
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
    this.estimatedEffectsRowElement.innerHTML = "Estimated Effects: " + this.effects[1]; //Choose the mid effect, how to show voided effects?
    console.log(this.effects);
  }
  #formatEffects(jsonEffects) {
    console.log(jsonEffects);
    this.effects = [];
    for (let property in jsonEffects){ //loop through values in jsonEffects
      if (typeof jsonEffects[property] == "string"){ //if the value exists
        this.effects.push(jsonEffects[property]);
      }
    }
  }
}