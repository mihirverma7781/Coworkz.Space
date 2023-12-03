// SignupValidator.ts
import { body, ValidationChain } from "express-validator";
import GlobalUtils from "../../../utils/global.utils";

const globalUtils = new GlobalUtils();

export default class UserValidator {
  public otpSignupValidator(): ValidationChain[] {
    return [
      body("number")
        .trim()
        .custom((value) => globalUtils.isIndianMobileNumber(value))
        .withMessage("Invalid mobile number"),
    ];
  }
}
