import { UUID } from "crypto";
import { Member } from "./Member";

export interface Split {
    id: UUID
    assignee: Member;
    value: number;

}
