import mongoose, { Model, Schema } from "mongoose";
import { randomUUID } from "crypto";
import NModel from "./typings";

const indianMobileNumberRegex: RegExp = /^[6789]\d{9}$/;
const emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const userSchema: Schema<NModel.IUserModel> = new mongoose.Schema(
  {
    tenetID: {
      type: String,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid number",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isNumberVerified: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    number: {
      type: String,
      validate: {
        validator: function (value: string) {
          return indianMobileNumberRegex.test(value);
        },
        message: "Please enter a valid number",
      },
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters long"],
    },
  },
  { timestamps: true },
);

const User: Model<NModel.IUserModel> = mongoose.model("User", userSchema);
export default User;
