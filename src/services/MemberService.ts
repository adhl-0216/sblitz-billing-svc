import { MemberDAO } from "@/dao/MemberDAO";

export class MemberService {
    private membersDAO: MemberDAO;

    constructor(membersDAO: MemberDAO) {
        this.membersDAO = membersDAO;
    }

    async addMembers(members: any[], billId: string): Promise<void> {
        const parsedMembers = members.map(member => ({
            name: member.name,
            email: member.email,
            billId, // Associate with the bill
        }));

        // await this.membersDAO.insertMany(parsedMembers);
    }
}
