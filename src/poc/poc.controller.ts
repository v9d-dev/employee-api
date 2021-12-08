import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { PocService } from './poc.service';

@Controller('poc')
export class PocController {
  constructor(private readonly pocService: PocService) {}

  @Post()
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
    return { id: generatedId };
  }

  @Get()
  async getAllPoc() {
    const poc = await this.pocService.getPocs();
    return poc;
  }

  @Get(':id')
  getPoc(@Param('id') pocId: string) {
    return this.pocService.getSinglePoc(pocId);
  }

  @Patch(':id')
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
  async removePoc(@Param('id') pocId: string) {
    await this.pocService.deletePoc(pocId);
    return null;
  }
}
