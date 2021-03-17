export interface IDeleteCarEvent {
    docType: string;
    carNumber: string;
    previousOwner: string;
    transactionDate: Date;
}
export declare class DeleteCarEvent implements IDeleteCarEvent {
    docType: string;
    carNumber: string;
    previousOwner: string;
    transactionDate: Date;
    constructor(carNumber: string, previousOwner: string, txDate: Date);
}
