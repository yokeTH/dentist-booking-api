import mongoose, { Document, Schema } from "mongoose";

export interface IDentist extends Document {
  name: string;
  yearsOfExperience: number;
  areaOfExpertise: string;
}

const DentistSchema = new Schema<IDentist>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    areaOfExpertise: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IDentist>("Dentist", DentistSchema);
