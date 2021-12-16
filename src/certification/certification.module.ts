import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeSchema } from '../employee/employee.model';
import { CertificationSchema } from './certification.model';

@Module({
  imports: [
    EmployeeModule,
    MongooseModule.forFeature([
      { name: 'Certification', schema: CertificationSchema }    ]),
  ],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
