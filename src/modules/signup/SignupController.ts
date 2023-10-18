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

  // Sign-up route
  public signupRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        throw new BadRequestError("Invalid Email or Password");
      }
      await this.signupService.signup(); // Assuming this handles the sign-up process
      throw new APIError("Error Creating User Account");
      // return response.json({ message: "Signup successful" });
    } catch (error) {
      console.error("Error in signupRequest:", error);
      next(error);
    }
  };

  // Define and return the router
  public routes() {
    this.router.get("/test", this.testRequest);
    this.router.post(
      "/signup",
      this.signupValidator.signupBodyValidator(),
      this.signupRequest,
    );
    return this.router;
  }
}
