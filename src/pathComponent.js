import { formatSize, timeFormat } from "./elementHelpers.js";
import { spellComponent } from "./spellComponent.js";
export class pathComponent extends spellComponent {
  constructor(name, flavor, pathDescription, image, costs, statBlock) {
    super(name, "Path", flavor, image, costs, statBlock);
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

  clone() {
    return new pathComponent(
      this.name,
      this.flavor,
      this.pathDescription,
      this.image,
      this.costs,
      this.statBlock
    );
  }
}