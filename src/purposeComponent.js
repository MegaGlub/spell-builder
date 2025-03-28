import { logText } from "./logging.js";
import { spellComponent } from "./spellComponent.js";
export class purposeComponent extends spellComponent {
  constructor(name, flavor, purposeDescriptions, image, costs, targetType, statBlock, locked) {
    super(name, "Purpose", flavor, image, costs, statBlock, locked);
    this.purposeDescriptions = purposeDescriptions;
    this.unformattedEffects = statBlock["effects"];
    this.#formatEffects(this.unformattedEffects);
    this.targetType = targetType;
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
    this.estimatedEffectsRowElement.innerHTML = "Estimated Effects: " + this.#formatEffectsForRealTho(this.statBlock.get("effects")["mid"]);
  }
  #formatEffects(jsonEffects) {
    this.effects = [];
    for (let property in jsonEffects) { //loop through values in jsonEffects
      if (typeof jsonEffects[property] == "string") { //if the value exists
        this.effects.push(jsonEffects[property]);
      }
    }
  }
  #formatEffectsForRealTho(effect) {
    if (effect == "") {
      return "None!";
    } else {
      return "Apply " + effect;
    }
  }

  clone() {
    return new purposeComponent(
      this.name,
      this.flavor,
      this.purposeDescriptions,
      this.image,
      this.costs,
      this.targetType,
      this.statBlock,
      this.locked
    );
  }
}