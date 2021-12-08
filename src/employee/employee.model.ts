import * as mongoose from 'mongoose';

export const EmployeeSchema = new mongoose.Schema({
  employeeNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  previousDesignation: { type: String, required: true },
  currentDesignation: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  dateOfBirth: { type: Date, required: true },
  mailId: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  reportingManager: { type: String, required: true },
  buHead: { type: String, required: true },
  overallExperience: { type: String, required: true },
  successiveExperience: { type: String, required: true },
  earlierProject: { type: String, required: true },
  currentProject: { type: String, required: true },
  projectType: { type: String, required: true },
  primaryKeySkill: { type: String, required: true },
  secondaryKeySkill: { type: String, required: true },
  roleId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface Employee extends mongoose.Document {
  employeeNumber: string;
  fullName: string;
  previousDesignation: string;
  currentDesignation: string;
  dateOfJoining: Date;
  dateOfBirth: Date;
  mailId: string;
  mobileNumber: string;
  reportingManager: string;
  buHead: string;
  overallExperience: string;
  successiveExperience: string;
  earlierProject: string;
  currentProject: string;
  projectType: string;
  primaryKeySkill: string;
  secondaryKeySkill: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}
