// SignupValidator.ts
import { body, ValidationChain } from "express-validator";
import GlobalUtils from "../../../utils/global.utils";

const globalUtils = new GlobalUtils();

export default class UserValidator {
  public basicDetailsValidator(): ValidationChain[] {
    return [
      body("firstName")
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("First name must be 2 to 20 characters long"),

      body("lastName")
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Last name must be 2 to 20 characters long"),

      body("location")
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Location must be 2 to 20 characters long"),

      body("workAuthorization")
        .optional({
          values: "falsy",
        })
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Work Authorization must be 2 to 20 characters long"),

      body("profileHeadline")
        .trim()
        .isLength({ min: 10, max: 50 })
        .withMessage("Profile Headline must be 10 to 50 characters long"),

      body("profileDescription")
        .optional({
          values: "falsy",
        })
        .trim()
        .isLength({ min: 10, max: 150 })
        .withMessage("Profile Description must be 10 to 30 characters long"),

      body("mobileVisible").optional({
        values: "null",
      }),

      body("whatsappUpdates").optional({
        values: "null",
      }),
    ];
  }
}
