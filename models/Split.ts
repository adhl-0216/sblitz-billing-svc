export class Split {
    id: string; // Unique identifier for the split
    billItemId: string; // The ID of the associated bill item
    assigneeId: string; // The ID of the user assigned to this split
    amount: number; // The amount assigned to the user

    constructor(id: string, billItemId: string, assigneeId: string, amount: number) {
        this.id = id;
        this.billItemId = billItemId;
        this.assigneeId = assigneeId;
        this.amount = amount;
    }

    // Additional methods or business logic for Split can be added here
}
