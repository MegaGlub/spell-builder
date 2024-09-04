import { spellComponent } from "./spellComponent.js";
export class enhancementComponent extends spellComponent {
    constructor(name, flavor, enhancementDescription, image, primaryCost, secondaryCost, energyCost, statBlock, showStats) {
      super(name, "Enhancement", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, statBlock);
      this.enhancementDescription = enhancementDescription;
      this.statBlock = statBlock;
      this.showStats = showStats;
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
      var formattedEnhancementCell = this.statBlock[1] + ": " + this.getSign(this.statBlock[1]); //the first statBlock[1] should be the name of the key in the map (how?)
      if (this.statBlock["enhancementMultiplier"] != 1) { //honestly this whole thing is a nightmare, need to make another example component... later
        formattedEnhancementCell += " (" + this.statBlock["enhancementMultiplier"] + "x)"
      }
      this.enhancementCellElement.innerHTML = formattedEnhancementCell;
    }

    clone(){
      return new enhancementComponent(
          this.name,
          this.flavor,
          this.enhancementDescription,
          this.image,
          this.primaryCost,
          this.secondaryCost,
          this.energyCost,
          this.statBlock,
          this.showStats
      );
  }
  }