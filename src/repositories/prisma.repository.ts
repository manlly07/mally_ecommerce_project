import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from 'src/common/connection/init.mysql';
export class PrismaRepository<T> extends BaseRepository<T> {
  constructor(
    private model: Prisma.ModelName
  ) {
    super();
  }

  async getModel() {
    return prisma[this.model];
  }

  async findAll(params?: any): Promise<T [] | null> {
    
    return ( prisma[this.model] as any ).findMany(params);
  }

  async findById(params: {
    id: string,
    where?: object
  }): Promise<T | null> {
    console.log(params);
    const { id, where } = params;
    return await ( prisma[this.model] as any ).findUnique({
      where: {
        id,
        ...where,
      },
    });
  }

  async create(data: any): Promise<T> {
    return ( prisma[this.model] as any ).create({
      ...data,
    });
  }

  async update(params: {
    where: object;
    data: Object;
  }): Promise<T> {
    const { data, where } = params;

    return ( prisma[this.model] as any ).update({
      where,
      data,
    });
  }

  async updateMany(params: {
    where: object;
    data: Object;
  }): Promise<T> {
    const { data, where } = params;

    return ( prisma[this.model] as any ).updateMany({
      where,
      data,
    });
  }

  async softDelete(params: {
    where: object;
    data: Object;
  }): Promise<T> {
    const { data, where } = params;

    return ( prisma[this.model] as any ).update({
      where,
      data,
    });
  }
}
