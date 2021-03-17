export interface IChangeOwnerEvent {
    docType: string;
    carNumber: string;
    previousOwner: string;
    newOwner: string;
    transactionDate: Date;
}
export declare class ChangeOwnerEvent implements IChangeOwnerEvent {
    docType: string;
    carNumber: string;
    previousOwner: string;
    newOwner: string;
    transactionDate: Date;
    constructor(carNumber: string, previousOwner: string, newOwner: string, txDate: Date);
}
