import mongoose, { Document, Schema } from "mongoose";

export interface IWaitlist extends Document {
  user: mongoose.Types.ObjectId;
  dentist: mongoose.Types.ObjectId;
  preferredDate: Date;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>(
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
    preferredDate: {
      type: Date,
      required: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);
