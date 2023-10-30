/* eslint-disable @typescript-eslint/no-explicit-any */
// SignupController.ts
import { Router, Request, Response, NextFunction } from "express";
import { autoInjectable } from "tsyringe";
import { validationResult } from "express-validator";
import SignupService from "./SignupService";
import SignupValidator from "./validations/SignupValidator";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";

@autoInjectable()
export default class SignupController {
  private signupService: SignupService;
  private signupValidator: SignupValidator;
  private router: Router;

  constructor(signupService: SignupService, signupValidator: SignupValidator) {
    this.signupService = signupService;
    this.signupValidator = signupValidator;
    this.router = Router();
  }

  // Testing route
  public testRequest = (request: Request, response: Response) => {
    response.send(this.signupService.testService());
  };

  // Sign-up OTP Controller
  public signupWithOTP = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        throw new BadRequestError(errorMessages);
      }
      const input = request.body;
      const result: any = await this.signupService.signup(input);
      if (!Object.keys(result) || result.code === 200) {
        throw new APIError("Error Creating User Account");
      }
      return response.json(result);
    } catch (error) {
      console.error("Error in signupRequest:", error);
      next(error);
    }
  };

  // Define and return the router
  public routes() {
    this.router.get("/test", this.testRequest);
    this.router.post(
      "/signup-sendotp",
      this.signupValidator.otpSignupValidator(),
      this.signupWithOTP,
    );
    return this.router;
  }
}
