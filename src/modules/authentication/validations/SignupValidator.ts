// SignupValidator.ts
import { body, ValidationChain } from "express-validator";
import GlobalUtils from "../../../utils/global.utils";

const globalUtils = new GlobalUtils();

export default class SignupValidator {
  public otpSignupValidator(): ValidationChain[] {
    return [
      body("number")
        .trim()
        .custom((value) => globalUtils.isIndianMobileNumber(value))
        .withMessage("Invalid mobile number"),
    ];
  }

  public otpVerificationValidator(): ValidationChain[] {
    return [
      body("number")
        .trim()
        .custom((value) => globalUtils.isIndianMobileNumber(value))
        .withMessage("Invalid mobile number"),
      body("otp")
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Invalid OTP"),
      body("activationID")
        .trim()
        .custom((value) => globalUtils.isUUID(value))
        .withMessage("Invalid activation ID"),
    ];
  }

  public passwordLoginValidator(): ValidationChain[] {
    return [
      body("number")
        .trim()
        .custom((value) => globalUtils.isIndianMobileNumber(value))
        .withMessage("Invalid mobile number"),
      body("password")
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage("Password must be  4  characters"),
    ];
  }

  public paswordValidator(): ValidationChain[] {
    return [
      body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    ];
  }
}
