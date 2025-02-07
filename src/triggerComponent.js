import { spellComponent } from "./spellComponent.js";
export class triggerComponent extends spellComponent {
  constructor(name, flavor, triggerDescription, image, costs, statBlock, locked) {
    super(name, "Trigger", flavor, image, costs, statBlock, locked);
    this.triggerDescription = triggerDescription;
  }

  clone() {
    return new triggerComponent(
      this.name,
      this.flavor,
      this.triggerDescription,
      this.image,
      this.costs,
      this.statBlock,
      this.locked
    );
  }
}