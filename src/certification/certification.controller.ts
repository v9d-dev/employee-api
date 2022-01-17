import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
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
    private readonly employeeService: EmployeeService,
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
    const certification = { _id, name };
    await this.employeeService.updateEmployeeCertififation(
      employeeId,
      certification,
    );
    return { id: generatedId };
  }

  @Get('?')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'certifications',
  })
  async getAllCertification(
    @Query('filters') filters,
  ) {
    const filterData = !!filters ? JSON.parse(filters) : {}
    const certification = await this.certificationService.getCertifications(filterData);
    return certification;
  }

  @Get('employee/:id?')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'pocs'
  })
  async getEmployeePoc(
    @Query('filters') filters,
    @Param('id') employeeId: string
  ) {
    const filterData = !!filters ? JSON.parse(filters) : {}
    const { certification } = await this.employeeService.getSingleEmployee(employeeId);
    return await this.certificationService.getEmployeeCertification(certification);
  }

  @Post('getdatabyfilter')
  @UseGuards(AuthGuard('local'))
  async getFilterdCertification(@Body('filter') filterData: object) {
    const result = await this.certificationService.getFilterdCertification(
      filterData,
    );
    return { result };
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
    const { employeeId } = await this.certificationService.getSingleCertification(certId);
    await this.employeeService.deleteEmployeeCertififation(employeeId, certId)
    await this.certificationService.deleteCertification(certId);
    return null;
  }
}
