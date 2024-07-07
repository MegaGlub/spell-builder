import { spellComponent } from "./spellComponent.js";
export class triggerComponent extends spellComponent {
  constructor(name, flavor, triggerDescription, image, primaryCost, secondaryCost, energyCost, potencyModifier) {
    super(name, "Trigger", flavor, image, primaryCost, "Primary", secondaryCost, "Secondary", energyCost, potencyModifier);
    this.triggerDescription = triggerDescription;
  }

  clone() {
    return new triggerComponent(
      this.name,
      this.flavor,
      this.triggerDescription,
      this.image,
      this.primaryCost,
      this.secondaryCost,
      this.energyCost,
      this.potencyModifier
    );
  }
}