import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { CertificationSchema } from './certification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Certification', schema: CertificationSchema },
    ]),
  ],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
