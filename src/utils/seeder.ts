import mongoose from "mongoose";
import dotenv from "dotenv";
import { users, dentists } from "../data/seedData";
import User from "../models/User";
import Dentist from "../models/Dentist";
import Booking from "../models/Booking";
import Waitlist from "../models/Waitlist";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dentist-booking");

    // Clear existing data
    await User.deleteMany({});
    await Dentist.deleteMany({});

    // Import users and dentists
    await User.insertMany(users);
    await Dentist.insertMany(dentists);

    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dentist-booking");

    // Clear all data
    await User.deleteMany({});
    await Dentist.deleteMany({});
    await Booking.deleteMany({});
    await Waitlist.deleteMany({});

    console.log("Data destroyed successfully");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

// Determine action from command line args
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
