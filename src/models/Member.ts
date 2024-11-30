import { UUID } from "crypto";

export interface Member {
    member_id: UUID
    name: string
    color_code: string
}
