import { user_tokens } from "@prisma/client";
import { PrismaRepository } from "./prisma.repository";

export class KeysRepository extends PrismaRepository<user_tokens> {
    constructor() {
        super('user_tokens');
    }

    async findFirst(where: Object) {
        console.log(where)
        return await (await this.getModel() as any).findFirst({
            ...where
        });
    }
}