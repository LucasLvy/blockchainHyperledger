"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabCar = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
const fabric_shim_1 = require("fabric-shim");
const createCarEvent_1 = require("./createCarEvent");
const timestamp_1 = require("./timestamp");
const utils_1 = require("./utils");
let FabCar = class FabCar extends fabric_contract_api_1.Contract {
    /*
      @Transaction(false)
      @Returns('boolean')
      public async carExists(ctx: Context, carNumber: string): Promise<boolean>
      {
    
        // make sure the carNumber is valid before trying to get it
        Utils.verifyCarKey(carNumber);
    
        const buffer = await ctx.stub.getState(carNumber);
        return (!!buffer && buffer.length > 0);
      }
    
      @Transaction()
      @Returns('Car')
      public async queryCar(ctx: Context, carNumber: string): Promise<Car>
      {
    
        const exists = await this.carExists(ctx, carNumber);
        if (!exists) {
          throw new Error(`The car ${carNumber} does not exist.`);
        }
    
        // Check for a transient option to control output. We allow:
        // [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
        let outputAll = false;
        const transientData = ctx.stub.getTransient();
        if (transientData.has('QueryOutput')) {
          const value = transientData.get('QueryOutput');
          if (value?.toString('utf8') === 'all') {
            outputAll = true;
          }
        }
    
        const buffer = await ctx.stub.getState(carNumber); // get the car from chaincode state
        const car = JSON.parse(buffer.toString()) as Car;
        if (!outputAll) {
          car.certOwner = undefined; // remove before returning to user
        }
        return car;
      }
    
      @Transaction()
      @Returns('object[]')
      public async queryByOwner(ctx: Context, carOwner: string): Promise<object[]>
      {
    
        // Check for transient options to control query and output. We allow:
        // [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
        let outputAll = false;
        const transientData = ctx.stub.getTransient();
        if (transientData.has('QueryOutput')) {
          const value = transientData.get('QueryOutput');
          if (value?.toString('utf8') === 'all') {
            outputAll = true;
          }
        }
    
        if (!carOwner) {
          throw new Error(`The query cannot be made as the 'carOwner' parameter is empty.`);
        }
    
        // construct the query we need
        const query = {
          selector: {
            docType: 'car',
            owner: carOwner,
          },
          use_index: [
            '_design/indexOwnerDoc',
            'indexOwner',
          ],
        };
    
        // console.log('****QUERY: ', query);
    
        // issue the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    
        // Now process the query results
        return await Utils.processQueryResults(outputAll, iterator);
      }
    
      @Transaction()
      @Returns('object[]')
      public async queryAllCars(ctx: Context): Promise<object[]>
      {
    
        // Check for transient options to control query and output. We allow:
        // 1: [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
        // 2: [ "QueryByOwner": "John" ] Return only those cars owned by "John" or "Max" or whoever
        // 3: [ "QueryByCreator": "true" | "fabric_user_xxxx" ] Returns only cars the caller (or another user) have created and have not transfered
        // 4: [ "QueryOutput": "all", "QueryByOwner": "John", "QueryByCreator": "true" ] Combinations of the above
        let outputAll = false;
        let iterator: Iterators.StateQueryIterator; // undefined
        const transientData = ctx.stub.getTransient();
        const optionsCount = transientData.size;
        if (optionsCount > 0) {
          // store the index and design doc to use
          let queryIndexName = '';
          let queryIndexDesignDocName = '';
    
          // Get output options
          if (transientData.has('QueryOutput')) {
            const value = transientData.get('QueryOutput');
            if (value?.toString('utf8') === 'all') {
              outputAll = true;
            }
    
            // set up the correct index to use in the search
            queryIndexName = 'indexDocType';
            queryIndexDesignDocName = '_design/indexDocTypeDoc';
          }
    
          const selector: any = {};
          // Process queryByOwner options
          if (transientData.has('QueryByOwner')) {
            let queryByOwner = '';
            const value = transientData.get('QueryByOwner');
            if (value) {
              queryByOwner = value.toString('utf8');
            }
    
            // set up the correct index to use in the search
            queryIndexName = 'indexOwner';
            queryIndexDesignDocName = '_design/indexOwnerDoc';
    
            // set up the correct selector to use in the search
            selector.owner = queryByOwner;
          }
    
          // Process query by Creator options
          // Note: if owner and certOwner are chosen it will work but will
          // slow down the search as we do not index for owner AND certOwner together
          if (transientData.has('QueryByCreator')) {
            const value = transientData.get('QueryByCreator');
            const creatorId = value?.toString('utf8');
    
            // get our ID to queryBy or use as a template
            const cid = new ClientIdentity(ctx.stub);
            const clientCertId = cid.getID();
    
            // true means use current callers ID
            let queryByCreatorId = '';
            if (creatorId === 'true') {
              queryByCreatorId = clientCertId;
            } else if (creatorId?.startsWith('x509::/')) {
              // explicit string used, use this verbatim
              queryByCreatorId = creatorId;
            } else {
              // Replace current caller CN with the provided one. This only works
              // for cars that are created under the using the same CA as the caller.
              queryByCreatorId = Utils.replaceCN(clientCertId, creatorId);
            }
    
            // set up the correct index to use in the search
            queryIndexName = 'indexCertOwner';
            queryIndexDesignDocName = '_design/indexCertOwnerDoc';
    
            // set up the correct selector to use in the search
            selector.certOwner = queryByCreatorId;
          }
    
          // construct the query
          selector.docType = 'car';
          const query = {
            selector,
            use_index: [
              queryIndexDesignDocName,
              queryIndexName,
            ],
          };
          // console.log('****QUERY: ', query);
    
          // finally issue the query
          iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    
        } else {
          // process a simple range query instead
          const startKey = 'CAR0';
          const endKey = 'CAR9999';
    
          // issue the query
          iterator = await ctx.stub.getStateByRange(startKey, endKey);
        }
    
        // Now process the query results
        return await Utils.processQueryResults(outputAll, iterator);
      }
    
      @Transaction()
      @Returns('object[]')
      public async findMyCars(ctx: Context): Promise<object[]>
      {
    
        // Check for transient options to control query and output. We allow:
        // [ "QueryOutput": "all" | "normal" (the default) ] Returns certOwner field in the output
        let outputAll = false;
        const transientData = ctx.stub.getTransient();
        if (transientData.has('QueryOutput')) {
          const value = transientData.get('QueryOutput');
          if (value?.toString('utf8') === 'all') {
            outputAll = true;
          }
        }
    
        // get our ID to stamp into the car
        const cid = new ClientIdentity(ctx.stub);
        const clientCertId = cid.getID();
    
        // construct the query we need
        const query = {
          selector: {
            certOwner: clientCertId,
            docType: 'car',
          },
          use_index: [
            '_design/indexCertOwnerDoc',
            'indexCertOwner',
          ],
        };
    
        // console.log('****QUERY: ', query);
    
        // issue the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    
        // Now process the query results
        return await Utils.processQueryResults(outputAll, iterator);
      }*/
    createCar(ctx, carNumber, make, model, color, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Create Car ===========');
            // const exists = await this.carExists(ctx, carNumber);
            // if (exists) {
            //   throw new Error(`The car ${carNumber} already exists.`);
            // }
            // get our ID to stamp into the car
            const cid = new fabric_shim_1.ClientIdentity(ctx.stub);
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
            yield utils_1.Utils.checkForMaxCars(carNumber, clientCertId, cid, ctx); // this will throw if not ok
            if (!make) {
                throw new Error(`The car ${carNumber} cannot be created as the 'make' parameter is empty.`);
            }
            if (!model) {
                throw new Error(`The car ${carNumber} cannot be created as the 'model' parameter is empty.`);
            }
            if (!color) {
                throw new Error(`The car ${carNumber} cannot be created as the 'color' parameter is empty.`);
            }
            if (!owner) {
                throw new Error(`The car ${carNumber} cannot be created as the 'owner' parameter is empty.`);
            }
            const car = {
                certOwner: clientCertId,
                color,
                docType: 'car',
                make,
                model,
                owner,
            };
            const buffer = Buffer.from(JSON.stringify(car));
            yield ctx.stub.putState(carNumber, buffer);
            // emit an event to inform listeners that a car has been created
            const txDate = timestamp_1.TimestampMapper.toDate(ctx.stub.getTxTimestamp());
            const createCarEvent = new createCarEvent_1.CreateCarEvent(carNumber, owner, txDate);
            ctx.stub.setEvent(createCarEvent.docType, Buffer.from(JSON.stringify(createCarEvent)));
            console.info('============= END : Create Car ===========');
        });
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "createCar", null);
FabCar = __decorate([
    fabric_contract_api_1.Info({ title: 'FabCar', description: 'FabCar Smart Contract' })
], FabCar);
exports.FabCar = FabCar;
//# sourceMappingURL=fabcars.js.map