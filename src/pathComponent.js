import { spellComponent } from "./spellComponent.js";
export class pathComponent extends spellComponent {
    constructor(name, description, pathDescription, image, primaryCost, secondaryCost, energyCost, potencyModifier, range, lifetime) {
      super(name, "Path", description, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, potencyModifier);
      this.pathDescription = pathDescription;
      this.range = range;
      this.lifetime = lifetime;
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
      this.rangeCellElement.innerHTML = "Range: ~" + this.range;
      this.lifetimeCellElement.innerHTML = "Proj. Life: " + this.timeFormat(this.lifetime);
    }

    timeFormat(seconds) {
      if (seconds == 3600) {
        return "1 hour";
      }
      else if (seconds / 3600 > 1) {
        return this.roundTo2(seconds / 3600) + " hours";
      }
      else if (seconds == 60) {
        return "1 minute";
      }
      else if (seconds / 60 > 1) {
        return this.roundTo2(seconds / 60) + " minutes";
      }
      else if (seconds == 1) {
        return "1 second";
      } else {
        return seconds + " seconds";
      }
    }

    roundTo2(num) {
      return Math.round(num * 100) / 100;
    }
  }