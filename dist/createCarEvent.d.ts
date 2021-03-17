export interface ICreateCarEvent {
    batchId: string;
    weight: number;
    producerId: string;
    transactionDate: Date;
    docType: string;
}
export declare class CreateCarEvent implements ICreateCarEvent {
    batchId: string;
    weight: number;
    producerId: string;
    transactionDate: Date;
    docType: string;
    constructor(batchId: string, weight: number, producerId: string, txDate: Date);
}
