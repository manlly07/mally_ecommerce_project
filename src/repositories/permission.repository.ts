import { permissions } from "@prisma/client";
import { PrismaRepository } from "./prisma.repository";

export class PermissionsRepository extends PrismaRepository<permissions> {
    constructor() {
        super('permissions');
    }

    async findByName(permission_name: string) {
        return await (await this.getModel() as any).findUnique({
            where: {
                permission_name,
            }
        });
    }
}   