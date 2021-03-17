export declare class PreviousOwnersResult {
    previousOwnerCount: number;
    previousOwners?: string[];
    previousOwnershipChangeDates?: Date[];
    currentOwner: string;
    currentOwnershipChangeDate: Date;
    constructor(count: number, previousOwners: string[], previousOwnershipChangeDates: Date[], currentOwner: string, currentDate: Date);
}
