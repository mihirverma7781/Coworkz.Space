// SignupValidator.ts
import { body, ValidationChain } from "express-validator";

export default class SignupValidator {
  public signupBodyValidator(): ValidationChain[] {
    return [
      body("email").trim().isEmail().withMessage("Invalid email provided"),
      body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    ];
  }
}
