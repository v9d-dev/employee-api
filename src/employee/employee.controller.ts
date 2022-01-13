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
  Logger,
} from '@nestjs/common';
import { ACGuard, UseRoles, RolesBuilder } from 'nest-access-control';

import { UserRoles } from '../auth/user-roles';

import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AuthGuard('local'))
  async addEmployee(
    @Body('employeeNumber') employeeNumber: string,
    @Body('fullName') fullName: string,
    @Body('previousDesignation') previousDesignation: string,
    @Body('currentDesignation') currentDesignation: string,
    @Body('dateOfJoining') dateOfJoining: Date,
    @Body('dateOfBirth') dateOfBirth: Date,
    @Body('mailId') mailId: string,
    @Body('mobileNumber') mobileNumber: string,
    @Body('reportingManager') reportingManager: string,
    @Body('buHead') buHead: string,
    @Body('overallExperience') overallExperience: string,
    @Body('successiveExperience') successiveExperience: string,
    @Body('earlierProject') earlierProject: string,
    @Body('currentProject') currentProject: string,
    @Body('projectType') projectType: string,
    @Body('primaryKeySkill') primaryKeySkill: string,
    @Body('secondaryKeySkill') secondaryKeySkill: string,
    @Body('roles') roles: UserRoles,
    @Body('authID') authID: string,

    // @Body('createdAt') createdAt: Date,
    // @Body('updatedAt') updatedAt: Date,
  ) {
    const generatedId = await this.employeeService.insertEmployee(
      employeeNumber,
      fullName,
      previousDesignation,
      currentDesignation,
      dateOfJoining,
      dateOfBirth,
      mailId,
      mobileNumber,
      reportingManager,
      buHead,
      overallExperience,
      successiveExperience,
      earlierProject,
      currentProject,
      projectType,
      primaryKeySkill,
      secondaryKeySkill,
      roles,
      authID,
    );
    return { id: generatedId };
  }

  @Get('?')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'employees',
  })
  async getAllEmployee(
    @Query('filters') filters,
  ) {
    const filterData = !!filters ? JSON.parse(filters) : {}
    const employee = await this.employeeService.getEmployees(filterData);
    return employee;
  }

  @Post('getdatabyfilter')
  @UseGuards(AuthGuard('local'))
  async getFilterdEmp(@Body('filter') filterData: object) {
    const employeeData = await this.employeeService.getFilterdEmp(filterData);
    return { result: employeeData };
  }

  @Get('/:id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'employees',
  })
  getEmployee(@Param('id') employeeId: string) {
    return this.employeeService.getSingleEmployee(employeeId);
  }

  @Get('/auth/:id')
  async getEmployeeID(@Param('id') authID: string) {
    const employeeId = this.employeeService.getEmployeeID(authID);
    return employeeId;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('local'))
  async updateEmployee(
    @Param('id') employeeId: string,
    @Body('employeeNumber') employeeNumber: string,
    @Body('fullName') fullName: string,
    @Body('previousDesignation') previousDesignation: string,
    @Body('currentDesignation') currentDesignation: string,
    @Body('dateOfJoining') dateOfJoining: Date,
    @Body('dateOfBirth') dateOfBirth: Date,
    @Body('mailId') mailId: string,
    @Body('mobileNumber') mobileNumber: string,
    @Body('reportingManager') reportingManager: string,
    @Body('buHead') buHead: string,
    @Body('overallExperience') overallExperience: string,
    @Body('successiveExperience') successiveExperience: string,
    @Body('earlierProject') earlierProject: string,
    @Body('currentProject') currentProject: string,
    @Body('projectType') projectType: string,
    @Body('primaryKeySkill') primaryKeySkill: string,
    @Body('secondaryKeySkill') secondaryKeySkill: string,
    @Body('roles')
    roles: {
      type: String;
      enum: ['BU_HEAD', 'HR', 'EMPLOYEE'];
    },
  ) {
    const data = await this.employeeService.updateEmployee(
      employeeId,
      employeeNumber,
      fullName,
      previousDesignation,
      currentDesignation,
      dateOfJoining,
      dateOfBirth,
      mailId,
      mobileNumber,
      reportingManager,
      buHead,
      overallExperience,
      successiveExperience,
      earlierProject,
      currentProject,
      projectType,
      primaryKeySkill,
      secondaryKeySkill,
      roles,
    );
    return data;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'employees',
  })
  async removeEmployee(@Param('id') employeeId: string) {
    await this.employeeService.deleteEmployee(employeeId);
    return null;
  }
}
