import { UUID } from "crypto";
import { Item } from "./Item";
import { Member } from "./Member";

export class Bill {
    id: UUID;
    title: string;
    description: string | null;
    currency: string;
    total_amount: number;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
    items: Item[]
    members: Member[]
}
