export abstract class BaseRepository<T> {
    abstract findAll(where: any): Promise<T[]>;
    abstract findById(where: any): Promise<T | null>;
    abstract create(data: any): Promise<T>;
    abstract createMany(data: any): Promise<T>;
    abstract update(where: object | null, data: any): Promise<T>;
    abstract updateMany(where: object | null, data: any): Promise<T>;
    abstract softDelete(where: object | null, data: any): Promise<T>;
}
