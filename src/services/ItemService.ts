import { ItemDAO } from "@/dao/ItemDAO";

export class ItemService {
    private itemsDAO: ItemDAO;


    constructor(itemsDAO: ItemDAO) {
        this.itemsDAO = itemsDAO;
    }

    async addItems(items: any[], billId: string): Promise<void> {
        const parsedItems = items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            billId,
        }));

        // await this.itemsDAO.insertMany(parsedItems);
    }
}
