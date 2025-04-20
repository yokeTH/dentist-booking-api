import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  dentist: mongoose.Types.ObjectId;
  appointmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dentist: {
      type: Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
