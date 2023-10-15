// SignupController.ts
import { Router, Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { validationResult } from "express-validator";
import SignupService from "./SignupService";
import SignupValidator from "./validations/SignupValidator";

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
  private testRequest = (req: Request, res: Response) => {
    res.send(this.signupService.testService());
  };

  // Sign-up route
  private signupRequest = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      await this.signupService.signup(); // Assuming this handles the sign-up process
      return res.json({ message: "Signup successful" });
    } catch (error) {
      console.error("Error in signupRequest:", error);
      return res.status(500).json({ error: "Internal server error" });
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
