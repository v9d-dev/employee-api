import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Certification } from './certification.model';

@Injectable()
export class CertificationService {
  constructor(
    @InjectModel('Certification')
    private readonly certificationModel: Model<Certification>,
  ) {}

  stringToArray(data: string, regex: boolean = false) {
    const newData = !!data.length ? data.toUpperCase().split(',').map( ele => {
      const value = ele.trim();
      return regex ? new RegExp(value, 'i') : ele;
    }) : "";
    return newData
  }

  async insertCertification(
    name: string,
    techStack: string,
    complitionDate: Date,
    expireDate: Date,
    price: string,
    employeeId: string,
    // createdAt: Date,
    // updatedAt: Date,
  ) {
    const techArray = this.stringToArray(techStack);
    const newCertification = new this.certificationModel({
      name,
      techStack: techArray,
      complitionDate,
      expireDate,
      price,
      employeeId,
    });
    const result = await newCertification.save();
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

  async getCertifications(filterData: Object) {
    Logger.log("filterData=========", JSON.stringify(filterData));
    const filter = await this.filterValue(filterData);
    Logger.log("filter==============", JSON.stringify(filter));
    const certifications = await this.certificationModel.find(filter).exec();
    Logger.log("certifications==============", JSON.stringify(certifications));
    return certifications.map(data => ({
      id: data.id,
      name: data.name,
      techStack: data.techStack,
      complitionDate: data.complitionDate,
      expireDate: data.expireDate,
      price: data.price,
      employeeId: data.employeeId,
    }));
  }

  async getFilterdCertification(filterData) {
    const filter = !!filterData ? await this.filterValue(filterData) : {};
    const certifications = await this.certificationModel
      .find(filter)
      .exec();
    return certifications.map(data => ({
      id: data.id,
      name: data.name,
      techStack: data.techStack,
      complitionDate: data.complitionDate,
      expireDate: data.expireDate,
      price: data.price,
      employeeId: data.employeeId,
    }));
  }

  async getSingleCertification(certificationId: string) {
    const certification = await this.findCertification(certificationId);
    return {
      id: certification.id,
      name: certification.name,
      techStack: certification.techStack,
      complitionDate: certification.complitionDate,
      expireDate: certification.expireDate,
      price: certification.price,
      employeeId: certification.employeeId,
    };
  }

  async updateCertification(
    certificationId: string,
    name: string,
    techStack: string,
    complitionDate: Date,
    expireDate: Date,
    price: string,
    employeeId: string,
  ) {
    const updatedCertification = await this.findCertification(certificationId);
    const techArray: [string] = this.stringToArray(techStack);
    if (name) {
      updatedCertification.name = name;
    }
    if (techStack) {
      updatedCertification.techStack = techArray;
    }
    if (complitionDate) {
      updatedCertification.complitionDate = complitionDate;
    }
    if (expireDate) {
      updatedCertification.expireDate = expireDate;
    }
    if (price) {
      updatedCertification.price = price;
    }
    if (employeeId) {
      updatedCertification.employeeId = employeeId;
    }

    updatedCertification.updatedAt = new Date(Date.now());

    updatedCertification.save();
  }

  async deleteCertification(id: string) {
    const result = await this.certificationModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find certification.');
    }
  }

  private async findCertification(id: string): Promise<Certification> {
    let certification;
    try {
      certification = await this.certificationModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find certification.');
    }
    if (!certification) {
      throw new NotFoundException('Could not find certification.');
    }
    return certification;
  }
}
