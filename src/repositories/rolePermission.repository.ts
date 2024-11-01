import { role_permission } from "@prisma/client";
import { PrismaRepository } from "./prisma.repository";

export class RolePermissionRepository extends PrismaRepository<role_permission> {
    constructor() {
        super('role_permission');
    }
}