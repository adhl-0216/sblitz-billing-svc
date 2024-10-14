import { MemberDAO } from "../dao/MemberDAO";

export class Member {
    static async joinBill(userId: string, billId: string, displayName?: string, colorCode?: string): Promise<void> {
        if (!colorCode) {
            colorCode = Member.generateRandomColor();
        }

        if (!displayName) {
            // displayName = await IAMService.getDisplayName(userId); // Fetch display name from IAM service
            displayName = "noname"
        }

        await MemberDAO.create(userId, billId, colorCode, displayName);
    }

    static generateRandomColor(): string {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    }
}
