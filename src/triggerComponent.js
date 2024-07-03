import { spellComponent } from "./spellComponent.js";
export class triggerComponent extends spellComponent {
    constructor(name, flavor, triggerDescription, image, primaryCost, secondaryCost, energyCost, potencyModifier) {
      super(name, "Trigger", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, potencyModifier);
      this.triggerDescription = triggerDescription;
    }
  }