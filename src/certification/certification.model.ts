import * as mongoose from 'mongoose';

export const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  techStack: { type: String, required: true },
  complitionDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  price: { type: String, required: true },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'employees'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface Certification extends mongoose.Document {
  name: string;
  techStack: string;
  complitionDate: Date;
  expireDate: Date;
  price: string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}
