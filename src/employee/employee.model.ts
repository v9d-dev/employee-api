import * as mongoose from 'mongoose';
import { UserRoles } from '../auth/user-roles';

export const EmployeeSchema = new mongoose.Schema({
  employeeNumber: { type: String },
  fullName: { type: String, required: true },
  previousDesignation: { type: String },
  currentDesignation: { type: String },
  dateOfJoining: { type: Date },
  dateOfBirth: { type: Date },
  mailId: { type: String, required: true },
  mobileNumber: { type: String },
  reportingManager: { type: String },
  buHead: { type: String },
  overallExperience: { type: String },
  successiveExperience: { type: String },
  earlierProject: { type: String },
  currentProject: { type: String },
  projectType: { type: String },
  primaryKeySkill: { type: String },
  secondaryKeySkill: { type: String },
  roles: {
    type: String,
     enum : ['BU_HEAD', 'HR', 'EMPLOYEE'],
    default: UserRoles.EMPLOYEE
  },
  authID: { type: String, required: true },
  poc: [{
    _id: {
      type: mongoose.Types.ObjectId,
      ref: 'pocs'
    },
    name: { type: String }
  }],
  certification: [{
    _id: {
      type: mongoose.Types.ObjectId,
      ref: 'certifications'
    },
    name: { type: String }
  }],
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
  roles: {
    type: String,
    enum : ['BU_HEAD', 'HR', 'EMPLOYEE'],
  };
  poc: [{
    _id: mongoose.Types.ObjectId,
    name: String
  }];
  certification: [{
    _id: mongoose.Types.ObjectId,
    name: String
  }];
  authID: string,
  createdAt: Date;
  updatedAt: Date;
}
