import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { CertificationService } from './certification.service';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  async addCertification(
    @Body('name') name: string,
    @Body('techStack') techStack: string,
    @Body('complitionDate') complitionDate: Date,
    @Body('expireDate') expireDate: Date,
    @Body('price') price: string,
    @Body('employeeId') employeeId: string,
  ) {
    const generatedId = await this.certificationService.insertCertification(
      name,
      techStack,
      complitionDate,
      expireDate,
      price,
      employeeId,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllCertification() {
    const certification = await this.certificationService.getCertifications();
    return certification;
  }

  @Get(':id')
  getCertification(@Param('id') certId: string) {
    return this.certificationService.getSingleCertification(certId);
  }

  @Patch(':id')
  async updateCertification(
    @Param('id') certificationId: string,
    @Body('name') name: string,
    @Body('techStack') techStack: string,
    @Body('complitionDate') complitionDate: Date,
    @Body('expireDate') expireDate: Date,
    @Body('price') price: string,
    @Body('employeeId') employeeId: string,
  ) {
    await this.certificationService.updateCertification(
      certificationId,
      name,
      techStack,
      complitionDate,
      expireDate,
      price,
      employeeId,
    );
    return null;
  }

  @Delete(':id')
  async removeCertification(@Param('id') certId: string) {
    await this.certificationService.deleteCertification(certId);
    return null;
  }
}
