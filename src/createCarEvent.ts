/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Object, Property } from 'fabric-contract-api';

// use an interface to share the definition with client code
export interface ICreateCarEvent {
  batchId: string;
    weight: number;
    producerId: string;
    transactionDate: Date;
    docType: string;
}

@Object()
export class CreateCarEvent implements ICreateCarEvent {
  @Property()
  public batchId: string;

  @Property()
  public weight: number;

  @Property()
  public producerId: string;

  @Property()
  public transactionDate: Date; //date

  @Property()
  public docType: string;

  public constructor(batchId: string, weight: number, producerId: string, txDate: Date) {
  this.batchId = batchId;
  this.weight = weight;
  this.producerId = producerId;
  this.transactionDate = txDate;
  //this.certification = certification;
  this.docType = 'createBatchEvent';
  }

}
