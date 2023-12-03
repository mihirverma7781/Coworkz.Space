/* eslint-disable @typescript-eslint/no-explicit-any */
// SignupController.ts
import { Router, Request, Response, NextFunction } from "express";
import { autoInjectable } from "tsyringe";
import { validationResult } from "express-validator";
import AuthService from "./AuthService";
import SignupValidator from "./validations/SignupValidator";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";
import AuthMiddleware from "../../middlewares/authMiddleware";

@autoInjectable()
export default class AuthController {
  private authMiddleware: AuthMiddleware;
  private authService: AuthService;
  private signupValidator: SignupValidator;
  private router: Router;

  constructor(
    authService: AuthService,
    signupValidator: SignupValidator,
    authMiddleware: AuthMiddleware,
  ) {
    this.authService = authService;
    this.signupValidator = signupValidator;
    this.authMiddleware = authMiddleware;
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
        response.cookie("user_details", result.data.userData, cookieOptions);
        delete result["token"];
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      next(error);
    }
  };

  // update password
  public updatePassword = async (
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
      const user = request.user;
      const result: any = await this.authService.updatePassword(
        input,
        user?.tenetID,
      );
      if (Object.keys(result) && result.status === 200) {
        const cookieOptions = {
          httpOnly: true,
          signed: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        response.cookie("user_details", result.data, cookieOptions);
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      next(error);
    }
  };

  // login password
  // public passwordLogin = async (
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const errors = validationResult(request);
  //     if (!errors.isEmpty()) {
  //       const errorMessages = errors
  //         .array()
  //         .map((error) => error.msg)
  //         .join(", ");
  //       throw new BadRequestError(errorMessages);
  //     }
  //     const input = request.body;
  //     const result: any = await this.authService.loginWithPassword(input);
  //     if (Object.keys(result) && result.status === 200) {
  //       const cookieOptions = {
  //         httpOnly: true,
  //         signed: true,
  //         maxAge: 7 * 24 * 60 * 60 * 1000,
  //       };
  //       response.cookie("access_token", result.token, cookieOptions);
  //       response.cookie("user_details", result.data.user, cookieOptions);
  //       delete result["token"];
  //       return response.status(result.status).json(result);
  //     } else {
  //       throw new APIError();
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // router
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
    this.router.patch(
      "/update-password",
      this.authMiddleware.authenticate,
      this.signupValidator.paswordValidator(),
      this.updatePassword,
    );
    // this.router.post(
    //   "/login",
    //   this.signupValidator.passwordLoginValidator(),
    //   this.passwordLogin,
    // );
    return this.router;
  }
}
