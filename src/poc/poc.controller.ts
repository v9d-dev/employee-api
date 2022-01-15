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
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ACGuard, UseRoles } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import * as mongoose from 'mongoose';

import { PocService } from './poc.service';
import { EmployeeService } from '../employee/employee.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOption } from '../helper/multerConfig';
//import { CsvParser } from 'nest-csv-parser';

// import * as fs from 'fs';
// import * as path from 'path';
// import * as csv from 'fast-csv';

const csvtojson = require('csvtojson');

@Controller('poc')
// @Injectable()
export class PocController {
  constructor(
    //private readonly csvParser: CsvParser,
    private readonly pocService: PocService,
    private readonly employeeService: EmployeeService,
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
    const poc = { _id, name };
    await this.employeeService.updateEmployeePoc(employeeId, poc);
    return { id: generatedId };
  }

  @Get('?')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'pocs',
  })
  async getAllPoc(@Query('filters') filters) {
    const filterData = !!filters ? JSON.parse(filters) : {};
    const poc = await this.pocService.getPocs(filterData);
    return poc;
  }

  @Get('employee/:id?')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'pocs',
  })
  async getEmployeePoc(
    @Query('filters') filters,
    @Param('id') employeeId: string,
  ) {
    const filterData = !!filters ? JSON.parse(filters) : {};
    const { poc } = await this.employeeService.getSingleEmployee(employeeId);
    return await this.pocService.getEmployeePoc(poc);
  }

  @Post('getdatabyfilter')
  @UseGuards(AuthGuard('local'))
  async getFilterdPocs(@Body('filter') filterData: object) {
    const result = await this.pocService.getFilterdPocs(filterData);
    return { result };
  }

  @Get(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource: 'pocs',
    action: 'read',
    possession: 'own',
  })
  getPoc(@Param('id') pocId: string) {
    return this.pocService.getSinglePoc(pocId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
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

  @Post('importpoc')
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(FilesInterceptor('file', null, multerOption))
  async uploadFile(@Res() res, @UploadedFile() file: Express.Multer.File) {
    try {
      if (res.statusCode === 201) {
        csvtojson()
          .fromFile('uploads/pocCsv.csv')
          .then(source => {
            let arrayToInsert = [];
            // Fetching the all data from each row
            for (var i = 0; i < source.length; i++) {
              var oneRow = {
                name: source[i]['name'],
                techStack: source[i]['techStack'],
                description: source[i]['description'],
                startDate: source[i]['startDate'],
                finishDate: source[i]['finishDate'],
                githubUrl: source[i]['githubUrl'],
                demoUrl: source[i]['demoUrl'],
                employeeId: source[i]['employeeId'],
              };
              arrayToInsert.push(oneRow);
            }

            return this.pocService
              .importPocData(arrayToInsert)
              .then(response => {
                return res.status(HttpStatus.OK).json({
                  success: true,
                  statusCode: HttpStatus.OK,
                });
              })
              .catch(error => {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                  success: false,
                  statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                });
              });

            //console.log({ returnData });
            //inserting into the table “employees”
            //  var collectionName = ‘employees’;
            //  var collection = dbConn.collection(collectionName);
            //  collection.insertMany(arrayToInsert, (err, result) => {
            //      if (err) console.log(err);
            //      if(result){
            //          console.log(“Import CSV into database successfully.”);
            //      }
            //  });
          });

        // fs.createReadStream(path.resolve('uploads/pocCsv.csv'))
        //   .pipe(csv.parse({ headers: true }))
        //   .on('error', error => console.error(error))
        //   .on('data', row => {
        //     dataArr.push(row);
        //     console.log({ row });
        //   })
        //   .on('end', (rowCount: number) =>
        //     console.log(`Parsed ${rowCount} rows`),
        //   );
        // console.log({ dataArr });
        // const stream = createReadStream('uploads/pocCsv.csv');
        // const entities = await this.csvParser.parse(stream, Entity);
        // console.log({ entities });
        // const stream = createReadStream('uploads/pocCsv.csv')
        //   .pipe(csv())
        //   .on('headers', headers => {
        //     console.log(`First header: ${headers[0]}`);
        //   });
        // console.log({
        //   file: '../../' + __dirname + '/some.csv',
        //   res: res.statusCode,
        // });
      }
    } catch (e) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }
  // async uploadFile(@Res() res, @UploadedFile() file) {
  //   //console.log({ file });
  //   return await res.status(HttpStatus.OK).json({
  //     success: true,
  //     data: file.path,
  //   });
  // }

  @Delete(':id')
  @UseGuards(AuthGuard('local'), ACGuard)
  @UseRoles({
    resource: 'pocs',
    action: 'delete',
    possession: 'any',
  })
  async removePoc(@Param('id') pocId: string) {
    await this.pocService.deletePoc(pocId);
    return null;
  }
}
