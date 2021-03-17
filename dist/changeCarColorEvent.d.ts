export interface IChangeColorEvent {
    docType: string;
    carNumber: string;
    previousColor: string;
    newColor: string;
    transactionDate: Date;
}
export declare class ChangeColorEvent implements IChangeColorEvent {
    docType: string;
    carNumber: string;
    previousColor: string;
    newColor: string;
    transactionDate: Date;
    constructor(carNumber: string, previousColor: string, newColor: string, txDate: Date);
}
