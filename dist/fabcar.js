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
const fabric_contract_api_1 = require("fabric-contract-api");
const fabric_shim_1 = require("fabric-shim");
const createCarEvent_1 = require("./createCarEvent");
const timestamp_1 = require("./timestamp");
// import { Utils } from './utils';
let FabCar = class FabCar extends fabric_contract_api_1.Contract {
    createCar(ctx, batchId, weight, producerId) {
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
            // await Utils.checkForMaxCars(carNumber, clientCertId, cid, ctx); // this will throw if not ok
            if (!weight) {
                throw new Error(`The car ${batchId} cannot be created as the 'color' parameter is empty.`);
            }
            if (!producerId) {
                throw new Error(`The car ${batchId} cannot be created as the 'owner' parameter is empty.`);
            }
            const car = {
                batchId: batchId,
                weight,
                producerId,
                //date,
                docType: 'coton',
            };
            const buffer = Buffer.from(JSON.stringify(car));
            yield ctx.stub.putState(batchId, buffer);
            // emit an event to inform listeners that a car has been created
            const txDate = timestamp_1.TimestampMapper.toDate(ctx.stub.getTxTimestamp());
            const createCarEvent = new createCarEvent_1.CreateCarEvent(batchId, weight, producerId, txDate);
            ctx.stub.setEvent(createCarEvent.docType, Buffer.from(JSON.stringify(createCarEvent)));
            console.info('============= END : Create Car ===========');
        });
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Number, String]),
    __metadata("design:returntype", Promise)
], FabCar.prototype, "createCar", null);
FabCar = __decorate([
    fabric_contract_api_1.Info({ title: 'FabCar', description: 'FabCar Smart Contract' })
], FabCar);
exports.FabCar = FabCar;
//# sourceMappingURL=fabcar.js.map