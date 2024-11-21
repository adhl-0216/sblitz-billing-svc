import { ItemDAO } from "../dao/ItemDAO";
import { Split } from "./Split"

export class Item {
    name: string;
    description: string;
    price: number;
    quantity: number;

    static async addToBill(billId: string, item: Item) {
        return ItemDAO.create(billId, item)
    }

}
