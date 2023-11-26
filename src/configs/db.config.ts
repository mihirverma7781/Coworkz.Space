import { APIError } from "../utils/error/ErrorHandler";
import mongoose from "mongoose";

export default class Database {
  constructor() {}

  async connectDB() {
    try {
      const connection = await mongoose.connect(
        "mongodb://127.0.0.1:27017/CoworkzSpace",
      );
      console.log(`Database connected with => ${connection.connection.host}`);
    } catch (error) {
      // You can log the error or handle it differently here
      console.error("DB connection error:", error);
      throw new APIError("DB connection error");
    }
  }
}
