import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserRoles } from '../auth/user-roles';

import { Employee } from './employee.model';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
  ) {}

  async insertEmployee(
    employeeNumber: string,
    fullName: string,
    previousDesignation: string,
    currentDesignation: string,
    dateOfJoining: Date,
    dateOfBirth: Date,
    mailId: string,
    mobileNumber: string,
    reportingManager: string,
    buHead: string,
    overallExperience: string,
    successiveExperience: string,
    earlierProject: string,
    currentProject: string,
    projectType: string,
    primaryKeySkill: string,
    secondaryKeySkill: string,
    roles: UserRoles,
    authID: string,
    // createdAt: Date,
    //updatedAt: Date,
  ) {
    const newEmployee = new this.employeeModel({
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
    });
    const result = await newEmployee.save();
    return result.id as string;
  }

  async getEmployees() {
    const employee = await this.employeeModel.find().exec();
    return employee.map(data => ({
      employeeNumber: data.employeeNumber,
      fullName: data.fullName,
      previousDesignation: data.previousDesignation,
      currentDesignation: data.currentDesignation,
      dateOfJoining: data.dateOfJoining,
      dateOfBirth: data.dateOfBirth,
      mailId: data.mailId,
      mobileNumber: data.mobileNumber,
      reportingManager: data.reportingManager,
      buHead: data.buHead,
      overallExperience: data.overallExperience,
      successiveExperience: data.successiveExperience,
      earlierProject: data.earlierProject,
      currentProject: data.currentProject,
      projectType: data.projectType,
      primaryKeySkill: data.primaryKeySkill,
      secondaryKeySkill: data.secondaryKeySkill,
      roles: data.roles,
      authID: data.authID,
    }));
  }

  async getSingleEmployee(employeeId: string) {
    const data = await this.findEmployee(employeeId);
    return data;
  }

  async updateEmployee(
    employeeId: string,
    employeeNumber: string,
    fullName: string,
    previousDesignation: string,
    currentDesignation: string,
    dateOfJoining: Date,
    dateOfBirth: Date,
    mailId: string,
    mobileNumber: string,
    reportingManager: string,
    buHead: string,
    overallExperience: string,
    successiveExperience: string,
    earlierProject: string,
    currentProject: string,
    projectType: string,
    primaryKeySkill: string,
    secondaryKeySkill: string,
    roles: {
      type: String,
       enum : ['BU_HEAD', 'HR', 'EMPLOYEE'],
    },
  ) {
    const updatedEmployee = await this.findEmployee(employeeId);
    if (employeeNumber) {
      updatedEmployee.employeeNumber = employeeNumber;
    }
    if (fullName) {
      updatedEmployee.fullName = fullName;
    }
    if (previousDesignation) {
      updatedEmployee.previousDesignation = previousDesignation;
    }
    if (currentDesignation) {
      updatedEmployee.currentDesignation = currentDesignation;
    }
    if (dateOfJoining) {
      updatedEmployee.dateOfJoining = dateOfJoining;
    }
    if (dateOfBirth) {
      updatedEmployee.dateOfBirth = dateOfBirth;
    }
    if (mailId) {
      updatedEmployee.mailId = mailId;
    }
    if (mobileNumber) {
      updatedEmployee.mobileNumber = mobileNumber;
    }
    if (reportingManager) {
      updatedEmployee.reportingManager = reportingManager;
    }
    if (buHead) {
      updatedEmployee.buHead = buHead;
    }
    if (overallExperience) {
      updatedEmployee.overallExperience = overallExperience;
    }
    if (successiveExperience) {
      updatedEmployee.successiveExperience = successiveExperience;
    }
    if (earlierProject) {
      updatedEmployee.earlierProject = earlierProject;
    }
    if (currentProject) {
      updatedEmployee.currentProject = currentProject;
    }
    if (projectType) {
      updatedEmployee.projectType = projectType;
    }
    if (primaryKeySkill) {
      updatedEmployee.primaryKeySkill = primaryKeySkill;
    }
    if (secondaryKeySkill) {
      updatedEmployee.secondaryKeySkill = secondaryKeySkill;
    }
    if (roles) {
      updatedEmployee.roles = roles;
    }

    updatedEmployee.updatedAt = new Date(Date.now());

    return updatedEmployee.save();
  }

  async deleteEmployee(employeeId: string) {
    const result = await this.employeeModel
      .deleteOne({ _id: employeeId })
      .exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find employee.');
    }
  }

  private async findEmployee(id: string): Promise<Employee> {
    let employee;
    try {
      employee = await this.employeeModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find employee.');
    }
    if (!employee) {
      throw new NotFoundException('Could not find employee.');
    }
    return employee;
  }

  async getEmployeeID(authID: string) {
    let employeeId = null; 
    await this.employeeModel.findOne({ "authID": authID }).then(employee => {
      employeeId = employee._id;
    }).catch(err => {
      throw new NotFoundException('Could not find employee.');
    })
    return employeeId;
  }

  async updateEmployeePoc(
    employeeId: string,
     poc: {
      _id: mongoose.Types.ObjectId,
      name: string
  },
  ) {
    const updatedEmployee = await this.findEmployee(employeeId);
    updatedEmployee.poc.push(poc);
  
    return updatedEmployee.save();
  }

  async updateEmployeeCertififation(
    employeeId: string,
    certification: {
      _id: mongoose.Types.ObjectId,
      name: string
    },
  ) {
    const updatedEmployee = await this.findEmployee(employeeId);
    updatedEmployee.certification.push(certification);
  
    return updatedEmployee.save();
  }
}
