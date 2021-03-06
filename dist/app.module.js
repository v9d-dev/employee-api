"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const poc_module_1 = require("./poc/poc.module");
const certification_module_1 = require("./certification/certification.module");
const employee_module_1 = require("./employee/employee.module");
const nest_access_control_1 = require("nest-access-control");
const user_roles_1 = require("./auth/user-roles");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            poc_module_1.PocModule,
            certification_module_1.CertificationModule,
            employee_module_1.EmployeeModule,
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/employee-poc', {
                useNewUrlParser: true,
            }),
            auth_module_1.AuthModule,
            nest_access_control_1.AccessControlModule.forRoles(user_roles_1.roles),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map