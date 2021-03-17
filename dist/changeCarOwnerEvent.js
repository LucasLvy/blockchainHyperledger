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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeOwnerEvent = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
let ChangeOwnerEvent = class ChangeOwnerEvent {
    constructor(carNumber, previousOwner, newOwner, txDate) {
        this.docType = 'changeOwnerEvent';
        this.carNumber = carNumber;
        this.previousOwner = previousOwner;
        this.newOwner = newOwner;
        this.transactionDate = txDate;
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeOwnerEvent.prototype, "docType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeOwnerEvent.prototype, "carNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeOwnerEvent.prototype, "previousOwner", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ChangeOwnerEvent.prototype, "newOwner", void 0);
ChangeOwnerEvent = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [String, String, String, Date])
], ChangeOwnerEvent);
exports.ChangeOwnerEvent = ChangeOwnerEvent;
//# sourceMappingURL=changeCarOwnerEvent.js.map