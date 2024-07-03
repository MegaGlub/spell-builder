import { spellComponent } from "./spellComponent.js";
export class enhancementComponent extends spellComponent {
    constructor(name, flavor, enhancementDescription, image, primaryCost, secondaryCost, energyCost, enhancementType, enhancementModifier, enhancementMultiplier, showStats) {
      super(name, "Enhancement", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, 0);
      this.enhancementDescription = enhancementDescription;
      this.enhancementType = enhancementType;
      this.enhancementModifier = enhancementModifier;
      this.enhancementMultiplier = enhancementMultiplier;
      this.showStats = showStats
      if (this.showStats) {
        this.buildEnhancementVisuals();
      }
    }

    buildEnhancementVisuals() {
      this.#createEmptyElements();
      this.#assignElementClasses();
      this.#relateElements();
      this.#fillInnerHTML();
    }
    #createEmptyElements() {
      this.enhancementCellElement = document.createElement("span");
    }
    #assignElementClasses() {
      this.enhancementCellElement.className = "componentStatCell";
    }
    #relateElements() {
      this.statTableElement.appendChild(this.enhancementCellElement);
    }
    #fillInnerHTML() {
      var formattedEnhancementCell = this.enhancementType + ": " + this.getSign(this.enhancementModifier);
      if (this.enhancementMultiplier != 1) {
        formattedEnhancementCell += " (" + this.enhancementMultiplier + "x)"
      }
      this.enhancementCellElement.innerHTML = formattedEnhancementCell;
    }
  }