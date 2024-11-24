import { UUID } from "crypto";
import { Split } from "./Split";

export enum SplitType {
    "PERCENTAGE", "SHARES", "AMOUNT"
}

export class Item {
    id: UUID;
    name: string;
    price: number;
    quantity: number;
    splitType: SplitType
    splits: Split[]
}
