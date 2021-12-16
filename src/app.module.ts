import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PocModule } from './poc/poc.module';
import { CertificationModule } from './certification/certification.module';
import { EmployeeModule } from './employee/employee.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './auth/user-roles';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PocModule,
    CertificationModule,
    EmployeeModule,
    MongooseModule.forRoot('mongodb://localhost:27017/employee-poc', {
      useNewUrlParser: true,
    }),
    AuthModule,
    AccessControlModule.forRoles(roles),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
