import { UUID } from "crypto";
import { Item } from "./Item";
import { Member } from "./Member";

export interface Bill {
    id: UUID;
    title: string;
    description: string | null;
    currency: string;
    totalAmount: number;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    items: Item[]
    members: Member[]
}
