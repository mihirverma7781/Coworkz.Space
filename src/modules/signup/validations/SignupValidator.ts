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

  public passwordSignupValidator(): ValidationChain[] {
    return [
      body("email").trim().isEmail().withMessage("Invalid email provided"),
      body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    ];
  }
}
