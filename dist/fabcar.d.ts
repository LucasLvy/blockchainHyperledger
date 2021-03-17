import { Context, Contract } from 'fabric-contract-api';
export declare class FabCar extends Contract {
    createCar(ctx: Context, batchId: string, weight: number, producerId: string): Promise<void>;
}
