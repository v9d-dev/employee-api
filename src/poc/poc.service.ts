import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Poc } from './poc.model';

@Injectable()
export class PocService {
  constructor(@InjectModel('Poc') private readonly pocModel: Model<Poc>) {}


  stringToArray(data: string, regex: boolean = false) {
    const newData = !!data.length ? data.toUpperCase().split(',').map( ele => {
      const value = ele.trim();
      return regex ? new RegExp(value, 'i') : ele;
    }) : "";
    return newData
  }


  async insertPoc(
    name: string,
    techStack: string,
    desc: string,
    startDate: Date,
    finishDate: Date,
    githubUrl: string,
    demoUrl: string,
    employeeId: string,
  ) {
    const techArray = this.stringToArray(techStack);
    const newPoc = new this.pocModel({
      name,
      techStack: techArray,
      description: desc,
      startDate,
      finishDate,
      githubUrl,
      demoUrl,
      employeeId,
    });
    const result = await newPoc.save();
    return result.id as string;
  }

  async filterValue(filterData: object) {
    for (const [key, value] of Object.entries(filterData)) {
      if(value.length) {
        if(key === "techStack") {
          const techStack = this.stringToArray(value, true);
          filterData[key] = { $all: techStack };
          continue;
        }
        filterData[key] =  new RegExp(value, 'i');
      } else {
        delete filterData[key];
      }
    }
    return filterData;
  }

  async getPocs(filterData: object) {
    const filter = await this.filterValue(filterData);
    const poc = await this.pocModel.find(filter).exec();
    return poc.map(data => ({
      id: data.id,
      name: data.name,
      techStack: data.techStack,
      description: data.description,
      startDate: data.startDate,
      finishDate: data.finishDate,
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      employeeId: data.employeeId,
    }));
  }

  async getFilterdPocs(filterData: object) {
    const poc = await this.pocModel.find(filterData).exec();
    return poc.map(data => ({
      id: data.id,
      name: data.name,
      techStack: data.techStack,
      description: data.description,
      startDate: data.startDate,
      finishDate: data.finishDate,
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      employeeId: data.employeeId,
    }));
  }

  async getSinglePoc(pocId: string) {
    const poc = await this.findPoc(pocId);
    return {
      id: poc.id,
      name: poc.name,
      techStack: poc.techStack,
      description: poc.description,
      startDate: poc.startDate,
      finishDate: poc.finishDate,
      githubUrl: poc.githubUrl,
      demoUrl: poc.demoUrl,
      employeeId: poc.employeeId,
    };
  }

  async updatePoc(
    pocId: string,
    name: string,
    techStack: string,
    desc: string,
    startDate: Date,
    finishDate: Date,
    githubUrl: string,
    demoUrl: string,
    employeeId: string,
  ) {
    const updatedPoc = await this.findPoc(pocId);
    const techArray: [string] = this.stringToArray(techStack);
    if (name) {
      updatedPoc.name = name;
    }
    if (desc) {
      updatedPoc.description = desc;
    }
    if (techStack) {
      updatedPoc.techStack = techArray;
    }
    if (startDate) {
      updatedPoc.startDate = startDate;
    }
    if (finishDate) {
      updatedPoc.finishDate = finishDate;
    }
    if (githubUrl) {
      updatedPoc.githubUrl = githubUrl;
    }
    if (demoUrl) {
      updatedPoc.demoUrl = demoUrl;
    }
    if (employeeId) {
      updatedPoc.employeeId = employeeId;
    }

    updatedPoc.updatedAt = new Date(Date.now());

    updatedPoc.save();
    return updatedPoc;
  }

  async deletePoc(pocId: string) {
    const result = await this.pocModel.deleteOne({ _id: pocId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find poc.');
    }
  }

  private async findPoc(id: string): Promise<Poc> {
    let poc;
    try {
      poc = await this.pocModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find poc.');
    }
    if (!poc) {
      throw new NotFoundException('Could not find poc.');
    }
    return poc;
  }
}
