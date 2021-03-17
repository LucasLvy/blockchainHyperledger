import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ClientIdentity, Iterators } from 'fabric-shim';
import { Car } from './car';
import { ChangeOwnerEvent } from './changeCarOwnerEvent';
import { ChangeColorEvent } from './changeCarColorEvent';
import { CreateCarEvent } from './createCarEvent';
import { DeleteCarEvent } from './deleteCarEvent';
import { PreviousOwnersResult } from './previousOwners';
import { TimestampMapper } from './timestamp';
// import { Utils } from './utils';

@Info({ title: 'FabCar', description: 'FabCar Smart Contract' })
export class FabCar extends Contract
{@Transaction()
    public async createCar(ctx: Context, batchId: string, weight:number, producerId: string)
    {
      console.info('============= START : Create Car ===========');
  
      // const exists = await this.carExists(ctx, carNumber);
      // if (exists) {
      //   throw new Error(`The car ${carNumber} already exists.`);
      // }
  
      // get our ID to stamp into the car
      const cid = new ClientIdentity(ctx.stub);
      const clientCertId = cid.getID();
  
      // Special case CAR10 as it's a reserved slot for IBM Org.
      // So are CAR0 - CAR9, but because initLedger created those cars, they will already exist...
      // if (carNumber === 'CAR10') {
      //   const msp = cid.getMSPID();
      //   if (msp !== 'IBMMSP') {
      //     const clientCN = Utils.extractCN(clientCertId);
      //     throw new Error(`The car ${carNumber} cannot be created. User ${clientCN} not authorised to create a car with reserved ID 'CAR10'. Try a different car number.`);
      //   }
      // }
  
      // Check to see if we have reached the limit on the total number of cars a single user can create or own
      // await Utils.checkForMaxCars(carNumber, clientCertId, cid, ctx); // this will throw if not ok
  
      
      
  
      if (!weight) {
        throw new Error(`The car ${batchId} cannot be created as the 'color' parameter is empty.`);
      }
  
      if (!producerId) {
        throw new Error(`The car ${batchId} cannot be created as the 'owner' parameter is empty.`);
      }
  
      const car: Car = {
            batchId,
            weight,
            producerId,
            //date,
            docType: 'coton',
      };
  
      const buffer = Buffer.from(JSON.stringify(car));
      await ctx.stub.putState(batchId, buffer);
  
      // emit an event to inform listeners that a car has been created
      const txDate = TimestampMapper.toDate(ctx.stub.getTxTimestamp());
      const createCarEvent = new CreateCarEvent(batchId, weight, producerId,txDate);
      ctx.stub.setEvent(createCarEvent.docType, Buffer.from(JSON.stringify(createCarEvent)));
  
      console.info('============= END : Create Car ===========');
    }
}