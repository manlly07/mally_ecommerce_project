import { roles } from "@prisma/client";
import { PrismaRepository } from "./prisma.repository";

export class RolesRepository extends PrismaRepository<roles> {
    constructor() {
        super('roles');
    }

    async findByName(role_name: string) {
        return await (await this.getModel() as any).findUnique({
            where: {
                role_name,
            }
        });
    }
}