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
    is2FAEnabled: {
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
      minLength: [4, "Password must be at least 8 characters long"],
      default: null,
    },
    basicDetails: [
      {
        firstName: {
          type: String,
          min: [2, "Firstname must be atleast two characters long"],
          max: [20, "First name must be atmost 20 characters long"],
        },
        lastName: {
          type: String,
          min: [2, "Last name must be atleast two characters long"],
          max: [20, "Last name must be atmost 20 characters long"],
        },
        location: {
          type: String,
        },
        profileUrl: {
          type: String,
        },
        workAuthorization: {
          type: String,
        },
        profileHeadline: {
          type: String,
          min: [10, "Profile headline must be atleast 10 characters long"],
          max: [30, "Profile headline must be atmost 30 characters long"],
        },
        profileDescription: {
          type: String,
          min: [10, "Profile description must be atleast 10 characters long"],
          max: [30, "Profile description must be atmost 150 characters long"],
        },
        mobileVisible: {
          type: Boolean,
          default: false,
        },
        whatsappUpdates: {
          type: Boolean,
          default: false,
        },
      },
    ],
    workDetails: [
      {
        employer: {
          type: String,
        },
        employerLocation: {
          type: String,
        },
        industry: {
          type: String,
        },
        designation: {
          type: String,
        },
        workDescription: {
          type: String,
          min: [10, "Profile headline must be atleast 10 characters long"],
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        from: {
          month: Number,
          year: Number,
        },
        to: {
          month: Number,
          year: Number,
        },
      },
    ],
    educationalDetails: [
      {
        educationLevel: {
          type: String,
        },
        degree: {
          type: String,
        },
        board: {
          type: String,
        },
        institute: {
          type: String,
        },
        completionYear: {
          type: Number,
        },
        specialization: {
          type: String,
        },
      },
    ],
    certificationDetails: [
      {
        certificationName: {
          type: String,
        },
        issuingAuthority: {
          type: String,
        },
        issueDate: {
          month: {
            type: Number,
          },
          year: {
            type: Number,
          },
        },
      },
    ],
    socialHandles: {
      facebook: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
      dribbble: {
        type: String,
      },
      behance: {
        type: String,
      },
      twitter: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

const User: Model<NModel.IUserModel> = mongoose.model("User", userSchema);
export default User;
