import { spellComponent } from "./spellComponent.js";
export class branchComponent extends spellComponent {
    constructor(name, flavor, branchDescription, image, costs, statBlock) {
        super(name, "Branch", flavor, image, costs, statBlock);
        this.branchDescription = branchDescription;
    }

    clone() {
        return new branchComponent(
            this.name,
            this.flavor,
            this.branchDescription,
            this.image,
            this.costs,
            this.statBlock
        )
    }
}