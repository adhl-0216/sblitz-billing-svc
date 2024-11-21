export interface Bill {
    id: string;
    title: string;
    description: string | null;
    currency: string;
    total_amount: number;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
}
