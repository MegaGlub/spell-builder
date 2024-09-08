import { formatSize, timeFormat } from "./elementHelpers.js";
import { spellComponent } from "./spellComponent.js";
export class pathComponent extends spellComponent {
    constructor(name, flavor, pathDescription, image, primaryCost, secondaryCost, energyCost, statBlock) {
      super(name, "Path", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, statBlock);
      this.pathDescription = pathDescription;
      this.statBlock = statBlock;
      this.buildPathVisuals();
    }

    buildPathVisuals() {
      this.#createEmptyElements();
      this.#assignElementClasses();
      this.#relateElements();
      this.#fillInnerHTML();
    }
    #createEmptyElements() {
      this.rangeCellElement = document.createElement("span");
      this.lifetimeCellElement = document.createElement("span");
    }
    #assignElementClasses() {
      this.rangeCellElement.className = "componentStatCell";
      this.lifetimeCellElement.className = "componentStatCell";
    }
    #relateElements() {
      this.statTableElement.appendChild(this.rangeCellElement);
      this.statTableElement.appendChild(this.lifetimeCellElement);
    }
    #fillInnerHTML() {
      this.rangeCellElement.innerHTML = "Range: ~" + formatSize(this.statBlock["range"]);
      this.lifetimeCellElement.innerHTML = "Proj. Life: " + timeFormat(this.statBlock["lifetime"]);
    }

    roundTo2(num) {
      return Math.round(num * 100) / 100;
    }

    clone(){
      return new pathComponent(
          this.name,
          this.flavor,
          this.pathDescription,
          this.image,
          this.primaryCost,
          this.secondaryCost,
          this.energyCost,
          this.statBlock
      );
  }
  }