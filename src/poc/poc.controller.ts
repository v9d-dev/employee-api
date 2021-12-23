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

import { PocService } from './poc.service';
import { EmployeeService } from '../employee/employee.service';

@Controller('poc')
export class PocController {
  constructor(
    private readonly pocService: PocService,
    private readonly employeeService: EmployeeService
  ) {}

  @Post()
  @UseGuards(AuthGuard('local'))
  async addPoc(
    @Body('name') name: string,
    @Body('techStack') techStack: string,
    @Body('description') description: string,
    @Body('startDate') startDate: Date,
    @Body('finishDate') finishDate: Date,
    @Body('githubUrl') githubUrl: string,
    @Body('demoUrl') demoUrl: string,
    @Body('employeeId') employeeId: string,
    // @Body('createdAt') createdAt: Date,
    // @Body('updatedAt') updatedAt: Date,
  ) {
    const generatedId = await this.pocService.insertPoc(
      name,
      techStack,
      description,
      startDate,
      finishDate,
      githubUrl,
      demoUrl,
      employeeId,
      // createdAt,
      // updatedAt,
    );
    const _id = new mongoose.Types.ObjectId(generatedId);
    const poc = { _id, name}
    await this.employeeService.updateEmployeePoc(employeeId, poc)
    return { id: generatedId };
  }

  @Get()
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource:  'pocs',
    action:  'read',
    possession:  'any',
  })
  async getAllPoc() {
    const poc = await this.pocService.getPocs();
    return poc;
  }

  @Get(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource:  'pocs',
    action:  'read',
    possession:  'own',
  })
  getPoc(@Param('id') pocId: string) {
    return this.pocService.getSinglePoc(pocId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource:  'pocs',
    action:  'update',
    possession:  'any',
  })
  async updatePoc(
    @Param('id') pocId: string,
    @Body('name') name: string,
    @Body('techStack') techStack: string,
    @Body('description') description: string,
    @Body('startDate') startDate: Date,
    @Body('finishDate') finishDate: Date,
    @Body('githubUrl') githubUrl: string,
    @Body('demoUrl') demoUrl: string,
    @Body('employeeId') employeeId: string,
  ) {
    const updateData = await this.pocService.updatePoc(
      pocId,
      name,
      techStack,
      description,
      startDate,
      finishDate,
      githubUrl,
      demoUrl,
      employeeId,
    );
    return updateData;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource:  'pocs',
    action:  'delete',
    possession:  'any',
  })
  async removePoc(@Param('id') pocId: string) {
    await this.pocService.deletePoc(pocId);
    return null;
  }
}
