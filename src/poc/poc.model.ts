import * as mongoose from 'mongoose';

export const PocSchema = new mongoose.Schema({
  name: { type: String, required: true },
  techStack: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  githubUrl: { type: String, required: true },
  demoUrl: { type: String, required: true },  
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'employees'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface Poc extends mongoose.Document {
  name: string;
  techStack: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  githubUrl: string;
  demoUrl: string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}
