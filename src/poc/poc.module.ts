import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PocController } from './poc.controller';
import { PocService } from './poc.service';
import { EmployeeModule } from '../employee/employee.module';

import { PocSchema } from './poc.model';

@Module({
  imports: [
    EmployeeModule,
    MongooseModule.forFeature([{ name: 'Poc', schema: PocSchema }])
  ],
  controllers: [PocController],
  providers: [PocService],
})
export class PocModule {}
