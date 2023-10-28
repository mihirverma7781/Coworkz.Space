import { APIError } from "../utils/error/ErrorHandler";
import mongoose from "mongoose";

export default class Database {
  constructor() {}

  async connectDB() {
    try {
      const connection = await mongoose.connect(
        "mongodb://auth-mongo-srv:27017/unison-auth",
      );
      console.log(`Database connected with => ${connection.connection.host}`);
    } catch (error) {
      // You can log the error or handle it differently here
      console.error("DB connection error:", error);
      throw new APIError("DB connection error");
    }
  }
}
