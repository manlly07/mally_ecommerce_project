import { users } from "@prisma/client";
import { PrismaRepository } from "./prisma.repository";

export class UserRepository extends PrismaRepository<users> {
    constructor() {
        super('users');
    }

    async findByEmail(user_email: string, where?: object) {
        return await (await this.getModel() as any).findUnique({
            where: {
                user_email: user_email,
                ...where
            },
        });
    }
}