import { Iterators, ClientIdentity } from 'fabric-shim';
import { Context } from 'fabric-contract-api';
export declare class Utils {
    static verifyCarKey(carNumber: string): void;
    static extractCN(certId: string | undefined): string;
    static replaceCN(certId: string, newCN: string | undefined): string;
    static processQueryResults(outputAll: boolean, iterator: Iterators.StateQueryIterator): Promise<object[]>;
    static checkForMaxCars(carNumber: string, clientCertId: string, cid: ClientIdentity, ctx: Context, transferCheck?: boolean): Promise<boolean>;
}
