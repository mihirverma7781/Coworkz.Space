/* eslint-disable @typescript-eslint/no-explicit-any */
// SignupController.ts
import { Router, Request, Response, NextFunction, request } from "express";
import { autoInjectable } from "tsyringe";
import { cookie, validationResult } from "express-validator";
import AuthService from "./AuthService";
import SignupValidator from "./validations/SignupValidator";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";

@autoInjectable()
export default class AuthController {
  private authService: AuthService;
  private signupValidator: SignupValidator;
  private router: Router;

  constructor(authService: AuthService, signupValidator: SignupValidator) {
    this.authService = authService;
    this.signupValidator = signupValidator;
    this.router = Router();
  }

  // Testing route
  public testRequest = (request: Request, response: Response) => {
    response.send(this.authService.testService());
  };

  // otp sending controller
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
      const result: any = await this.authService.sendOTP(input);
      if (Object.keys(result) && result.status === 200) {
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      console.error("Error in signupRequest:", error.message);
      next(error);
    }
  };

  // otp verification controller
  public verifyOTP = async (
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
      const result: any = await this.authService.verifyOTP(input);
      if (Object.keys(result) && result.status === 201) {
        const cookieOptions = {
          httpOnly: true,
          signed: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        response.cookie("access_token", result.token, cookieOptions);
        response.cookie("user_details", result.data.user, cookieOptions);
        delete result["token"];
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      console.error("Error in signupRequest:", error.message);
      next(error);
    }
  };

  // Define and return the router
  public routes() {
    this.router.get("/test", this.testRequest);
    this.router.post(
      "/sendotp",
      this.signupValidator.otpSignupValidator(),
      this.signupWithOTP,
    );
    this.router.post(
      "/verifyotp",
      this.signupValidator.otpVerificationValidator(),
      this.verifyOTP,
    );
    return this.router;
  }
}
