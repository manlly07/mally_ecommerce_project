// mongo.repository.ts
import { Model, Document, UpdateWriteOpResult } from 'mongoose';
import { BaseRepository } from './base.repository';

export class MongoRepository<T extends Document> extends BaseRepository<T> {
    constructor(private readonly model: Model<T>) {
        super();
    }

    async findAll(params?: {
        filter?: object;
        projection?: object;
    }): Promise<T[]> {
        const { filter, projection } = params || {};
        return this.model.find({ filter, projection }).exec();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async create(data: any): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save();
    }

    async createMany(data: any[]): Promise<T[]> {
        return this.model.insertMany(data);
    }

    async update(where: object, data: any): Promise<T | null> {
        return this.model.findOneAndUpdate(where, data, { new: true }).exec();
    }

    async updateMany(where: object, data: any): Promise<any> {
        return this.model.updateMany(where, data).exec();
    }

    async softDelete(where: object): Promise<T | null> {
        return this.model.findOneAndUpdate(where, { isDeleted: true }, { new: true }).exec();
    }
}
