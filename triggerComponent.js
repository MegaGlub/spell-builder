import { spellComponent } from "./spellComponent.js";
export class triggerComponent extends spellComponent {
    constructor(name, description, triggerDescription, image, primaryCost, secondaryCost, energyCost, potencyModifier) {
      super(name, "Trigger", description, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, potencyModifier);
      this.triggerDescription = triggerDescription;
    }
  }