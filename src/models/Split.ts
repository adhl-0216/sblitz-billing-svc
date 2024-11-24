import { UUID } from "crypto";
import { Member } from "./Member";

export class Split {
    id: UUID
    assignee: Member;
    value: number;

    constructor(assignee: Member, value: number) {
        this.assignee = assignee;
        this.value = value;
    }

}
