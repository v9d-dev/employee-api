import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Certification } from './certification.model';

@Injectable()
export class CertificationService {
  constructor(
    @InjectModel('Certification')
    private readonly certificationModel: Model<Certification>,
  ) {}

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
    const newCertification = new this.certificationModel({
      name,
      techStack,
      complitionDate,
      expireDate,
      price,
      employeeId,
    });
    const result = await newCertification.save();
    return result.id as string;
  }

  async getCertifications() {
    const certifications = await this.certificationModel.find().exec();
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
    if (name) {
      updatedCertification.name = name;
    }
    if (techStack) {
      updatedCertification.techStack = techStack;
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
