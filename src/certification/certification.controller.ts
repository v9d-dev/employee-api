import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';

import { ACGuard, UseRoles } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import * as mongoose from 'mongoose';

import { CertificationService } from './certification.service';
import { EmployeeService } from '../employee/employee.service';

@Controller('certification')
export class CertificationController {
  constructor(
    private readonly certificationService: CertificationService,
    private readonly employeeService: EmployeeService
    ) {}

  @Post()
  @UseGuards(AuthGuard('local'))
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
    const _id = new mongoose.Types.ObjectId(generatedId);
    const certification = { _id, name}
    await this.employeeService.updateEmployeeCertififation(employeeId, certification)
    return { id: generatedId };
  }

  @Get()
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession:  'any',
    action:  'read',
    resource:  'certifications'
  })
  async getAllCertification() {
    const certification = await this.certificationService.getCertifications();
    return certification;
  }

  @Get(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  getCertification(@Param('id') certId: string) {
    return this.certificationService.getSingleCertification(certId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
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
  @UseGuards(AuthGuard('local'), ACGuard)
  async removeCertification(@Param('id') certId: string) {
    await this.certificationService.deleteCertification(certId);
    return null;
  }
}
