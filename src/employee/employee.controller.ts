import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
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
    @Body('roleId') roleId: string,

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
      roleId,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllEmployee() {
    const employee = await this.employeeService.getEmployees();
    return employee;
  }

  @Get(':id')
  getEmployee(@Param('id') employeeId: string) {
    return this.employeeService.getSingleEmployee(employeeId);
  }

  @Patch(':id')
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
    @Body('roleId') roleId: string,
    // @Body('employeeId') employeeId: string,
  ) {
    await this.employeeService.updateEmployee(
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
      roleId,
    );
    return null;
  }

  @Delete(':id')
  async removeEmployee(@Param('id') employeeId: string) {
    await this.employeeService.deleteEmployee(employeeId);
    return null;
  }
}
