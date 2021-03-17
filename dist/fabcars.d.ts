import { Context, Contract } from 'fabric-contract-api';
export declare class FabCar extends Contract {
    createCar(ctx: Context, carNumber: string, make: string, model: string, color: string, owner: string): Promise<void>;
}
